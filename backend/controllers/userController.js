import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Buyer from "../models/buyerModel.js";
import UserPasswordResetEmail from "../utils/authEmails/sendUserResetPasswordEmail.js";

const generateAccessAndRefreshToken = async (userId) => {
	try {
		const user = await User.findById(userId);
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });
		return { accessToken, refreshToken };
	} catch (error) {
		throw new Error("Token generation failed");
	}
};

const registerUser = async (req, res) => {
	try {
		const {
			username,
			email,
			phoneNumber,
			vehicleNumber,
			vehicleName,
			vehicleManufactureYear,
			chassisNumber,
			password,
			confirmPassword,
		} = req.body;

		if (!username || !email || !phoneNumber || !vehicleNumber || !vehicleName || !vehicleManufactureYear || !chassisNumber || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		if (!/^\d{4}$/.test(String(vehicleManufactureYear))) {
			return res.status(400).json({
				success: false,
				message: "Vehicle manufacture year must be a 4-digit year",
			});
		}

		if (confirmPassword && password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Passwords do not match",
			});
		}

		const existingUser = await User.findOne({
			$or: [
				{ email },
				{ phoneNumber },
				{ vehicleNumber },
				{ chassisNumber },
			],
		});

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists with provided details",
			});
		}

		const user = await User.create({
			username,
			email,
			phoneNumber,
			vehicleNumber,
			vehicleName,
			vehicleManufactureYear,
			chassisNumber,
			password,
		});

		return res.status(201).json({
			success: true,
			message: "User account created successfully",
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				phoneNumber: user.phoneNumber,
				vehicleNumber: user.vehicleNumber,
				vehicleName: user.vehicleName,
				vehicleManufactureYear: user.vehicleManufactureYear,
				chassisNumber: user.chassisNumber,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error while creating user",
			error: error.message,
		});
	}
};

const loginUser = async (req, res) => {
	try {
		const { identifier, email, phoneNumber, password } = req.body;

		const resolvedIdentifier = identifier || email || phoneNumber;
		if (!resolvedIdentifier || !password) {
			return res.status(400).json({
				success: false,
				message: "Email or phone number and password are required",
			});
		}

		const isEmail = resolvedIdentifier.includes("@");
		let user = null;

		if (isEmail) {
			user = await User.findOne({ email: resolvedIdentifier }).select("+password");
		} else {
			const phoneValue = resolvedIdentifier.replace(/\D/g, "");
			if (!phoneValue) {
				return res.status(400).json({
					success: false,
					message: "Invalid phone number",
				});
			}
			user = await User.findOne({ phoneNumber: phoneValue }).select("+password");
		}

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		const isPasswordValid = await user.isPasswordCorrect(password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		const { accessToken, refreshToken } =
			await generateAccessAndRefreshToken(user._id);

		const isProd = process.env.NODE_ENV === "production";
		const cookieOptions = {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? "None" : "Lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		};

		return res
			.status(200)
			.cookie("refreshToken", refreshToken, cookieOptions)
			.json({
				success: true,
				message: "Login successful",
				accessToken,
				refreshToken,
				data: {
					id: user._id,
					username: user.username,
					email: user.email,
					phoneNumber: user.phoneNumber,
					vehicleName: user.vehicleName,
					vehicleManufactureYear: user.vehicleManufactureYear,
					vehicleNumber: user.vehicleNumber,
					chassisNumber: user.chassisNumber,
				},
			});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error while logging in",
			error: error.message,
		});
	}
};

const refreshUserToken = async (req, res) => {
	const incomingRefreshToken =
		req.cookies?.refreshToken || req.body.refreshToken;

	if (!incomingRefreshToken) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized: No refresh token provided",
		});
	}

	try {
		const decodedToken = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		const user = await User.findById(decodedToken?._id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (user.refreshToken !== incomingRefreshToken) {
			return res.status(403).json({
				success: false,
				message: "Refresh token has already been used or is invalid",
			});
		}

		const { accessToken, refreshToken } =
			await generateAccessAndRefreshToken(user._id);

		const isProd = process.env.NODE_ENV === "production";
		const options = {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? "None" : "Lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		};

		return res
			.status(200)
			.cookie("refreshToken", refreshToken, options)
			.json({
				success: true,
				message: "New access and refresh tokens issued",
				accessToken,
				refreshToken,
			});
	} catch (error) {
		return res.status(403).json({
			success: false,
			message: "Invalid or expired refresh token",
			error: error.message,
		});
	}
};

const forgotUserPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: "Invalid email format",
			});
		}

		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "No user registered with this email",
			});
		}

		const result = await UserPasswordResetEmail(user);
		if (!result.success) {
			return res.status(500).json({
				success: false,
				message: result.message || "Failed to send reset email. Please try again later.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Reset email sent successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

const resetUserPassword = async (req, res) => {
	try {
		const { password, confirmPassword } = req.body;
		const { token } = req.params;

		if (!token || !password || !confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Token, password, and confirmPassword are required.",
			});
		}

		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(password)) {
			return res.status(400).json({
				success: false,
				message:
					"Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and confirmPassword do not match.",
			});
		}

		let payload;
		try {
			payload = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
		} catch (err) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired token.",
			});
		}

		const user = await User.findById(payload.id).select("+password");
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		user.password = password;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Password has been reset successfully. Now you can login.",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error.message,
		});
	}
};

const formatDisplayDate = (value) => {
	if (!value) return "";
	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) return "";
	const day = String(parsedDate.getDate()).padStart(2, "0");
	const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
	const year = parsedDate.getFullYear();
	return `${day}-${month}-${year}`;
};

const calculateAge = (dateOfBirth) => {
	if (!dateOfBirth) return "";
	const dob = new Date(dateOfBirth);
	if (Number.isNaN(dob.getTime())) return "";
	const today = new Date();
	let age = today.getFullYear() - dob.getFullYear();
	const monthDiff = today.getMonth() - dob.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
		age -= 1;
	}
	return age;
};

const calculateEmiProgress = (emiDates = []) => {
	let carryForward = 0;
	return emiDates.map((schedule, index) => {
		const emiValue = Number(schedule?.amount || 0);
		const paidAmount = Number(schedule?.paidAmount || 0);
		const availableAmount = paidAmount + carryForward;
		const pendingAmount = Math.max(emiValue - availableAmount, 0);
		carryForward = Math.max(availableAmount - emiValue, 0);
		return {
			schedule,
			index,
			emiValue,
			paidAmount,
			pendingAmount,
			carryForward,
		};
	});
};

const mapEmiSchedule = (emiDates = []) => {
	const emiProgress = calculateEmiProgress(emiDates);
	return emiProgress.map((item) => {
		const { schedule, index, emiValue, paidAmount, pendingAmount } = item;
		return {
			sno: Number(schedule?.emiNo || index + 1),
			emi: emiValue,
			paidAmount,
			emiDate: formatDisplayDate(schedule?.emiDate),
			paidDate: formatDisplayDate(schedule?.paidDate),
			bookNo: schedule?.bookNo || "",
			pageNo: schedule?.pageNo || "",
			pendingAmount,
			peningAmount: pendingAmount,
		};
	});
};

const mapPaymentEntries = (paymentEntries = []) => {
	if (!Array.isArray(paymentEntries)) return [];
	return paymentEntries.map((entry) => ({
		paidDate: formatDisplayDate(entry?.paidDate),
		amount: Number(entry?.amount || 0),
		bookNo: entry?.bookNo || "",
		pageNo: entry?.pageNo || "",
		emiNo: Number(entry?.emiNo || 0),
	}));
};

const mapBuyerToFinanceStatement = (buyer) => {
	const finance = buyer?.finance || {};
	const vehicle = buyer?.vehicle || {};
	const guarantor = buyer?.guarantor || {};
	const emiSchedule = mapEmiSchedule(finance?.emiDates || []);
	const paymentEntries = mapPaymentEntries(finance?.paymentEntries || []);
	const totalInstalmentAmount = emiSchedule.reduce((sum, item) => sum + Number(item?.emi || 0), 0);
	const totalPaid = paymentEntries.length > 0
		? paymentEntries.reduce((sum, entry) => sum + Number(entry?.amount || 0), 0)
		: emiSchedule.reduce((sum, item) => sum + Number(item?.paidAmount || 0), 0);
	const totalPending = Math.max(totalInstalmentAmount - totalPaid, 0);

	const financeAmount = Number(finance?.financeAmount || 0);
	const emiAmount = Number(finance?.emiAmount || 0);
	const emiMonths = Number(finance?.months || emiSchedule.length || 0);
	const charges = Math.abs(financeAmount - emiAmount * emiMonths);
	const totalAmount = financeAmount + charges;

	return {
		id: String(buyer?._id),
		seller: buyer?.name || "",
		buyerName: buyer?.name || "",
		vehicle: vehicle?.vehicleNumber || "",
		phoneNo: buyer?.phoneNo || "",
		financeAmount,
		emiDate: formatDisplayDate(finance?.emiStartDate || finance?.emiDate),
		emi: emiAmount,
		age: calculateAge(buyer?.dateOfBirth),
		address: buyer?.fullAddress || "",
		agreementNo: buyer?.agreementNo || "",
		vehiclePrice: Number(vehicle?.bikePrice || 0),
		charges,
		totalAmount,
		emiSchedule,
		paymentEntries,
		totalPaid,
		totalPending,
		vehicleName: vehicle?.vehicleName || "",
		chassisNo: vehicle?.chassisNo || "",
		vehicleModel: vehicle?.model || "",
		months: emiMonths,
		guarantorName: guarantor?.fullName || "",
		guarantorAge: calculateAge(guarantor?.dateOfBirth),
		guarantorPhoneNo: guarantor?.phoneNo || "",
		guarantorAddress: guarantor?.address || "",
		partyPhoto: buyer?.profile || "",
		guarantorPhoto: guarantor?.guarantorPhoto || "",
		status: finance?.status || "pending",
	};
};

const escapeRegex = (str) => {
	return String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getUserFinanceByVehicle = async (req, res) => {
	try {
		const { vehicleNumber, chassisNumber } = req.body;

		if (!vehicleNumber || !chassisNumber) {
			return res.status(400).json({
				success: false,
				message: "Vehicle number and chassis number are required",
			});
		}

		const trimmedVehicleNumber = String(vehicleNumber || "").trim();
		const trimmedChassisNumber = String(chassisNumber || "").trim();

		// Escape regex special characters
		const escapedVehicleNumber = escapeRegex(trimmedVehicleNumber);
		const escapedChassisNumber = escapeRegex(trimmedChassisNumber);

		console.log("Searching for vehicle:", { trimmedVehicleNumber, trimmedChassisNumber });

		// Try multiple query strategies
		// First attempt: case-insensitive regex search
		let buyer = await Buyer.findOne({
			"vehicle.vehicleNumber": { $regex: escapedVehicleNumber, $options: "i" },
			"vehicle.chassisNo": { $regex: escapedChassisNumber, $options: "i" },
		})
			.select("name agreementNo phoneNo fullAddress dateOfBirth vehicle finance guarantor profile")
			.lean();

		// If not found with regex, try exact match with normalization
		if (!buyer) {
			buyer = await Buyer.findOne({
				$expr: {
					$and: [
						{ $eq: [{ $toLower: "$vehicle.vehicleNumber" }, trimmedVehicleNumber.toLowerCase()] },
						{ $eq: [{ $toLower: "$vehicle.chassisNo" }, trimmedChassisNumber.toLowerCase()] },
					],
				},
			})
				.select("name agreementNo phoneNo fullAddress dateOfBirth vehicle finance guarantor profile")
				.lean();
		}

		console.log("Found buyer:", buyer ? "Yes" : "No");

		if (!buyer) {
			return res.status(404).json({
				success: false,
				message: "No finance record found for the provided vehicle details",
				data: null,
			});
		}

		// Check if finance data exists
		if (!buyer.finance || !buyer.finance.financeAmount || buyer.finance.financeAmount <= 0) {
			return res.status(404).json({
				success: false,
				message: "No active finance found for this vehicle",
				data: null,
			});
		}

		const financeStatement = mapBuyerToFinanceStatement(buyer);

		return res.status(200).json({
			success: true,
			message: "Finance statement retrieved successfully",
			data: financeStatement,
		});
	} catch (error) {
		console.error("Error in getUserFinanceByVehicle:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

export { registerUser, loginUser, refreshUserToken, forgotUserPassword, resetUserPassword, getUserFinanceByVehicle };

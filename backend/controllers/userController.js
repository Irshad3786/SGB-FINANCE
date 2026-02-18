import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

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
			chassisNumber,
			password,
			confirmPassword,
		} = req.body;

		if (!username || !email || !phoneNumber || !vehicleNumber || !chassisNumber || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
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

export { registerUser, loginUser, refreshUserToken };

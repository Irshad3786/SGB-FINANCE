import Buyer from "../../models/buyerModel.js";
import Seller from "../../models/sellerModel.js";
import mongoose from "mongoose";

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? undefined : numberValue;
};

const pickLocation = (selected, customValue) => {
  return selected === "Other" ? (customValue || "") : (selected || "");
};

const normalizeText = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const buildEmiSchedule = ({ emiAmount, months, emiStartDate }) => {
  const monthlyAmount = toNumber(emiAmount);
  const totalMonths = toNumber(months);
  const startDate = emiStartDate ? new Date(emiStartDate) : null;

  if (
    !monthlyAmount ||
    !totalMonths ||
    totalMonths <= 0 ||
    !startDate ||
    Number.isNaN(startDate.getTime())
  ) {
    return [];
  }

  return Array.from({ length: totalMonths }, (_, index) => {
    const emiDate = new Date(startDate);
    emiDate.setMonth(startDate.getMonth() + index);

    return {
      emiNo: index + 1,
      emiDate,
      amount: monthlyAmount,
      paid: false,
      paidDate: null,
      paidAmount: 0,
      bookNo: "",
      pageNo: "",
    };
  });
};

const saveBuyerOrSeller = async (req, res) => {
  try {
    const {
      role,
      fullName,
      soWoCo,
      phone,
      alternatePhone,
      aadhaar,
      vehicleName,
      model,
      vehicleNo,
      chassisNo,
      saleAmount,
      dob,
      district,
      customDistrict,
      mandal,
      customMandal,
      street,
      address,
      referralName,
      referralPhone,
      agreementNo,
      oldHaNumber,
      haNumber,
      financeAmount,
      emiDate,
      emiStartDate,
      emiMonths,
      emiAmount,
      pendingAmount,
      pendingDate,
      guarantorName,
      guarantorSoWoCo,
      guarantorPhone,
      guarantorAadhaar,
      guarantorDob,
      guarantorAddress,
      aadharFront,
      aadharBack,
      profile,
      guarantorPhoto,
      isFinanced,
      mode,
    } = req.body;

    if (!role || !["buyer", "seller"].includes(String(role).toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Role is required and must be either buyer or seller",
      });
    }

    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: "fullName and phone are required",
      });
    }

    const resolvedDistrict = pickLocation(district, customDistrict);
    const resolvedMandal = pickLocation(mandal, customMandal);

    let savedRecord;

    if (String(role).toLowerCase() === "seller") {
      const normalizedChassisNo = normalizeText(chassisNo);
      const normalizedVehicleNo = normalizeText(vehicleNo);

      if (normalizedChassisNo) {
        const existingSeller = await Seller.findOne({ "vehicle.chassisNo": normalizedChassisNo })
          .select("_id vehicle.chassisNo")
          .lean();

        if (existingSeller) {
          return res.status(409).json({
            success: false,
            message: "Duplicate value found. Please use a unique Chassis No.",
          });
        }
      }

      if (normalizedVehicleNo) {
        const existingVehicleNo = await Seller.findOne({ "vehicle.vehicleNumber": normalizedVehicleNo })
          .select("_id vehicle.vehicleNumber")
          .lean();

        if (existingVehicleNo) {
          return res.status(409).json({
            success: false,
            message: "Duplicate value found. Please use a unique Vehicle No.",
          });
        }
      }

      const sellerPayload = {
        fullName,
        sowoco: soWoCo,
        phoneNo: phone,
        alternatePhoneNo: alternatePhone,
        aadharNo: aadhaar,
        vehicle: {
          vehicleName,
          vehicleNumber: normalizedVehicleNo || undefined,
          model,
          chassisNo: normalizedChassisNo || undefined,
          bikePrice: toNumber(saleAmount),
        },
        dateOfBirth: dob || undefined,
        district: resolvedDistrict,
        mandal: resolvedMandal,
        street,
        fullAddress: address,
        aadharFront,
        aadharBack,
        profile,
        referralName,
        referralPhoneNo: referralPhone,
      };

      try {
        savedRecord = await Seller.create(sellerPayload);
      } catch (error) {
        const isStaleAgreementIndexError =
          error?.code === 11000 &&
          (error?.message?.includes("agreementNo_1") || error?.keyPattern?.agreementNo);

        if (!isStaleAgreementIndexError) {
          throw error;
        }

        await Seller.collection.dropIndex("agreementNo_1").catch(() => null);
        savedRecord = await Seller.create(sellerPayload);
      }

      const buyerFilters = [];
      if (normalizedChassisNo) {
        buyerFilters.push({ "vehicle.chassisNo": normalizedChassisNo });
        buyerFilters.push({ oldHAnumber: normalizedChassisNo });
      }
      if (normalizedVehicleNo) {
        buyerFilters.push({ "vehicle.vehicleNumber": normalizedVehicleNo });
        buyerFilters.push({ oldHAnumber: normalizedVehicleNo });
      }

      if (buyerFilters.length > 0) {
        const matchedBuyer = await Buyer.findOne({ $or: buyerFilters })
          .select("_id")
          .lean();

        if (matchedBuyer) {
          savedRecord.vehicle.status = "sold";
          await savedRecord.save();
        }
      }
    } else {
      const normalizedAgreementNo = normalizeText(agreementNo);
      const normalizedMode = normalizeText(mode).toLowerCase();
      const resolvedMode = ["refinance", "buy"].includes(normalizedMode)
        ? normalizedMode
        : "buy";
      const resolvedEmiStartDate = emiStartDate || emiDate;
      const emiSchedule = buildEmiSchedule({
        emiAmount,
        months: emiMonths,
        emiStartDate: resolvedEmiStartDate,
      });

      const normalizedChassisNo = normalizeText(chassisNo);
      const normalizedVehicleNo = normalizeText(vehicleNo);

      if (normalizedAgreementNo) {
        const existingBuyer = await Buyer.findOne({ agreementNo: normalizedAgreementNo })
          .select("_id agreementNo")
          .lean();

        if (existingBuyer) {
          return res.status(409).json({
            success: false,
            message: "Duplicate value found. Please use a unique Agreement No.",
          });
        }
      }

      const buyerPayload = {
        name: fullName,
        sowoco: soWoCo,
        mode: resolvedMode,
        agreementNo: normalizedAgreementNo || undefined,
        phoneNo: phone,
        alternatePhoneNo: alternatePhone,
        aadharNo: aadhaar,
        soldamount: toNumber(saleAmount),
        oldHAnumber: oldHaNumber || haNumber,
        dateOfBirth: dob || undefined,
        district: resolvedDistrict,
        mandal: resolvedMandal,
        street,
        fullAddress: address,
        aadharFront,
        aadharBack,
        profile,
        referralName,
        referralPhoneNo: referralPhone,
        vehicle: {
          vehicleName,
          vehicleNumber: normalizedVehicleNo || undefined,
          model,
          chassisNo: normalizedChassisNo || undefined,
          bikePrice: toNumber(saleAmount),
        },
        guarantor: {
          fullName: guarantorName,
          sowoco: guarantorSoWoCo,
          phoneNo: guarantorPhone,
          dateOfBirth: guarantorDob || undefined,
          aadharNo: guarantorAadhaar,
          address: guarantorAddress,
          guarantorPhoto,
        },
        finance: {
          financeAmount: toNumber(financeAmount),
          emiAmount: toNumber(emiAmount),
          months: toNumber(emiMonths),
          emiStartDate: resolvedEmiStartDate || undefined,
          emiDates: emiSchedule,
        },
        ...(resolvedMode === "buy"
          ? {
              dpPayment: {
                amount: toNumber(pendingAmount),
                dueDate: pendingDate || undefined,
              },
            }
          : {}),
      };

      savedRecord = await Buyer.create(buyerPayload);

      const sellerFilters = [];
      if (normalizedChassisNo) {
        sellerFilters.push({ "vehicle.chassisNo": normalizedChassisNo });
      }
      if (normalizedVehicleNo) {
        sellerFilters.push({ "vehicle.vehicleNumber": normalizedVehicleNo });
      }

      if (sellerFilters.length > 0) {
        await Seller.findOneAndUpdate(
          { $or: sellerFilters },
          { $set: { "vehicle.status": "sold" } }
        );
      }
    }

    const targetModel = String(role).toLowerCase() === "seller" ? Seller : Buyer;

    return res.status(201).json({
      success: true,
      message: `${role} saved successfully`,
      data: savedRecord,
      meta: {
        database: mongoose.connection?.name,
        collection: targetModel.collection?.name,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error?.keyPattern || {})[0];
      return res.status(409).json({
        success: false,
        message:
          duplicateField === "chassisNo" || duplicateField === "vehicle.chassisNo"
            ? "Duplicate value found. Please use a unique Chassis No."
            : duplicateField === "vehicle.vehicleNumber"
            ? "Duplicate value found. Please use a unique Vehicle No."
            : duplicateField === "agreementNo"
            ? "Duplicate value found. Please use a unique Agreement No."
            : "Duplicate value found. Please use a unique value.",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to save buyer/seller",
      error: error.message,
    });
  }
};

const saveBuyer = async (req, res) => {
  req.body = { ...req.body, role: "buyer" };
  return saveBuyerOrSeller(req, res);
};

const saveSeller = async (req, res) => {
  req.body = { ...req.body, role: "seller" };
  return saveBuyerOrSeller(req, res);
};

export { saveBuyer, saveSeller };

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

const extractAgreementSequence = (value) => {
  const normalizedValue = normalizeText(value).toUpperCase();
  if (!normalizedValue) return null;

  const haMatch = normalizedValue.match(/^HA\s*0*([0-9]+)$/);
  if (haMatch) {
    const parsed = Number(haMatch[1]);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const numericMatch = normalizedValue.match(/^0*([0-9]+)$/);
  if (numericMatch) {
    const parsed = Number(numericMatch[1]);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const getNextAgreementSequence = async () => {
  const buyers = await Buyer.find({ agreementNo: { $exists: true, $ne: null, $ne: "" } })
    .select("agreementNo")
    .lean();

  const maxSequence = buyers.reduce((max, row) => {
    const sequence = extractAgreementSequence(row?.agreementNo);
    if (!sequence) return max;
    return sequence > max ? sequence : max;
  }, 0);

  return maxSequence + 1;
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
      occupation,
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
      guarantorOccupation,
      guarantorPhone,
      guarantorAlternatePhone,
      guarantorAadhaar,
      guarantorDob,
      guarantorDistrict,
      guarantorCustomDistrict,
      guarantorMandal,
      guarantorCustomMandal,
      guarantorAddress,
      aadharFront,
      aadharBack,
      profile,
      guarantorPhoto,
      isFinanced,
      mode,
      overwriteExisting,
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
    const resolvedGuarantorDistrict = pickLocation(guarantorDistrict, guarantorCustomDistrict);
    const resolvedGuarantorMandal = pickLocation(guarantorMandal, guarantorCustomMandal);

    let savedRecord;
    let wasUpdated = false;
    let refinanceContext = null;

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
        occupation,
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
      let normalizedAgreementNo = normalizeText(agreementNo);
      const normalizedMode = normalizeText(mode).toLowerCase();
      const resolvedMode = ["refinance", "buy"].includes(normalizedMode)
        ? normalizedMode
        : "buy";
      const shouldOverwriteExisting = Boolean(overwriteExisting);
      const resolvedIsFinanced = isFinanced === true || String(isFinanced).toLowerCase() === "true";

      if (!normalizedAgreementNo && resolvedIsFinanced) {
        const nextSequence = await getNextAgreementSequence();
        normalizedAgreementNo = `HA${nextSequence}`;
      }

      const resolvedEmiStartDate = emiStartDate || emiDate;
      const emiSchedule = buildEmiSchedule({
        emiAmount,
        months: emiMonths,
        emiStartDate: resolvedEmiStartDate,
      });

      const normalizedChassisNo = normalizeText(chassisNo);
      const normalizedVehicleNo = normalizeText(vehicleNo);
      const normalizedOldHaNumber = normalizeText(oldHaNumber || haNumber);

      let matchedBuyerForRefinance = null;
      let matchedBuyerForBuyOverwrite = null;
      let previousBuyerSnapshot = null;
      let relatedSellerSnapshot = null;
      if (resolvedMode === "refinance") {
        const refinanceFilters = [];

        if (normalizedVehicleNo) {
          refinanceFilters.push({ "vehicle.vehicleNumber": normalizedVehicleNo });
        }

        if (normalizedChassisNo) {
          refinanceFilters.push({ "vehicle.chassisNo": normalizedChassisNo });
        }

        if (normalizedOldHaNumber) {
          refinanceFilters.push({ oldHAnumber: normalizedOldHaNumber });
          refinanceFilters.push({ agreementNo: normalizedOldHaNumber });
        }

        if (refinanceFilters.length > 0) {
          matchedBuyerForRefinance = await Buyer.findOne({ $or: refinanceFilters })
            .select("_id")
            .lean();

          if (matchedBuyerForRefinance?._id) {
            previousBuyerSnapshot = await Buyer.findById(matchedBuyerForRefinance._id)
              .select(
                "name phoneNo agreementNo oldHAnumber fullAddress district mandal vehicle.vehicleName vehicle.vehicleNumber vehicle.model vehicle.chassisNo"
              )
              .lean();

            const sellerFiltersForRefinance = [];
            const snapshotVehicleNo = normalizeText(previousBuyerSnapshot?.vehicle?.vehicleNumber);
            const snapshotChassisNo = normalizeText(previousBuyerSnapshot?.vehicle?.chassisNo);

            if (snapshotVehicleNo) {
              sellerFiltersForRefinance.push({ "vehicle.vehicleNumber": snapshotVehicleNo });
            }

            if (snapshotChassisNo) {
              sellerFiltersForRefinance.push({ "vehicle.chassisNo": snapshotChassisNo });
            }

            if (sellerFiltersForRefinance.length > 0) {
              relatedSellerSnapshot = await Seller.findOne({ $or: sellerFiltersForRefinance })
                .select(
                  "fullName phoneNo fullAddress district mandal vehicle.vehicleName vehicle.vehicleNumber vehicle.model vehicle.chassisNo"
                )
                .lean();
            }
          }
        }
      }

      if (resolvedMode === "buy") {
        const buyFilters = [];

        if (normalizedVehicleNo) {
          buyFilters.push({ "vehicle.vehicleNumber": normalizedVehicleNo });
        }

        if (normalizedChassisNo) {
          buyFilters.push({ "vehicle.chassisNo": normalizedChassisNo });
        }

        if (buyFilters.length > 0) {
          matchedBuyerForBuyOverwrite = await Buyer.findOne({ $or: buyFilters })
            .select("_id name vehicle.vehicleNumber vehicle.chassisNo")
            .lean();

          if (matchedBuyerForBuyOverwrite && !shouldOverwriteExisting) {
            return res.status(409).json({
              success: false,
              code: "VEHICLE_DATA_EXISTS",
              requiresConfirmation: true,
              message: "This vehicle data already exists. Do you want to rewrite it?",
              data: {
                id: matchedBuyerForBuyOverwrite._id,
                name: matchedBuyerForBuyOverwrite.name,
                vehicleNumber: matchedBuyerForBuyOverwrite?.vehicle?.vehicleNumber,
                chassisNo: matchedBuyerForBuyOverwrite?.vehicle?.chassisNo,
              },
            });
          }
        }
      }

      if (resolvedMode === "refinance" && !matchedBuyerForRefinance) {
        return res.status(404).json({
          success: false,
          message: "Buyer not found for this vehicle. Please create buyer first.",
        });
      }

      const targetBuyerIdForUpdate =
        matchedBuyerForRefinance?._id || matchedBuyerForBuyOverwrite?._id || null;

      if (normalizedAgreementNo) {
        const agreementQuery = { agreementNo: normalizedAgreementNo };

        if (targetBuyerIdForUpdate) {
          agreementQuery._id = { $ne: targetBuyerIdForUpdate };
        }

        const existingBuyer = await Buyer.findOne(agreementQuery)
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
        occupation,
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
          occupation: guarantorOccupation,
          phoneNo: guarantorPhone,
          alternatePhoneNo: guarantorAlternatePhone,
          dateOfBirth: guarantorDob || undefined,
          aadharNo: guarantorAadhaar,
          district: resolvedGuarantorDistrict,
          mandal: resolvedGuarantorMandal,
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

      if (targetBuyerIdForUpdate) {
        savedRecord = await Buyer.findByIdAndUpdate(
          targetBuyerIdForUpdate,
          { $set: buyerPayload },
          { new: true, runValidators: true }
        );
        wasUpdated = true;
      } else {
        savedRecord = await Buyer.create(buyerPayload);
      }

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

      if (resolvedMode === "refinance") {
        refinanceContext = {
          previousBuyer: previousBuyerSnapshot,
          previousSeller: relatedSellerSnapshot,
        };
      }
    }

    const targetModel = String(role).toLowerCase() === "seller" ? Seller : Buyer;

    return res.status(wasUpdated ? 200 : 201).json({
      success: true,
      message: wasUpdated ? `${role} updated successfully` : `${role} saved successfully`,
      data: savedRecord,
      meta: {
        database: mongoose.connection?.name,
        collection: targetModel.collection?.name,
        ...(refinanceContext ? { refinanceContext } : {}),
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

const getNextAgreementNumber = async (req, res) => {
  try {
    const nextNumber = await getNextAgreementSequence();

    return res.status(200).json({
      success: true,
      message: "Next agreement number fetched successfully",
      data: {
        nextNumber,
        agreementNo: `HA${nextNumber}`,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch next agreement number",
      error: error.message,
    });
  }
};

const getRefinancePrefillData = async (req, res) => {
  try {
    const rawHaNumber = req.query?.haNumber;
    const normalizedHaNumber = normalizeText(rawHaNumber);

    if (!normalizedHaNumber) {
      return res.status(400).json({
        success: false,
        message: "haNumber is required",
      });
    }

    const buyer = await Buyer.findOne({
      $or: [
        { agreementNo: { $regex: `^${normalizedHaNumber}$`, $options: "i" } },
        { oldHAnumber: { $regex: `^${normalizedHaNumber}$`, $options: "i" } },
      ],
    })
      .select(
        "name sowoco occupation phoneNo alternatePhoneNo aadharNo dateOfBirth district mandal street fullAddress referralName referralPhoneNo agreementNo oldHAnumber vehicle guarantor finance soldamount"
      )
      .lean();

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "No refinance data found for the entered HA / Agreement number",
      });
    }

    const vehicleNo = normalizeText(buyer?.vehicle?.vehicleNumber);
    const chassisNo = normalizeText(buyer?.vehicle?.chassisNo);
    const sellerFilters = [];

    if (vehicleNo) sellerFilters.push({ "vehicle.vehicleNumber": vehicleNo });
    if (chassisNo) sellerFilters.push({ "vehicle.chassisNo": chassisNo });

    const linkedSeller =
      sellerFilters.length > 0
        ? await Seller.findOne({ $or: sellerFilters })
            .select("fullName phoneNo district mandal fullAddress vehicle")
            .lean()
        : null;

    return res.status(200).json({
      success: true,
      message: "Refinance prefill data fetched successfully",
      data: {
        buyer,
        seller: linkedSeller,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch refinance prefill data",
      error: error.message,
    });
  }
};

const getVehiclePrefillData = async (req, res) => {
  try {
    const normalizedVehicleNo = normalizeText(req.query?.vehicleNo);

    if (!normalizedVehicleNo) {
      return res.status(400).json({
        success: false,
        message: "vehicleNo is required",
      });
    }

    const seller = await Seller.findOne({
      "vehicle.vehicleNumber": { $regex: `^${normalizedVehicleNo}$`, $options: "i" },
    })
      .select("fullName phoneNo vehicle")
      .lean();

    if (!seller) {
      return res.status(200).json({
        success: true,
        message: "Vehicle not found",
        data: {
          found: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle prefill data fetched successfully",
      data: {
        found: true,
        vehicleNo: seller?.vehicle?.vehicleNumber || normalizedVehicleNo,
        vehicleName: seller?.vehicle?.vehicleName || "",
        model: seller?.vehicle?.model || "",
        chassisNo: seller?.vehicle?.chassisNo || "",
        saleAmount: seller?.vehicle?.bikePrice ?? "",
        sellerName: seller?.fullName || "",
        sellerPhone: seller?.phoneNo || "",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle prefill data",
      error: error.message,
    });
  }
};

export {
  saveBuyer,
  saveSeller,
  getNextAgreementNumber,
  getRefinancePrefillData,
  getVehiclePrefillData,
};

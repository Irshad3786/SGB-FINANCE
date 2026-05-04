import Buyer from "../../models/buyerModel.js";
import Seller from "../../models/sellerModel.js";
import mongoose from "mongoose";

const normalizeKey = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim().replace(/[-\s]/g, "").toUpperCase();
};

const createDisplayDate = (mongoId) => {
  if (!mongoId || typeof mongoId.getTimestamp !== "function") return null;
  const createdAt = mongoId.getTimestamp();
  if (!createdAt) return null;

  const day = String(createdAt.getDate()).padStart(2, "0");
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const year = createdAt.getFullYear();
  return `${day}-${month}-${year}`;
};

const createTimestampDate = (mongoId) => {
  if (!mongoId || typeof mongoId.getTimestamp !== "function") return null;
  const createdAt = mongoId.getTimestamp();
  return createdAt || null;
};

const normalizeStatusValue = (value) => {
  if (!value) return "";
  return String(value).trim().toLowerCase().replace(/-/g, " ");
};

const parseDateBoundary = (value, boundary = "start") => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  if (boundary === "end") {
    parsed.setHours(23, 59, 59, 999);
  } else {
    parsed.setHours(0, 0, 0, 0);
  }

  return parsed;
};

const findModulePermission = (permissions = [], moduleName = "") => {
  if (!Array.isArray(permissions) || !moduleName) return null;
  return (
    permissions.find((permission) => {
      const currentModule = permission?.module || permission?.name || permission?.key;
      return currentModule === moduleName;
    }) || null
  );
};

const canEditModule = (permissions = [], moduleName = "") => {
  const modulePermission = findModulePermission(permissions, moduleName);
  if (!modulePermission) return false;

  const hasEditAction =
    modulePermission?.actions?.edit ?? modulePermission?.edit ?? false;
  return Boolean(hasEditAction);
};

const getUserData = async (req, res) => {
  try {
    const {
      vehicleNumber = "",
      chassisNo = "",
      search = "",
      from = "",
      to = "",
      status = "all",
      page = 1,
      limit = 10,
    } = req.query;

    const normalizedVehicle = normalizeKey(vehicleNumber);
    const normalizedChassis = normalizeKey(chassisNo);
    const normalizedSearch = normalizeKey(search);
    const normalizedStatus = normalizeStatusValue(status);
    const fromDate = parseDateBoundary(from, "start");
    const toDate = parseDateBoundary(to, "end");
    const shouldApplyDateRange = Boolean(fromDate && toDate);

    const sellers = await Seller.find({})
      .select("fullName sowoco occupation phoneNo alternatePhoneNo aadharNo dateOfBirth district mandal fullAddress vehicle referralName referralPhoneNo")
      .lean();

    const buyers = await Buyer.find({})
      .select("name sowoco occupation agreementNo phoneNo alternatePhoneNo aadharNo dateOfBirth district mandal fullAddress soldamount oldHAnumber vehicle finance guarantor referralName referralPhoneNo")
      .lean();

    const buyerByVehicleOrChassis = new Map();

    buyers.forEach((buyer) => {
      const buyerMatchKeys = [
        normalizeKey(buyer?.vehicle?.vehicleNumber),
        normalizeKey(buyer?.vehicle?.chassisNo),
        normalizeKey(buyer?.oldHAnumber),
      ].filter(Boolean);

      buyerMatchKeys.forEach((buyerKey) => {
        if (!buyerByVehicleOrChassis.has(buyerKey)) {
          buyerByVehicleOrChassis.set(buyerKey, buyer);
        }
      });
    });

    const matchedBuyerIds = new Set();

    const sellerRecords = sellers
      .map((seller, index) => {
        const sellerVehicleKey = normalizeKey(seller?.vehicle?.vehicleNumber);
        const sellerChassisKey = normalizeKey(seller?.vehicle?.chassisNo);

        const matchedBuyer =
          buyerByVehicleOrChassis.get(sellerVehicleKey) ||
          buyerByVehicleOrChassis.get(sellerChassisKey) ||
          null;

        if (matchedBuyer?._id) {
          matchedBuyerIds.add(String(matchedBuyer._id));
        }

        return {
          id: index + 1,
          sellerId: seller?._id,
          buyerId: matchedBuyer?._id || null,
          seller: seller?.fullName || "",
          buyerName: matchedBuyer?.name || "",
          vehicle: seller?.vehicle?.vehicleNumber || "",
          vehicleName: seller?.vehicle?.vehicleName || "",
          model: seller?.vehicle?.model || "",
          chassis: seller?.vehicle?.chassisNo || "",
          soldAmount: seller?.vehicle?.bikePrice ?? null,
          buyAmount: matchedBuyer?.soldamount ?? null,
          date: createDisplayDate(seller?._id),
          createdAtDate: createTimestampDate(seller?._id),
          sellerDob: seller?.dateOfBirth || null,
          buyerDob: matchedBuyer?.dateOfBirth || null,
          sellerPhone: seller?.phoneNo || "",
          sellerAlternatePhone: seller?.alternatePhoneNo || "",
          buyerPhone: matchedBuyer?.phoneNo || "",
          buyerAlternatePhone: matchedBuyer?.alternatePhoneNo || "",
          sellerSoWoCo: seller?.sowoco || "",
          buyerSoWoCo: matchedBuyer?.sowoco || "",
          sowoco: matchedBuyer?.sowoco || seller?.sowoco || "",
          sellerOccupation: seller?.occupation || "",
          buyerOccupation: matchedBuyer?.occupation || "",
          sellerAadhaar: seller?.aadharNo || "",
          buyerAadhaar: matchedBuyer?.aadharNo || "",
          sellerAddress: seller?.fullAddress || "",
          buyerAddress: matchedBuyer?.fullAddress || "",
          sellerDistrict: seller?.district || "",
          sellerMandal: seller?.mandal || "",
          buyerDistrict: matchedBuyer?.district || "",
          buyerMandal: matchedBuyer?.mandal || "",
          district: matchedBuyer?.district || seller?.district || "",
          mandal: matchedBuyer?.mandal || seller?.mandal || "",
          sellerReferenceName: seller?.referralName || "",
          sellerReferencePhone: seller?.referralPhoneNo || "",
          buyerReferenceName: matchedBuyer?.referralName || "",
          buyerReferencePhone: matchedBuyer?.referralPhoneNo || "",
          dob: seller?.dateOfBirth || matchedBuyer?.dateOfBirth || null,
          phone: seller?.phoneNo || matchedBuyer?.phoneNo || "",
          alternatePhone: seller?.alternatePhoneNo || matchedBuyer?.alternatePhoneNo || "",
          aadhaar: seller?.aadharNo || matchedBuyer?.aadharNo || "",
          address: seller?.fullAddress || matchedBuyer?.fullAddress || "",
          financeAmount: matchedBuyer?.finance?.financeAmount ?? null,
          emiAmount: matchedBuyer?.finance?.emiAmount ?? null,
          emiMonths: matchedBuyer?.finance?.months ?? null,
          emiDate:
            matchedBuyer?.finance?.emiDate ??
            matchedBuyer?.finance?.emiStartDate ??
            matchedBuyer?.finance?.emiDates?.[0]?.emiDate ??
            null,
          agreementNo: matchedBuyer?.agreementNo || "",
          guarantorName: matchedBuyer?.guarantor?.fullName || "",
          guarantorPhone: matchedBuyer?.guarantor?.phoneNo || "",
          guarantorAadhaar: matchedBuyer?.guarantor?.aadharNo || "",
          guarantorAddress: matchedBuyer?.guarantor?.address || "",
          referenceName: matchedBuyer?.referralName || seller?.referralName || "",
          referencePhone: matchedBuyer?.referralPhoneNo || seller?.referralPhoneNo || "",
          status: matchedBuyer ? "completed" : "buyer pending",
          sellerData: seller,
          buyerData: matchedBuyer,
        };
      });

    const unmatchedBuyerRecords = buyers
      .filter((buyer) => buyer?._id && !matchedBuyerIds.has(String(buyer._id)))
      .map((buyer, index) => {
        return {
          id: sellerRecords.length + index + 1,
          sellerId: null,
          buyerId: buyer?._id,
          seller: "",
          buyerName: buyer?.name || "",
          vehicle: buyer?.vehicle?.vehicleNumber || "",
          vehicleName: buyer?.vehicle?.vehicleName || "",
          model: buyer?.vehicle?.model || "",
          chassis: buyer?.vehicle?.chassisNo || "",
          soldAmount: null,
          buyAmount: buyer?.soldamount ?? null,
          date: createDisplayDate(buyer?._id),
          createdAtDate: createTimestampDate(buyer?._id),
          sellerDob: null,
          buyerDob: buyer?.dateOfBirth || null,
          sellerPhone: "",
          sellerAlternatePhone: "",
          buyerPhone: buyer?.phoneNo || "",
          buyerAlternatePhone: buyer?.alternatePhoneNo || "",
          sellerSoWoCo: "",
          buyerSoWoCo: buyer?.sowoco || "",
          sowoco: buyer?.sowoco || "",
          sellerOccupation: "",
          buyerOccupation: buyer?.occupation || "",
          sellerAadhaar: "",
          buyerAadhaar: buyer?.aadharNo || "",
          sellerAddress: "",
          buyerAddress: buyer?.fullAddress || "",
          sellerDistrict: "",
          sellerMandal: "",
          buyerDistrict: buyer?.district || "",
          buyerMandal: buyer?.mandal || "",
          district: buyer?.district || "",
          mandal: buyer?.mandal || "",
          sellerReferenceName: "",
          sellerReferencePhone: "",
          buyerReferenceName: buyer?.referralName || "",
          buyerReferencePhone: buyer?.referralPhoneNo || "",
          dob: buyer?.dateOfBirth || null,
          phone: buyer?.phoneNo || "",
          alternatePhone: buyer?.alternatePhoneNo || "",
          aadhaar: buyer?.aadharNo || "",
          address: buyer?.fullAddress || "",
          financeAmount: buyer?.finance?.financeAmount ?? null,
          emiAmount: buyer?.finance?.emiAmount ?? null,
          emiMonths: buyer?.finance?.months ?? null,
          emiDate:
            buyer?.finance?.emiDate ??
            buyer?.finance?.emiStartDate ??
            buyer?.finance?.emiDates?.[0]?.emiDate ??
            null,
          agreementNo: buyer?.agreementNo || "",
          guarantorName: buyer?.guarantor?.fullName || "",
          guarantorPhone: buyer?.guarantor?.phoneNo || "",
          guarantorAadhaar: buyer?.guarantor?.aadharNo || "",
          guarantorAddress: buyer?.guarantor?.address || "",
          referenceName: buyer?.referralName || "",
          referencePhone: buyer?.referralPhoneNo || "",
          status: "seller pending",
          sellerData: null,
          buyerData: buyer,
        };
      });

    const records = [...sellerRecords, ...unmatchedBuyerRecords]
      .filter((record) => {
        if (normalizedStatus && normalizedStatus !== "all") {
          const recordStatus = normalizeStatusValue(record.status);
          if (recordStatus !== normalizedStatus) {
            return false;
          }
        }

        if (shouldApplyDateRange) {
          if (!record.createdAtDate) {
            return false;
          }

          const recordDate = new Date(record.createdAtDate);
          if (recordDate < fromDate || recordDate > toDate) {
            return false;
          }
        }

        if (!normalizedVehicle && !normalizedChassis && !normalizedSearch) return true;

        const recordVehicle = normalizeKey(record.vehicle);
        const recordChassis = normalizeKey(record.chassis);
        const sellerName = normalizeKey(record.seller);
        const buyerName = normalizeKey(record.buyerName);
        const sellerPhone = normalizeKey(record.sellerPhone);
        const buyerPhone = normalizeKey(record.buyerPhone);
        const sellerAddress = normalizeKey(record.sellerAddress);
        const buyerAddress = normalizeKey(record.buyerAddress);
        const soldAmount = normalizeKey(record.soldAmount);
        const buyAmount = normalizeKey(record.buyAmount);

        if (normalizedVehicle && recordVehicle === normalizedVehicle) return true;
        if (normalizedChassis && recordChassis === normalizedChassis) return true;

        if (normalizedSearch) {
          return (
            recordVehicle.includes(normalizedSearch) ||
            recordChassis.includes(normalizedSearch) ||
            sellerName.includes(normalizedSearch) ||
            buyerName.includes(normalizedSearch) ||
            sellerPhone.includes(normalizedSearch) ||
            buyerPhone.includes(normalizedSearch) ||
            sellerAddress.includes(normalizedSearch) ||
            buyerAddress.includes(normalizedSearch) ||
            soldAmount.includes(normalizedSearch) ||
            buyAmount.includes(normalizedSearch)
          );
        }

        return false;
      });

    const parsedPage = Math.max(1, Number.parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, Number.parseInt(limit, 10) || 10);
    const totalRecords = records.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / parsedLimit));
    const safePage = Math.min(parsedPage, totalPages);
    const startIndex = (safePage - 1) * parsedLimit;
    const paginatedRecords = records.slice(startIndex, startIndex + parsedLimit);

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      request: {
        vehicleNumber,
        chassisNo,
        search,
        from,
        to,
        status,
        page: safePage,
        limit: parsedLimit,
      },
      total: totalRecords,
      pagination: {
        page: safePage,
        limit: parsedLimit,
        totalRecords,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
      data: paginatedRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
      error: error.message,
    });
  }
};

const setIfProvided = (target, key, value, transform) => {
  if (value === undefined) return;
  target[key] = typeof transform === "function" ? transform(value) : value;
};

const toNullableDate = (value) => {
  if (value === null || value === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const toNullableNumber = (value) => {
  if (value === null || value === "") return null;
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
};

const isValidDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

const addMonthsSafe = (date, monthsToAdd) => {
  const base = new Date(date);
  const day = base.getDate();
  base.setMonth(base.getMonth() + monthsToAdd);

  // Keep EMI due dates stable for month-ends (e.g. 31st -> last day of target month).
  if (base.getDate() < day) {
    base.setDate(0);
  }

  return base;
};

const buildEmiSchedule = ({ startDate, months, emiAmount, existingSchedule = [] }) => {
  const safeMonths = Math.max(0, Number(months) || 0);
  const safeAmount = Number(emiAmount) || 0;

  if (!isValidDate(startDate) || safeMonths <= 0) return existingSchedule;

  return Array.from({ length: safeMonths }, (_, index) => {
    const previous = existingSchedule[index] || {};
    const paidAmount = Number(previous?.paidAmount || 0);

    return {
      emiNo: index + 1,
      emiDate: addMonthsSafe(startDate, index),
      amount: safeAmount,
      paid: Boolean(previous?.paid) || paidAmount >= safeAmount,
      paidDate: previous?.paidDate || null,
      paidAmount,
      bookNo: previous?.bookNo || "",
      pageNo: previous?.pageNo || "",
    };
  });
};

const updateUserData = async (req, res) => {
  try {
    if (!canEditModule(req?.subAdmin?.permissions, "users")) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit users",
      });
    }

    const {
      sellerId,
      buyerId,
      vehicleName,
      vehicleNumber,
      vehicle,
      model,
      chassis,
      seller,
      sellerOccupation,
      sellerPhone,
      sellerAlternatePhone,
      sellerAadhaar,
      sellerDob,
      sellerAddress,
      sellerReferenceName,
      sellerReferencePhone,
      soldAmount,
      buyerName,
      buyerOccupation,
      buyerPhone,
      buyerAlternatePhone,
      buyerAadhaar,
      buyerDob,
      buyerAddress,
      buyerReferenceName,
      buyerReferencePhone,
      buyAmount,
      financeAmount,
      emiAmount,
      emiMonths,
      emiDate,
      agreementNo,
      guarantorName,
      guarantorPhone,
      guarantorAadhaar,
      guarantorAddress,
    } = req.body || {};

    if (!sellerId && !buyerId) {
      return res.status(400).json({
        success: false,
        message: "sellerId or buyerId is required",
      });
    }

    const normalizedVehicleNumber = vehicleNumber ?? vehicle;
    const normalizedAgreementNo =
      typeof agreementNo === "string" ? agreementNo.trim() : agreementNo;

    if (buyerId && normalizedAgreementNo) {
      const existingAgreementBuyer = await Buyer.findOne({
        _id: { $ne: buyerId },
        agreementNo: normalizedAgreementNo,
      })
        .select("name agreementNo")
        .lean();

      if (existingAgreementBuyer) {
        return res.status(409).json({
          success: false,
          message: `Agreement Already Selected. Agreement No. ${existingAgreementBuyer.agreementNo} is already linked to ${existingAgreementBuyer.name || "another buyer"}.`,
        });
      }
    }

    const sellerSet = {};
    const buyerSet = {};
    const shouldSyncEmiSchedule =
      emiAmount !== undefined || emiMonths !== undefined || emiDate !== undefined;

    setIfProvided(sellerSet, "fullName", seller);
    setIfProvided(sellerSet, "occupation", sellerOccupation);
    setIfProvided(sellerSet, "phoneNo", sellerPhone);
    setIfProvided(sellerSet, "alternatePhoneNo", sellerAlternatePhone);
    setIfProvided(sellerSet, "aadharNo", sellerAadhaar);
    setIfProvided(sellerSet, "dateOfBirth", sellerDob, toNullableDate);
    setIfProvided(sellerSet, "fullAddress", sellerAddress);
    setIfProvided(sellerSet, "referralName", sellerReferenceName);
    setIfProvided(sellerSet, "referralPhoneNo", sellerReferencePhone);
    setIfProvided(sellerSet, "vehicle.vehicleName", vehicleName);
    setIfProvided(sellerSet, "vehicle.vehicleNumber", normalizedVehicleNumber);
    setIfProvided(sellerSet, "vehicle.model", model);
    setIfProvided(sellerSet, "vehicle.chassisNo", chassis);
    setIfProvided(sellerSet, "vehicle.bikePrice", soldAmount, toNullableNumber);

    setIfProvided(buyerSet, "name", buyerName);
    setIfProvided(buyerSet, "occupation", buyerOccupation);
    setIfProvided(buyerSet, "phoneNo", buyerPhone);
    setIfProvided(buyerSet, "alternatePhoneNo", buyerAlternatePhone);
    setIfProvided(buyerSet, "aadharNo", buyerAadhaar);
    setIfProvided(buyerSet, "dateOfBirth", buyerDob, toNullableDate);
    setIfProvided(buyerSet, "fullAddress", buyerAddress);
    setIfProvided(buyerSet, "referralName", buyerReferenceName);
    setIfProvided(buyerSet, "referralPhoneNo", buyerReferencePhone);
    setIfProvided(buyerSet, "soldamount", buyAmount, toNullableNumber);
    setIfProvided(buyerSet, "vehicle.vehicleName", vehicleName);
    setIfProvided(buyerSet, "vehicle.vehicleNumber", normalizedVehicleNumber);
    setIfProvided(buyerSet, "vehicle.model", model);
    setIfProvided(buyerSet, "vehicle.chassisNo", chassis);
    setIfProvided(buyerSet, "finance.financeAmount", financeAmount, toNullableNumber);
    setIfProvided(buyerSet, "finance.emiAmount", emiAmount, toNullableNumber);
    setIfProvided(buyerSet, "finance.months", emiMonths, toNullableNumber);
    setIfProvided(buyerSet, "finance.emiDate", emiDate, toNullableDate);
    setIfProvided(buyerSet, "finance.emiStartDate", emiDate, toNullableDate);
    setIfProvided(buyerSet, "agreementNo", normalizedAgreementNo);
    setIfProvided(buyerSet, "guarantor.fullName", guarantorName);
    setIfProvided(buyerSet, "guarantor.phoneNo", guarantorPhone);
    setIfProvided(buyerSet, "guarantor.aadharNo", guarantorAadhaar);
    setIfProvided(buyerSet, "guarantor.address", guarantorAddress);

    const operations = [];

    if (sellerId && Object.keys(sellerSet).length > 0) {
      operations.push(
        Seller.findByIdAndUpdate(sellerId, { $set: sellerSet }, { new: true }).lean()
      );
    }

    if (buyerId && Object.keys(buyerSet).length > 0) {
      if (shouldSyncEmiSchedule) {
        const existingBuyer = await Buyer.findById(buyerId)
          .select("finance.emiAmount finance.months finance.emiDate finance.emiStartDate finance.emiDates")
          .lean();

        if (existingBuyer?.finance) {
          const currentFinance = existingBuyer.finance;
          const nextEmiAmount =
            buyerSet["finance.emiAmount"] !== undefined
              ? buyerSet["finance.emiAmount"]
              : Number(currentFinance?.emiAmount || 0);
          const nextMonths =
            buyerSet["finance.months"] !== undefined
              ? buyerSet["finance.months"]
              : Number(currentFinance?.months || currentFinance?.emiDates?.length || 0);
          const nextStartDate =
            buyerSet["finance.emiStartDate"] !== undefined
              ? buyerSet["finance.emiStartDate"]
              : currentFinance?.emiStartDate ||
                currentFinance?.emiDate ||
                currentFinance?.emiDates?.[0]?.emiDate ||
                null;

          const schedule = buildEmiSchedule({
            startDate: nextStartDate,
            months: nextMonths,
            emiAmount: nextEmiAmount,
            existingSchedule: currentFinance?.emiDates || [],
          });

          buyerSet["finance.emiDates"] = schedule;
        }
      }

      operations.push(
        Buyer.findByIdAndUpdate(buyerId, { $set: buyerSet }, { new: true }).lean()
      );
    }

    if (operations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No editable fields were provided",
      });
    }

    await Promise.all(operations);

    return res.status(200).json({
      success: true,
      message: "User data updated successfully",
      data: {
        sellerId: sellerId || null,
        buyerId: buyerId || null,
      },
    });
  } catch (error) {
    const isAgreementDuplicate =
      error?.code === 11000 &&
      (error?.keyPattern?.agreementNo || String(error?.message || "").includes("agreementNo_1"));

    if (isAgreementDuplicate) {
      const duplicateAgreementNo = error?.keyValue?.agreementNo || "";
      return res.status(409).json({
        success: false,
        message: `Agreement Already Selected. Agreement No. ${duplicateAgreementNo} is already linked to another buyer record.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update user data",
      error: error.message,
    });
  }
};

const deleteUserData = async (req, res) => {
  try {
    if (!canEditModule(req?.subAdmin?.permissions, "users")) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit users",
      });
    }

    const { sellerId, buyerId } = req.body || {};

    if (!sellerId && !buyerId) {
      return res.status(400).json({
        success: false,
        message: "sellerId or buyerId is required",
      });
    }

    if (sellerId && !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sellerId",
      });
    }

    if (buyerId && !mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid buyerId",
      });
    }

    const [deletedSeller, deletedBuyer] = await Promise.all([
      sellerId ? Seller.findByIdAndDelete(sellerId).lean() : Promise.resolve(null),
      buyerId ? Buyer.findByIdAndDelete(buyerId).lean() : Promise.resolve(null),
    ]);

    if (sellerId && !deletedSeller && buyerId && !deletedBuyer) {
      return res.status(404).json({
        success: false,
        message: "Seller and buyer records not found",
      });
    }

    if (sellerId && !deletedSeller && !buyerId) {
      return res.status(404).json({
        success: false,
        message: "Seller record not found",
      });
    }

    if (buyerId && !deletedBuyer && !sellerId) {
      return res.status(404).json({
        success: false,
        message: "Buyer record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User record(s) deleted permanently",
      data: {
        sellerId: deletedSeller?._id || null,
        buyerId: deletedBuyer?._id || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user data",
      error: error.message,
    });
  }
};

export { getUserData, updateUserData, deleteUserData };

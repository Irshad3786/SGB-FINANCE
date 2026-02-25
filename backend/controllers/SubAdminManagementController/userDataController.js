import Buyer from "../../models/buyerModel.js";
import Seller from "../../models/sellerModel.js";

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

const getUserData = async (req, res) => {
  try {
    const { vehicleNumber = "", chassisNo = "", search = "", page = 1, limit = 10 } = req.query;

    const normalizedVehicle = normalizeKey(vehicleNumber);
    const normalizedChassis = normalizeKey(chassisNo);
    const normalizedSearch = normalizeKey(search);

    const sellers = await Seller.find({})
      .select("fullName phoneNo aadharNo dateOfBirth fullAddress vehicle referralName referralPhoneNo")
      .lean();

    const buyers = await Buyer.find({})
      .select("name phoneNo aadharNo dateOfBirth fullAddress soldamount oldHAnumber vehicle finance guarantor referralName referralPhoneNo")
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

    const records = sellers
      .map((seller, index) => {
        const sellerVehicleKey = normalizeKey(seller?.vehicle?.vehicleNumber);
        const sellerChassisKey = normalizeKey(seller?.vehicle?.chassisNo);

        const matchedBuyer =
          buyerByVehicleOrChassis.get(sellerVehicleKey) ||
          buyerByVehicleOrChassis.get(sellerChassisKey) ||
          null;

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
          sellerDob: seller?.dateOfBirth || null,
          buyerDob: matchedBuyer?.dateOfBirth || null,
          sellerPhone: seller?.phoneNo || "",
          buyerPhone: matchedBuyer?.phoneNo || "",
          sellerAadhaar: seller?.aadharNo || "",
          buyerAadhaar: matchedBuyer?.aadharNo || "",
          sellerAddress: seller?.fullAddress || "",
          buyerAddress: matchedBuyer?.fullAddress || "",
          sellerReferenceName: seller?.referralName || "",
          sellerReferencePhone: seller?.referralPhoneNo || "",
          buyerReferenceName: matchedBuyer?.referralName || "",
          buyerReferencePhone: matchedBuyer?.referralPhoneNo || "",
          dob: seller?.dateOfBirth || matchedBuyer?.dateOfBirth || null,
          phone: seller?.phoneNo || matchedBuyer?.phoneNo || "",
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
      })
      .filter((record) => {
        if (!normalizedVehicle && !normalizedChassis && !normalizedSearch) return true;

        const recordVehicle = normalizeKey(record.vehicle);
        const recordChassis = normalizeKey(record.chassis);
        const sellerName = normalizeKey(record.seller);
        const buyerName = normalizeKey(record.buyerName);

        if (normalizedVehicle && recordVehicle === normalizedVehicle) return true;
        if (normalizedChassis && recordChassis === normalizedChassis) return true;

        if (normalizedSearch) {
          return (
            recordVehicle.includes(normalizedSearch) ||
            recordChassis.includes(normalizedSearch) ||
            sellerName.includes(normalizedSearch) ||
            buyerName.includes(normalizedSearch)
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

export { getUserData };

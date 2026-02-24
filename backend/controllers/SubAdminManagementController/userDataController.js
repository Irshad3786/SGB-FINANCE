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
    const { vehicleNumber = "", chassisNo = "", search = "" } = req.query;

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
          dob: seller?.dateOfBirth || matchedBuyer?.dateOfBirth || null,
          phone: seller?.phoneNo || matchedBuyer?.phoneNo || "",
          aadhaar: seller?.aadharNo || matchedBuyer?.aadharNo || "",
          address: seller?.fullAddress || matchedBuyer?.fullAddress || "",
          financeAmount: matchedBuyer?.finance?.financeAmount ?? null,
          emiAmount: matchedBuyer?.finance?.emiAmount ?? null,
          emiMonths: matchedBuyer?.finance?.months ?? null,
          emiDate: matchedBuyer?.finance?.emiDate ?? null,
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

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      request: {
        vehicleNumber,
        chassisNo,
        search,
      },
      total: records.length,
      data: records,
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

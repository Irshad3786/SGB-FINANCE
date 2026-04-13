import Buyer from "../../models/buyerModel.js";
import Seller from "../../models/sellerModel.js";
import CollectionEntry from "../../models/collectionEntryModel.js";
import Request from "../../models/requestModel.js";

const MONTHS_TO_SHOW = 4;

const getLastMonthLabels = (count = MONTHS_TO_SHOW) => {
  const now = new Date();
  const labels = [];

  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      date.toLocaleString("en-US", {
        month: "short",
      })
    );
  }

  return labels;
};

const getMonthlyCollection = (buyers = [], count = MONTHS_TO_SHOW) => {
  const now = new Date();
  const monthlyBuckets = Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      total: 0,
    };
  });

  const bucketMap = new Map(monthlyBuckets.map((item) => [item.key, item]));

  buyers.forEach((buyer) => {
    const paymentEntries = Array.isArray(buyer?.finance?.paymentEntries)
      ? buyer.finance.paymentEntries
      : [];

    paymentEntries.forEach((entry) => {
      if (!entry?.paidDate) return;
      const paidDate = new Date(entry.paidDate);
      if (Number.isNaN(paidDate.getTime())) return;

      const key = `${paidDate.getFullYear()}-${paidDate.getMonth()}`;
      if (!bucketMap.has(key)) return;

      const amount = Number(entry?.amount || 0);
      const current = bucketMap.get(key);
      current.total += Number.isFinite(amount) ? amount : 0;
    });
  });

  return monthlyBuckets.map((item) => Math.round(item.total));
};

const getFinanceSummary = (buyers = []) => {
  return buyers.reduce(
    (acc, buyer) => {
      const finance = buyer?.finance || {};
      const financeAmount = Number(finance?.financeAmount || 0);
      if (financeAmount <= 0) {
        return acc;
      }

      const emiDates = Array.isArray(finance?.emiDates) ? finance.emiDates : [];
      const paymentEntries = Array.isArray(finance?.paymentEntries) ? finance.paymentEntries : [];

      const totalInstalmentAmount = emiDates.reduce((sum, emiRow) => sum + Number(emiRow?.amount || 0), 0);
      const totalPaid = paymentEntries.reduce((sum, entry) => sum + Number(entry?.amount || 0), 0);
      const pending = Math.max(totalInstalmentAmount - totalPaid, 0);

      const emiAmount = Number(finance?.emiAmount || 0);
      const months = Number(finance?.months || 0);
      const withHAAmount = emiAmount > 0 && months > 0 ? emiAmount * months : 0;

      acc.totalFinancedAmount += financeAmount;
      acc.totalWithHA += withHAAmount;
      acc.totalWithoutHA += financeAmount;
      acc.collectionDone += totalPaid;
      acc.pendingCollection += pending;
      return acc;
    },
    {
      totalFinancedAmount: 0,
      totalWithHA: 0,
      totalWithoutHA: 0,
      collectionDone: 0,
      pendingCollection: 0,
    }
  );
};

export const getDashboardData = async (req, res) => {
  try {
    const [buyers, totalSellers, totalCollectionEntries, requestTypeRows, totalRequests] = await Promise.all([
      Buyer.find({})
        .select("mode agreementNo finance.paymentEntries finance.emiDates finance.financeAmount finance.emiAmount finance.months finance.status")
        .lean(),
      Seller.countDocuments({}),
      CollectionEntry.countDocuments({}),
      Request.aggregate([
        { $group: { _id: "$requestType", count: { $sum: 1 } } },
      ]),
      Request.countDocuments({}),
    ]);

    const totalBuyers = buyers.length;
    const totalUsers = totalSellers + totalBuyers;
    const financed = buyers.filter((buyer) => Number(buyer?.finance?.financeAmount || 0) > 0).length;
    const refinance = buyers.filter((buyer) => String(buyer?.mode || "").toLowerCase() === "refinance").length;
    const pendingPayments = buyers.filter((buyer) => {
      const financeAmount = Number(buyer?.finance?.financeAmount || 0);
      const status = String(buyer?.finance?.status || "").toLowerCase();
      return financeAmount > 0 && status !== "paid";
    }).length;

    const financeSummary = getFinanceSummary(buyers);
    const monthlyLabels = getLastMonthLabels(MONTHS_TO_SHOW);
    const monthlyValues = getMonthlyCollection(buyers, MONTHS_TO_SHOW);

    const requestTypeCounts = {
      all: totalRequests,
      finance: 0,
      contact: 0,
      support: 0,
      application: 0,
      documentation: 0,
      ticket: 0,
      other: 0,
    };

    requestTypeRows.forEach((row) => {
      const key = String(row?._id || "other").toLowerCase();
      if (Object.prototype.hasOwnProperty.call(requestTypeCounts, key)) {
        requestTypeCounts[key] = Number(row?.count || 0);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        stats: {
          totalUsers,
          totalSellers,
          totalBuyers,
          financed,
          refinance,
          totalVehicles: totalSellers,
          pendingPayments,
          totalFinancedAmount: Math.round(financeSummary.totalFinancedAmount),
          totalWithHA: Math.round(financeSummary.totalWithHA),
          totalWithoutHA: Math.round(financeSummary.totalWithoutHA),
          totalCollections: totalCollectionEntries,
        },
        requestSummary: requestTypeCounts,
        charts: {
          monthlyCollection: {
            labels: monthlyLabels,
            values: monthlyValues,
          },
          collectionDistribution: {
            collectionDone: Math.round(financeSummary.collectionDone),
            pendingCollection: Math.round(financeSummary.pendingCollection),
          },
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

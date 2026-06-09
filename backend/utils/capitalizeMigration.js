import mongoose from "mongoose";

const EXCLUDED_KEYS = new Set([
  "_id",
  "id",
  "mode",
  "role",
  "status",
  "aadharFront",
  "aadharBack",
  "profile",
  "guarantorPhoto",
  "guarantorAadharFront",
  "guarantorAadharBack",
  "guarantorAadhaarFront",
  "guarantorAadhaarBack",
  "aadharFrontKey",
  "aadharBackKey",
  "profileKey",
  "guarantorPhotoUrl",
  "guarantorAadhaarFrontUrl",
  "guarantorAadhaarBackUrl",
  "sellerProfileUrl",
  "sellerAadhaarFrontUrl",
  "sellerAadhaarBackUrl",
  "buyerProfileUrl",
  "buyerAadhaarFrontUrl",
  "buyerAadhaarBackUrl",
  "createdAt",
  "updatedAt",
  "__v"
]);

export const capitalizeObjectStrings = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => capitalizeObjectStrings(item));
  }

  if (typeof obj === "object") {
    // If it's a Date, Mongoose ObjectId, or similar non-plain object, do not modify
    if (obj instanceof Date || obj.constructor?.name === "ObjectId") {
      return obj;
    }
    const newObj = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (EXCLUDED_KEYS.has(key)) {
        newObj[key] = val;
      } else if (typeof val === "string") {
        newObj[key] = val.toUpperCase();
      } else {
        newObj[key] = capitalizeObjectStrings(val);
      }
    }
    return newObj;
  }

  return obj;
};

export const runCapitalizeMigration = async () => {
  try {
    console.log("🔄 Starting capitalization migration for Sellers and Buyers...");
    
    const Seller = mongoose.model("Seller");
    const Buyer = mongoose.model("Buyer");

    const sellers = await Seller.find({}).lean();
    console.log(`Found ${sellers.length} sellers to verify/migrate.`);
    let sellerCount = 0;
    for (const seller of sellers) {
      const capitalized = capitalizeObjectStrings(seller);
      await Seller.findByIdAndUpdate(seller._id, { $set: capitalized });
      sellerCount++;
    }
    console.log(`Updated ${sellerCount} sellers.`);

    const buyers = await Buyer.find({}).lean();
    console.log(`Found ${buyers.length} buyers to verify/migrate.`);
    let buyerCount = 0;
    for (const buyer of buyers) {
      const capitalized = capitalizeObjectStrings(buyer);
      await Buyer.findByIdAndUpdate(buyer._id, { $set: capitalized });
      buyerCount++;
    }
    console.log(`Updated ${buyerCount} buyers.`);

    console.log("✅ Capitalization migration completed successfully!");
  } catch (error) {
    console.error("❌ Capitalization migration failed:", error);
  }
};

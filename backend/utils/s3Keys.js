const PERSON_TYPES = new Set(["buyer", "seller", "guarantor"]);
const DOCUMENT_NAMES = new Set(["profile", "aadhaar-front", "aadhaar-back"]);

export const isSupportedPersonType = (value) => PERSON_TYPES.has(String(value || "").toLowerCase());
export const isSupportedDocumentName = (value) => DOCUMENT_NAMES.has(String(value || "").toLowerCase());

export const normalizeVehicleNumber = (value) => {
  const trimmed = String(value || "").trim().toUpperCase();
  // Keep only A-Z/0-9, drop spaces and special characters.
  return trimmed.replace(/[^A-Z0-9]/g, "");
};

export const buildApplicationObjectKey = ({
  vehicleNumber,
  personType,
  documentName,
  timestamp = Date.now(),
}) => {
  const normalizedVehicle = normalizeVehicleNumber(vehicleNumber);
  const normalizedPerson = String(personType || "").toLowerCase();
  const normalizedDoc = String(documentName || "").toLowerCase();

  if (!normalizedVehicle) {
    throw new Error("vehicleNumber is required");
  }
  if (!isSupportedPersonType(normalizedPerson)) {
    throw new Error("Invalid personType. Allowed: buyer, seller, guarantor");
  }
  if (!isSupportedDocumentName(normalizedDoc)) {
    throw new Error("Invalid documentName. Allowed: profile, aadhaar-front, aadhaar-back");
  }

  const safeTimestamp = Number(timestamp);
  if (!Number.isFinite(safeTimestamp) || safeTimestamp <= 0) {
    throw new Error("Invalid timestamp");
  }

  return `applications/${normalizedVehicle}/${normalizedPerson}/${normalizedDoc}-${safeTimestamp}.webp`;
};

export const isValidApplicationObjectKey = (key) => {
  const candidate = String(key || "");
  return /^applications\/[A-Z0-9]+\/(buyer|seller|guarantor)\/(profile|aadhaar-front|aadhaar-back)-\d+\.webp$/.test(candidate);
};

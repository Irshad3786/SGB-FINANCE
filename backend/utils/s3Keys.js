const PERSON_TYPES = new Set(["buyer", "seller", "guarantor"]);

export const isSupportedPersonType = (value) => PERSON_TYPES.has(String(value || "").toLowerCase());

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
  // Allow any documentName but sanitize to a safe token (lowercase, alnum, hyphen, underscore)
  const normalizedDoc = String(documentName || "").toLowerCase().trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalizedVehicle) {
    throw new Error("vehicleNumber is required");
  }
  if (!isSupportedPersonType(normalizedPerson)) {
    throw new Error("Invalid personType. Allowed: buyer, seller, guarantor");
  }

  const safeTimestamp = Number(timestamp);
  if (!Number.isFinite(safeTimestamp) || safeTimestamp <= 0) {
    throw new Error("Invalid timestamp");
  }

  const docToken = normalizedDoc || "document";
  return `applications/${normalizedVehicle}/${normalizedPerson}/${docToken}-${safeTimestamp}.webp`;
};

export const isValidApplicationObjectKey = (key) => {
  const candidate = String(key || "");
  // Accept sanitized document tokens (lowercase alnum, hyphen, underscore)
  return /^applications\/[A-Za-z0-9_-]+\/(buyer|seller|guarantor)\/[a-z0-9_-]+-\d+\.webp$/.test(candidate);
};

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { apDistricts, apMandals, fetchLocationLookup, normalizeKey } from "../constants/apLocations";
import apiClient from "../../api/axios";
import { useToast } from "../../components/ToastProvider";
import InvoicePreviewModal from "./InvoicePreviewModal";
import { canEditModule, readStoredSubAdminProfile } from "../utils/subAdminAccess";

const formatDateInput = (dateValue) => {
  if (!dateValue) return "";
  const dateObj = new Date(dateValue);
  if (Number.isNaN(dateObj.getTime())) return "";
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const pickDistrictValues = (value, districtOptions) => {
  const safeValue = String(value || "").trim();
  if (!safeValue) return { district: "", customDistrict: "" };
  const exists = districtOptions.some((entry) => entry.toLowerCase() === safeValue.toLowerCase());
  if (exists) return { district: safeValue, customDistrict: "" };
  return { district: "Other", customDistrict: safeValue };
};

const pickMandalValues = (value, districtValue, mandalsByDistrict, allMandals) => {
  const safeValue = String(value || "").trim();
  if (!safeValue) return { mandal: "", customMandal: "" };

  const districtMandals = districtValue && districtValue !== "Other"
    ? (mandalsByDistrict[normalizeKey(districtValue)] || [])
    : [];
  const sourceList = districtMandals.length > 0 ? districtMandals : allMandals;
  const exists = sourceList.some((entry) => entry.toLowerCase() === safeValue.toLowerCase());

  if (exists) return { mandal: safeValue, customMandal: "" };
  return { mandal: "Other", customMandal: safeValue };
};

const INITIAL_REFINANCE_FORM = {
  fullName: "",
  soWoCo: "",
  occupation: "",
  phone: "",
  alternatePhone: "",
  aadhaar: "",
  vehicleName: "",
  model: "",
  vehicleNo: "",
  chassisNo: "",
  oldHaNumber: "",
  dob: "2000-01-01",
  district: "",
  customDistrict: "",
  mandal: "",
  customMandal: "",
  street: "",
  address: "",
  guarantorName: "",
  guarantorSoWoCo: "",
  guarantorOccupation: "",
  guarantorPhone: "",
  guarantorAlternatePhone: "",
  guarantorAadhaar: "",
  guarantorDob: "2000-01-01",
  guarantorDistrict: "",
  guarantorCustomDistrict: "",
  guarantorMandal: "",
  guarantorCustomMandal: "",
  guarantorAddress: "",
  referralName: "",
  referralPhone: "",
  isFinanced: true,
  agreementNo: "",
  financeAmount: "",
  emiDate: "",
  emiMonths: "",
  emiAmount: "",
};

const INITIAL_REFINANCE_FILES = {
  aadhaarFront: null,
  aadhaarBack: null,
  profile: null,
  guarantorPhoto: null,
};

function RefinanceForm({ inputBase, labelClass }) {
  const baseInput =
    inputBase ||
    "w-full pl-10 px-3 py-2 rounded-xl border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] pr-4 text-sm";
  const baseLabel = labelClass || "text-sm text-[#27563C] font-semibold";

  const [form, setForm] = useState(INITIAL_REFINANCE_FORM);
  const [permissions, setPermissions] = useState(() => readStoredSubAdminProfile().permissions || []);
  const canEditRefinance = canEditModule(permissions, "addEntry");
  const [suggestedAgreementNo, setSuggestedAgreementNo] = useState("");

  const [files, setFiles] = useState(INITIAL_REFINANCE_FILES);

  const [showGuarantor, setShowGuarantor] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [districtOptions, setDistrictOptions] = useState(apDistricts);
  const [allMandalOptions, setAllMandalOptions] = useState(apMandals);
  const [mandalsByDistrict, setMandalsByDistrict] = useState({});
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const lastPrefillHaRef = useRef("");
  const invoiceRef = useRef(null);
  const { showToast } = useToast();
  const printInvoice = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: "refinance-invoice",
  });

  const handleInvoicePreviewClose = () => {
    setShowInvoicePreview(false);
  };

  const handleInvoicePrint = () => {
    printInvoice?.();
  };

  const fetchNextAgreementNumber = async (forceReplace = false) => {
    try {
      const response = await apiClient.get("/api/subadmin/management/next-agreement-number");
      const nextAgreementNo = response?.data?.data?.agreementNo || "";

      if (nextAgreementNo) {
        setSuggestedAgreementNo(nextAgreementNo);
        setForm((prev) => {
          if (forceReplace || !prev.agreementNo) {
            return { ...prev, agreementNo: nextAgreementNo };
          }
          return prev;
        });
      }
    } catch {
      // Keep manual entry available if auto-number API fails.
    }
  };

  useEffect(() => {
    fetchNextAgreementNumber();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const syncPermissions = async () => {
      try {
        const response = await apiClient.get('/api/subadmin/me');
        const currentPermissions = Array.isArray(response?.data?.data?.permissions)
          ? response.data.data.permissions
          : [];

        if (isMounted) {
          setPermissions(currentPermissions);
        }
      } catch {
        if (isMounted) {
          const storedProfile = readStoredSubAdminProfile();
          setPermissions(storedProfile?.permissions || []);
        }
      }
    };

    syncPermissions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadLocationOptions = async () => {
      try {
        const lookup = await fetchLocationLookup();
        if (!isMounted) return;

        setDistrictOptions(lookup.districtOptions.length > 0 ? lookup.districtOptions : apDistricts);
        setAllMandalOptions(lookup.mandalOptions.length > 0 ? lookup.mandalOptions : apMandals);
        setMandalsByDistrict(lookup.mandalsByDistrict || {});
      } catch {
        if (!isMounted) return;
        setDistrictOptions(apDistricts);
        setAllMandalOptions(apMandals);
        setMandalsByDistrict({});
      }
    };

    loadLocationOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const enteredHaNumber = String(form.oldHaNumber || "").trim();

    if (!enteredHaNumber || enteredHaNumber.length < 2) {
      return;
    }

    if (lastPrefillHaRef.current.toLowerCase() === enteredHaNumber.toLowerCase()) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsAutoFilling(true);
        const response = await apiClient.get("/api/subadmin/management/refinance-prefill", {
          params: { haNumber: enteredHaNumber },
        });

        const buyer = response?.data?.data?.buyer || {};
        const vehicle = buyer?.vehicle || {};
        const guarantor = buyer?.guarantor || {};
        const finance = buyer?.finance || {};

        const resolvedDistrict = pickDistrictValues(buyer?.district, districtOptions);
        const resolvedMandal = pickMandalValues(
          buyer?.mandal,
          resolvedDistrict.district,
          mandalsByDistrict,
          allMandalOptions
        );

        const resolvedGuarantorDistrict = pickDistrictValues(guarantor?.district, districtOptions);
        const resolvedGuarantorMandal = pickMandalValues(
          guarantor?.mandal,
          resolvedGuarantorDistrict.district,
          mandalsByDistrict,
          allMandalOptions
        );

        const hasGuarantorData = Boolean(
          guarantor?.fullName || guarantor?.phoneNo || guarantor?.aadharNo || guarantor?.address
        );

        setForm((prev) => ({
          ...prev,
          fullName: buyer?.name || "",
          soWoCo: buyer?.sowoco || "",
          occupation: buyer?.occupation || "",
          phone: buyer?.phoneNo || "",
          alternatePhone: buyer?.alternatePhoneNo || "",
          aadhaar: buyer?.aadharNo || "",
          vehicleName: vehicle?.vehicleName || "",
          model: vehicle?.model || "",
          vehicleNo: vehicle?.vehicleNumber || "",
          chassisNo: vehicle?.chassisNo || "",
          oldHaNumber: enteredHaNumber,
          dob: formatDateInput(buyer?.dateOfBirth) || "2000-01-01",
          district: resolvedDistrict.district,
          customDistrict: resolvedDistrict.customDistrict,
          mandal: resolvedMandal.mandal,
          customMandal: resolvedMandal.customMandal,
          street: buyer?.street || "",
          address: buyer?.fullAddress || "",
          guarantorName: guarantor?.fullName || "",
          guarantorSoWoCo: guarantor?.sowoco || "",
          guarantorOccupation: guarantor?.occupation || "",
          guarantorPhone: guarantor?.phoneNo || "",
          guarantorAlternatePhone: guarantor?.alternatePhoneNo || "",
          guarantorAadhaar: guarantor?.aadharNo || "",
          guarantorDob: formatDateInput(guarantor?.dateOfBirth) || "2000-01-01",
          guarantorDistrict: resolvedGuarantorDistrict.district,
          guarantorCustomDistrict: resolvedGuarantorDistrict.customDistrict,
          guarantorMandal: resolvedGuarantorMandal.mandal,
          guarantorCustomMandal: resolvedGuarantorMandal.customMandal,
          guarantorAddress: guarantor?.address || "",
          referralName: buyer?.referralName || "",
          referralPhone: buyer?.referralPhoneNo || "",
          financeAmount: finance?.financeAmount ? String(finance.financeAmount) : "",
          emiDate: formatDateInput(finance?.emiStartDate),
          emiMonths: finance?.months ? String(finance.months) : "",
          emiAmount: finance?.emiAmount ? String(finance.emiAmount) : "",
        }));

        setShowGuarantor(hasGuarantorData);
        lastPrefillHaRef.current = enteredHaNumber;
        showToast({
          type: "success",
          title: "Auto Filled",
          message: "Refinance details loaded from HA / Agreement number",
        });
      } catch (error) {
        if (error?.response?.status === 404) {
          showToast({
            type: "error",
            title: "Not Found",
            message: "No existing data found for this HA / Agreement number",
          });
        }
      } finally {
        setIsAutoFilling(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [form.oldHaNumber, districtOptions, allMandalOptions, mandalsByDistrict, showToast]);

  const buildRefinanceInvoice = (responseData) => {
    const saved = responseData?.data || {};
    const vehicle = saved?.vehicle || {};
    const finance = saved?.finance || {};
    const refinanceContext = responseData?.meta?.refinanceContext || {};
    const previousBuyer = refinanceContext?.previousBuyer || {};
    const previousSeller = refinanceContext?.previousSeller || {};

    return {
      mode: "refinance",
      typeLabel: "Refinance Invoice",
      invoiceNo: saved?._id || "-",
      date: new Date().toLocaleDateString("en-IN"),
      fullName: form.fullName,
      soWoCo: form.soWoCo,
      occupation: form.occupation,
      phone: form.phone,
      aadhaar: form.aadhaar,
      vehicleName: form.vehicleName || vehicle.vehicleName,
      vehicleNo: form.vehicleNo || vehicle.vehicleNumber,
      model: form.model || vehicle.model,
      chassisNo: form.chassisNo || vehicle.chassisNo,
      saleAmount: form.saleAmount || saved?.soldamount || vehicle.bikePrice || "-",
      address: form.address,
      district: form.district === "Other" ? form.customDistrict : form.district,
      mandal: form.mandal === "Other" ? form.customMandal : form.mandal,
      agreementNo: form.agreementNo || saved?.agreementNo || "-",
      financeAmount: form.financeAmount || finance.financeAmount || "-",
      emiAmount: form.emiAmount || finance.emiAmount || "-",
      emiMonths: form.emiMonths || finance.months || "-",
      emiDate: form.emiDate || "-",
      oldHaNumber: form.oldHaNumber || saved?.oldHAnumber || previousBuyer?.agreementNo || "-",
      previousBuyer: {
        name: previousBuyer?.name || "-",
        phone: previousBuyer?.phoneNo || "-",
        agreementNo: previousBuyer?.agreementNo || previousBuyer?.oldHAnumber || "-",
        vehicleNo: previousBuyer?.vehicle?.vehicleNumber || "-",
      },
      previousSeller: {
        name: previousSeller?.fullName || "-",
        phone: previousSeller?.phoneNo || "-",
        vehicleNo: previousSeller?.vehicle?.vehicleNumber || "-",
      },
    };
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const phoneFields = ["phone", "alternatePhone", "referralPhone", "guarantorPhone", "guarantorAlternatePhone"];
    const aadhaarFields = ["aadhaar", "guarantorAadhaar"];

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (phoneFields.includes(name)) {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    if (aadhaarFields.includes(name)) {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
      setForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    if (name === "vehicleNo") {
      setForm((prev) => ({ ...prev, [name]: value.slice(0, 10) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onDistrictChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      district: value,
      mandal: "",
      customMandal: "",
      customDistrict: value === "Other" ? prev.customDistrict : "",
    }));
  };

  const onMandalChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      mandal: value,
      customMandal: value === "Other" ? prev.customMandal : "",
    }));
  };

  const onGuarantorDistrictChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      guarantorDistrict: value,
      guarantorMandal: "",
      guarantorCustomMandal: "",
      guarantorCustomDistrict: value === "Other" ? prev.guarantorCustomDistrict : "",
    }));
  };

  const onGuarantorMandalChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      guarantorMandal: value,
      guarantorCustomMandal: value === "Other" ? prev.guarantorCustomMandal : "",
    }));
  };

  const selectedDistrictMandals = form.district && form.district !== "Other"
    ? (mandalsByDistrict[normalizeKey(form.district)] || [])
    : [];

  const selectedGuarantorDistrictMandals = form.guarantorDistrict && form.guarantorDistrict !== "Other"
    ? (mandalsByDistrict[normalizeKey(form.guarantorDistrict)] || [])
    : [];

  const mandalOptions = selectedDistrictMandals.length > 0
    ? [...selectedDistrictMandals, "Other"]
    : allMandalOptions;

  const guarantorMandalOptions = selectedGuarantorDistrictMandals.length > 0
    ? [...selectedGuarantorDistrictMandals, "Other"]
    : allMandalOptions;

  const onFileChange = (e, key) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const onSubmit = async () => {
    if (!canEditRefinance) {
      showToast({
        type: "error",
        title: "Permission",
        message: "You do not have permission to add entries",
      });
      return;
    }

    try {
      const phoneFields = ["phone", "alternatePhone", "referralPhone", "guarantorPhone", "guarantorAlternatePhone"];
      const aadhaarFields = ["aadhaar", "guarantorAadhaar"];

      const invalidPhoneField = phoneFields.find((field) => form[field] && form[field].length !== 10);
      if (invalidPhoneField) {
        showToast({
          type: "error",
          title: "Invalid Phone Number",
          message: "Phone numbers must be exactly 10 digits",
        });
        return;
      }

      const invalidAadhaarField = aadhaarFields.find((field) => form[field] && form[field].length !== 12);
      if (invalidAadhaarField) {
        showToast({
          type: "error",
          title: "Invalid Aadhaar Number",
          message: "Aadhaar number must be exactly 12 digits",
        });
        return;
      }

      const payload = {
        ...form,
        oldHaNumber: form.oldHaNumber,
        mode: "refinance",
        isFinanced: true,
      };

      const response = await apiClient.post("/api/subadmin/management/save-buyer", payload);
      console.log("refinance saved:", response.data);
      showToast({
        type: "success",
        title: "Success",
        message: response.data?.message || "Refinance saved successfully",
      });
      setInvoice(buildRefinanceInvoice(response.data));
      setShowInvoicePreview(true);
      setForm(INITIAL_REFINANCE_FORM);
      setFiles(INITIAL_REFINANCE_FILES);
      setShowGuarantor(false);
      fetchNextAgreementNumber(true);
    } catch (error) {
      console.error("refinance save error:", error?.response?.data || error.message);
      showToast({
        type: "error",
        title: "Error",
        message: error?.response?.data?.message || "Failed to save refinance",
      });
    }
  };

  return (
    <div className="w-full bg-[#E0FCED] rounded-2xl p-6 sm:p-8 space-y-3">
      <div className="flex items-center gap-3 pb-2 border-b">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path
              fill="#a6a6a6"
              d="M0 10.5v-1A4.5 4.5 0 0 1 4.5 5h7.586l-2-2L11.5 1.586L15.914 6L11.5 10.414L10.086 9l2-2H4.5a2.5 2.5 0 0 0 0 5H12v2H4.5a4.5 4.5 0 0 1-4.388-3.5z"
            />
          </svg>
        </span>
        <div>
          <p className="text-base font-semibold text-gray-900">Refinance</p>
          <p className="text-xs text-gray-500">Capture refinance details</p>
        </div>
      </div>

      <div className="relative">
        <label className={baseLabel}>Enter HA number</label>
        <input
          name="oldHaNumber"
          value={form.oldHaNumber}
          onChange={onChange}
          placeholder="Enter HA number"
          className={baseInput}
        />
        <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#a6a6a6"
              d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m-1 14h-2v-6h2zm4 0h-2v-6h2z"
            />
          </svg>
        </div>
      </div>
      {isAutoFilling && (
        <p className="text-xs text-[#27563C] -mt-1">Loading details from previous agreement...</p>
      )}

      <label className={baseLabel}>full name</label>
      <div className="relative">
        <input
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          placeholder="Enter full name"
          className={baseInput}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#a6a6a6" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18" />
          </svg>
        </div>
      </div>

      <label className={baseLabel}>s/o w/o c/o</label>
      <div className="relative">
        <input
          name="soWoCo"
          value={form.soWoCo}
          onChange={onChange}
          placeholder="Enter s/o w/o c/o"
          className={baseInput}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path fill="#a6a6a6" d="M3 14s-1 0-1-1s1-4 6-4s6 3 6 4s-1 1-1 1zm5-6a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/>
          </svg>
        </div>
      </div>

      <label className={baseLabel}>occupation</label>
      <div className="relative">
        <input
          name="occupation"
          value={form.occupation}
          onChange={onChange}
          placeholder="Enter occupation"
          className={baseInput}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path fill="#a6a6a6" d="M1.5 3A1.5 1.5 0 0 1 3 1.5h10A1.5 1.5 0 0 1 14.5 3v1h-13zm13 2H7v7h7.5zm-8.5 0H1.5v7H6zm7.5 8H3A1.5 1.5 0 0 1 1.5 11.5V13A1.5 1.5 0 0 0 3 14.5h10a1.5 1.5 0 0 0 1.5-1.5v-1.5A1.5 1.5 0 0 1 13 13"/>
          </svg>
        </div>
      </div>

      <label className={baseLabel}>phone no</label>
      <div className="relative">
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="Enter phone no"
          className={baseInput}
        />
        <div className="absolute left-3 top-5 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#a6a6a6"
              fillRule="evenodd"
              d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z"
              clipRule="evenodd"
            />
            <path
              fill="#a6a6a6"
              d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      <label className={baseLabel}>alternate phone no</label>
      <div className="relative">
        <input
          name="alternatePhone"
          value={form.alternatePhone}
          onChange={onChange}
          placeholder="Enter alternate phone no"
          className={baseInput}
        />
        <div className="absolute left-3 top-5 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#a6a6a6"
              fillRule="evenodd"
              d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z"
              clipRule="evenodd"
            />
            <path
              fill="#a6a6a6"
              d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      <label className={baseLabel}>aadhaar no</label>
      <div className="relative">
        <input
          name="aadhaar"
          value={form.aadhaar}
          onChange={onChange}
          placeholder="Enter aadhaar no"
          className={baseInput}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32">
            <path
              fill="#a6a6a6"
              d="M5 6C3.355 6 2 7.355 2 9v14c0 1.645 1.355 3 3 3h22c1.645 0 3-1.355 3-3V9c0-1.645-1.355-3-3-3zm0 2h22c.566 0 1 .434 1 1v14c0 .566-.434 1-1 1H5c-.566 0-1-.434-1-1V9c0-.566.434-1 1-1m6 2c-2.2 0-4 1.8-4 4c0 1.113.477 2.117 1.219 2.844A5.04 5.04 0 0 0 6 21h2c0-1.668 1.332-3 3-3s3 1.332 3 3h2a5.04 5.04 0 0 0-2.219-4.156C14.523 16.117 15 15.114 15 14c0-2.2-1.8-4-4-4m7 1v2h8v-2zm-7 1c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m7 3v2h8v-2zm0 4v2h5v-2z"
            />
          </svg>
        </div>
      </div>

      <div className="relative">
        <label className={baseLabel}>vehicle no</label>
        <input
          name="vehicleNo"
          value={form.vehicleNo}
          onChange={onChange}
          placeholder="Enter vehicle no"
          className={baseInput}
        />
        <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="22" viewBox="0 0 17 24">
            <path
              fill="#a6a6a6"
              d="M8.632 15.526a2.11 2.11 0 0 0-2.106 2.105v4.305a2.106 2.106 0 0 0 4.212 0v-.043v.002v-4.263a2.11 2.11 0 0 0-2.104-2.106z"
            />
            <path
              fill="#a6a6a6"
              d="M16.263 2.631H12.21C11.719 1.094 10.303 0 8.631 0S5.544 1.094 5.06 2.604l-.007.027h-4a1.053 1.053 0 0 0 0 2.106h4.053c.268.899.85 1.635 1.615 2.096l.016.009c-2.871.867-4.929 3.48-4.947 6.577v5.528a1.753 1.753 0 0 0 1.736 1.737h1.422v-3a3.737 3.737 0 1 1 7.474 0v3h1.421a1.75 1.75 0 0 0 1.738-1.737v-5.474a6.855 6.855 0 0 0-4.899-6.567l-.048-.012a3.65 3.65 0 0 0 1.625-2.08l.007-.026h4.053a1.056 1.056 0 0 0 1.053-1.053a1.15 1.15 0 0 0-1.104-1.105h-.002zM8.631 5.84a2.106 2.106 0 1 1 2.106-2.106l.001.06c0 1.13-.916 2.046-2.046 2.046l-.063-.001h.003z"
            />
          </svg>
        </div>
      </div>

      <div className="relative">
        <label className={baseLabel}>vehicle name</label>
        <input
          name="vehicleName"
          value={form.vehicleName}
          onChange={onChange}
          placeholder="Enter vehicle name"
          className={baseInput}
        />
        <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#a6a6a6"
              d="M10.7 11H8.95h3.75zM5 19q-2.075 0-3.537-1.463T0 14t1.463-3.537T5 9h11.6l-2-2H12q-.425 0-.712-.288T11 6t.288-.712T12 5h2.575q.4 0 .763.15t.637.425L19.45 9.05q1.95.15 3.25 1.575T24 14q0 2.075-1.463 3.538T19 19t-3.537-1.463T14 14q0-.45.063-.888t.237-.862l-2.45 2.45q-.15.15-.337.225t-.388.075H9.9q-.35 1.75-1.725 2.875T5 19m14-2q1.25 0 2.125-.875T22 14t-.875-2.125T19 11t-2.125.875T16 14t.875 2.125T19 17M5 17q.95 0 1.713-.55T7.8 15H6q-.425 0-.712-.288T5 14t.288-.712T6 13h1.8q-.325-.9-1.088-1.45T5 11q-1.25 0-2.125.875T2 14t.875 2.125T5 17m4.95-4h.75l2-2H8.95q.375.425.625.925T9.95 13"
            />
          </svg>
        </div>
      </div>

      <div className="relative">
        <label className={baseLabel}>model</label>
        <input
          name="model"
          value={form.model}
          onChange={onChange}
          placeholder="Enter model"
          className={baseInput}
        />
        <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 640 640">
            <path fill="#a6a6a6" d="M224 64c17.7 0 32 14.3 32 32v32h128V96c0-17.7 14.3-32 32-32s32 14.3 32 32v32h32c35.3 0 64 28.7 64 64v288c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64h32V96c0-17.7 14.3-32 32-32m0 256c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32z" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <label className={baseLabel}>chassis no</label>
        <input
          name="chassisNo"
          value={form.chassisNo}
          onChange={onChange}
          placeholder="Enter chassis no"
          className={baseInput}
        />
        <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#a6a6a6" d="M12.75 3a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0z" />
            <path
              fill="#a6a6a6"
              fillRule="evenodd"
              d="M22.75 12.057c0 1.837 0 3.293-.153 4.432c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.837 0-3.293 0-4.432-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.926q.001-.575.008-1.096c.014-.975.05-1.81.145-2.523c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c.716-.096 1.558-.132 2.541-.145l.697-.005a1 1 0 0 1 1.001.999V5a2.25 2.25 0 0 0 4.5 0v-.75c0-.552.448-1 1-.998c1.29.006 2.359.033 3.239.151c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433zM8 9.75a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm0 3.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="relative">
        <label className={baseLabel}>date of birth</label>
        <input
          name="dob"
          value={form.dob}
          onChange={onChange}
          type="date"
          className={baseInput + " py-2"}
        />
        <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#a6a6a6"
              d="M6.94 2c.416 0 .753.324.753.724v1.46c.668-.012 1.417-.012 2.26-.012h4.015c.842 0 1.591 0 2.259.013v-1.46c0-.4.337-.725.753-.725s.753.324.753.724V4.25c1.445.111 2.394.384 3.09 1.055c.698.67.982 1.582 1.097 2.972L22 9H2v-.724c.116-1.39.4-2.302 1.097-2.972s1.645-.944 3.09-1.055V2.724c0-.4.337-.724.753-.724"
            />
            <path
              fill="#a6a6a6"
              d="M22 14v-2c0-.839-.004-2.335-.017-3H2.01c-.013.665-.01 2.161-.01 3v2c0 3.771 0 5.657 1.172 6.828S6.228 22 10 22h4c3.77 0 5.656 0 6.828-1.172S22 17.772 22 14"
              opacity="0.5"
            />
            <path
              fill="#a6a6a6"
              d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
            />
          </svg>
        </div>
      </div>

      <label className={baseLabel}>District</label>
      <div className="relative">
        <input
          name="district"
          value={form.district}
          onChange={onDistrictChange}
          list="district-options-refi"
          placeholder="Select district"
          className={baseInput}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
        </div>
      </div>
      {form.district === "Other" && (
        <div className="relative">
          <input
            name="customDistrict"
            value={form.customDistrict}
            onChange={onChange}
            placeholder="Enter district"
            className={baseInput}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none"><path fill="#a6a6a6" d="M12 2a6 6 0 0 0-6 6c0 5 6 14 6 14s6-9 6-14a6 6 0 0 0-6-6m0 8a2 2 0 1 1 0-4a2 2 0 0 1 0 4"/></svg>
          </div>
        </div>
      )}
      <datalist id="district-options-refi">
        {districtOptions.map((d) => (
          <option key={d} value={d} />
        ))}
      </datalist>

      <label className={baseLabel}>Mandal</label>
      <div className="relative">
        <input
          name="mandal"
          value={form.mandal}
          onChange={onMandalChange}
          list="mandal-options-refi"
          placeholder="Select mandal"
          className={baseInput}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
        </div>
      </div>
      {form.mandal === "Other" && (
        <div className="relative">
          <input
            name="customMandal"
            value={form.customMandal}
            onChange={onChange}
            placeholder="Enter mandal"
            className={baseInput}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
          </div>
        </div>
      )}
      <datalist id="mandal-options-refi">
        {mandalOptions.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>

      <label className={baseLabel}>Street / Locality</label>
      <div className="relative">
        <input
          name="street"
          value={form.street}
          onChange={onChange}
          placeholder="Enter street or locality"
          className={baseInput}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
        </div>
      </div>

      <label className={baseLabel}>Full Address</label>
      <div className="relative">
        <textarea
          name="address"
          value={form.address}
          onChange={onChange}
          placeholder="Enter address"
          className="w-full pl-10 pr-3 py-2 rounded-md bg-white/90 text-sm outline-none h-20 border border-transparent shadow-inner focus:ring-2 focus:ring-[#bff86a]"
        />
        <div className="absolute left-3 top-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <g fill="none">
              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path
                fill="#a6a6a6"
                d="M20 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-3 12H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2m-7-8H8a2 2 0 0 0-1.995 1.85L6 9v2a2 2 0 0 0 1.85 1.995L8 13h2a2 2 0 0 0 1.995-1.85L12 11V9a2 2 0 0 0-1.85-1.995zm7 4h-3a1 1 0 0 0-.117 1.993L14 13h3a1 1 0 0 0 .117-1.993zm-7-2v2H8V9zm7-2h-3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2"
              />
            </g>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={baseLabel}>Aadhaar (Front)</label>
          <label className="mt-1 flex items-center gap-3 h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
            <span className="flex items-center justify-center w-7 h-7">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <g fill="none" stroke="#a6a6a6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path
                    fill="#a6a6a6"
                    fillOpacity="0"
                    strokeDasharray="20"
                    strokeDashoffset="20"
                    d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
                  >
                    <animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5" />
                    <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1" />
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0" />
                  </path>
                  <path strokeDasharray="14" strokeDashoffset="14" d="M6 19h12">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0" />
                  </path>
                </g>
              </svg>
            </span>
            <span className="text-gray-500 truncate flex-1">
              {files.aadhaarFront ? files.aadhaarFront.name : "Upload aadhaar front"}
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => onFileChange(e, "aadhaarFront")}
            />
          </label>
        </div>

        <div>
          <label className={baseLabel}>Aadhaar (Back)</label>
          <label className="mt-1 flex items-center gap-3 h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
            <span className="flex items-center justify-center w-7 h-7">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <g fill="none" stroke="#a6a6a6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path
                    fill="#a6a6a6"
                    fillOpacity="0"
                    strokeDasharray="20"
                    strokeDashoffset="20"
                    d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
                  >
                    <animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5" />
                    <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1" />
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0" />
                  </path>
                  <path strokeDasharray="14" strokeDashoffset="14" d="M6 19h12">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0" />
                  </path>
                </g>
              </svg>
            </span>
            <span className="text-gray-500 truncate flex-1">
              {files.aadhaarBack ? files.aadhaarBack.name : "Upload aadhaar back"}
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => onFileChange(e, "aadhaarBack")}
            />
          </label>
        </div>

        <div>
          <label className={baseLabel}>Profile Photo</label>
          <label className="mt-1 flex items-center gap-3 h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
            <span className="flex items-center justify-center w-7 h-7">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <g fill="none" stroke="#a6a6a6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path
                    fill="#a6a6a6"
                    fillOpacity="0"
                    strokeDasharray="20"
                    strokeDashoffset="20"
                    d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
                  >
                    <animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5" />
                    <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1" />
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0" />
                  </path>
                  <path strokeDasharray="14" strokeDashoffset="14" d="M6 19h12">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0" />
                  </path>
                </g>
              </svg>
            </span>
            <span className="text-gray-500 truncate flex-1">
              {files.profile ? files.profile.name : "Upload profile"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileChange(e, "profile")}
            />
          </label>
        </div>
      </div>

      <label className={baseLabel}>Referal Name</label>
      <div className="relative">
        <input
          name="referralName"
          value={form.referralName}
          onChange={onChange}
          placeholder="Enter referal name"
          className={baseInput}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 12 12" className="w-6 h-6" fill="none">
            <path
              fill="#a6a6a6"
              d="M6 1a2 2 0 1 0 0 4a2 2 0 0 0 0-4m2.5 5h-5A1.5 1.5 0 0 0 2 7.5c0 1.116.459 2.01 1.212 2.615C3.953 10.71 4.947 11 6 11s2.047-.29 2.788-.885C9.54 9.51 10 8.616 10 7.5A1.5 1.5 0 0 0 8.5 6"
            />
          </svg>
        </div>
      </div>

      <label className={baseLabel}>Referral Phone No</label>
      <div className="relative">
        <input
          name="referralPhone"
          value={form.referralPhone}
          onChange={onChange}
          placeholder="Enter referral phone"
          className={baseInput}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <path
              fill="#a6a6a6"
              fillRule="evenodd"
              d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z"
              clipRule="evenodd"
            />
            <path
              fill="#a6a6a6"
              d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      <div className={`flex items-center gap-2 mt-4 ${form.isFinanced ? "py-8" : ""}`}>
        <input
          id="refi-financed"
          type="checkbox"
          className="w-4 h-4"
          name="isFinanced"
          checked={form.isFinanced}
          onChange={onChange}
        />
        <label htmlFor="refi-financed" className="text-sm font-semibold text-[#27563C]">
          add finance
        </label>
      </div>

      {form.isFinanced && (
        <>
          <label className={baseLabel}>Agreement No</label>
          <div className="relative">
            <input
              name="agreementNo"
              value={form.agreementNo}
              onChange={onChange}
              placeholder={suggestedAgreementNo || "Enter agreement no"}
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 56 56"><path fill="#a6a6a6" d="M8.746 37.703h7.149l-2.133 10.594a4 4 0 0 0-.07.75c0 1.148.796 1.781 1.898 1.781c1.125 0 1.945-.61 2.18-1.758l2.296-11.367h11.086L29.02 48.297c-.07.234-.093.516-.093.75c0 1.148.797 1.781 1.922 1.781s1.945-.61 2.18-1.758L35.3 37.703h8.367c1.289 0 2.18-.937 2.18-2.203c0-1.031-.703-1.875-1.758-1.875h-7.946L38.63 21.25h8.203c1.29 0 2.18-.937 2.18-2.203c0-1.031-.703-1.875-1.758-1.875H39.45l1.922-9.445c.023-.141.07-.446.07-.75c0-1.149-.82-1.805-1.945-1.805c-1.312 0-1.898.726-2.133 1.828l-2.062 10.172H24.215l1.922-9.445c.023-.141.07-.446.07-.75c0-1.149-.844-1.805-1.945-1.805c-1.336 0-1.946.726-2.157 1.828l-2.062 10.172h-7.687c-1.29 0-2.18.984-2.18 2.273c0 1.055.703 1.805 1.758 1.805h7.289l-2.485 12.375h-7.57c-1.29 0-2.18.984-2.18 2.273c0 1.055.703 1.805 1.758 1.805m12.14-4.078l2.509-12.375H34.48l-2.508 12.375Z" style={{width: '16px', height: '16px'}}/></svg>
            </div>
          </div>

          <label className={baseLabel}>Finance Amount</label>
          <div className="relative">
            <input
              name="financeAmount"
              value={form.financeAmount}
              onChange={onChange}
              placeholder="Enter finance amount"
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 16 16"><path fill="#a6a6a6" d="M1 4.25C1 3.56 1.56 3 2.25 3h9.5c.69 0 1.25.56 1.25 1.25v5.5c0 .69-.56 1.25-1.25 1.25h-9.5C1.56 11 1 10.44 1 9.75zm3 .25V4H3v.5a.5.5 0 0 1-.5.5H2v1h.5A1.5 1.5 0 0 0 4 4.5M9 7a2 2 0 1 0-4 0a2 2 0 0 0 4 0m2-3h-1v.5A1.5 1.5 0 0 0 11.5 6h.5V5h-.5a.5.5 0 0 1-.5-.5zM4 9.5A1.5 1.5 0 0 0 2.5 8H2v1h.5a.5.5 0 0 1 .5.5v.5h1zm7 .5v-.5a.5.5 0 0 1 .5-.5h.5V8h-.5A1.5 1.5 0 0 0 10 9.5v.5zm-6.5 3a1.5 1.5 0 0 1-1.427-1.036Q3.281 12 3.5 12h8.25A2.25 2.25 0 0 0 14 9.75V5.085A1.5 1.5 0 0 1 15 6.5v3.25A3.25 3.25 0 0 1 11.75 13z"/></svg></div>
          </div>

          <label className={baseLabel}>Emi Date</label>
          <div className="relative">
            <input name="emiDate" value={form.emiDate} onChange={onChange} type="date" className={baseInput + " py-2"} />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M6.94 2c.416 0 .753.324.753.724v1.46c.668-.012 1.417-.012 2.26-.012h4.015c.842 0 1.591 0 2.259.013v-1.46c0-.4.337-.725.753-.725s.753.324.753.724V4.25c1.445.111 2.394.384 3.09 1.055c.698.67.982 1.582 1.097 2.972L22 9H2v-.724c.116-1.39.4-2.302 1.097-2.972s1.645-.944 3.09-1.055V2.724c0-.4.337-.724.753-.724"/><path fill="#a6a6a6" d="M22 14v-2c0-.839-.004-2.335-.017-3H2.01c-.013.665-.01 2.161-.01 3v2c0 3.771 0 5.657 1.172 6.828S6.228 22 10 22h4c3.77 0 5.656 0 6.828-1.172S22 17.772 22 14" opacity="0.5"/><path fill="#a6a6a6" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"/></svg></div>
          </div>

          <label className={baseLabel}>Months</label>
          <div className="relative">
            <input name="emiMonths" value={form.emiMonths} onChange={onChange} placeholder="Enter months" className={baseInput} />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M3 10.5V6q0-.425.288-.712T4 5h3.325q.425 0 .713.288T8.325 6v4.5q0 .425-.287.713t-.713.287H4q-.425 0-.712-.288T3 10.5m7.325 1q-.425 0-.712-.288t-.288-.712V6q0-.425.288-.712T10.325 5h3.35q.425 0 .713.288t.287.712v4.5q0 .425-.288.713t-.712.287zm6.35 0q-.425 0-.712-.288t-.288-.712V6q0-.425.288-.712T16.675 5H20q.425 0 .713.288T21 6v4.5q0 .425-.288.713T20 11.5zM7.325 19H4q-.425 0-.712-.288T3 18v-4.5q0-.425.288-.712T4 12.5h3.325q.425 0 .713.288t.287.712V18q0 .425-.287.713T7.325 19m3 0q-.425 0-.712-.288T9.324 18v-4.5q0-.425.288-.712t.712-.288h3.35q.425 0 .713.288t.287.712V18q0 .425-.288.713t-.712.287zm6.35 0q-.425 0-.712-.288T15.675 18v-4.5q0-.425.288-.712t.712-.288H20q.425 0 .713.288T21 13.5V18q0 .425-.288.713T20 19z"/></svg></div>
          </div>

          <label className={baseLabel}>Emi Amount</label>
          <div className="relative">
            <input name="emiAmount" value={form.emiAmount} onChange={onChange} placeholder="Amount" className={baseInput} />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M19 5.25H5A1.76 1.76 0 0 0 3.25 7v10A1.76 1.76 0 0 0 5 18.75h14A1.76 1.76 0 0 0 20.75 17V7A1.76 1.76 0 0 0 19 5.25M19.25 7v1.67h-.21a1.5 1.5 0 0 1-.36 0h-.13a2 2 0 0 1-.33-.1h-.12a1.3 1.3 0 0 1-.38-.28a1.58 1.58 0 0 1-.47-1.12a1.5 1.5 0 0 1 .06-.41H19a.25.25 0 0 1 .25.24M5 6.75h1.69a1.5 1.5 0 0 1 .06.41a1.58 1.58 0 0 1-.47 1.12a1.5 1.5 0 0 1-.38.28h-.13a1.1 1.1 0 0 1-.31.1h-.14a1.5 1.5 0 0 1-.36 0h-.21V7A.25.25 0 0 1 5 6.75M4.75 17v-1.67h.21a1.5 1.5 0 0 1 .36 0h.13a1.3 1.3 0 0 1 .33.1h.12a1.5 1.5 0 0 1 .38.28a1.58 1.58 0 0 1 .47 1.12a1.5 1.5 0 0 1-.06.41H5a.25.25 0 0 1-.25-.24m3.47.25a3 3 0 0 0 0-.41a3 3 0 0 0-.91-2.18a2.6 2.6 0 0 0-.49-.39l-.17-.11a3 3 0 0 0-.36-.16l-.2-.08a3.3 3.3 0 0 0-.53-.11a1.6 1.6 0 0 0-.31 0h-.5v-3.59h.85a3 3 0 0 0 .4-.1l.22-.07a2.5 2.5 0 0 0 .44-.2l.16-.09a3.4 3.4 0 0 0 .52-.42a3 3 0 0 0 .91-2.18a3 3 0 0 0 0-.41h7.56a3 3 0 0 0 0 .41a3 3 0 0 0 .91 2.18a3 3 0 0 0 .52.42l.16.09a2.5 2.5 0 0 0 .44.2l.22.07a3 3 0 0 0 .41.09h.84v3.56h-.5a1.6 1.6 0 0 0-.31 0a3.3 3.3 0 0 0-.53.11l-.2.08a3 3 0 0 0-.39.18l-.17.11a2.6 2.6 0 0 0-.49.39a3 3 0 0 0-.91 2.18a3 3 0 0 0 0 .41Zm10.78 0h-1.69a1.5 1.5 0 0 1-.06-.41a1.58 1.58 0 0 1 .47-1.12a1.3 1.3 0 0 1 .38-.28h.12a2 2 0 0 1 .33-.1h.13a1.5 1.5 0 0 1 .36 0h.21V17a.25.25 0 0 1-.25.25"/><path fill="#a6a6a6" d="M12 8.5a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 8.5m0 5.5a2 2 0 1 1 2-2a2 2 0 0 1-2 2"/></svg></div>
          </div>
        </>
      )}

      <div className={`flex items-center gap-2 mt-4 ${showGuarantor ? "py-8" : ""}`}>
        <input
          id="refi-guarantor"
          type="checkbox"
          className="w-4 h-4"
          checked={showGuarantor}
          onChange={() => setShowGuarantor((s) => !s)}
        />
        <label htmlFor="refi-guarantor" className="text-sm font-semibold text-[#27563C]">
          add Guarantor
        </label>
      </div>

      {showGuarantor && (
        <>
          <label className={baseLabel}>Guarantor full name</label>
          <div className="relative">
            <input
              name="guarantorName"
              value={form.guarantorName}
              onChange={onChange}
              placeholder="Enter full name"
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#a6a6a6" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18" />
              </svg>
            </div>
          </div>

          <label className={baseLabel}>s/o w/o c/o</label>
          <div className="relative">
            <input
              name="guarantorSoWoCo"
              value={form.guarantorSoWoCo}
              onChange={onChange}
              placeholder="Enter s/o w/o c/o"
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#a6a6a6" d="M3 14s-1 0-1-1s1-4 6-4s6 3 6 4s-1 1-1 1zm5-6a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/>
              </svg>
            </div>
          </div>

          <label className={baseLabel}>Guarantor phone no</label>
          <div className="relative">
            <input
              name="guarantorPhone"
              value={form.guarantorPhone}
              onChange={onChange}
              placeholder="Enter phone no"
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#a6a6a6"
                  fillRule="evenodd"
                  d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z"
                  clipRule="evenodd"
                />
                <path
                  fill="#a6a6a6"
                  d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>

          <label className={baseLabel}>Guarantor alternate phone no</label>
          <div className="relative">
            <input
              name="guarantorAlternatePhone"
              value={form.guarantorAlternatePhone}
              onChange={onChange}
              placeholder="Enter alternate phone no"
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#a6a6a6" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd" />
                <path fill="#a6a6a6" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity="0.6" />
              </svg>
            </div>
          </div>

          <label className={baseLabel}>Guarantor occupation</label>
          <div className="relative">
            <input
              name="guarantorOccupation"
              value={form.guarantorOccupation}
              onChange={onChange}
              placeholder="Enter occupation"
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#a6a6a6" d="M1.5 3A1.5 1.5 0 0 1 3 1.5h10A1.5 1.5 0 0 1 14.5 3v1h-13zm13 2H7v7h7.5zm-8.5 0H1.5v7H6zm7.5 8H3A1.5 1.5 0 0 1 1.5 11.5V13A1.5 1.5 0 0 0 3 14.5h10a1.5 1.5 0 0 0 1.5-1.5v-1.5A1.5 1.5 0 0 1 13 13" />
              </svg>
            </div>
          </div>

          <label className={baseLabel}>Guarantor district</label>
          <div className="relative">
            <input
              name="guarantorDistrict"
              value={form.guarantorDistrict}
              onChange={onGuarantorDistrictChange}
              list="guarantor-district-options-refi"
              placeholder="Select district"
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
            </div>
          </div>
          {form.guarantorDistrict === "Other" && (
            <div className="relative">
              <input
                name="guarantorCustomDistrict"
                value={form.guarantorCustomDistrict}
                onChange={onChange}
                placeholder="Enter district"
                className={baseInput}
              />
            </div>
          )}
          <datalist id="guarantor-district-options-refi">
            {districtOptions.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>

          <label className={baseLabel}>Guarantor mandal</label>
          <div className="relative">
            <input
              name="guarantorMandal"
              value={form.guarantorMandal}
              onChange={onGuarantorMandalChange}
              list="guarantor-mandal-options-refi"
              placeholder="Select mandal"
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
            </div>
          </div>
          {form.guarantorMandal === "Other" && (
            <div className="relative">
              <input
                name="guarantorCustomMandal"
                value={form.guarantorCustomMandal}
                onChange={onChange}
                placeholder="Enter mandal"
                className={baseInput}
              />
            </div>
          )}
          <datalist id="guarantor-mandal-options-refi">
            {guarantorMandalOptions.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>

          <label className={baseLabel}>Guarantor aadhaar no</label>
          <div className="relative">
            <input
              name="guarantorAadhaar"
              value={form.guarantorAadhaar}
              onChange={onChange}
              placeholder="Enter aadhaar no"
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32">
                <path
                  fill="#a6a6a6"
                  d="M5 6C3.355 6 2 7.355 2 9v14c0 1.645 1.355 3 3 3h22c1.645 0 3-1.355 3-3V9c0-1.645-1.355-3-3-3zm0 2h22c.566 0 1 .434 1 1v14c0 .566-.434 1-1 1H5c-.566 0-1-.434-1-1V9c0-.566.434-1 1-1m6 2c-2.2 0-4 1.8-4 4c0 1.113.477 2.117 1.219 2.844A5.04 5.04 0 0 0 6 21h2c0-1.668 1.332-3 3-3s3 1.332 3 3h2a5.04 5.04 0 0 0-2.219-4.156C14.523 16.117 15 15.114 15 14c0-2.2-1.8-4-4-4m7 1v2h8v-2zm-7 1c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m7 3v2h8v-2zm0 4v2h5v-2z"
                />
              </svg>
            </div>
          </div>

          <label className={baseLabel}>date of birth</label>
          <div className="relative">
            <input
              type="date"
              name="guarantorDob"
              value={form.guarantorDob}
              onChange={onChange}
              className={baseInput}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013"/><path fill="#a6a6a6" fillRule="evenodd" d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clipRule="evenodd"/></svg>
            </div>
          </div>

          <label className={baseLabel}>Address</label>
          <div className="relative">
            <textarea
              name="guarantorAddress"
              value={form.guarantorAddress}
              onChange={onChange}
              placeholder="Enter address"
              className="w-full pl-10 pr-3 py-2 rounded-md bg-white/90 text-sm outline-none h-20 border border-transparent shadow-inner focus:ring-2 focus:ring-[#bff86a]"
            />
            <div className="absolute left-3 top-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="#a6a6a6"
                    d="M20 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-3 12H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2m-7-8H8a2 2 0 0 0-1.995 1.85L6 9v2a2 2 0 0 0 1.85 1.995L8 13h2a2 2 0 0 0 1.995-1.85L12 11V9a2 2 0 0 0-1.85-1.995zm7 4h-3a1 1 0 0 0-.117 1.993L14 13h3a1 1 0 0 0 .117-1.993zm-7-2v2H8V9zm7-2h-3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2"
                  />
                </g>
              </svg>
            </div>
          </div>

            <label className={baseLabel}>Guarantor photo</label>
            <label className="mt-1 flex items-center gap-3 h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
              <span className="flex items-center justify-center w-7 h-7">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <g fill="none" stroke="#a6a6a6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path
                      fill="#a6a6a6"
                      fillOpacity="0"
                      strokeDasharray="20"
                      strokeDashoffset="20"
                      d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"
                    >
                      <animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5" />
                      <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1" />
                      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0" />
                    </path>
                    <path strokeDasharray="14" strokeDashoffset="14" d="M6 19h12">
                      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0" />
                    </path>
                  </g>
                </svg>
              </span>

              <span className="text-gray-500 truncate flex-1">
                {files.guarantorPhoto ? files.guarantorPhoto.name : "Upload guarantor photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileChange(e, "guarantorPhoto")}
              />
            </label>
        </>
      )}

      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canEditRefinance}
          className="px-6 py-2 rounded-full bg-gradient-to-b from-[#bfff3a] to-[#40ff00] font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Save Refinance
        </button>
      </div>

      {showInvoicePreview && invoice && (
        <InvoicePreviewModal
          invoice={invoice}
          invoiceRef={invoiceRef}
          onClose={handleInvoicePreviewClose}
          onPrint={handleInvoicePrint}
        />
      )}
    </div>
  );
}

export default RefinanceForm;

import React, { useEffect, useState } from 'react'

const toDateInputValue = (value) => {
  if (!value) return ''

  // Already in input-friendly format.
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim()
  }

  // Supports dd-mm-yyyy and dd/mm/yyyy.
  if (typeof value === 'string') {
    const match = value.trim().match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
    if (match) {
      const day = String(Number(match[1])).padStart(2, '0')
      const month = String(Number(match[2])).padStart(2, '0')
      const year = match[3]
      return `${year}-${month}-${day}`
    }
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function EditUserModal({ user, onSave, onClose }) {
  const [form, setForm] = useState(
    user || {
      id: '',
      // vehicle
      vehicleName: '',
      vehicleNumber: '',
      model: '',
      chassis: '',
      // seller
      seller: '',
      sellerSoWoCo: '',
      sellerOccupation: '',
      sellerPhone: '',
      sellerAlternatePhone: '',
      sellerAadhaar: '',
      sellerDob: '',
      sellerAddress: '',
      sellerReferenceName: '',
      sellerReferencePhone: '',
      soldAmount: '',
      // buyer
      buyerName: '',
      buyerSoWoCo: '',
      buyerOccupation: '',
      buyerPhone: '',
      buyerAlternatePhone: '',
      buyerAadhaar: '',
      buyerDob: '',
      buyerAddress: '',
      buyerReferenceName: '',
      buyerReferencePhone: '',
      buyAmount: '',
      // buyer finance
      financeAmount: '',
      emiAmount: '',
      emiMonths: '',
      emiDate: '',
      agreementNo: '',
      // guarantor
      guarantorName: '',
      guarantorPhone: '',
      guarantorAadhaar: '',
      guarantorAddress: '',
      // files (profile + aadhar)
      sellerProfile: null,
      sellerAadhaarFront: null,
      sellerAadhaarBack: null,
      buyerProfile: null,
      buyerAadhaarFront: null,
      buyerAadhaarBack: null,
    }
  )

  const [previews, setPreviews] = useState({
    sellerProfile: null,
    sellerAadhaarFront: null,
    sellerAadhaarBack: null,
    buyerProfile: null,
    buyerAadhaarFront: null,
    buyerAadhaarBack: null,
  })

  // populate form and previews from incoming user
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        id: user.id ?? prev.id,
        vehicleName: user.vehicleName ?? prev.vehicleName,
        vehicleNumber: user.vehicle ?? prev.vehicleNumber,
        model: user.model ?? prev.model,
        chassis: user.chassis ?? prev.chassis,
        seller: user.seller ?? prev.seller,
        sellerSoWoCo: user.sellerSoWoCo ?? prev.sellerSoWoCo,
        sellerOccupation: user.sellerOccupation ?? prev.sellerOccupation,
        sellerPhone: user.phone ?? prev.sellerPhone,
        sellerAlternatePhone: user.sellerAlternatePhone ?? user.alternatePhone ?? prev.sellerAlternatePhone,
        sellerAadhaar: user.aadhaar ?? prev.sellerAadhaar,
        sellerDob: toDateInputValue(user.sellerDob ?? user.dob ?? prev.sellerDob),
        sellerAddress: user.address ?? prev.sellerAddress,
        sellerReferenceName: user.referenceName ?? prev.sellerReferenceName,
        sellerReferencePhone: user.referencePhone ?? prev.sellerReferencePhone,
        soldAmount: user.soldAmount ?? prev.soldAmount,
        buyerName: user.buyerName ?? prev.buyerName,
        buyerSoWoCo: user.buyerSoWoCo ?? prev.buyerSoWoCo,
        buyerOccupation: user.buyerOccupation ?? prev.buyerOccupation,
        buyerPhone: user.buyerPhone ?? user.phone ?? prev.buyerPhone,
        buyerAlternatePhone: user.buyerAlternatePhone ?? user.alternatePhone ?? prev.buyerAlternatePhone,
        buyerAadhaar: user.buyerAadhaar ?? user.aadhaar ?? prev.buyerAadhaar,
        buyerDob: toDateInputValue(user.buyerDob ?? user.dob ?? prev.buyerDob),
        buyerAddress: user.buyerAddress ?? user.address ?? prev.buyerAddress,
        buyerReferenceName: user.buyerReferenceName ?? prev.buyerReferenceName,
        buyerReferencePhone: user.buyerReferencePhone ?? prev.buyerReferencePhone,
        buyAmount: user.buyAmount ?? prev.buyAmount,
        financeAmount: user.financeAmount ?? prev.financeAmount,
        emiAmount: user.emiAmount ?? prev.emiAmount,
        emiMonths: user.emiMonths ?? prev.emiMonths,
        emiDate: toDateInputValue(user.emiDate ?? prev.emiDate),
        agreementNo: user.agreementNo ?? prev.agreementNo,
        guarantorName: user.guarantorName ?? prev.guarantorName,
        guarantorPhone: user.guarantorPhone ?? prev.guarantorPhone,
        guarantorAadhaar: user.guarantorAadhaar ?? prev.guarantorAadhaar,
        guarantorAddress: user.guarantorAddress ?? prev.guarantorAddress,
      }))

      // set previews from urls if available on user object (common keys: profileUrl, sellerProfileUrl, aadhar urls...)
      setPreviews({
        sellerProfile: user.sellerProfileUrl ?? user.profileUrl ?? null,
        sellerAadhaarFront: user.sellerAadhaarFrontUrl ?? user.aadhaarFrontUrl ?? null,
        sellerAadhaarBack: user.sellerAadhaarBackUrl ?? user.aadhaarBackUrl ?? null,
        buyerProfile: user.buyerProfileUrl ?? null,
        buyerAadhaarFront: user.buyerAadhaarFrontUrl ?? null,
        buyerAadhaarBack: user.buyerAadhaarBackUrl ?? null,
      })
    }
    // cleanup not needed here
  }, [user])

  // create object URLs for selected files and cleanup previous URLs
  useEffect(() => {
    const toRevoke = []
    const newPreviews = { ...previews }

    Object.keys(previews).forEach(key => {
      const value = form[key]
      if (value instanceof File) {
        const url = URL.createObjectURL(value)
        newPreviews[key] = url
        toRevoke.push(url)
      }
    })

    // If any object URLs created, set them
    if (toRevoke.length) {
      setPreviews(prev => ({ ...prev, ...newPreviews }))
    }

    return () => {
      toRevoke.forEach(u => URL.revokeObjectURL(u))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sellerProfile, form.sellerAadhaarFront, form.sellerAadhaarBack, form.buyerProfile, form.buyerAadhaarFront, form.buyerAadhaarBack])

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function onFileChange(key, e) {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    setForm(prev => ({ ...prev, [key]: file }))
    // preview handled in effect
  }

  function removeFile(key) {
    setForm(prev => ({ ...prev, [key]: null }))
    setPreviews(prev => ({ ...prev, [key]: null }))
  }

  function save(e) {
    e.preventDefault()
    const out = { ...form, id: form.id ?? user?.id }
    onSave && onSave(out)
  }

  if (!user) return null

  const fileInputClass = 'text-xs text-gray-600'

  return (
    // parent renders overlay + scroll wrapper; this is the form container
    <form onSubmit={save} className="relative w-[95%] md:w-2/3 lg:w-1/2 bg-white rounded-xl p-6 shadow-2xl z-50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Edit User</h4>
        <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded bg-gray-100">Close</button>
      </div>

      {/* Profile & Aadhar Uploads (Seller + Buyer) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Seller uploads */}
        <div className="bg-white rounded-xl p-3 shadow">
          <h5 className="text-sm font-semibold mb-2">Seller Files</h5>

          <div className="flex items-start gap-3">
            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {previews.sellerProfile ? (
                <img src={previews.sellerProfile} alt="seller profile" className="object-cover w-full h-full" />
              ) : (
                <div className="text-xs text-gray-500">No profile</div>
              )}
            </div>
            <div className="flex-1">
              <label className={fileInputClass}>Profile Image</label>
              <div className="flex items-center gap-2 mt-1">
                <label className="px-3 py-1 rounded bg-gray-50 border text-xs cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange('sellerProfile', e)} />
                  Choose
                </label>
                {form.sellerProfile && <button type="button" onClick={() => removeFile('sellerProfile')} className="text-xs text-red-500">Remove</button>}
                {!form.sellerProfile && previews.sellerProfile && <button type="button" onClick={() => removeFile('sellerProfile')} className="text-xs text-red-500">Clear</button>}
              </div>

              <div className="mt-3">
                <label className={fileInputClass}>Aadhaar Front</label>
                <div className="flex items-center gap-2 mt-1">
                  <label className="px-3 py-1 rounded bg-gray-50 border text-xs cursor-pointer">
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => onFileChange('sellerAadhaarFront', e)} />
                    Upload
                  </label>
                  { (form.sellerAadhaarFront || previews.sellerAadhaarFront) && (
                    <button type="button" onClick={() => removeFile('sellerAadhaarFront')} className="text-xs text-red-500">Remove</button>
                  )}
                </div>
                {previews.sellerAadhaarFront && (
                  <div className="mt-2 text-xs text-gray-600">
                    <a href={previews.sellerAadhaarFront} target="_blank" rel="noreferrer" className="underline">View</a>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <label className={fileInputClass}>Aadhaar Back</label>
                <div className="flex items-center gap-2 mt-1">
                  <label className="px-3 py-1 rounded bg-gray-50 border text-xs cursor-pointer">
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => onFileChange('sellerAadhaarBack', e)} />
                    Upload
                  </label>
                  { (form.sellerAadhaarBack || previews.sellerAadhaarBack) && (
                    <button type="button" onClick={() => removeFile('sellerAadhaarBack')} className="text-xs text-red-500">Remove</button>
                  )}
                </div>
                {previews.sellerAadhaarBack && (
                  <div className="mt-2 text-xs text-gray-600">
                    <a href={previews.sellerAadhaarBack} target="_blank" rel="noreferrer" className="underline">View</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buyer uploads */}
        <div className="bg-white rounded-xl p-3 shadow">
          <h5 className="text-sm font-semibold mb-2">Buyer Files</h5>

          <div className="flex items-start gap-3">
            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {previews.buyerProfile ? (
                <img src={previews.buyerProfile} alt="buyer profile" className="object-cover w-full h-full" />
              ) : (
                <div className="text-xs text-gray-500">No profile</div>
              )}
            </div>
            <div className="flex-1">
              <label className={fileInputClass}>Profile Image</label>
              <div className="flex items-center gap-2 mt-1">
                <label className="px-3 py-1 rounded bg-gray-50 border text-xs cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange('buyerProfile', e)} />
                  Choose
                </label>
                {form.buyerProfile && <button type="button" onClick={() => removeFile('buyerProfile')} className="text-xs text-red-500">Remove</button>}
                {!form.buyerProfile && previews.buyerProfile && <button type="button" onClick={() => removeFile('buyerProfile')} className="text-xs text-red-500">Clear</button>}
              </div>

              <div className="mt-3">
                <label className={fileInputClass}>Aadhaar Front</label>
                <div className="flex items-center gap-2 mt-1">
                  <label className="px-3 py-1 rounded bg-gray-50 border text-xs cursor-pointer">
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => onFileChange('buyerAadhaarFront', e)} />
                    Upload
                  </label>
                  { (form.buyerAadhaarFront || previews.buyerAadhaarFront) && (
                    <button type="button" onClick={() => removeFile('buyerAadhaarFront')} className="text-xs text-red-500">Remove</button>
                  )}
                </div>
                {previews.buyerAadhaarFront && (
                  <div className="mt-2 text-xs text-gray-600">
                    <a href={previews.buyerAadhaarFront} target="_blank" rel="noreferrer" className="underline">View</a>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <label className={fileInputClass}>Aadhaar Back</label>
                <div className="flex items-center gap-2 mt-1">
                  <label className="px-3 py-1 rounded bg-gray-50 border text-xs cursor-pointer">
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => onFileChange('buyerAadhaarBack', e)} />
                    Upload
                  </label>
                  { (form.buyerAadhaarBack || previews.buyerAadhaarBack) && (
                    <button type="button" onClick={() => removeFile('buyerAadhaarBack')} className="text-xs text-red-500">Remove</button>
                  )}
                </div>
                {previews.buyerAadhaarBack && (
                  <div className="mt-2 text-xs text-gray-600">
                    <a href={previews.buyerAadhaarBack} target="_blank" rel="noreferrer" className="underline">View</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle, Seller, Buyer, Finance, Guarantor sections (unchanged) */}
      {/* Vehicle Details */}
      <div className="mb-4">
        <h5 className="text-sm font-semibold mb-2">Vehicle Details</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-600">Name</label>
            <input name="vehicleName" value={form.vehicleName || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Number</label>
            <input name="vehicleNumber" value={form.vehicleNumber || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Model</label>
            <input name="model" value={form.model || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-gray-600">Chassis</label>
            <input name="chassis" value={form.chassis || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seller Details */}
        <div>
          <h5 className="text-sm font-semibold mb-2">Seller Details</h5>
          <div className="space-y-2 bg-white rounded-xl p-3 shadow">
            <div>
              <label className="text-xs text-gray-600">Name</label>
              <input name="seller" value={form.seller || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">S/O C/O W/O</label>
              <input name="sellerSoWoCo" value={form.sellerSoWoCo || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Phone</label>
              <input name="sellerPhone" value={form.sellerPhone || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Alternative Phone</label>
              <input name="sellerAlternatePhone" value={form.sellerAlternatePhone || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Occupation</label>
              <input name="sellerOccupation" value={form.sellerOccupation || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Aadhaar</label>
              <input name="sellerAadhaar" value={form.sellerAadhaar || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Date of Birth</label>
              <input name="sellerDob" type="date" value={form.sellerDob || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Address</label>
              <textarea name="sellerAddress" value={form.sellerAddress || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm h-20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600">Referral Name</label>
                <input name="sellerReferenceName" value={form.sellerReferenceName || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Referral Phone</label>
                <input name="sellerReferencePhone" value={form.sellerReferencePhone || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Sold Amount</label>
              <input name="soldAmount" value={form.soldAmount || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
          </div>
        </div>

        {/* Buyer Details */}
        <div>
          <h5 className="text-sm font-semibold mb-2">Buyer Details</h5>
          <div className="space-y-2 bg-white rounded-xl p-3 shadow">
            <div>
              <label className="text-xs text-gray-600">Name</label>
              <input name="buyerName" value={form.buyerName || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">S/O C/O W/O</label>
              <input name="buyerSoWoCo" value={form.buyerSoWoCo || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Phone</label>
              <input name="buyerPhone" value={form.buyerPhone || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Alternative Phone</label>
              <input name="buyerAlternatePhone" value={form.buyerAlternatePhone || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Occupation</label>
              <input name="buyerOccupation" value={form.buyerOccupation || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Aadhaar</label>
              <input name="buyerAadhaar" value={form.buyerAadhaar || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Date of Birth</label>
              <input name="buyerDob" type="date" value={form.buyerDob || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Address</label>
              <textarea name="buyerAddress" value={form.buyerAddress || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm h-20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600">Referral Name</label>
                <input name="buyerReferenceName" value={form.buyerReferenceName || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Referral Phone</label>
                <input name="buyerReferencePhone" value={form.buyerReferencePhone || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Buy Amount</label>
              <input name="buyAmount" value={form.buyAmount || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Finance (separate) */}
      <div className="mt-4 bg-white rounded-xl p-4 shadow">
        <h5 className="text-sm font-semibold mb-2">Buyer Finance Details</h5>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-gray-600">Agreement No</label>
            <input name="agreementNo" value={form.agreementNo || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" placeholder="e.g., AG-001" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Finance Amount</label>
            <input name="financeAmount" value={form.financeAmount || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600">EMI Amount</label>
            <input name="emiAmount" value={form.emiAmount || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600">EMI Months</label>
            <input name="emiMonths" value={form.emiMonths || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600">EMI Start Date</label>
            <input name="emiDate" type="date" value={form.emiDate || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
        </div>
      </div>

      {/* Guarantor */}
      <div className="mt-4 bg-white rounded-xl p-4 shadow">
        <h5 className="text-sm font-semibold mb-2">Guarantor Details</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">Name</label>
            <input name="guarantorName" value={form.guarantorName || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Phone</label>
            <input name="guarantorPhone" value={form.guarantorPhone || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Aadhaar</label>
            <input name="guarantorAadhaar" value={form.guarantorAadhaar || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Address</label>
            <input name="guarantorAddress" value={form.guarantorAddress || ''} onChange={onChange} className="w-full mt-1 px-3 py-2 rounded border text-sm" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-sm">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-gradient-to-b from-[#bfff3a] to-[#40ff00] text-sm">Save</button>
      </div>
    </form>
  )
}
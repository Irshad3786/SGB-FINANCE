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
  const getEmptyForm = (source = null) => ({
    id: source?.id ?? '',
    // vehicle
    vehicleName: source?.vehicleName ?? '',
    vehicleNumber: source?.vehicle ?? source?.vehicleNumber ?? '',
    model: source?.model ?? '',
    chassis: source?.chassis ?? '',
    // seller
    seller: source?.seller ?? '',
    sellerSoWoCo: source?.sellerSoWoCo ?? '',
    sellerOccupation: source?.sellerOccupation ?? '',
    sellerPhone: source?.phone ?? source?.sellerPhone ?? '',
    sellerAlternatePhone: source?.sellerAlternatePhone ?? '',
    sellerAadhaar: source?.aadhaar ?? source?.sellerAadhaar ?? '',
    sellerDob: toDateInputValue(source?.sellerDob ?? source?.dob ?? ''),
    sellerAddress: source?.address ?? source?.sellerAddress ?? '',
    sellerReferenceName: source?.referenceName ?? source?.sellerReferenceName ?? '',
    sellerReferencePhone: source?.referencePhone ?? source?.sellerReferencePhone ?? '',
    soldAmount: source?.soldAmount ?? '',
    // buyer
    buyerName: source?.buyerName ?? '',
    buyerSoWoCo: source?.buyerSoWoCo ?? '',
    buyerOccupation: source?.buyerOccupation ?? '',
    buyerPhone: source?.buyerPhone ?? source?.phone ?? '',
    buyerAlternatePhone: source?.buyerAlternatePhone ?? '',
    buyerAadhaar: source?.buyerAadhaar ?? source?.aadhaar ?? '',
    buyerDob: toDateInputValue(source?.buyerDob ?? source?.dob ?? ''),
    buyerAddress: source?.buyerAddress ?? source?.address ?? '',
    buyerReferenceName: source?.buyerReferenceName ?? '',
    buyerReferencePhone: source?.buyerReferencePhone ?? '',
    buyAmount: source?.buyAmount ?? '',
    // buyer finance
    financeAmount: source?.financeAmount ?? '',
    emiAmount: source?.emiAmount ?? '',
    emiMonths: source?.emiMonths ?? '',
    emiDate: toDateInputValue(source?.emiDate ?? ''),
    agreementNo: source?.agreementNo ?? '',
    // guarantor
    guarantorName: source?.guarantorName ?? '',
    guarantorPhone: source?.guarantorPhone ?? '',
    guarantorAadhaar: source?.guarantorAadhaar ?? '',
    guarantorAddress: source?.guarantorAddress ?? '',
    // files always reset; previews come from URLs below
    sellerProfile: null,
    sellerAadhaarFront: null,
    sellerAadhaarBack: null,
    buyerProfile: null,
    buyerAadhaarFront: null,
    buyerAadhaarBack: null,
    guarantorPhoto: null,
    guarantorAadhaarFront: null,
    guarantorAadhaarBack: null,
  })

  const [form, setForm] = useState(
    getEmptyForm(user)
  )

  const [previews, setPreviews] = useState({
    sellerProfile: null,
    sellerAadhaarFront: null,
    sellerAadhaarBack: null,
    buyerProfile: null,
    buyerAadhaarFront: null,
    buyerAadhaarBack: null,
    guarantorPhoto: null,
    guarantorAadhaarFront: null,
    guarantorAadhaarBack: null,
  })

  // File input refs for resetting
  const fileInputRefs = React.useRef({
    sellerProfile: null,
    sellerAadhaarFront: null,
    sellerAadhaarBack: null,
    buyerProfile: null,
    buyerAadhaarFront: null,
    buyerAadhaarBack: null,
    guarantorPhoto: null,
    guarantorAadhaarFront: null,
    guarantorAadhaarBack: null,
  })

  // populate form and previews from incoming user
  useEffect(() => {
    if (user) {
      setForm(getEmptyForm(user))

      // set previews from urls if available on user object (common keys: profileUrl, sellerProfileUrl, aadhar urls...)
      setPreviews({
          sellerProfile: user.sellerProfileUrl ?? user.profileUrl ?? null,
          sellerAadhaarFront: user.sellerAadhaarFrontUrl ?? user.aadhaarFrontUrl ?? null,
          sellerAadhaarBack: user.sellerAadhaarBackUrl ?? user.aadhaarBackUrl ?? null,
          buyerProfile: user.buyerProfileUrl ?? null,
          buyerAadhaarFront: user.buyerAadhaarFrontUrl ?? null,
          buyerAadhaarBack: user.buyerAadhaarBackUrl ?? null,
          guarantorPhoto: user.guarantorProfileUrl ?? user.guarantorPhotoUrl ?? null,
          guarantorAadhaarFront: user.guarantorAadhaarFrontUrl ?? null,
          guarantorAadhaarBack: user.guarantorAadhaarBackUrl ?? null,
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
  }, [form.sellerProfile, form.sellerAadhaarFront, form.sellerAadhaarBack, form.buyerProfile, form.buyerAadhaarFront, form.buyerAadhaarBack, form.guarantorPhoto, form.guarantorAadhaarFront, form.guarantorAadhaarBack])

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function onFileChange(key, e) {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    setForm(prev => ({ ...prev, [key]: file }))
    // Reset the input value so the same file can be selected again
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key].value = ''
    }
    // preview handled in effect
  }

  function removeFile(key) {
    setForm(prev => ({ ...prev, [key]: null }))
    setPreviews(prev => ({ ...prev, [key]: null }))
    // Reset the input value
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key].value = ''
    }
  }

  function save(e) {
    e.preventDefault()
    // Prepare payload: include only meaningful fields so backend doesn't clear
    // unchanged values. Keep File instances for uploads; drop empty strings and nulls.
    const raw = { ...form, id: form.id ?? user?.id }
    const out = {}
    Object.keys(raw).forEach((k) => {
      const v = raw[k]
      // keep File objects
      if (v instanceof File) {
        out[k] = v
        return
      }
      // include non-empty primitives only
      if (v !== '' && v !== null && v !== undefined) {
        out[k] = v
      }
    })

    onSave && onSave(out)
  }

  if (!user) return null

  return (
    // parent renders overlay + scroll wrapper; this is the form container
    <form onSubmit={save} className="relative w-[95%] md:w-2/3 lg:w-1/2 bg-white rounded-xl p-6 shadow-2xl z-50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Edit User</h4>
        <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded bg-gray-100">Close</button>
      </div>

      {/* Profile & Aadhar Uploads (Seller + Buyer + Guarantor) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Seller uploads */}
        <div className="bg-white rounded-xl p-3 shadow">
          <h5 className="text-sm font-semibold mb-2">Seller Files</h5>

          {/* Seller Profile */}
          <div className="mb-4 pb-4 border-b">
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                {previews.sellerProfile ? (
                  <img src={previews.sellerProfile} alt="seller profile" className="object-cover w-full h-full" />
                ) : (
                  <div className="text-xs text-gray-500 text-center">No profile</div>
                )}
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 font-semibold">Profile Image</label>
                <div className="flex items-center gap-2 mt-2">
                  <label className="px-3 py-1 rounded bg-blue-50 border border-blue-200 text-xs cursor-pointer hover:bg-blue-100 transition">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={el => fileInputRefs.current['sellerProfile'] = el}
                      onChange={(e) => onFileChange('sellerProfile', e)} 
                    />
                    📝 Edit
                  </label>
                  {previews.sellerProfile && (
                    <a 
                      href={previews.sellerProfile} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-3 py-1 rounded bg-green-50 border border-green-200 text-xs hover:bg-green-100 transition"
                    >
                      ⬇️ Download
                    </a>
                  )}
                  {(form.sellerProfile || previews.sellerProfile) && (
                    <button 
                      type="button" 
                      onClick={() => removeFile('sellerProfile')} 
                      className="px-3 py-1 rounded bg-red-50 border border-red-200 text-xs hover:bg-red-100 transition"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Seller Aadhaar Front */}
          <div className="mb-4 pb-4 border-b">
            <label className="text-xs text-gray-600 font-semibold">Aadhaar Front</label>
            <div className="flex items-center gap-2 mt-2">
              <label className="px-3 py-1 rounded bg-blue-50 border border-blue-200 text-xs cursor-pointer hover:bg-blue-100 transition">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="hidden" 
                  ref={el => fileInputRefs.current['sellerAadhaarFront'] = el}
                  onChange={(e) => onFileChange('sellerAadhaarFront', e)} 
                />
                📝 Edit
              </label>
              {previews.sellerAadhaarFront && (
                <a 
                  href={previews.sellerAadhaarFront} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1 rounded bg-green-50 border border-green-200 text-xs hover:bg-green-100 transition"
                >
                  ⬇️ Download
                </a>
              )}
              {(form.sellerAadhaarFront || previews.sellerAadhaarFront) && (
                <button 
                  type="button" 
                  onClick={() => removeFile('sellerAadhaarFront')} 
                  className="px-3 py-1 rounded bg-red-50 border border-red-200 text-xs hover:bg-red-100 transition"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          </div>

          {/* Seller Aadhaar Back */}
          <div>
            <label className="text-xs text-gray-600 font-semibold">Aadhaar Back</label>
            <div className="flex items-center gap-2 mt-2">
              <label className="px-3 py-1 rounded bg-blue-50 border border-blue-200 text-xs cursor-pointer hover:bg-blue-100 transition">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="hidden" 
                  ref={el => fileInputRefs.current['sellerAadhaarBack'] = el}
                  onChange={(e) => onFileChange('sellerAadhaarBack', e)} 
                />
                📝 Edit
              </label>
              {previews.sellerAadhaarBack && (
                <a 
                  href={previews.sellerAadhaarBack} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1 rounded bg-green-50 border border-green-200 text-xs hover:bg-green-100 transition"
                >
                  ⬇️ Download
                </a>
              )}
              {(form.sellerAadhaarBack || previews.sellerAadhaarBack) && (
                <button 
                  type="button" 
                  onClick={() => removeFile('sellerAadhaarBack')} 
                  className="px-3 py-1 rounded bg-red-50 border border-red-200 text-xs hover:bg-red-100 transition"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Buyer uploads */}
        <div className="bg-white rounded-xl p-3 shadow">
          <h5 className="text-sm font-semibold mb-2">Buyer Files</h5>

          {/* Buyer Profile */}
          <div className="mb-4 pb-4 border-b">
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                {previews.buyerProfile ? (
                  <img src={previews.buyerProfile} alt="buyer profile" className="object-cover w-full h-full" />
                ) : (
                  <div className="text-xs text-gray-500 text-center">No profile</div>
                )}
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 font-semibold">Profile Image</label>
                <div className="flex items-center gap-2 mt-2">
                  <label className="px-3 py-1 rounded bg-blue-50 border border-blue-200 text-xs cursor-pointer hover:bg-blue-100 transition">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={el => fileInputRefs.current['buyerProfile'] = el}
                      onChange={(e) => onFileChange('buyerProfile', e)} 
                    />
                    📝 Edit
                  </label>
                  {previews.buyerProfile && (
                    <a 
                      href={previews.buyerProfile} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-3 py-1 rounded bg-green-50 border border-green-200 text-xs hover:bg-green-100 transition"
                    >
                      ⬇️ Download
                    </a>
                  )}
                  {(form.buyerProfile || previews.buyerProfile) && (
                    <button 
                      type="button" 
                      onClick={() => removeFile('buyerProfile')} 
                      className="px-3 py-1 rounded bg-red-50 border border-red-200 text-xs hover:bg-red-100 transition"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Aadhaar Front */}
          <div className="mb-4 pb-4 border-b">
            <label className="text-xs text-gray-600 font-semibold">Aadhaar Front</label>
            <div className="flex items-center gap-2 mt-2">
              <label className="px-3 py-1 rounded bg-blue-50 border border-blue-200 text-xs cursor-pointer hover:bg-blue-100 transition">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="hidden" 
                  ref={el => fileInputRefs.current['buyerAadhaarFront'] = el}
                  onChange={(e) => onFileChange('buyerAadhaarFront', e)} 
                />
                📝 Edit
              </label>
              {previews.buyerAadhaarFront && (
                <a 
                  href={previews.buyerAadhaarFront} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1 rounded bg-green-50 border border-green-200 text-xs hover:bg-green-100 transition"
                >
                  ⬇️ Download
                </a>
              )}
              {(form.buyerAadhaarFront || previews.buyerAadhaarFront) && (
                <button 
                  type="button" 
                  onClick={() => removeFile('buyerAadhaarFront')} 
                  className="px-3 py-1 rounded bg-red-50 border border-red-200 text-xs hover:bg-red-100 transition"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          </div>

          {/* Buyer Aadhaar Back */}
          <div>
            <label className="text-xs text-gray-600 font-semibold">Aadhaar Back</label>
            <div className="flex items-center gap-2 mt-2">
              <label className="px-3 py-1 rounded bg-blue-50 border border-blue-200 text-xs cursor-pointer hover:bg-blue-100 transition">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="hidden" 
                  ref={el => fileInputRefs.current['buyerAadhaarBack'] = el}
                  onChange={(e) => onFileChange('buyerAadhaarBack', e)} 
                />
                📝 Edit
              </label>
              {previews.buyerAadhaarBack && (
                <a 
                  href={previews.buyerAadhaarBack} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1 rounded bg-green-50 border border-green-200 text-xs hover:bg-green-100 transition"
                >
                  ⬇️ Download
                </a>
              )}
              {(form.buyerAadhaarBack || previews.buyerAadhaarBack) && (
                <button 
                  type="button" 
                  onClick={() => removeFile('buyerAadhaarBack')} 
                  className="px-3 py-1 rounded bg-red-50 border border-red-200 text-xs hover:bg-red-100 transition"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Guarantor Documents - combined UI */}
      <div className="mb-4 bg-white rounded-xl p-4 shadow">
        <h5 className="text-sm font-semibold mb-3">Guarantor Documents</h5>
        <div className="grid grid-cols-3 gap-4 items-start">
          {[{
            key: 'guarantorPhoto',
            label: 'Photo',
            preview: previews.guarantorPhoto,
          }, {
            key: 'guarantorAadhaarFront',
            label: 'Aadhar Front',
            preview: previews.guarantorAadhaarFront,
          }, {
            key: 'guarantorAadhaarBack',
            label: 'Aadhar Back',
            preview: previews.guarantorAadhaarBack,
          }].map(item => (
            <div key={item.key} className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
              <div className="w-28 h-28 bg-white rounded overflow-hidden flex items-center justify-center border">
                {item.preview ? (
                  <img src={item.preview} alt={item.label} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-xs text-gray-500 text-center">No {item.label.toLowerCase()}</div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <label className="px-3 py-1 rounded bg-blue-50 border border-blue-200 text-xs cursor-pointer hover:bg-blue-100 transition font-semibold">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={el => fileInputRefs.current[item.key] = el}
                    onChange={(e) => onFileChange(item.key, e)}
                  />
                  📝 Edit
                </label>
                {item.preview && (
                  <a href={item.preview} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-green-50 border border-green-200 text-xs hover:bg-green-100 transition font-semibold">⬇️</a>
                )}
                {(form[item.key] || item.preview) && (
                  <button type="button" onClick={() => removeFile(item.key)} className="px-3 py-1 rounded bg-red-50 border border-red-200 text-xs hover:bg-red-100 transition font-semibold">✕</button>
                )}
              </div>
              <div className="mt-1 text-xs text-gray-600">{item.label}</div>
            </div>
          ))}
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
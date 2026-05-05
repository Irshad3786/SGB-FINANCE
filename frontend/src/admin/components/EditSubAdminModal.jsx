import React, { useState, useEffect } from 'react'

function EditSubAdminModal({ isOpen, onClose, subAdmin, onSave }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    roleName: '',
    status: 'active',
    moduleAccess: {
      dashboard: { enabled: false, edit: false },
      vehicleStock: { enabled: false, edit: false },
      users: { enabled: false, edit: false },
      addEntry: { enabled: false, edit: false },
      finance: { enabled: false, edit: false },
      pendingPayments: { enabled: false, edit: false },
      requestCenter: { enabled: false, edit: false },
      ownershipTransfer: { enabled: false, edit: false }
    }
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const roleNames = [
    { value: 'Financer', label: 'Financer' },
    { value: 'Data Entry', label: 'Data Entry' },
    { value: 'Collection Agent', label: 'Collection Agent' }
  ]

  const modules = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14"><path fill="#000" fillRule="evenodd" d="M1.375 1.375v5.75h3.75v-5.75zM.125 1.25C.125.629.629.125 1.25.125h4c.621 0 1.125.504 1.125 1.125v6c0 .621-.504 1.125-1.125 1.125h-4A1.125 1.125 0 0 1 .125 7.25zM8.75.125c-.621 0-1.125.504-1.125 1.125v2.01c0 .621.504 1.125 1.125 1.125h4c.621 0 1.125-.504 1.125-1.125V1.25c0-.621-.504-1.125-1.125-1.125zm.125 6.75v5.75h3.75v-5.75zm-1.25-.125c0-.621.504-1.125 1.125-1.125h4c.621 0 1.125.504 1.125 1.125v6c0 .621-.504 1.125-1.125 1.125h-4a1.125 1.125 0 0 1-1.125-1.125zM1.25 9.615c-.621 0-1.125.504-1.125 1.125v2.01c0 .621.504 1.125 1.125 1.125h4c.621 0 1.125-.504 1.125-1.125v-2.01c0-.621-.504-1.125-1.125-1.125z" clipRule="evenodd"/></svg>
      )
    },
    {
      id: 'vehicleStock',
      label: 'Vehicle Stock',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M4 8.923h16V5.385q0-.231-.192-.423t-.423-.193H4.615q-.23 0-.423.192T4 5.384zm0 5.154h16V9.923H4zm.615 5.154h14.77q.23 0 .423-.193t.192-.423v-3.538H4v3.539q0 .23.192.423t.423.192M5.77 7.654V6.039h1.615v1.615zm0 5.154v-1.616h1.615v1.616zm0 5.154v-1.616h1.615v1.616z"/></svg>
      )
    },
    {
      id: 'users',
      label: 'Users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"/></svg>
      )
    },
    {
      id: 'addEntry',
      label: 'Add Entry',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" fillRule="evenodd" d="M7.345 4.017a42.3 42.3 0 0 1 9.31 0c1.713.192 3.095 1.541 3.296 3.26a40.7 40.7 0 0 1 0 9.446c-.201 1.719-1.583 3.068-3.296 3.26a42.3 42.3 0 0 1-9.31 0c-1.713-.192-3.095-1.541-3.296-3.26a40.7 40.7 0 0 1 0-9.445a3.734 3.734 0 0 1 3.295-3.26M12 7.007a.75.75 0 0 1 .75.75v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1 0-1.5h3.493V7.757a.75.75 0 0 1 .75-.75" clipRule="evenodd"/></svg>
      )
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#2f2f2f" strokeWidth="2" d="M16 16c0-1.105-3.134-2-7-2s-7 .895-7 2s3.134 2 7 2s7-.895 7-2ZM2 16v4.937C2 22.077 5.134 23 9 23s7-.924 7-2.063V16M9 5c-4.418 0-8 .895-8 2s3.582 2 8 2M1 7v5c0 1.013 3.582 2 8 2M23 4c0-1.105-3.1-2-6.923-2s-6.923.895-6.923 2s3.1 2 6.923 2S23 5.105 23 4Zm-7 12c3.824 0 7-.987 7-2V4M9.154 4v10.166M9 9c0 1.013 3.253 2 7.077 2S23 10.013 23 9"/></svg>
      )
    },
    {
      id: 'pendingPayments',
      label: 'Pending Payments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M22.26 3.35A1 1 0 0 0 21.5 3h-9a1 1 0 0 0-.75.34a1 1 0 0 0-.24.79l1 7.5a1 1 0 1 0 2-.26l-.81-6.09a.22.22 0 0 1 .06-.19a.25.25 0 0 1 .17-.09H20a.22.22 0 0 1 .19.09a.24.24 0 0 1 .06.2l-1.09 6.57a1 1 0 1 0 2 .33l1.34-8a1 1 0 0 0-.24-.84"/><path fill="#000" d="M19 14h-6a.23.23 0 0 1-.22-.14L11.82 12a.5.5 0 0 0-.39-.28a.51.51 0 0 0-.45.18L9.1 14.21a.9.9 0 0 1-.59.28h-1A.5.5 0 0 0 7 15v6a.48.48 0 0 0 .2.4c2.3 1.73 4.08 2.6 5.3 2.6h5.55A1.7 1.7 0 0 0 20 22.66a56 56 0 0 0 1-7.16c0-.75-.69-1.5-2-1.5m-14.17-.5H1.75a.25.25 0 0 0-.25.25v9a.25.25 0 0 0 .25.25h3.08a.6.6 0 0 0 .67-.59v-8.32a.6.6 0 0 0-.67-.59M15.5 9a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M10 11a1 1 0 0 0 1-1.16L9.73 2.29a.28.28 0 0 1 0-.2A.25.25 0 0 1 10 2h8a1 1 0 0 0 0-2H8.5a1 1 0 0 0-1 1.16l1.5 9a1 1 0 0 0 1 .84"/></svg>
      )
    },
    {
      id: 'requestCenter',
      label: 'Request Center',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M5 3a2 2 0 0 0-2 2v14.5A1.5 1.5 0 0 0 4.5 21H19a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 15.172 3zm9 1.5V8h3.5zM7 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zm0 4a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zm0 4a1 1 0 1 1 0-2h7a1 1 0 1 1 0 2z"/></svg>
      )
    },
    {
      id: 'ownershipTransfer',
      label: 'Ownership Transfer',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#000" d="M8.56 11.9a1.5 1.5 0 0 1 0 2.12l-.974.976H16a1.5 1.5 0 0 1 0 3H7.586l.975.974a1.5 1.5 0 1 1-2.122 2.122l-3.535-3.536a1.5 1.5 0 0 1 0-2.121l3.535-3.536a1.5 1.5 0 0 1 2.122 0Zm6.88-9a1.5 1.5 0 0 1 2.007-.104l.114.103l3.535 3.536a1.5 1.5 0 0 1 .103 2.007l-.103.114l-3.535 3.536a1.5 1.5 0 0 1-2.225-2.008l.103-.114l.975-.974H8a1.5 1.5 0 0 1-.144-2.994L8 5.996h8.414l-.975-.975a1.5 1.5 0 0 1 0-2.122Z"/></g></svg>
      )
    }
  ]

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const originalOverflow = document.body.style.overflow

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (subAdmin) {
      const moduleAccess = {
        dashboard: { enabled: false, edit: false },
        vehicleStock: { enabled: false, edit: false },
        users: { enabled: false, edit: false },
        addEntry: { enabled: false, edit: false },
        finance: { enabled: false, edit: false },
        pendingPayments: { enabled: false, edit: false },
        requestCenter: { enabled: false, edit: false },
        ownershipTransfer: { enabled: false, edit: false }
      }

      if (Array.isArray(subAdmin.permissions)) {
        subAdmin.permissions.forEach(permission => {
          if (moduleAccess[permission.module]) {
            moduleAccess[permission.module] = {
              enabled: true,
              edit: Boolean(permission?.actions?.edit)
            }
          }
        })
      }

      setForm({
        name: subAdmin.name || '',
        phone: subAdmin.phone || '',
        roleName: subAdmin.roleName || '',
        status: subAdmin.status || 'active',
        moduleAccess
      })
      setErrors({})
    }
  }, [subAdmin, isOpen])

  const onChange = (e) => {
    const { name, value } = e.target
    const nextValue =
      name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value

    setForm(prev => ({ ...prev, [name]: nextValue }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleModuleToggle = (moduleId) => {
    setForm(prev => ({
      ...prev,
      moduleAccess: {
        ...prev.moduleAccess,
        [moduleId]: {
          ...prev.moduleAccess[moduleId],
          enabled: !prev.moduleAccess[moduleId].enabled,
          edit: !prev.moduleAccess[moduleId].enabled ? false : prev.moduleAccess[moduleId].edit
        }
      }
    }))
  }

  const handleEditPermissionChange = (moduleId) => {
    setForm(prev => ({
      ...prev,
      moduleAccess: {
        ...prev.moduleAccess,
        [moduleId]: {
          ...prev.moduleAccess[moduleId],
          edit: !prev.moduleAccess[moduleId].edit
        }
      }
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits'
    }

    if (!form.roleName) {
      newErrors.roleName = 'Please select a role name'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        // Convert moduleAccess to permissions array
        const permissions = Object.entries(form.moduleAccess)
          .filter(([, val]) => val.enabled)
          .map(([module, actions]) => ({
            module,
            actions: {
              view: true,
              edit: actions.edit
            }
          }))
        
        console.log('Updating subadmin with permissions:', permissions)

        await onSave({
          ...subAdmin,
          name: form.name,
          phone: form.phone,
          roleName: form.roleName,
          status: form.status,
          permissions
        })
        setErrors({})
        onClose()
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: error?.response?.data?.message || 'Failed to update sub-admin'
        }))
      } finally {
        setLoading(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-[#eafef2] to-white px-6 md:px-8 py-4 md:py-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#14493b]">Edit SubAdmin</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 py-6 md:py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.submit && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
                {errors.submit}
              </div>
            )}

            {/* Name and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-2">Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={onChange}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Full Name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-2">Phone No</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  inputMode="numeric"
                  maxLength={10}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Phone No"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Role and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Role Name */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-2">Role Name</label>
                <select
                  name="roleName"
                  value={form.roleName}
                  onChange={onChange}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                >
                  <option value="">Select Role</option>
                  {roleNames.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                {errors.roleName && <p className="text-red-500 text-xs mt-1">{errors.roleName}</p>}
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-2">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={onChange}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Permissions */}
            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-[#0e6b53] mb-3">Permissions</label>
              <p className="text-xs text-gray-600 mb-4">Select which sections this sub-admin can access</p>

              <div className="grid grid-cols-1 gap-4">
                {modules.map(module => (
                  <div key={module.id} className="space-y-2">
                    <div
                      onClick={() => handleModuleToggle(module.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        form.moduleAccess[module.id].enabled
                          ? 'border-[#40FF00] bg-gradient-to-b from-[#B0FF1C]/20 to-[#40FF00]/20 shadow-md'
                          : 'border-gray-200 bg-white/50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          form.moduleAccess[module.id].enabled ? 'bg-white' : 'bg-gray-100'
                        }`}>
                          {module.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${
                            form.moduleAccess[module.id].enabled ? 'text-[#0e6b53]' : 'text-gray-700'
                          }`}>
                            {module.label}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          form.moduleAccess[module.id].enabled
                            ? 'border-[#40FF00] bg-[#40FF00]'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {form.moduleAccess[module.id].enabled && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                              <path fill="white" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit Permission - Show when module is enabled */}
                    {form.moduleAccess[module.id].enabled && (
                      <div className="ml-12 flex gap-4 pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.moduleAccess[module.id].edit}
                            onChange={() => handleEditPermissionChange(module.id)}
                            className="w-4 h-4 text-[#40FF00] rounded focus:ring-[#bff86a] border-gray-300"
                          />
                          <span className="text-sm font-medium text-[#0e6b53]">Edit</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-gray-900 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update SubAdmin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditSubAdminModal

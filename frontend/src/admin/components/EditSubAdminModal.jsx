import React, { useState, useEffect } from 'react'

function EditSubAdminModal({ isOpen, onClose, subAdmin, onSave }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    roleName: '',
    status: 'active',
    permissions: []
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const roleNames = [
    { value: 'Financer', label: 'Financer' },
    { value: 'Data Entry', label: 'Data Entry' },
    { value: 'Collection Agent', label: 'Collection Agent' }
  ]

  const modules = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'vehicleStock', label: 'Vehicle Stock' },
    { id: 'users', label: 'Users' },
    { id: 'addEntry', label: 'Add Entry' },
    { id: 'finance', label: 'Finance' },
    { id: 'pendingPayments', label: 'Pending Payments' }
  ]

  useEffect(() => {
    if (subAdmin) {
      setForm({
        name: subAdmin.name || '',
        phone: subAdmin.phone || '',
        roleName: subAdmin.roleName || '',
        status: subAdmin.status || 'active',
        permissions: subAdmin.permissions || []
      })
      setErrors({})
    }
  }, [subAdmin, isOpen])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePermissionChange = (moduleId, action) => {
    setForm(prev => {
      const updatedPermissions = [...prev.permissions]
      const permissionIndex = updatedPermissions.findIndex(p => p.module === moduleId)
      
      if (permissionIndex >= 0) {
        updatedPermissions[permissionIndex].actions[action] = !updatedPermissions[permissionIndex].actions[action]
      } else {
        updatedPermissions.push({
          module: moduleId,
          actions: {
            view: action === 'view' ? true : false,
            edit: action === 'edit' ? true : false
          }
        })
      }
      
      return { ...prev, permissions: updatedPermissions }
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10,}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!form.roleName) {
      newErrors.roleName = 'Please select a role name'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      setTimeout(() => {
        onSave({
          ...subAdmin,
          name: form.name,
          phone: form.phone,
          roleName: form.roleName,
          status: form.status,
          permissions: form.permissions
        })
        setLoading(false)
        onClose()
      }, 1000)
    } else {
      setErrors(newErrors)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="space-y-3">
                {modules.map(module => {
                  const permission = form.permissions.find(p => p.module === module.id)
                  return (
                    <div key={module.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-[#14493b] flex-1">{module.label}</span>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permission?.actions.view || false}
                            onChange={() => handlePermissionChange(module.id, 'view')}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-600">View</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permission?.actions.edit || false}
                            onChange={() => handlePermissionChange(module.id, 'edit')}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-600">Edit</span>
                        </label>
                      </div>
                    </div>
                  )
                })}
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

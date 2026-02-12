import React, { useState, useEffect } from 'react'
import EditSubAdminModal from './EditSubAdminModal'

function SubAdminList() {
  const [subAdmins, setSubAdmins] = useState([
    {
      _id: '1',
      name: 'John Doe',
      email: 'financer@example.com',
      phone: '9876543210',
      roleName: 'Financer',
      status: 'active',
      permissions: [
        { module: 'dashboard', actions: { view: true, edit: false } },
        { module: 'finance', actions: { view: true, edit: true } }
      ]
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'dataentry@example.com',
      phone: '9876543211',
      roleName: 'Data Entry',
      status: 'active',
      permissions: [
        { module: 'addEntry', actions: { view: true, edit: true } },
        { module: 'users', actions: { view: true, edit: false } }
      ]
    },
    {
      _id: '3',
      name: 'Mike Johnson',
      email: 'collection@example.com',
      phone: '9876543212',
      roleName: 'Collection Agent',
      status: 'inactive',
      permissions: [
        { module: 'finance', actions: { view: true, edit: false } },
        { module: 'pendingPayments', actions: { view: true, edit: true } }
      ]
    }
  ])

  const [loading, setLoading] = useState(false)
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [successMessage, setSuccessMessage] = useState('')

  const handleEditClick = (subAdmin) => {
    setSelectedSubAdmin(subAdmin)
    setIsEditModalOpen(true)
  }

  const handleSave = (updatedSubAdmin) => {
    setSubAdmins(prev =>
      prev.map(admin =>
        admin._id === updatedSubAdmin._id ? updatedSubAdmin : admin
      )
    )
    setSuccessMessage('SubAdmin updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const filteredSubAdmins = filterStatus === 'all'
    ? subAdmins
    : subAdmins.filter(s => s.status === filterStatus)

  return (
    <div className="w-full">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
          {successMessage}
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h3 className="text-xl md:text-2xl font-bold text-[#14493b]">SubAdmin Management</h3>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {filteredSubAdmins.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 font-medium">No subAdmins found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSubAdmins.map((subAdmin) => (
            <div
              key={subAdmin._id}
              className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Mobile Layout: 2 cols, Desktop Layout: 4 cols */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-start md:items-center mb-4">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Name</p>
                  <p className="text-gray-900 font-medium text-sm">{subAdmin.name}</p>
                </div>
                <div className="col-span-1 md:col-span-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</p>
                  <p className="text-gray-900 font-medium text-sm">{subAdmin.phone}</p>
                </div>
                <div className="col-span-1 md:col-span-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Role</p>
                  <p className="text-gray-900 font-medium text-sm">{subAdmin.roleName}</p>
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-start md:justify-end">
                  <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    subAdmin.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {subAdmin.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Permissions Display */}
              {subAdmin.permissions && subAdmin.permissions.length > 0 && (
                <div className="mb-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Permissions</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {subAdmin.permissions.map((perm, idx) => (
                      <div key={idx} className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded">
                        <span className="font-medium capitalize">{perm.module}</span>
                        <span className="text-gray-500">
                          {' '}({perm.actions.view ? 'V' : ''}{perm.actions.edit ? 'E' : ''})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleEditClick(subAdmin)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-gray-900 font-semibold shadow hover:shadow-lg transition-all"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditSubAdminModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedSubAdmin(null)
        }}
        subAdmin={selectedSubAdmin}
        onSave={handleSave}
      />
    </div>
  )
}

export default SubAdminList

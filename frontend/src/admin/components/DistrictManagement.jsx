import React, { useEffect, useState } from 'react'
import apiClient from '../../api/axios'
import Loader from '../../components/Loader'
import DistrictLocationModal from './DistrictLocationModal'

function DistrictManagement() {
  const [districtLocations, setDistrictLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDistrictLocation, setSelectedDistrictLocation] = useState(null)

  const fetchDistrictLocations = async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await apiClient.get('/api/admin/district-locations')
      setDistrictLocations(response.data?.data || [])
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to load district locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDistrictLocations()
  }, [])

  const handleAddClick = () => {
    setSelectedDistrictLocation(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (districtLocation) => {
    setSelectedDistrictLocation(districtLocation)
    setIsModalOpen(true)
  }

  const handleSave = async (savedDistrictLocation) => {
    const isEdit = Boolean(savedDistrictLocation?._id)
    const response = isEdit
      ? await apiClient.put(`/api/admin/district-locations/${savedDistrictLocation._id}`, {
          district: savedDistrictLocation.district,
          mandals: savedDistrictLocation.mandals,
        })
      : await apiClient.post('/api/admin/district-locations', {
          district: savedDistrictLocation.district,
          mandals: savedDistrictLocation.mandals,
        })

    const savedLocation = response.data?.data

    setDistrictLocations((prev) => {
      if (isEdit) {
        return prev.map((item) => (item._id === savedLocation._id ? savedLocation : item))
      }

      return [savedLocation, ...prev].sort((left, right) =>
        String(left?.district || '').localeCompare(String(right?.district || ''))
      )
    })

    setSuccessMessage(response.data?.message || 'District location saved successfully')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleDelete = async (districtLocation) => {
    const confirmed = window.confirm(`Delete ${districtLocation.district}?`)
    if (!confirmed) {
      return
    }

    try {
      await apiClient.delete(`/api/admin/district-locations/${districtLocation._id}`)
      setDistrictLocations((prev) => prev.filter((item) => item._id !== districtLocation._id))
      setSuccessMessage('District location deleted successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete district location')
    }
  }

  return (
    <div className="w-full">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-[#14493b]">District & Mandal Management</h3>
          <p className="text-sm text-gray-600 mt-1">Manage the district list used by the sub-admin forms</p>
        </div>

        <button
          onClick={handleAddClick}
          className="px-4 py-2 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-gray-900 font-semibold shadow hover:shadow-lg transition-all"
        >
          Add District
        </button>
      </div>

      {loading ? (
        <div className="bg-gray-50 rounded-lg p-8 min-h-[260px] flex items-center justify-center">
          <Loader fullScreen={false} message="Loading district locations..." />
        </div>
      ) : districtLocations.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 font-medium">No district locations found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {districtLocations.map((districtLocation) => (
            <div
              key={districtLocation._id}
              className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start md:items-center mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">District</p>
                  <p className="text-gray-900 font-medium text-sm md:text-base">{districtLocation.district}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Mandal Count</p>
                  <p className="text-gray-900 font-medium text-sm md:text-base">{districtLocation.mandalCount || districtLocation.mandals?.length || 0}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Mandals</p>
                  <div className="flex flex-wrap gap-2">
                    {(districtLocation.mandals || []).slice(0, 6).map((mandal) => (
                      <span key={mandal} className="px-2 py-1 rounded-full bg-[#eafef2] text-[#0e6b53] text-xs font-semibold">
                        {mandal}
                      </span>
                    ))}
                    {(districtLocation.mandals || []).length > 6 && (
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                        +{districtLocation.mandals.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleEditClick(districtLocation)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(districtLocation)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DistrictLocationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDistrictLocation(null)
        }}
        districtLocation={selectedDistrictLocation}
        onSave={handleSave}
      />
    </div>
  )
}

export default DistrictManagement
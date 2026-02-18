import React, { useState, useEffect } from 'react'
import UserNavbar from './components/UserNavbar'

function UserDashboard() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData)
        // Mock additional data for UI demo
        setUserData({
          ...parsedData,
          isEmailVerified: false,
          vehicleModel: 'Hero Splendor Plus 2020'
        })
      } catch (err) {
        console.error('Failed to parse user data:', err)
        setUserData({
          username: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '9876543210',
          vehicleNumber: 'KA-01-AB-1234',
          chassisNumber: 'ABC123XYZ456',
          vehicleModel: 'Hero Splendor Plus 2020',
          isEmailVerified: false
        })
      }
    } else {
      // Mock data for demo
      setUserData({
        username: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '9876543210',
        vehicleNumber: 'KA-01-AB-1234',
        chassisNumber: 'ABC123XYZ456',
        vehicleModel: 'Hero Splendor Plus 2020',
        isEmailVerified: false
      })
    }
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {userData && <UserNavbar userData={userData} />}
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dashboard Cards - Will be added later */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-gray-600 text-sm font-medium mb-2">Dashboard</div>
              <div className="text-gray-400">More features coming soon...</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default UserDashboard
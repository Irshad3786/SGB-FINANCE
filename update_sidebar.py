#!/usr/bin/env python3

# Read the file
with open('frontend/src/subAdmin/Sidebar.jsx', 'r') as f:
    content = f.read()

# Add imports after line 5 (after useLocation import)
old_imports = """import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../home/components/Logo';
import { useLocation } from 'react-router-dom';"""

new_imports = """import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../home/components/Logo';
import { useLocation } from 'react-router-dom';
import apiClient, { setAuthToken, setRefreshToken } from '../api/axios';"""

content = content.replace(old_imports, new_imports)

# Add navigate const in Sidebar function
old_function = """function Sidebar({toggle, onNavigate}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();"""

new_function = """function Sidebar({toggle, onNavigate}) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();"""

content = content.replace(old_function, new_function)

# Replace the logout click handler
old_handler = """              onClick={() => {
                setShowLogoutModal(false);
                // Add your logout logic here
                console.log('Logging out...');
              }}"""

new_handler = """              onClick={async () => {
                try {
                  await apiClient.post('/api/subadmin/logOutSubAdmin')
                  setAuthToken(null)
                  setRefreshToken(null)
                  setShowLogoutModal(false)
                  if (typeof window !== 'undefined') {
                    sessionStorage.clear()
                  }
                  navigate('/subadmin-signin', { replace: true })
                } catch (error) {
                  console.error('Logout error:', error)
                  setAuthToken(null)
                  setRefreshToken(null)
                  setShowLogoutModal(false)
                  if (typeof window !== 'undefined') {
                    sessionStorage.clear()
                  }
                  navigate('/subadmin-signin', { replace: true })
                }
              }}"""

content = content.replace(old_handler, new_handler)

# Write back
with open('frontend/src/subAdmin/Sidebar.jsx', 'w') as f:
    f.write(content)

print("File updated successfully!")

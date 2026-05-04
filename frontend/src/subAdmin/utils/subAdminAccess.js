const USER_DATA_KEY = 'userData'

export function readStoredSubAdminProfile() {
  if (typeof window === 'undefined') {
    return { name: 'Sub Admin', roleName: '', permissions: [] }
  }

  try {
    const rawUserData = localStorage.getItem(USER_DATA_KEY)
    if (!rawUserData) {
      return { name: 'Sub Admin', roleName: '', permissions: [] }
    }

    const parsedUserData = JSON.parse(rawUserData)
    return {
      name: parsedUserData?.name || 'Sub Admin',
      roleName: parsedUserData?.roleName || '',
      permissions: Array.isArray(parsedUserData?.permissions) ? parsedUserData.permissions : [],
    }
  } catch {
    return { name: 'Sub Admin', roleName: '', permissions: [] }
  }
}

export function canAccessModule(permissions, moduleName) {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return false
  }

  return permissions.some(permission => {
    const currentModule = permission?.module || permission?.name || permission?.key
    return currentModule === moduleName
  })
}

export function canEditModule(permissions, moduleName) {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return false
  }

  return permissions.some(
    permission => {
      const currentModule = permission?.module || permission?.name || permission?.key
      const canEdit = permission?.actions?.edit ?? permission?.edit ?? false
      return currentModule === moduleName && Boolean(canEdit)
    }
  )
}
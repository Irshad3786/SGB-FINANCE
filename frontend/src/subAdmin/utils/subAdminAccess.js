const USER_DATA_KEY = 'userData'

const MODULE_ALIASES = {
  pendingpayment: 'pendingPayments',
  pendingpayments: 'pendingPayments',
  pendingdownpayment: 'pendingPayments',
  requestcenter: 'requestCenter',
  vehiclestock: 'vehicleStock',
  ownershiptransfer: 'ownershipTransfer',
  addentry: 'addEntry',
}

function normalizeModuleName(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const key = raw.replace(/[^a-zA-Z]/g, '').toLowerCase()
  return MODULE_ALIASES[key] || raw
}

function resolveEditAccess(permission) {
  const value = permission?.actions?.edit ?? permission?.edit ?? permission?.actions?.canEdit
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true'
  }
  return Boolean(value)
}

export function readStoredSubAdminProfile() {
  if (typeof window === 'undefined') {
    return { name: 'Sub Admin', roleName: '', permissions: [] }
  }

  try {
    const rawUserData = sessionStorage.getItem(USER_DATA_KEY)
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

  const normalizedTarget = normalizeModuleName(moduleName)

  return permissions.some(permission => {
    const currentModule = normalizeModuleName(permission?.module || permission?.name || permission?.key)
    return currentModule === normalizedTarget
  })
}

export function canEditModule(permissions, moduleName) {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return false
  }

  const normalizedTarget = normalizeModuleName(moduleName)

  return permissions.some(permission => {
    const currentModule = normalizeModuleName(permission?.module || permission?.name || permission?.key)
    return currentModule === normalizedTarget && resolveEditAccess(permission)
  })
}
import React, { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

const toastTypeStyles = {
  success: {
    border: 'border-[#40FF00]',
    iconBg: 'bg-[#eaffcf]',
    icon: '✓',
    iconColor: 'text-[#0e6b53]'
  },
  error: {
    border: 'border-red-500',
    iconBg: 'bg-red-100',
    icon: '✕',
    iconColor: 'text-red-600'
  },
  warning: {
    border: 'border-amber-400',
    iconBg: 'bg-amber-100',
    icon: '!',
    iconColor: 'text-amber-600'
  },
  info: {
    border: 'border-[#0e6b53]',
    iconBg: 'bg-[#e0fced]',
    icon: 'i',
    iconColor: 'text-[#0e6b53]'
  }
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showToast = ({ type = 'info', title = 'Notice', message = '', duration = 3500 }) => {
    const normalizedType = type === 'caution' ? 'warning' : type
    const finalType = toastTypeStyles[normalizedType] ? normalizedType : 'info'
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    setToasts((prev) => [
      ...prev,
      {
        id,
        type: finalType,
        title,
        message
      }
    ])

    window.setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const contextValue = useMemo(() => ({ showToast }), [])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          const styles = toastTypeStyles[toast.type]

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-xl border-l-4 ${styles.border} p-4`}
            >
              <div className="flex items-start gap-3">
                <div className={`h-7 w-7 rounded-full ${styles.iconBg} ${styles.iconColor} font-bold flex items-center justify-center text-sm`}>
                  {styles.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#14493b] leading-tight">{toast.title}</p>
                  {toast.message ? <p className="mt-1 text-xs text-[#27563C] break-words">{toast.message}</p> : null}
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-[#0e6b53] text-sm font-bold leading-none"
                  aria-label="Close toast"
                >
                  ×
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }

  return context
}

import React, { useState, useMemo } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import WhatsAppConfirmModal from '../components/WhatsAppConfirmModal'
import apiClient from '../../api/axios'
import { useToast } from '../../components/ToastProvider'

// Finance data for EMI entry autocomplete
const unifiedData = [
  { sno: 1, ha: 'HA454', name: 'MOHAMMAD IRSHAD', vehicle: 'AP39DZ9786', phone: '9182278505,9876543210', emi: '3500', emiDate: '12-10-2025', commAmount: '25-11-2025', commDate: '3500', paidAmount: '3500', status: 'paid', vehiclePrice: '55000', charges: '15000', totalAmount: '50000', buyerName: 'RAJU K', financeAmount: '25000', age: '32', address: 'Ramapuram Road rosaiah colony Chirala, vetapalem mandal 523157', vehicleName: 'Hero Splendor', chassisNo: 'MBLHASD55544DD51410', vehicleModel: '2022', phoneNo: '9182278505', seller: 'MOHAMMAD IRSHAD', agreementNo: 'HA454', bookNo: '1', pageNo: '1', emiSchedule: [{ sno: 1, emi: 3500, paidAmount: 3400, emiDate: '30-01-2025', paidDate: '30-01-2025', peningAmount: 100 }, { sno: 2, emi: 3500, paidAmount: 3400, emiDate: '30-02-2025', paidDate: '30-02-2025', peningAmount: 100 }, { sno: 3, emi: 3500, paidAmount: 3400, emiDate: '30-03-2025', paidDate: '30-03-2025', peningAmount: 100 }, { sno: 4, emi: 3500, paidAmount: 3400, emiDate: '30-04-2025', paidDate: '30-04-2025', peningAmount: 100 }, { sno: 5, emi: 3500, paidAmount: 3400, emiDate: '30-05-2025', paidDate: '30-05-2025', peningAmount: 100 }, { sno: 6, emi: 3500, paidAmount: 3400, emiDate: '30-06-2025', paidDate: '30-06-2025', peningAmount: 100 }], totalPaid: '20400', totalPending: '600' },
  { sno: 2, ha: 'HA455', name: 'RAHUL KUMAR', vehicle: 'AP27AZ9865', phone: '9190909090', emi: '4250', emiDate: '01-11-2025', commAmount: '25-10-2025', commDate: '3330', paidAmount: '3330', status: 'pending', vehiclePrice: '48000', charges: '12000', totalAmount: '60000', buyerName: 'MANU', financeAmount: '20000', age: '28', address: 'Block 5, Some Area', vehicleName: 'TVS Apache', chassisNo: 'MBLHASD55544DD22222', vehicleModel: '2021', phoneNo: '9190909090', seller: 'RAHUL', agreementNo: 'HA455', bookNo: '2', pageNo: '5', emiSchedule: [{ sno: 1, emi: 4250, paidAmount: 4250, emiDate: '01-11-2025', paidDate: '01-11-2025', peningAmount: 0 }, { sno: 2, emi: 4250, paidAmount: 0, emiDate: '01-12-2025', paidDate: '-', peningAmount: 4250 }, { sno: 3, emi: 4250, paidAmount: 0, emiDate: '01-01-2026', paidDate: '-', peningAmount: 4250 }] },
  { sno: 3, ha: 'HA456', name: 'PRADEEP SINGH', vehicle: 'AP26VV2654', phone: '9155555555', emi: '2800', emiDate: '15-12-2025', commAmount: '10-12-2025', commDate: '2880', paidAmount: '2880', status: 'paid', vehiclePrice: '42000', charges: '10000', totalAmount: '52000', buyerName: 'SAI', financeAmount: '15000', age: '30', address: 'Address line here', vehicleName: 'Royal Enfield', chassisNo: 'MBLHASD55544DD33333', vehicleModel: '2020', phoneNo: '9155555555', seller: 'PRADEEP', agreementNo: 'HA456', bookNo: '3', pageNo: '7', emiSchedule: [{ sno: 1, emi: 2800, paidAmount: 2800, emiDate: '15-12-2025', paidDate: '15-12-2025', peningAmount: 0 }, { sno: 2, emi: 2800, paidAmount: 0, emiDate: '15-01-2026', paidDate: '-', peningAmount: 2800 }] },
  { sno: 4, ha: 'HA457', name: 'KARTHIK RAO', vehicle: 'AP27NN3658', phone: '9166666666', emi: '3500', emiDate: '20-12-2025', commAmount: '15-12-2025', commDate: '3030', paidAmount: '3030', status: 'paid', vehiclePrice: '50000', charges: '14000', totalAmount: '64000', buyerName: '', financeAmount: '', age: '', address: '', vehicleName: '', chassisNo: '', vehicleModel: '', phoneNo: '9166666666', seller: 'KARTHIK', agreementNo: 'HA457', bookNo: '4', pageNo: '10', emiSchedule: [{ sno: 1, emi: 3500, paidAmount: 3500, emiDate: '20-12-2025', paidDate: '20-12-2025', peningAmount: 0 }, { sno: 2, emi: 3500, paidAmount: 0, emiDate: '20-01-2026', paidDate: '-', peningAmount: 3500 }] },
  { sno: 5, ha: 'HA458', name: 'MOULALI AHMED', vehicle: 'AP39XX7508', phone: '9133333333', emi: '2200', emiDate: '25-12-2025', commAmount: '20-12-2025', commDate: '2030', paidAmount: '2030', status: 'paid', vehiclePrice: '38000', charges: '9000', totalAmount: '47000', buyerName: '', financeAmount: '', age: '', address: '', vehicleName: '', chassisNo: '', vehicleModel: '', phoneNo: '9133333333', seller: 'MOULALI', agreementNo: 'HA458', bookNo: '5', pageNo: '12', emiSchedule: [{ sno: 1, emi: 2200, paidAmount: 2200, emiDate: '25-12-2025', paidDate: '25-12-2025', peningAmount: 0 }, { sno: 2, emi: 2200, paidAmount: 0, emiDate: '25-01-2026', paidDate: '-', peningAmount: 2200 }] },
  { sno: 6, ha: 'HA459', name: 'SURESH BABU', vehicle: 'AP39YZ8512', phone: '9123456780', emi: '3500', emiDate: '05-01-2026', commAmount: '31-12-2025', commDate: '3030', paidAmount: '3030', status: 'paid', vehiclePrice: '52000', charges: '13000', totalAmount: '65000', buyerName: '', financeAmount: '', age: '', address: '', vehicleName: '', chassisNo: '', vehicleModel: '', phoneNo: '9123456780', seller: 'SURESH', agreementNo: 'HA459', bookNo: '6', pageNo: '15', emiSchedule: [{ sno: 1, emi: 3500, paidAmount: 0, emiDate: '05-01-2026', paidDate: '-', peningAmount: 3500 }, { sno: 2, emi: 3500, paidAmount: 0, emiDate: '05-02-2026', paidDate: '-', peningAmount: 3500 }] },
  { sno: 7, ha: 'HA460', name: 'DEEPAK VERMA', vehicle: 'AP25KK4532', phone: '9144444444', emi: '1800', emiDate: '10-01-2026', commAmount: '05-01-2026', commDate: '1630', paidAmount: '1630', status: 'paid', vehiclePrice: '35000', charges: '8000', totalAmount: '43000', buyerName: '', financeAmount: '', age: '', address: '', vehicleName: '', chassisNo: '', vehicleModel: '', phoneNo: '9144444444', seller: 'DEEPAK VERMA', agreementNo: 'HA460', bookNo: '7', pageNo: '20', emiSchedule: [{ sno: 1, emi: 1800, paidAmount: 0, emiDate: '10-01-2026', paidDate: '-', peningAmount: 1800 }, { sno: 2, emi: 1800, paidAmount: 0, emiDate: '10-02-2026', paidDate: '-', peningAmount: 1800 }] },
]

const toInputDate = (displayDate) => {
  if (!displayDate) return ''
  const parts = String(displayDate).split('-')
  if (parts.length !== 3) return ''
  const [dd, mm, yyyy] = parts
  if (!dd || !mm || !yyyy) return ''
  return `${yyyy}-${mm}-${dd}`
}

const mapFinanceRowToCollectionRow = (row, index) => {
  const firstPendingSchedule = (row?.emiSchedule || []).find(
    s => Number(s?.pendingAmount ?? s?.peningAmount ?? 0) > 0
  )

  return {
    id: row?.id,
    sno: index + 1,
    ha: row?.agreementNo || '',
    agreementNo: row?.agreementNo || '',
    name: row?.seller || '',
    seller: row?.seller || '',
    vehicle: row?.vehicle || '',
    phone: row?.phoneNo || '',
    phoneNo: row?.phoneNo || '',
    emi: String(row?.emi ?? ''),
    emiDate: row?.emiDate || '',
    commAmount: toInputDate(firstPendingSchedule?.emiDate || row?.emiDate),
    commDate: String(firstPendingSchedule?.emi ?? row?.emi ?? ''),
    paidAmount: String(firstPendingSchedule?.paidAmount ?? 0),
    status: row?.status === 'paid' ? 'paid' : 'pending',
    vehiclePrice: row?.vehiclePrice,
    charges: row?.charges,
    totalAmount: row?.totalAmount,
    buyerName: row?.buyerName,
    financeAmount: row?.financeAmount,
    age: row?.age,
    address: row?.address,
    vehicleName: row?.vehicleName,
    chassisNo: row?.chassisNo,
    vehicleModel: row?.vehicleModel,
    emiSchedule: row?.emiSchedule || [],
    totalPaid: row?.totalPaid,
    totalPending: row?.totalPending,
    bookNo: firstPendingSchedule?.bookNo || '',
    pageNo: firstPendingSchedule?.pageNo || '',
  }
}

const todayInputDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const toDateInputValue = (value) => {
  if (!value) return todayInputDate()
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return todayInputDate()
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`
}

const toInr = (value) => Number(value || 0).toLocaleString('en-IN')

const formatBalance = (value) => {
  const amount = Number(value || 0)
  if (amount < 0) {
    return `(${toInr(Math.abs(amount))})`
  }
  return toInr(amount)
}

const getBalanceClass = (balance) => {
  const amount = Number(balance || 0)
  if (amount < 0) return 'text-green-600'
  if (amount > 0) return 'text-red-600'
  return 'text-black'
}

const getStatementRows = (emiSchedule = [], paymentEntries = []) => {
  let runningBalance = 0
  const entries = Array.isArray(paymentEntries) ? paymentEntries : []

  const rows = emiSchedule.map((schedule, idx) => {
    const paymentEntry = entries[idx] || null
    const paidAmt = Number(paymentEntry?.amount ?? 0)
    const paidDate = paymentEntry?.paidDate || '-'
    const receiptNo = paymentEntry?.bookNo && paymentEntry?.pageNo
      ? `${paymentEntry.bookNo}/${paymentEntry.pageNo}`
      : '-'

    const instAmount = Number(schedule?.emi || 0)
    runningBalance += instAmount - paidAmt

    return {
      instNo: Number(schedule?.sno || idx + 1),
      instDate: schedule?.emiDate || '-',
      instAmount,
      paidDate,
      paidAmt,
      balance: runningBalance,
      receiptNo,
    }
  })

  const extraEntries = entries.slice(emiSchedule.length)
  extraEntries.forEach((entry, index) => {
    const paidAmt = Number(entry?.amount || 0)
    const receiptNo = entry?.bookNo && entry?.pageNo
      ? `${entry.bookNo}/${entry.pageNo}`
      : '-'
    runningBalance -= paidAmt

    rows.push({
      instNo: emiSchedule.length + index + 1,
      instDate: '',
      instAmount: '',
      paidDate: entry?.paidDate || '-',
      paidAmt,
      balance: runningBalance,
      receiptNo,
    })
  })

  return rows
}

const mapCollectionEntryToTableRow = (entry, index) => ({
  id: entry.buyerId || '',
  collectionEntryId: entry.id,
  sno: index + 1,
  ha: entry.agreementNo,
  agreementNo: entry.agreementNo,
  name: entry.name || '',
  seller: entry.name || '',
  vehicle: entry.vehicle || '',
  phone: entry.phoneNo || '',
  phoneNo: entry.phoneNo || '',
  emi: String(entry.emi || ''),
  emiDate: entry.emiDate || '',
  commAmount: toDateInputValue(entry.date),
  commDate: String(entry.amount || ''),
  paidAmount: String(entry.paidAmount ?? 0),
  status: entry.status || 'pending',
  agentName: entry.agentName || '',
  vehiclePrice: '', charges: '', totalAmount: '',
  buyerName: entry.name || '', financeAmount: '', age: '',
  address: '', vehicleName: '', chassisNo: '', vehicleModel: '',
  emiSchedule: [], totalPaid: '', totalPending: '',
  bookNo: '', pageNo: '',
})

const withSno = (rows = []) => rows.map((row, index) => ({ ...row, sno: index + 1 }))

function Collection() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ agent: '', status: 'all', date: '' })
  const [searchQuery, setSearchQuery] = useState('')
  // Quick entry defaults so inputs are ready to edit
  const [quickEntry, setQuickEntry] = useState({ aggNo: '', amount: '', agent: '' })
  const [agentOptions, setAgentOptions] = useState([])
  const [financeData, setFinanceData] = useState([])
  const [savingQuickEntry, setSavingQuickEntry] = useState(false)
  const [resettingCollection, setResettingCollection] = useState(false)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ open: false, type: '', row: null })
  const [whatsAppModal, setWhatsAppModal] = useState({ isOpen: false, userName: '' })
  const [financeModal, setFinanceModal] = useState(null)
  const [editableData, setEditableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex] = useState(0)
  const tableContainerRef = useRef(null)
  const [emiEntryOpen, setEmiEntryOpen] = useState(false)
  const [emiEntryForm, setEmiEntryForm] = useState({ agreementNo: '', bookNo: '', pageNo: '', amount: '', date: '' })
  const [savingEntry, setSavingEntry] = useState(false)
  const bookInputRef = useRef(null)
  const [editFieldsPrompt, setEditFieldsPrompt] = useState({ open: false, bookNo: '', pageNo: '', amount: '', date: '' })

  const fetchCollectionData = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/api/subadmin/management/finance', {
        params: { page: 1, limit: 100 },
      })
      const data = response?.data?.data || []
      if (Array.isArray(data) && data.length > 0) {
        setFinanceData(data.map(mapFinanceRowToCollectionRow))
      } else {
        setFinanceData([])
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to load collection data',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCollectionAgents = async () => {
    try {
      const response = await apiClient.get('/api/subadmin/management/finance/collection-agents')
      const names = Array.isArray(response?.data?.data) ? response.data.data : []
      setAgentOptions(names)
    } catch (error) {
      setAgentOptions([])
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to load collection agents',
      })
    }
  }

  const fetchCollectionEntries = async (agentFilter = '') => {
    const selectedAgent = String(agentFilter || '').trim()
    if (!selectedAgent) {
      setEditableData([])
      return
    }

    try {
      const params = {}
      params.agentName = selectedAgent
      const response = await apiClient.get('/api/subadmin/management/finance/collection-entries', { params })
      const entries = Array.isArray(response?.data?.data) ? response.data.data : []
      setEditableData(withSno(entries.map(mapCollectionEntryToTableRow)))
      setSelectedRowIndex(0)
    } catch (error) {
      setEditableData([])
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to load collection entries',
      })
    }
  }

  const handleQuickEntrySubmit = async (e) => {
    e.preventDefault()
    const selectedAgent = filters.agent || quickEntry.agent
    const normalizedAggNo = quickEntry.aggNo.trim()

    if (!normalizedAggNo || !quickEntry.amount || !selectedAgent) {
      showToast({ type: 'error', title: 'Validation', message: 'Agg No, Amount and Agent are required' })
      return
    }

    const duplicateExists = editableData.some(row =>
      String(row.agreementNo || '').trim().toLowerCase() === normalizedAggNo.toLowerCase()
    )

    if (duplicateExists) {
      showToast({
        type: 'error',
        title: 'Duplicate',
        message: `Agreement No ${normalizedAggNo} is already added for ${selectedAgent}`,
      })
      return
    }

    try {
      setSavingQuickEntry(true)
      const resp = await apiClient.post('/api/subadmin/management/finance/collection-entry', {
        agreementNo: normalizedAggNo,
        amount: quickEntry.amount,
        agentName: selectedAgent,
      })
      const savedEntry = resp?.data?.data
      if (savedEntry) {
        const newRow = mapCollectionEntryToTableRow(savedEntry, editableData.length)
        setEditableData(prev => withSno([...prev, newRow]))
      }
      showToast({ type: 'success', title: 'Saved', message: 'Collection entry added' })
      setQuickEntry(prev => ({ aggNo: '', amount: '', agent: selectedAgent }))
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to save collection entry',
      })
    } finally {
      setSavingQuickEntry(false)
    }
  }

  const handleCellChange = (collectionEntryId, field, value) => {
    const currentRow = editableData.find(row => row.collectionEntryId === collectionEntryId)
    if (!currentRow) return

    setEditableData(prev => prev.map((row, idx) =>
      row.collectionEntryId === collectionEntryId ? { ...row, [field]: value } : row
    ))

    if (!currentRow?.collectionEntryId) return

    const payload = {}
    if (field === 'commAmount') payload.date = value
    if (field === 'commDate') payload.amount = value
    if (field === 'paidAmount') payload.paidAmount = value
    if (field === 'status') payload.status = value
    if (Object.keys(payload).length === 0) return

    apiClient.patch(
      `/api/subadmin/management/finance/collection-entry/${currentRow.collectionEntryId}`,
      payload
    ).catch(() => {
      showToast({ type: 'error', title: 'Error', message: 'Failed to save changes' })
    })
  }

  const handleDeleteCollectionEntry = async (row) => {
    if (!row?.collectionEntryId) {
      showToast({ type: 'error', title: 'Error', message: 'Entry id missing' })
      return
    }

    try {
      await apiClient.delete(`/api/subadmin/management/finance/collection-entry/${row.collectionEntryId}`)
      setEditableData(prev => withSno(prev.filter(item => item.collectionEntryId !== row.collectionEntryId)))
      setSelectedRowIndex(0)
      showToast({ type: 'success', title: 'Deleted', message: 'Collection entry removed' })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to delete collection entry',
      })
    }
  }

  const handleResetCollection = async () => {
    try {
      setResettingCollection(true)
      const response = await apiClient.delete('/api/subadmin/management/finance/collection-entries')
      const deletedCount = Number(response?.data?.data?.deletedCount || 0)

      setEditableData([])
      setSelectedRowIndex(0)

      showToast({
        type: 'success',
        title: 'Reset Complete',
        message: `Deleted ${deletedCount} collection entries from database`,
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to reset collection data',
      })
    } finally {
      setResettingCollection(false)
    }
  }

  const openDeleteConfirmModal = (type, row = null) => {
    setConfirmDeleteModal({ open: true, type, row })
  }

  const closeDeleteConfirmModal = () => {
    setConfirmDeleteModal({ open: false, type: '', row: null })
  }

  const handleConfirmDeleteModal = async () => {
    if (confirmDeleteModal.type === 'row' && confirmDeleteModal.row) {
      await handleDeleteCollectionEntry(confirmDeleteModal.row)
    }

    if (confirmDeleteModal.type === 'reset') {
      await handleResetCollection()
    }

    closeDeleteConfirmModal()
  }

  const handleWhatsAppClick = (userName) => {
    setWhatsAppModal({ isOpen: true, userName })
  }

  const filteredAgreements = useMemo(() => {
    const query = emiEntryForm.agreementNo.trim().toLowerCase()
    if (!query) return []
    return financeData
      .filter(f => f.agreementNo && f.agreementNo.toLowerCase().includes(query))
      .slice(0, 6)
  }, [emiEntryForm.agreementNo, financeData])

  const selectedAgreement = useMemo(
    () => financeData.find(f => f.agreementNo === emiEntryForm.agreementNo),
    [emiEntryForm.agreementNo, financeData]
  )

  const duplicateBookPageEntry = useMemo(() => {
    const bookNo = (emiEntryForm.bookNo || '').trim()
    const pageNo = (emiEntryForm.pageNo || '').trim()
    if (!bookNo || !pageNo) return null

    return financeData.find(item => {
      const itemBookNo = String(item.bookNo || '').trim()
      const itemPageNo = String(item.pageNo || '').trim()
      return itemBookNo === bookNo && itemPageNo === pageNo
    }) || null
  }, [emiEntryForm.bookNo, emiEntryForm.pageNo, financeData])

  const hasDuplicateBookPageConflict = Boolean(
    duplicateBookPageEntry && duplicateBookPageEntry.agreementNo !== emiEntryForm.agreementNo
  )

  const handleEmiEntryChange = (field, value) => {
    setEmiEntryForm(prev => ({ ...prev, [field]: value }))
  }

  const focusEmiEditFields = () => {
    if (bookInputRef.current) {
      bookInputRef.current.focus()
    }
  }

  const handleEmiEntrySave = async () => {
    if (!emiEntryForm.agreementNo || !emiEntryForm.date || !emiEntryForm.amount) {
      showToast({
        type: 'error',
        title: 'Validation',
        message: 'Agreement No, date and amount are required',
      })
      return
    }

    if (hasDuplicateBookPageConflict) {
      showToast({
        type: 'error',
        title: 'Duplicate Book/Page',
        message: `Book No ${emiEntryForm.bookNo} and Page No ${emiEntryForm.pageNo} already exist with Agreement No ${duplicateBookPageEntry.agreementNo} (${duplicateBookPageEntry.name || duplicateBookPageEntry.seller || 'Unknown'})`,
      })
      return
    }

    try {
      setSavingEntry(true)
      await apiClient.post('/api/subadmin/management/finance/emi-entry', {
        agreementNo: emiEntryForm.agreementNo,
        date: emiEntryForm.date,
        amount: emiEntryForm.amount,
        bookNo: emiEntryForm.bookNo,
        pageNo: emiEntryForm.pageNo,
      })

      await fetchCollectionData()

      if (financeModal?.id) {
        const statementResponse = await apiClient.get(`/api/subadmin/management/finance/${financeModal.id}`)
        const statement = statementResponse?.data?.data
        if (statement) {
          setFinanceModal(statement)
        }
      }

      showToast({
        type: 'success',
        title: 'Saved',
        message: 'EMI entry saved successfully',
      })
      focusEmiEditFields()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to save EMI entry',
      })
    } finally {
      setSavingEntry(false)
    }
  }

  const getDerivedEmiDefaults = () => {
    const next = selectedAgreement?.emiSchedule?.find(s => !s.paidAmount || s.paidAmount === 0)
    return {
      amount: (next?.emi ?? selectedAgreement?.emi ?? '').toString(),
      date: next?.emiDate ?? ''
    }
  }

  // Lookup Book/Page -> Name & Vehicle from financeData
  const lookupByBookPage = (bookNo, pageNo) => {
    const b = (bookNo || '').trim()
    const p = (pageNo || '').trim()
    if (!b || !p) return null
    const found = financeData.find(item => item.bookNo === b && item.pageNo === p)
    return found ? { name: found.name, vehicle: found.vehicle } : null
  }

  const handleWhatsAppConfirm = () => {
    // Add your WhatsApp sending logic here
    console.log('Sending WhatsApp message to:', whatsAppModal.userName)
    // You can integrate WhatsApp API or deep linking here
  }

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return editableData

    return editableData.filter(row => {
      const searchable = [
        row.ha,
        row.agreementNo,
        row.name,
        row.vehicle,
        row.phone,
        row.emi,
        row.emiDate,
        row.commDate,
      ]

      return searchable.some(value => String(value || '').toLowerCase().includes(query))
    })
  }, [editableData, searchQuery])

  // Handle keyboard navigation
  useEffect(() => {
    fetchCollectionData()
    fetchCollectionAgents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch entries whenever agent filter changes
  useEffect(() => {
    fetchCollectionEntries(filters.agent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.agent])

  useEffect(() => {
    if (agentOptions.length === 0) return
    setQuickEntry(prev => (prev.agent ? prev : { ...prev, agent: agentOptions[0] }))
    setFilters(prev => (prev.agent ? prev : { ...prev, agent: agentOptions[0] }))
  }, [agentOptions])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedRowIndex(prev => (prev < filteredData.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedRowIndex(prev => (prev > 0 ? prev - 1 : prev))
      }
    }
    
    if (tableContainerRef.current) {
      tableContainerRef.current.addEventListener('keydown', handleKeyDown)
    }
    
    return () => {
      if (tableContainerRef.current) {
        tableContainerRef.current.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [filteredData.length])

  // Calculate totals
  const totals = useMemo(() => {
    const totalCommAmount = filteredData.reduce((sum, row) => {
      const amount = parseFloat(row.commDate) || 0
      return sum + amount
    }, 0)

    const totalPaidAmount = filteredData.reduce((sum, row) => {
      const amount = parseFloat(row.paidAmount) || 0
      return sum + amount
    }, 0)

    const pendingAmount = totalCommAmount - totalPaidAmount

    return { totalCommAmount, totalPaidAmount, pendingAmount }
  }, [filteredData])

  const statementRows = financeModal
    ? getStatementRows(financeModal.emiSchedule, financeModal.paymentEntries)
    : []
  const statementTotalPaid = statementRows.reduce((sum, row) => sum + Number(row?.paidAmt || 0), 0)
  const statementBalance = statementRows.length > 0
    ? Number(statementRows[statementRows.length - 1]?.balance || 0)
    : 0
  const statementPending = Math.max(statementBalance, 0)

  return (
    <div className="p-3 sm:p-6 overflow-x-hidden max-w-full break-words w-full">
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none;}
        .no-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}
      `}</style>

      {/* Top Buttons */}
      <div className="flex items-center gap-4 mb-8">
        {/* All Users Button (inactive on Collection) */}
        <button onClick={() => navigate('/subadmin/finance')} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white border-2 border-gray-300 font-semibold text-gray-800 shadow hover:shadow-md transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#000" d="M21.987 18.73a2 2 0 0 1-.34.85a1.9 1.9 0 0 1-1.56.8h-1.651a.74.74 0 0 1-.6-.31a.76.76 0 0 1-.11-.67c.37-1.18.29-2.51-3.061-4.64a.77.77 0 0 1-.32-.85a.76.76 0 0 1 .72-.54a7.61 7.61 0 0 1 6.792 4.39a2 2 0 0 1 .13.97M19.486 7.7a4.43 4.43 0 0 1-4.421 4.42a.76.76 0 0 1-.65-1.13a6.16 6.16 0 0 0 0-6.53a.75.75 0 0 1 .61-1.18a4.3 4.3 0 0 1 3.13 1.34a4.46 4.46 0 0 1 1.291 3.12z"/>
            <path fill="#000" d="M16.675 18.7a2.65 2.65 0 0 1-1.26 2.48c-.418.257-.9.392-1.39.39H4.652a2.63 2.63 0 0 1-1.39-.39A2.62 2.62 0 0 1 2.01 18.7a2.6 2.6 0 0 1 .5-1.35a8.8 8.8 0 0 1 6.812-3.51a8.78 8.78 0 0 1 6.842 3.5a2.7 2.7 0 0 1 .51 1.36M14.245 7.32a4.92 4.92 0 0 1-4.902 4.91a4.903 4.903 0 0 1-4.797-5.858a4.9 4.9 0 0 1 6.678-3.57a4.9 4.9 0 0 1 3.03 4.518z"/>
          </svg>
          <span>Users</span>
        </button>

        {/* Collection Button (active on Collection) */}
        <button disabled className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold text-gray-900 shadow-lg cursor-default opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="w-5 h-5">
            <path fill="#000" d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1"/>
          </svg>
          <span>Collection</span>
        </button>
      </div>

      {/* Quick controls */}
      

      <div className="md:flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(s => !s)} aria-expanded={showFilters} className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow hover:shadow-md transition-shadow bg-white text-base">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#a6a6a6" fillRule="evenodd" d="M5 3h14L8.816 13.184a2.7 2.7 0 0 0-.778-1.086c-.228-.198-.547-.377-1.183-.736l-2.913-1.64c-.949-.533-1.423-.8-1.682-1.23C2 8.061 2 7.541 2 6.503v-.69c0-1.326 0-1.99.44-2.402C2.878 3 3.585 3 5 3" clipRule="evenodd"/>
              <path fill="#a6a6a6" d="M22 6.504v-.69c0-1.326 0-1.99-.44-2.402C21.122 3 20.415 3 19 3L8.815 13.184q.075.193.121.403c.064.285.064.619.064 1.286v2.67c0 .909 0 1.364.252 1.718c.252.355.7.53 1.594.88c1.879.734 2.818 1.101 3.486.683S15 19.452 15 17.542v-2.67c0-.666 0-1 .063-1.285a2.68 2.68 0 0 1 .9-1.49c.227-.197.545-.376 1.182-.735l2.913-1.64c.948-.533 1.423-.8 1.682-1.23c.26-.43.26-.95.26-1.988" opacity="0.5"/>
            </svg>
            select filter
          </button>

          <button
            onClick={() => setEmiEntryOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow hover:shadow-md transition-shadow bg-white text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-0.5 -0.5 24 24" className="w-5 h-5">
              <path fill="#a6a6a6" d="m21.289.98l.59.59c.813.814.69 2.257-.277 3.223L9.435 16.96l-3.942 1.442c-.495.182-.977-.054-1.075-.525a.93.93 0 0 1 .045-.51l1.47-3.976L18.066 1.257c.967-.966 2.41-1.09 3.223-.276zM8.904 2.19a1 1 0 1 1 0 2h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4z"/>
            </svg>
            <span>EMI Entry</span>
          </button>
        </div>

        <div className="w-full max-w-sm py-4">
          <label htmlFor="collection-search" className="sr-only">Search collection</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#a6a6a6" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/>
               </svg>
            </div>
            <input
              id="collection-search"
              type="search"
              name="search"
              placeholder="search user"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-3xl border border-transparent bg-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] shadow-[1px_2px_9px_-4px_rgba(0,_0,_0,_0.7)]"
            />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-2 mb-14 md:mt-0  w-full md:w-fit bg-[#f0f0fa] rounded-lg p-3 shadow flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="#a6a6a6" d="M5.75 7.5a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m1.5.75A.75.75 0 0 1 8 7.5h2.25a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75M5.75 9.5a.75.75 0 0 0 0 1.5H8a.75.75 0 0 0 0-1.5z"/><path fill="#a6a6a6" fill-rule="evenodd" d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1M3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z" clip-rule="evenodd"/></svg>
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[12px] text-gray-500">Select Agent</label>
              <select value={filters.agent} onChange={(e)=> setFilters(f=>({...f, agent: e.target.value}))} className="text-xs border rounded px-2 py-1">
                {agentOptions.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M15 16.69V13h1.5v2.82l2.44 1.41l-.75 1.3zM19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.58-1.58c.14.19.3.36.47.53A7.001 7.001 0 0 0 21 11.1V2zM11.1 11c-.6.57-1.07 1.25-1.43 2H6v-2zm-2.03 4c-.07.33-.07.66-.07 1s0 .67.07 1H6v-2zM18 9H6V7h12zm2.85 7c0 .64-.12 1.27-.35 1.86c-.26.58-.62 1.14-1.07 1.57c-.43.45-.99.81-1.57 1.07c-.59.23-1.22.35-1.86.35c-2.68 0-4.85-2.17-4.85-4.85c0-1.29.51-2.5 1.42-3.43c.93-.91 2.14-1.42 3.43-1.42c2.67 0 4.85 2.17 4.85 4.85"/></svg>
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[12px] text-gray-500">Commentary date</label>
              <input type="date" value={filters.date} onChange={(e)=> setFilters(f=>({...f, date: e.target.value}))} className="text-xs border rounded px-2 py-1" />
            </div>
          </div>

          <div className="ml-auto">
            <button onClick={() => setShowFilters(false)} className="px-3 py-1 text-xs bg-white rounded">Close</button>
          </div>
        </div>
      )}


      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <form className="flex flex-wrap items-center gap-3 bg-[#f3f1ff] rounded-xl px-4 py-3 shadow-sm" onSubmit={handleQuickEntrySubmit}>
          <div className="flex items-center gap-3">
            <label className="flex flex-col leading-tight text-gray-700 text-sm">
              <span className="text-[11px] text-gray-500">Agg No</span>
              <input
                type="text"
                name="aggNo"
                value={quickEntry.aggNo}
                onChange={(e) => setQuickEntry(q => ({ ...q, aggNo: e.target.value }))}
                className="mt-1 w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                placeholder="Agg No"
                autoComplete="off"
              />
            </label>
            <label className="flex flex-col leading-tight text-gray-700 text-sm">
              <span className="text-[11px] text-gray-500">Amount</span>
              <input
                type="number"
                name="amount"
                value={quickEntry.amount}
                onChange={(e) => setQuickEntry(q => ({ ...q, amount: e.target.value }))}
                className="mt-1 w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                placeholder="Amount"
                inputMode="numeric"
              />
            </label>
            <label className="flex flex-col leading-tight text-gray-700 text-sm">
              <span className="text-[11px] text-gray-500">Agent</span>
              <select
                name="agent"
                value={quickEntry.agent}
                onChange={(e) => {
                  const selectedAgent = e.target.value
                  setQuickEntry(q => ({ ...q, agent: selectedAgent }))
                  setFilters(f => ({ ...f, agent: selectedAgent }))
                }}
                className="mt-1 w-28 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#bff86a] capitalize bg-white"
              >
                <option value="" disabled>Select agent</option>
                {agentOptions.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            disabled={savingQuickEntry}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[#5751f5] text-[#5751f5] bg-white hover:bg-[#5751f5] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add quick entry"
          >
            {savingQuickEntry ? (
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5c.552 0 1 .448 1 1v5h5c.552 0 1 .448 1 1s-.448 1-1 1h-5v5c0 .552-.448 1-1 1s-1-.448-1-1v-5H6c-.552 0-1-.448-1-1s.448-1 1-1h5V6c0-.552.448-1 1-1" />
              </svg>
            )}
          </button>
        </form>

        <div className="flex justify-start md:justify-end">
          <button
            onClick={() => openDeleteConfirmModal('reset')}
            disabled={resettingCollection}
            className="flex items-center gap-2 bg-[#ff7a19] text-white font-semibold px-5 py-3 rounded-full shadow hover:shadow-md"
          >
            <span>{resettingCollection ? 'resetting...' : 'reset collection'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M3.578 6.487A8 8 0 1 1 2.5 10.5"/><path d="M7.5 6.5h-4v-4"/></g></svg>
          </button>
        </div>
      </div>


      <div className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-hidden">
        {/* Agent Filter Display */}
        <div className="mb-4 pb-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Agent: </span>
          <span className="text-base font-bold text-black capitalize">{filters.agent || '-'}</span>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto max-w-full">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-gray-100 text-left sticky top-0">
                <th className="py-2 px-2 font-semibold whitespace-nowrap">HA</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">Name</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">Vehicle</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">Phone</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">EMI</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">EMI Date</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">Comm Date</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">Comm Amt</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">Paid Amt</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">Status</th>
                <th className="py-2 px-2 font-semibold whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx} onClick={() => setSelectedRowIndex(idx)} className={`border transition-all cursor-pointer ${
                  selectedRowIndex === idx ? 'border-2 border-orange-600' : 'border border-gray-200'
                } ${
                  row.status === 'pending' ? 'bg-red-100' :
                  row.status === 'paid' ? 'bg-green-50' :
                  row.status === 'mark' ? 'bg-gray-200' :
                  'bg-white'
                }`}>
                  <td className="py-1.5 px-1 font-semibold whitespace-nowrap">{row.ha}</td>
                  <td className="py-1.5 px-1 whitespace-nowrap truncate max-w-[100px] text-[12px]">{row.name}</td>
                  <td className="py-1.5 px-1 whitespace-nowrap text-[12px]">{row.vehicle}</td>
                  <td className="py-1.5 px-1 whitespace-nowrap text-[12px]">{row.phone}</td>
                  <td className="py-1.5 px-1 whitespace-nowrap text-[12px]">{row.emi}</td>
                  <td className="py-1.5 px-1 whitespace-nowrap text-[12px]">{row.emiDate}</td>
                  <td className="py-1.5 px-1">
                    <input
                      type="date"
                      value={row.commAmount}
                      onChange={(e) => handleCellChange(row.collectionEntryId, 'commAmount', e.target.value)}
                      className="w-24 px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#bff86a] bg-white"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={row.commDate}
                      onChange={(e) => handleCellChange(row.collectionEntryId, 'commDate', e.target.value)}
                      className="w-16 px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#bff86a]"
                      placeholder="Amt"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={row.paidAmount}
                      onChange={(e) => handleCellChange(row.collectionEntryId, 'paidAmount', e.target.value)}
                      className="w-16 px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#bff86a]"
                      placeholder="Amt"
                    />
                  </td>
                  <td className="py-1.5 px-1">
                    <select
                      value={row.status}
                      onChange={(e) => handleCellChange(row.collectionEntryId, 'status', e.target.value)}
                      className={`w-20 px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#bff86a] font-medium ${
                        row.status === 'paid' ? 'bg-green-50 text-green-700' : 
                        row.status === 'pending' ? 'bg-red-50 text-red-700' :
                        row.status === 'mark' ? 'bg-gray-200 text-gray-700' :
                        'bg-white text-gray-700'
                      }`}
                    >
                      <option value="none">None</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pend</option>
                      <option value="mark">Mark</option>
                    </select>
                  </td>
                  <td className="py-1.5 px-1">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEmiEntryForm({
                            agreementNo: row.agreementNo,
                            bookNo: '',
                            pageNo: '',
                            amount: row.paidAmount,
                            date: ''
                          })
                          setEmiEntryOpen(true)
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="EMI Entry"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="-0.5 -0.5 24 24" className="w-5 h-5">
                          <path fill="currentColor" d="m21.289.98l.59.59c.813.814.69 2.257-.277 3.223L9.435 16.96l-3.942 1.442c-.495.182-.977-.054-1.075-.525a.93.93 0 0 1 .045-.51l1.47-3.976L18.066 1.257c.967-.966 2.41-1.09 3.223-.276zM8.904 2.19a1 1 0 1 1 0 2h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4z"/>
                        </svg>
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            const response = await apiClient.get(`/api/subadmin/management/finance/${row.id}`)
                            const statement = response?.data?.data
                            if (statement) {
                              setFinanceModal(statement)
                            }
                          } catch (error) {
                            showToast({
                              type: 'error',
                              title: 'Error',
                              message: error?.response?.data?.message || 'Failed to fetch finance statement',
                            })
                          }
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Finance Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="currentColor"/><path fill="currentColor" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>
                      </button>
                      <button
                        onClick={() => handleWhatsAppClick(row.name)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Send WhatsApp message"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                          <path fill="currentColor" d="M8 0a8 8 0 1 1-4.075 14.886L.658 15.974a.5.5 0 0 1-.632-.632l1.089-3.266A8 8 0 0 1 8 0M5.214 4.004a.7.7 0 0 0-.526.266C4.508 4.481 4 4.995 4 6.037c0 1.044.705 2.054.804 2.196c.098.138 1.388 2.28 3.363 3.2q.55.255 1.12.446c.472.16.902.139 1.242.085c.379-.06 1.164-.513 1.329-1.01c.163-.493.163-.918.113-1.007c-.049-.088-.18-.142-.378-.25c-.196-.105-1.165-.618-1.345-.687c-.18-.073-.312-.106-.443.105c-.132.213-.507.691-.623.832c-.113.139-.23.159-.425.053c-.198-.105-.831-.33-1.584-1.054c-.585-.561-.98-1.258-1.094-1.469c-.116-.213-.013-.326.085-.433c.09-.094.198-.246.296-.371c.097-.122.132-.21.198-.353c.064-.141.031-.266-.018-.371s-.443-1.152-.607-1.577c-.16-.413-.323-.355-.443-.363c-.114-.005-.245-.005-.376-.005"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteConfirmModal('row', row)
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete row"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M9 3h6l1 2h4v2h-1v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4V5h4zm0 6v9h2V9zm4 0v9h2V9zM9.618 5h4.764l-.5-1h-3.764z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="block md:hidden space-y-2 w-full">
          {filteredData.map((row, idx) => (
            <div key={idx} onClick={() => setSelectedRowIndex(idx)} className={`rounded-lg p-2 sm:p-3 transition-all cursor-pointer overflow-hidden ${
              selectedRowIndex === idx ? 'border-2 border-orange-600' : 'border border-gray-300'
            } ${
              row.status === 'pending' ? 'bg-red-100' : 
              row.status === 'paid' ? 'bg-green-50' :
              row.status === 'mark' ? 'bg-gray-200' :
              'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold">{row.ha}</div>
                <select
                  value={row.status}
                  onChange={(e) => handleCellChange(row.collectionEntryId, 'status', e.target.value)}
                  className={`px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#bff86a] font-medium ${
                    row.status === 'paid' ? 'bg-green-50 text-green-700' :
                    row.status === 'pending' ? 'bg-red-50 text-red-700' :
                    row.status === 'mark' ? 'bg-gray-200 text-gray-700' :
                    'bg-white text-gray-700'
                  }`}
                >
                  <option value="none">None</option>
                  <option value="paid">✓ Paid</option>
                  <option value="pending">⚠ Seizing</option>
                  <option value="mark">• Mark</option>
                </select>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div><span className="text-[10px] text-gray-400">Name</span><div className="font-medium">{row.name}</div></div>
                <div><span className="text-[10px] text-gray-400">Vehicle</span><div className="font-medium">{row.vehicle}</div></div>
                <div><span className="text-[10px] text-gray-400">Phone</span><div className="font-medium">{row.phone}</div></div>
                <div><span className="text-[10px] text-gray-400">EMI</span><div className="font-medium">{row.emi}</div></div>
                <div>
                  <span className="text-[10px] text-gray-400">Comm Date</span>
                  <input
                    type="date"
                    value={row.commAmount}
                    onChange={(e) => handleCellChange(row.collectionEntryId, 'commAmount', e.target.value)}
                    className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#bff86a] bg-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400">Comm Amount</span>
                  <input
                    type="text"
                    value={row.commDate}
                    onChange={(e) => handleCellChange(row.collectionEntryId, 'commDate', e.target.value)}
                    className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  />
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-gray-400">Paid Amount</span>
                  <input
                    type="text"
                    value={row.paidAmount}
                    onChange={(e) => handleCellChange(row.collectionEntryId, 'paidAmount', e.target.value)}
                    className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  />
                </div>
                <div><span className="text-[10px] text-gray-400">EMI Date</span><div className="font-medium">{row.emiDate}</div></div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEmiEntryForm({
                      agreementNo: row.agreementNo,
                      bookNo: '',
                      pageNo: '',
                      amount: row.paidAmount,
                      date: ''
                    })
                    setEmiEntryOpen(true)
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="EMI Entry"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-0.5 -0.5 24 24" className="w-5 h-5">
                    <path fill="currentColor" d="m21.289.98l.59.59c.813.814.69 2.257-.277 3.223L9.435 16.96l-3.942 1.442c-.495.182-.977-.054-1.075-.525a.93.93 0 0 1 .045-.51l1.47-3.976L18.066 1.257c.967-.966 2.41-1.09 3.223-.276zM8.904 2.19a1 1 0 1 1 0 2h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4z"/>
                  </svg>
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    try {
                      const response = await apiClient.get(`/api/subadmin/management/finance/${row.id}`)
                      const statement = response?.data?.data
                      if (statement) {
                        setFinanceModal(statement)
                      }
                    } catch (error) {
                      showToast({
                        type: 'error',
                        title: 'Error',
                        message: error?.response?.data?.message || 'Failed to fetch finance statement',
                      })
                    }
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Finance Details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="currentColor"/><path fill="currentColor" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>
                </button>
                <button
                  onClick={() => handleWhatsAppClick(row.name)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Send WhatsApp message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M8 0a8 8 0 1 1-4.075 14.886L.658 15.974a.5.5 0 0 1-.632-.632l1.089-3.266A8 8 0 0 1 8 0M5.214 4.004a.7.7 0 0 0-.526.266C4.508 4.481 4 4.995 4 6.037c0 1.044.705 2.054.804 2.196c.098.138 1.388 2.28 3.363 3.2q.55.255 1.12.446c.472.16.902.139 1.242.085c.379-.06 1.164-.513 1.329-1.01c.163-.493.163-.918.113-1.007c-.049-.088-.18-.142-.378-.25c-.196-.105-1.165-.618-1.345-.687c-.18-.073-.312-.106-.443.105c-.132.213-.507.691-.623.832c-.113.139-.23.159-.425.053c-.198-.105-.831-.33-1.584-1.054c-.585-.561-.98-1.258-1.094-1.469c-.116-.213-.013-.326.085-.433c.09-.094.198-.246.296-.371c.097-.122.132-.21.198-.353c.064-.141.031-.266-.018-.371s-.443-1.152-.607-1.577c-.16-.413-.323-.355-.443-.363c-.114-.005-.245-.005-.376-.005"/>
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openDeleteConfirmModal('row', row)
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete row"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 3h6l1 2h4v2h-1v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4V5h4zm0 6v9h2V9zm4 0v9h2V9zM9.618 5h4.764l-.5-1h-3.764z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="mt-6 pt-4 border-t-2 border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-xs text-blue-600 font-semibold mb-1">Total Comm Amount</div>
              <div className="text-2xl font-bold text-blue-700">₹ {totals.totalCommAmount.toLocaleString()}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-xs text-green-600 font-semibold mb-1">Total Paid Amount</div>
              <div className="text-2xl font-bold text-green-700">₹ {totals.totalPaidAmount.toLocaleString()}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="text-xs text-orange-600 font-semibold mb-1">Pending Amount</div>
              <div className="text-2xl font-bold text-orange-700">₹ {totals.pendingAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end items-center gap-3">
          <button className="px-3 py-1 rounded-full bg-gray-100 text-xs">previous</button>
          <div className="text-xs">1</div>
          <button className="px-3 py-1 rounded-full bg-gray-100 text-xs">next</button>
        </div>
      </div>

      {financeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative w-[95%] md:w-4/5 lg:w-3/4 bg-white rounded-3xl p-8 shadow-2xl no-scrollbar max-h-[90vh] overflow-auto">
            <button
              onClick={() => setFinanceModal(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Finance Statement</h2>
            <div className="text-center text-sm text-gray-500 mb-8">Agreement No : {financeModal.agreementNo}</div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border-2 border-gray-300 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">Party Details</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="font-semibold text-gray-900">{financeModal.seller}</div>
                      <div className="text-gray-600">Age : {financeModal.age}</div>
                      <div className="text-gray-600">Phone No: {financeModal.phoneNo}</div>
                      <div className="text-gray-600">Address: {financeModal.address}</div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 flex flex-col items-center">
                      {financeModal.partyPhoto ? (
                        <img src={financeModal.partyPhoto} alt="Party" className="w-28 h-28 rounded-lg object-cover mb-2" />
                      ) : (
                        <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-xs text-gray-500 text-center">Party<br/>Img</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-600 font-semibold">Party</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-gray-300 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">Guarantor Details</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="font-semibold text-gray-900">{financeModal.guarantorName || '-'}</div>
                      <div className="text-gray-600">Age : {financeModal.guarantorAge || '-'}</div>
                      <div className="text-gray-600">Phone No: {financeModal.guarantorPhoneNo || '-'}</div>
                      <div className="text-gray-600">Address: {financeModal.guarantorAddress || '-'}</div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 flex flex-col items-center">
                      {financeModal.guarantorPhoto ? (
                        <img src={financeModal.guarantorPhoto} alt="Guarantor" className="w-28 h-28 rounded-lg object-cover mb-2" />
                      ) : (
                        <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-xs text-gray-500 text-center">Guarantor<br/>Img</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-600 font-semibold">Guarantor</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-blue-300">Vehicle Details</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">VEHICLE NO</div>
                  <div className="text-lg font-bold text-gray-900">{financeModal.vehicle}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">VEHICLE NAME</div>
                  <div className="text-lg font-bold text-gray-900">{financeModal.vehicleName}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">CHASSIS NO</div>
                  <div className="text-sm font-bold text-gray-900">{financeModal.chassisNo}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">MODEL</div>
                  <div className="text-lg font-bold text-gray-900">{financeModal.vehicleModel}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-purple-300">Finance Details</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">VEHICLE PRICE</div>
                  <div className="text-lg font-bold text-gray-900">₹ {toInr(financeModal.vehiclePrice)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">FINANCE AMOUNT</div>
                  <div className="text-lg font-bold text-gray-900">₹ {toInr(financeModal.financeAmount)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">CHARGES & INTEREST</div>
                  <div className="text-lg font-bold text-gray-900">₹ {toInr(financeModal.charges)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-purple-300">
                  <div className="text-xs text-gray-500 font-semibold mb-2">TOTAL AMOUNT</div>
                  <div className="text-lg font-bold text-purple-900">₹ {toInr(financeModal.totalAmount)}</div>
                </div>
              </div>
            </div>

            {financeModal.emiSchedule && financeModal.emiSchedule.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-300">EMI Schedule : ₹ {toInr(financeModal.emi)} x {financeModal.months || financeModal.emiSchedule.length} months</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-left font-semibold">INST.NO</th>
                        <th className="px-4 py-3 text-left font-semibold">INST.DATE</th>
                        <th className="px-4 py-3 text-left font-semibold">INST.AMOUNT</th>
                        <th className="px-4 py-3 text-left font-semibold">PAID DATE</th>
                        <th className="px-4 py-3 text-left font-semibold">PAID AMT.</th>
                        <th className="px-4 py-3 text-left font-semibold">BALANCE</th>
                        <th className="px-4 py-3 text-left font-semibold">RECEIPT NO.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statementRows.map((schedule, idx) => (
                        <tr key={`${schedule.instNo}-${idx}`} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3 font-semibold text-gray-900">{schedule.instNo}</td>
                          <td className="px-4 py-3 text-gray-700">{schedule.instDate}</td>
                          <td className="px-4 py-3 text-gray-700">{schedule.instAmount === '' ? '' : `₹ ${toInr(schedule.instAmount)}`}</td>
                          <td className="px-4 py-3 text-gray-700">{schedule.paidDate}</td>
                          <td className="px-4 py-3 text-gray-700">₹ {toInr(schedule.paidAmt)}</td>
                          <td className={`px-4 py-3 font-semibold ${getBalanceClass(schedule.balance)}`}>
                            {formatBalance(schedule.balance)}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{schedule.receiptNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-gray-100 rounded-xl p-6 flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">TOTAL PAID</div>
                <div className="text-2xl font-bold text-green-600">₹ {toInr(statementTotalPaid)}</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">PENDING AMOUNT</div>
                <div className="text-2xl font-bold text-red-600">₹ {toInr(statementPending)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EMI Entry Modal */}
      {emiEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setEmiEntryOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            {editFieldsPrompt.open && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                <div className="w-full mx-4 max-w-sm bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-gray-900">Edit via Book & Page</div>
                    <button onClick={() => setEditFieldsPrompt({ open: false, bookNo: '', pageNo: '', amount: '', date: '' })} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold">✕</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block text-xs font-semibold text-gray-700">
                      Book No
                      <input
                        type="text"
                        value={editFieldsPrompt.bookNo}
                        onChange={(e) => setEditFieldsPrompt(prev => ({ ...prev, bookNo: e.target.value }))}
                        className="mt-1 w-full rounded-lg border px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] border-gray-300"
                        placeholder="e.g. 12"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-gray-700">
                      Page No
                      <input
                        type="text"
                        value={editFieldsPrompt.pageNo}
                        onChange={(e) => setEditFieldsPrompt(prev => ({ ...prev, pageNo: e.target.value }))}
                        className="mt-1 w-full rounded-lg border px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] border-gray-300"
                        placeholder="e.g. 45"
                      />
                    </label>
                  </div>
                  <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] font-medium text-gray-700">Name</div>
                        <div className="text-xs font-semibold text-gray-900">{lookupByBookPage(editFieldsPrompt.bookNo, editFieldsPrompt.pageNo)?.name || '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-gray-700">Vehicle No</div>
                        <div className="text-xs font-semibold text-gray-900">{lookupByBookPage(editFieldsPrompt.bookNo, editFieldsPrompt.pageNo)?.vehicle || '—'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block text-xs font-semibold text-gray-700">
                      Amount
                      <input
                        type="number"
                        value={editFieldsPrompt.amount}
                        onChange={(e) => setEditFieldsPrompt(prev => ({ ...prev, amount: e.target.value }))}
                        className="mt-1 w-full rounded-lg border px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] border-gray-300"
                        placeholder="Enter amount"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-gray-700">
                      Date
                      <input
                        type="date"
                        value={editFieldsPrompt.date}
                        onChange={(e) => setEditFieldsPrompt(prev => ({ ...prev, date: e.target.value }))}
                        className="mt-1 w-full rounded-lg border px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] border-gray-300"
                      />
                    </label>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button onClick={() => setEditFieldsPrompt({ open: false, bookNo: '', pageNo: '', amount: '', date: '' })} className="px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-100">Cancel</button>
                    <button
                      onClick={() => {
                        setEmiEntryForm(prev => ({
                          ...prev,
                          bookNo: editFieldsPrompt.bookNo,
                          pageNo: editFieldsPrompt.pageNo,
                          amount: editFieldsPrompt.amount,
                          date: editFieldsPrompt.date
                        }))
                        setEditFieldsPrompt({ open: false, bookNo: '', pageNo: '', amount: '', date: '' })
                        setTimeout(() => { if (bookInputRef.current) bookInputRef.current.focus() }, 0)
                      }}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] text-[11px] font-semibold text-gray-900 shadow hover:shadow-md"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-start gap-3 pr-12 mb-4">
              <h3 className="text-xl font-bold text-gray-900">EMI Entry</h3>
              <button
                type="button"
                onClick={() => {
                  const { amount, date } = getDerivedEmiDefaults()
                  setEditFieldsPrompt({
                    open: true,
                    bookNo: emiEntryForm.bookNo || '',
                    pageNo: emiEntryForm.pageNo || '',
                    amount: (emiEntryForm.amount || amount || '').toString(),
                    date: emiEntryForm.date || date || ''
                  })
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-100"
              >
                Edit fields
              </button>
            </div>

            {/* Removed Current entry preview per request */}

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">
                Date
                <input
                  type="date"
                  value={emiEntryForm.date}
                  onChange={(e) => handleEmiEntryChange('date', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Enter date"
                />
              </label>

              <label className="block text-xs font-semibold text-gray-700">
                Agreement No
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={emiEntryForm.agreementNo}
                    onChange={(e) => handleEmiEntryChange('agreementNo', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="HA123"
                    autoComplete="off"
                  />
                  {filteredAgreements.length > 0 && !selectedAgreement && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-auto">
                      {filteredAgreements.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEmiEntryForm(prev => ({ ...prev, agreementNo: item.agreementNo }))}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100"
                        >
                          <div className="font-semibold text-gray-800 text-xs">{item.agreementNo}</div>
                          <div className="text-[11px] text-gray-600">{item.seller}</div>
                          <div className="text-[10px] text-gray-500">{item.vehicle}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              {selectedAgreement && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="text-[11px] font-medium text-gray-600">Name</label>
                        <div className="text-xs font-semibold text-gray-900 mt-1">{selectedAgreement.seller}</div>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-gray-600">Vehicle No</label>
                        <div className="text-xs font-semibold text-gray-900 mt-1">{selectedAgreement.vehicle}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmiEntryForm(prev => ({ ...prev, agreementNo: '' }))}
                      className="ml-3 px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-gray-700">
                  Book No
                  <input
                    type="text"
                    value={emiEntryForm.bookNo}
                    onChange={(e) => handleEmiEntryChange('bookNo', e.target.value)}
                    ref={bookInputRef}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Enter book no"
                  />
                </label>
                <label className="block text-xs font-semibold text-gray-700">
                  Page No
                  <input
                    type="text"
                    value={emiEntryForm.pageNo}
                    onChange={(e) => handleEmiEntryChange('pageNo', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Enter page no"
                  />
                </label>
              </div>

              {hasDuplicateBookPageConflict && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  Book No {emiEntryForm.bookNo} and Page No {emiEntryForm.pageNo} already exist with Agreement No {duplicateBookPageEntry.agreementNo} ({duplicateBookPageEntry.name || duplicateBookPageEntry.seller || 'Unknown'}).
                </div>
              )}

              <label className="block text-xs font-semibold text-gray-700">
                Amount
                <input
                  type="number"
                  value={emiEntryForm.amount}
                  onChange={(e) => handleEmiEntryChange('amount', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Enter amount"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEmiEntryOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEmiEntrySave}
                disabled={savingEntry}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] text-sm font-semibold text-gray-900 shadow hover:shadow-md"
              >
                {savingEntry ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Confirmation Modal */}
      {confirmDeleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl">
            <div className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</div>
            <p className="text-sm text-gray-600 mb-5">
              {confirmDeleteModal.type === 'reset'
                ? 'This will delete all collection data for every agent from database. Do you want to continue?'
                : `Delete Agreement No ${confirmDeleteModal.row?.agreementNo || ''}?`}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeDeleteConfirmModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteModal}
                disabled={resettingCollection}
                className="px-4 py-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {resettingCollection && confirmDeleteModal.type === 'reset' ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <WhatsAppConfirmModal
        isOpen={whatsAppModal.isOpen}
        onClose={() => setWhatsAppModal({ isOpen: false, userName: '' })}
        onConfirm={handleWhatsAppConfirm}
        userName={whatsAppModal.userName}
      />
    </div>
  )
}

export default Collection

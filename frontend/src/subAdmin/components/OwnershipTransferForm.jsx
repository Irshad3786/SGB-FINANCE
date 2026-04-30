import React, { useState } from 'react';
import apiClient from '../../api/axios';
import { useToast } from '../../components/ToastProvider';

function OwnershipTransferForm({ onSubmitSuccess, initialData = null }) {
  const baseInput = "w-full pl-10 px-3 py-2 rounded-xl border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] pr-4 text-sm";
  const baseLabel = "text-sm text-[#27563C] font-semibold";
  
  const { showToast } = useToast();
  
  const [form, setForm] = useState(initialData || {
    name: '',
    phoneNo: '',
    vehicleNumber: '',
    chassisNumber: '',
    paidAmount: '',
       status: 'ekyc',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNo') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setForm(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    if (name === 'vehicleNumber') {
      setForm(prev => ({ ...prev, [name]: value.slice(0, 15) }));
      return;
    }

    if (name === 'chassisNumber') {
      setForm(prev => ({ ...prev, [name]: value.slice(0, 25) }));
      return;
    }

    if (name === 'paidAmount') {
      const numberOnly = value.replace(/\D/g, '');
      setForm(prev => ({ ...prev, [name]: numberOnly }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.phoneNo || !form.vehicleNumber || !form.chassisNumber || !form.paidAmount) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill all required fields'
      });
      return;
    }

    if (form.phoneNo.length !== 10) {
      showToast({
        type: 'error',
        title: 'Invalid Phone',
        message: 'Phone number must be exactly 10 digits'
      });
      return;
    }

    try {
      setLoading(true);
      const endpoint = initialData?._id 
        ? `/api/subadmin/management/ownership-transfer/update/${initialData._id}`
        : '/api/subadmin/management/ownership-transfer/create';
      
      const method = initialData?._id ? 'put' : 'post';
      
      const response = await apiClient[method](endpoint, form);
      
      showToast({
        type: 'success',
        title: 'Success',
        message: response.data?.message || 'Ownership transfer saved successfully'
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
      
      if (!initialData?._id) {
        setForm({
          name: '',
          phoneNo: '',
          vehicleNumber: '',
          chassisNumber: '',
          paidAmount: '',
          status: 'pending',
          notes: ''
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to save ownership transfer'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full bg-[#E0FCED] rounded-2xl p-6 sm:p-8 space-y-4">
      <div className="flex items-center gap-3 pb-2 border-b">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path fill="#a6a6a6" d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 2a5 5 0 1 0 0 10A5 5 0 0 0 8 3z"/>
          </svg>
        </span>
        <div>
          <p className="text-base font-semibold text-gray-900">Ownership Transfer</p>
          <p className="text-xs text-gray-500">Add ownership transfer details</p>
        </div>
      </div>

      <div>
        <label className={baseLabel}>Full Name *</label>
        <div className="relative">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Enter full name"
            className={baseInput}
            required
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#a6a6a6" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className={baseLabel}>Phone No *</label>
        <div className="relative">
            <input
              name="phoneNo"
              type="text"
              value={form.phoneNo}
              onChange={onChange}
              placeholder="Enter phone number"
              className={baseInput + ' pl-12'}
              required
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd"/><path fill="currentColor" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity=".6"/></svg>
            </div>
        </div>
      </div>

      <div>
        <label className={baseLabel}>Vehicle Number *</label>
        <div className="relative">
          <input
            name="vehicleNumber"
            type="text"
            value={form.vehicleNumber}
            onChange={onChange}
            placeholder="Enter vehicle number"
            className={baseInput + ' pl-12'}
            required
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="24" viewBox="0 0 17 24"><path fill="currentColor" d="M8.632 15.526a2.11 2.11 0 0 0-2.106 2.105v4.305a2.106 2.106 0 0 0 4.212 0v-.043v.002v-4.263a2.11 2.11 0 0 0-2.104-2.106z"/><path fill="currentColor" d="M16.263 2.631H12.21C11.719 1.094 10.303 0 8.631 0S5.544 1.094 5.06 2.604l-.007.027h-4a1.053 1.053 0 0 0 0 2.106h4.053c.268.899.85 1.635 1.615 2.096l.016.009c-2.871.867-4.929 3.48-4.947 6.577v5.528a1.753 1.753 0 0 0 1.736 1.737h1.422v-3a3.737 3.737 0 1 1 7.474 0v3h1.421a1.75 1.75 0 0 0 1.738-1.737v-5.474a6.855 6.855 0 0 0-4.899-6.567l-.048-.012a3.65 3.65 0 0 0 1.625-2.08l.007-.026h4.053a1.056 1.056 0 0 0 1.053-1.053a1.15 1.15 0 0 0-1.104-1.105h-.002zM8.631 5.84a2.106 2.106 0 1 1 2.106-2.106l.001.06c0 1.13-.916 2.046-2.046 2.046l-.063-.001h.003z"/></svg>
          </div>
        </div>
      </div>

      <div>
        <label className={baseLabel}>Chassis Number *</label>
        <div className="relative">
          <input
            name="chassisNumber"
            type="text"
            value={form.chassisNumber}
            onChange={onChange}
            placeholder="Enter chassis number"
            className={baseInput + ' pl-12'}
            required
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M14.975 3.5a1.25 1.25 0 0 0-2.45-.5L11.2 9.5H5.25a1.25 1.25 0 1 0 0 2.5h5.439L9.26 19H4.25a1.25 1.25 0 0 0 0 2.5h4.5l-1.225 6a1.25 1.25 0 1 0 2.45.5l1.327-6.5h6.948l-1.224 6a1.25 1.25 0 1 0 2.449.5l1.326-6.5h5.949a1.25 1.25 0 1 0 0-2.5h-5.438l1.428-7h5.01a1.25 1.25 0 1 0 0-2.5h-4.5l1.225-6a1.25 1.25 0 0 0-2.45-.5L20.7 9.5h-6.95zM18.76 19h-6.948l1.428-7h6.949z"/></svg>
          </div>
        </div>
      </div>

      <div>
        <label className={baseLabel}>Paid Amount *</label>
        <div className="relative">
          <input
            name="paidAmount"
            type="text"
            value={form.paidAmount}
            onChange={onChange}
            placeholder="Enter amount paid"
            className={baseInput + ' pl-12'}
            required
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M4 6.8V8H2.8A1.8 1.8 0 0 0 1 9.8v8.4A1.8 1.8 0 0 0 2.8 20h16.4a1.8 1.8 0 0 0 1.8-1.8V17h1.2c.992 0 1.8-.808 1.8-1.8V6.8c0-.992-.808-1.8-1.8-1.8H5.8C4.808 5 4 5.808 4 6.8M6 7v1h13.2A1.8 1.8 0 0 1 21 9.8V15h1V7zm3 7a2 2 0 1 1 4 0a2 2 0 0 1-4 0" clipRule="evenodd"/></svg>
          </div>
        </div>
      </div>

      <div>
        <label className={baseLabel}>Status</label>
        <div className="relative">
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className={baseInput}
          >
            <option value="ekyc">E-KYC</option>
            <option value="token">Token</option>
            <option value="challan">Challan</option>
            <option value="finance approval">Finance Approval</option>
            <option value="rto approval">RTO Approval</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className={baseLabel}>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={onChange}
          placeholder="Add any additional notes"
          className={baseInput + " resize-none h-20"}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow disabled:opacity-50"
      >
        {loading ? 'Saving...' : (initialData?._id ? 'Update Transfer' : 'Add Transfer')}
      </button>
    </form>
  );
}

export default OwnershipTransferForm;

import React, { forwardRef } from 'react'
import Logo from '../../home/components/Logo'

const formatMoney = (value) => {
  const amount = Number(value)
  if (Number.isNaN(amount) || value === '-') return '-'
  return amount.toLocaleString('en-IN')
}

const PrintInvoice = forwardRef(function PrintInvoice({ invoice }, ref) {
  if (!invoice) return null

  const hasFinance = invoice.mode === 'buyer' || invoice.mode === 'refinance'

  return (
    <div
      ref={ref}
      style={{
        maxWidth: '820px',
        margin: '0 auto',
        background: '#ffffff',
        padding: '28px',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        color: '#0f172a',
        border: '1px solid #dbe2ea',
        borderRadius: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', borderBottom: '2px solid #cbd5e1', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div>
            <Logo />
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>Vehicle Finance, Refinance, Sell and Buy Services</div>
            <div style={{ fontSize: '12px', color: '#475569' }}>Opp Hero Showroom, Shanthi Theater Road, Chirala, Andhra Pradesh - 523155</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '26px', fontWeight: 700 }}>INVOICE</div>
          <div style={{ fontSize: '12px', color: '#334155' }}>Type: {invoice.typeLabel || '-'}</div>
          <div style={{ fontSize: '12px', color: '#334155' }}>No: {invoice.invoiceNo || '-'}</div>
          <div style={{ fontSize: '12px', color: '#334155' }}>Date: {invoice.date || '-'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px' }}>
        <div style={{ border: '1px solid #d1d5db', borderRadius: '10px', padding: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>BILLED TO</div>
          <div style={{ fontSize: '14px', lineHeight: 1.7 }}>
            <div><strong>Name:</strong> {invoice.fullName || '-'}</div>
            <div><strong>S/O C/O W/O:</strong> {invoice.soWoCo || '-'}</div>
            <div><strong>Phone:</strong> {invoice.phone || '-'}</div>
            <div><strong>Aadhaar:</strong> {invoice.aadhaar || '-'}</div>
            <div><strong>Address:</strong> {invoice.address || '-'}</div>
            <div><strong>District/Mandal:</strong> {invoice.district || '-'} / {invoice.mandal || '-'}</div>
          </div>
        </div>

        <div style={{ border: '1px solid #d1d5db', borderRadius: '10px', padding: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>VEHICLE DETAILS</div>
          <div style={{ fontSize: '14px', lineHeight: 1.7 }}>
            <div><strong>Vehicle:</strong> {invoice.vehicleName || '-'}</div>
            <div><strong>Vehicle No:</strong> {invoice.vehicleNo || '-'}</div>
            <div><strong>Model:</strong> {invoice.model || '-'}</div>
            <div><strong>Chassis No:</strong> {invoice.chassisNo || '-'}</div>
            {hasFinance && invoice.agreementNo && invoice.agreementNo !== '-' && (
              <div><strong>Agreement No:</strong> {invoice.agreementNo}</div>
            )}
          </div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ background: '#0f172a', color: '#ffffff' }}>
            <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px' }}>DESCRIPTION</th>
            <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px' }}>VALUE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>Sale Amount</td>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>Rs. {formatMoney(invoice.saleAmount)}</td>
          </tr>
          {hasFinance && (
            <>
              <tr>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>Finance Amount</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>Rs. {formatMoney(invoice.financeAmount)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>EMI (Amount x Months)</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>
                  Rs. {formatMoney(invoice.emiAmount)} x {invoice.emiMonths || '-'}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>EMI Date</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>{invoice.emiDate || '-'}</td>
              </tr>
            </>
          )}
          {invoice.mode === 'buyer' && invoice.pendingAmount && invoice.pendingAmount !== '-' && (
            <>
              <tr>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>Pending Amount</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>Rs. {formatMoney(invoice.pendingAmount)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>Pending Date</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', fontSize: '13px' }}>{invoice.pendingDate || '-'}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {invoice.mode === 'buyer' && (
        <div style={{ marginTop: '18px', border: '1px solid #d1d5db', borderRadius: '10px', padding: '12px', background: '#f8fafc' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>BUYER AGREEMENT DESCRIPTION</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Telugu</div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            ఈరోజు నుండి నేను కొనిన ఈ పాత వాహనమునకు సంబంధించిన పూర్తి R.T.O. కాగితాలు ముట్టినవి. ఈరోజు నుండి ఈ వాహనమునకు సంబంధించిన అన్ని రిపేరులు మరియు ఖర్చులు పూర్తిగా నాకు సంబంధించినవి.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            నేను, నా మెకానిక్ సమక్షంలో నా ఇష్టముగా వాహనము కొనుగోలు చేసుకొనుచున్నాను.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            వాహనము R.C. బుక్ను 15 రోజులలోపు నా పేరుపై మార్చుకొనగలవాడను.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            ఇది నా సమ్మతమున వ్రాసి ఇచ్చిన అగ్రిమెంట్ పత్రము.
          </p>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginTop: '10px', marginBottom: '6px' }}>English</div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            From today onwards, I have received all the R.T.O. documents related to this second-hand vehicle. From today onwards, all repairs, maintenance, and expenses related to this vehicle shall be my sole responsibility.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            I am purchasing this vehicle of my own free will, in the presence of my mechanic, after proper inspection.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            I agree to transfer the R.C. book of this vehicle into my name within 15 days.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            This agreement letter is written and given with my full consent.
          </p>
        </div>
      )}

      {invoice.mode === 'seller' && (
        <div style={{ marginTop: '18px', border: '1px solid #d1d5db', borderRadius: '10px', padding: '12px', background: '#f8fafc' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>SELLER AGREEMENT DESCRIPTION</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Telugu</div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            ఈరోజు నుండి నేను అమ్మిన ఈ పాత వాహనమును పూర్తిగా కొనుగోలుదారునికి అప్పగించినాను. ఈ వాహనమునకు సంబంధించిన అన్ని R.T.O. కాగితాలు, రిజిస్ట్రేషన్ పత్రాలు కొనుగోలుదారునికి అందజేసినాను. ఈరోజు నుండి ఈ వాహనమునకు సంబంధించిన అన్ని రిపేర్లు, నిర్వహణ, ఖర్చులు పూర్తిగా కొనుగోలుదారునికే సంబంధించినవి.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            ఈ వాహనమును కొనుగోలుదారు తన ఇష్టముతో, తన మెకానిక్ సమక్షంలో పరిశీలించి కొనుగోలు చేసుకొన్నాడు. ఇకపై ఈ వాహనమునకు సంబంధించిన ఎటువంటి బాధ్యతలు నాకు ఉండవు.
          </p>
          
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            ఇది నా సమ్మతితో వ్రాసి ఇచ్చిన అగ్రిమెంట్ పత్రము.
          </p>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginTop: '10px', marginBottom: '6px' }}>English</div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            From today onwards, I have handed over the said second-hand vehicle completely to the buyer. I have provided all R.T.O. documents and registration papers related to the vehicle to the buyer. From today onwards, all repairs, maintenance, and expenses related to the vehicle shall be the sole responsibility of the buyer.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            The buyer has inspected the vehicle in the presence of their mechanic and has purchased it of their own free will. From now on, I shall have no responsibility whatsoever regarding this vehicle.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.8, color: '#0f172a' }}>
            This agreement letter is written and given with my full consent.
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
        <div style={{ fontSize: '12px', color: '#475569' }}>
          <div>Thank you for choosing SGB Finance.</div>
          <div>This is a system-generated invoice.</div>
          <div style={{ marginTop: '6px', fontWeight: 700, color: '#b91c1c' }}>
            Note: Rs. 300/- charges should be paid as office fee.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '40px', fontSize: '12px', color: '#334155', alignItems: 'flex-end' }}>
          <div style={{ borderTop: '1px solid #475569', paddingTop: '6px' }}>Receiver Signature</div>
          <div style={{ borderTop: '1px solid #475569', paddingTop: '6px' }}>Authorized Signature</div>
        </div>
      </div>
    </div>
  )
})

export default PrintInvoice

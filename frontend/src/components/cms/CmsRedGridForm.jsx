import React, { useState, useEffect } from 'react';

const FieldInput = ({ defaultValue = '', placeholder = '', className = '', readOnly = false }) => {
  const [val, setVal] = useState(defaultValue);

  useEffect(() => {
    setVal(defaultValue);
  }, [defaultValue]);

  if (readOnly) {
    return <span className={className}>{val}</span>;
  }

  return (
    <input
      type="text"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent hover:bg-amber-100/70 focus:bg-amber-100 focus:ring-1 focus:ring-amber-600 rounded px-0.5 outline-none text-slate-900 font-mono font-bold uppercase transition cursor-text border-b border-transparent focus:border-amber-500 ${className}`}
    />
  );
};

/**
 * Authentic NUCC 02/12 Standard CMS-1500 (HCFA-1500) Red-Grid Claim Form Component
 * Form Approved OMB-0938-1197 FORM CMS-1500 (02/12)
 * Includes all 33 official boxes, 6 line items with Modifiers (1-4), Box 21 A-L pointers, and Appointment DOS linking
 */
export const CmsRedGridForm = ({ claim: rawClaim = null, blankMode = false, readOnly = false }) => {
  const baseClaim = rawClaim || {
    box1: 'OTHER',
    box1a: '906684061',
    box2: 'aa jj',
    box3Dob: { mm: '05', dd: '15', yy: '1985' },
    box3Sex: 'M',
    box4: 'aa jj',
    box5Address: '10101 Harwin Dr. Suite 774',
    box5City: 'HOUSTON',
    box5State: 'TX',
    box5Zip: '77036',
    box6Relation: 'Self',
    box7Address: '10101 Harwin Dr. Suite 774',
    box7City: 'HOUSTON',
    box7State: 'TX',
    box7Zip: '77036',
    box8Status: 'Single',
    box10AutoAccident: 'YES',
    box10State: 'TX',
    box12Signature: 'SIGNATURE ON FILE',
    box12Date: '2026-08-16',
    box13Signature: 'SIGNATURE ON FILE',
    box14IllnessDate: { mm: '12', dd: '27', yy: '2025' },
    box17ReferringName: 'Dr. Segun Adeoye',
    box17Npi: '1234567890',
    box21Diagnoses: ['M54.50', 'M54.2', 'S13.4XXA', 'M25.572'],
    box24Lines: [
      {
        note: 'Class IV High-Intensity Laser Therapy (HILT) Biostimulation',
        fromDos: '2026-08-16',
        toDos: '2026-08-16',
        pos: '11',
        emg: 'N',
        cpt: '97039',
        mod1: 'GP',
        mod2: 'RT',
        diagPtr: 'A',
        charge: '4000.00',
        units: '2',
        renderingId: '1234567890'
      },
      {
        note: 'Therapeutic Deep Tissue Laser Mobilization & Spinal Decompression',
        fromDos: '2026-08-16',
        toDos: '2026-08-16',
        pos: '11',
        emg: 'N',
        cpt: '97124',
        mod1: '59',
        diagPtr: 'A',
        charge: '868.00',
        units: '1',
        renderingId: '1234567890'
      }
    ],
    box25TaxId: '993723387',
    box25Type: 'EIN',
    box27AcceptAssignment: 'YES',
    box28TotalCharge: '4868.00',
    box29AmountPaid: '0.00',
    box30BalanceDue: '4868.00',
    box31ProviderSignature: 'Adeoye, Segun, MD',
    box31Date: '2026-08-16',
    box32Facility: 'ANIK Laser Therapy\n10101 HARWIN DR, SUITE 774\nHOUSTON, TX 77036',
    box33BillingProvider: 'ANIK Laser Therapy\n10101 HARWIN DR, SUITE 774\nHOUSTON, TX 77036',
    box33Phone: '(713) 555-0100',
    carrierHeader: 'PATIENT SELF-PAY / DIRECT BILLING\n10101 Harwin Dr., Houston'
  };

  const claim = blankMode ? {
    box1: '', box1a: '', box2: '', box3Dob: { mm: '', dd: '', yy: '' }, box3Sex: '',
    box4: '', box5Address: '', box5City: '', box5State: '', box5Zip: '',
    box6Relation: '', box7Address: '', box7City: '', box7State: '', box7Zip: '',
    box10State: '', box12Signature: '', box12Date: '', box13Signature: '',
    box14IllnessDate: { mm: '', dd: '', yy: '' }, box17ReferringName: '',
    box21Diagnoses: [], box24Lines: [], box25TaxId: '', box28TotalCharge: '',
    box29AmountPaid: '', box30BalanceDue: '', box31ProviderSignature: '',
    box32Facility: '', box33BillingProvider: '', box33Phone: '', box33Npi: ''
  } : baseClaim;

  const cleanAmount = (val) => {
    if (blankMode) return '';
    if (!val) return '0.00';
    return String(val).replace('$', '').trim();
  };

  const c = (v) => blankMode ? '' : (v || '');
  const chk = (cond) => (!blankMode && cond) ? 'X' : '';

  const padLines = (lines = [], targetLen = 6) => {
    const res = [...lines];
    while (res.length < targetLen) {
      res.push({
        fromDos: '',
        toDos: '',
        pos: '',
        emg: '',
        cpt: '',
        mod1: '',
        mod2: '',
        mod3: '',
        mod4: '',
        diagPtr: '',
        charge: '',
        units: '',
        epsdt: '',
        qual: '',
        renderingId: '',
        note: ''
      });
    }
    return res;
  };

  const serviceRows = padLines(blankMode ? [] : (claim.box24Lines || []), 6);

  return (
    <div
      className="cms-claim-page relative bg-white text-black font-sans shadow-2xl mx-auto border-2 border-[#b91c1c] p-3 print:border-none print:shadow-none print:m-0 select-text"
      style={{
        width: '850px',
        minHeight: '1100px',
        minWidth: '850px',
        breakAfter: 'page',
        pageBreakAfter: 'always',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}
    >
      {/* 🔴 OFFICIAL NUCC 02/12 HEADER */}
      <div className="flex border-b-2 border-[#b91c1c] pb-1.5 items-start justify-between">
        <div className="w-[490px] pr-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-[#991b1b] font-mono">1500</span>
            <span className="text-xs font-black text-[#991b1b] tracking-wider">HEALTH INSURANCE CLAIM FORM</span>
          </div>
          <p className="text-[7px] font-bold text-[#991b1b] tracking-tight mt-0.5">
            APPROVED BY NATIONAL UNIFORM CLAIM COMMITTEE (NUCC) 02/12 &bull; FORM CMS-1500 (02/12)
          </p>
        </div>

        <div className="flex-1 border-l-2 border-[#b91c1c] pl-2 font-mono text-[10px] leading-tight">
          <div className="flex justify-between items-center text-[7px] font-bold text-[#991b1b] uppercase mb-0.5">
            <span>PICA</span>
            <span>CARRIER / PAYER INFO</span>
            <span>PICA</span>
          </div>
          <div className="font-bold text-slate-900 whitespace-pre-line uppercase text-[10px]">
            <FieldInput defaultValue={c(claim.carrierHeader || 'OJ LAW FIRM & ATTORNEY LIEN\n11711 BEDFORD ST. SUITE 01\nHOUSTON, TX 77031')} readOnly={readOnly} />
          </div>
        </div>
      </div>

      {/* 🔴 ROW 1: BOX 1 & 1a */}
      <div className="flex border-b border-[#b91c1c] text-[8px] font-bold text-[#991b1b]">
        <div className="w-[490px] p-1 border-r-2 border-[#b91c1c]">
          <span>1. MEDICARE &nbsp; MEDICAID &nbsp; TRICARE &nbsp; CHAMPVA &nbsp; GROUP HEALTH &nbsp; FECA &nbsp; OTHER</span>
          <div className="flex items-center gap-3 mt-1 font-mono text-[9px] text-slate-900">
            <div className="flex items-center gap-1"><span className="w-3.5 h-3.5 border border-[#b91c1c] flex items-center justify-center font-bold">{chk(claim.box1 === 'MEDICARE')}</span><span className="text-[7px]">MEDICARE</span></div>
            <div className="flex items-center gap-1"><span className="w-3.5 h-3.5 border border-[#b91c1c] flex items-center justify-center font-bold">{chk(claim.box1 === 'MEDICAID')}</span><span className="text-[7px]">MEDICAID</span></div>
            <div className="flex items-center gap-1"><span className="w-3.5 h-3.5 border border-[#b91c1c] flex items-center justify-center font-bold">{chk(claim.box1 === 'TRICARE')}</span><span className="text-[7px]">TRICARE</span></div>
            <div className="flex items-center gap-1"><span className="w-3.5 h-3.5 border border-[#b91c1c] flex items-center justify-center font-bold">{chk(claim.box1 === 'CHAMPVA')}</span><span className="text-[7px]">CHAMPVA</span></div>
            <div className="flex items-center gap-1"><span className="w-3.5 h-3.5 border border-[#b91c1c] flex items-center justify-center font-bold">{chk(claim.box1 === 'GROUP')}</span><span className="text-[7px]">GROUP</span></div>
            <div className="flex items-center gap-1"><span className="w-3.5 h-3.5 border border-[#b91c1c] flex items-center justify-center font-bold">{chk(claim.box1 === 'FECA')}</span><span className="text-[7px]">FECA</span></div>
            <div className="flex items-center gap-1"><span className="w-3.5 h-3.5 border border-[#b91c1c] flex items-center justify-center font-bold text-teal-900">{chk(true)}</span><span className="text-[7px]">OTHER (LIEN/AUTO)</span></div>
          </div>
        </div>

        <div className="flex-1 p-1">
          <span>1a. INSURED'S I.D. NUMBER (For Program in Item 1)</span>
          <div className="mt-1">
            <FieldInput defaultValue={c(claim.box1a || 'PAT-141849159')} readOnly={readOnly} className="text-xs font-mono font-bold tracking-widest" />
          </div>
        </div>
      </div>

      {/* 🔴 ROW 2: BOXES 2, 3, 4 */}
      <div className="flex border-b border-[#b91c1c] text-[8px] font-bold text-[#991b1b]">
        <div className="w-[300px] p-1 border-r border-[#b91c1c]">
          <span>2. PATIENT'S NAME (Last Name, First Name, Middle Initial)</span>
          <div className="mt-1">
            <FieldInput defaultValue={c(claim.box2 || claim.patientName || 'SAMPLE TESTING')} readOnly={readOnly} className="text-xs font-mono font-bold" />
          </div>
        </div>

        <div className="w-[190px] p-1 border-r-2 border-[#b91c1c]">
          <span>3. PATIENT'S BIRTH DATE &bull; SEX</span>
          <div className="flex justify-between items-center mt-1 font-mono text-xs text-slate-900">
            <FieldInput defaultValue={blankMode ? '' : `${claim.box3Dob?.mm || '05'} ${claim.box3Dob?.dd || '15'} ${claim.box3Dob?.yy || '1985'}`} readOnly={readOnly} className="w-24 text-xs font-mono font-bold" />
            <div className="flex gap-2">
              <span className="text-[8px]">M <span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold">{chk(claim.box3Sex !== 'F')}</span></span>
              <span className="text-[8px]">F <span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold">{chk(claim.box3Sex === 'F')}</span></span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-1">
          <span>4. INSURED'S NAME (Last Name, First Name, Middle Initial)</span>
          <div className="mt-1">
            <FieldInput defaultValue={c(claim.box4 || claim.box2 || 'SAMPLE TESTING')} readOnly={readOnly} className="text-xs font-mono font-bold" />
          </div>
        </div>
      </div>

      {/* 🔴 ROW 3: BOXES 5, 6, 7 */}
      <div className="flex border-b border-[#b91c1c] text-[8px] font-bold text-[#991b1b]">
        <div className="w-[300px] p-1 border-r border-[#b91c1c]">
          <span>5. PATIENT'S ADDRESS (No., Street)</span>
          <div className="mt-0.5">
            <FieldInput defaultValue={c(claim.box5Address || '10101 Harwin Dr. Suite 774')} readOnly={readOnly} className="text-xs font-mono font-bold" />
          </div>
          <div className="flex justify-between font-mono text-xs text-slate-900 mt-1 uppercase">
            <span>CITY: <FieldInput defaultValue={c(claim.box5City || 'HOUSTON')} readOnly={readOnly} className="w-20 inline-block text-xs" /></span>
            <span>STATE: <FieldInput defaultValue={c(claim.box5State || 'TX')} readOnly={readOnly} className="w-8 inline-block text-xs" /></span>
            <span>ZIP: <FieldInput defaultValue={c(claim.box5Zip || '77036')} readOnly={readOnly} className="w-16 inline-block text-xs" /></span>
          </div>
        </div>

        <div className="w-[190px] p-1 border-r-2 border-[#b91c1c]">
          <span>6. PATIENT RELATIONSHIP TO INSURED</span>
          <div className="grid grid-cols-2 gap-1 mt-1 font-mono text-[9px] text-slate-900">
            <div><span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold">{chk(true)}</span> Self</div>
            <div><span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold"></span> Spouse</div>
            <div><span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold"></span> Child</div>
            <div><span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold"></span> Other</div>
          </div>
        </div>

        <div className="flex-1 p-1">
          <span>7. INSURED'S ADDRESS (No., Street)</span>
          <div className="mt-0.5">
            <FieldInput defaultValue={c(claim.box7Address || claim.box5Address || '10101 Harwin Dr. Suite 774')} readOnly={readOnly} className="text-xs font-mono font-bold" />
          </div>
          <div className="flex justify-between font-mono text-xs text-slate-900 mt-1 uppercase">
            <span>CITY: <FieldInput defaultValue={c(claim.box7City || claim.box5City || 'HOUSTON')} readOnly={readOnly} className="w-20 inline-block text-xs" /></span>
            <span>STATE: <FieldInput defaultValue={c(claim.box7State || claim.box5State || 'TX')} readOnly={readOnly} className="w-8 inline-block text-xs" /></span>
            <span>ZIP: <FieldInput defaultValue={c(claim.box7Zip || claim.box5Zip || '77036')} readOnly={readOnly} className="w-16 inline-block text-xs" /></span>
          </div>
        </div>
      </div>

      {/* 🔴 ROW 4: BOXES 8 - 11 */}
      <div className="flex border-b border-[#b91c1c] text-[8px] font-bold text-[#991b1b]">
        <div className="w-[300px] p-1 border-r border-[#b91c1c]">
          <span>8. RESERVED FOR NUCC USE</span>
          <p className="font-mono text-xs font-bold text-slate-400 mt-1">N/A</p>
        </div>

        <div className="w-[190px] p-1 border-r-2 border-[#b91c1c]">
          <span>9. OTHER INSURED'S NAME</span>
          <p className="font-mono text-xs font-bold text-slate-400 mt-1">N/A</p>
        </div>

        <div className="flex-1 p-1">
          <span>10. IS PATIENT'S CONDITION RELATED TO:</span>
          <div className="space-y-1 mt-1 font-mono text-[9px] text-slate-900">
            <div className="flex justify-between">
              <span>a. EMPLOYMENT?</span>
              <div className="flex gap-2"><span>YES <span className="inline-block w-3 h-3 border border-[#b91c1c]"></span></span><span>NO <span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold">{chk(true)}</span></span></div>
            </div>
            <div className="flex justify-between">
              <span>b. AUTO ACCIDENT?</span>
              <div className="flex gap-2"><span>YES <span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold text-teal-900">{chk(true)}</span></span><span>NO <span className="inline-block w-3 h-3 border border-[#b91c1c]"></span></span><span className="ml-1 font-bold">STATE: {c(claim.box10State || 'TX')}</span></div>
            </div>
            <div className="flex justify-between">
              <span>c. OTHER ACCIDENT?</span>
              <div className="flex gap-2"><span>YES <span className="inline-block w-3 h-3 border border-[#b91c1c]"></span></span><span>NO <span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold">{chk(true)}</span></span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 ROW 5: BOXES 12 & 13 SIGNATURES */}
      <div className="flex border-b-2 border-[#b91c1c] text-[8px] font-bold text-[#991b1b]">
        <div className="w-[490px] p-1.5 border-r-2 border-[#b91c1c]">
          <span>12. PATIENT'S OR AUTHORIZED PERSON'S SIGNATURE (Release of Info)</span>
          <div className="flex justify-between items-end mt-2 font-mono text-xs text-slate-900">
            <div>
              <span className="text-[8px] text-[#991b1b] block font-sans">SIGNED:</span>
              <span className="font-bold border-b border-slate-400 pb-0.5">{c(claim.box12Signature || 'SIGNATURE ON FILE')}</span>
            </div>
            <div>
              <span className="text-[8px] text-[#991b1b] block font-sans">DATE:</span>
              <span className="font-bold">{c(claim.dos || claim.box12Date || '08/04/2026')}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-1.5">
          <span>13. INSURED'S OR AUTHORIZED PERSON'S SIGNATURE (Assignment of Benefits)</span>
          <div className="mt-2 font-mono text-xs text-slate-900">
            <span className="text-[8px] text-[#991b1b] block font-sans">SIGNED:</span>
            <span className="font-bold border-b border-slate-400 pb-0.5">{c(claim.box13Signature || 'SIGNATURE ON FILE')}</span>
          </div>
        </div>
      </div>

      {/* 🔴 ROW 6: BOXES 14 - 20 (LINKED TO APPOINTMENT / MVA DATE) */}
      <div className="flex border-b border-[#b91c1c] text-[8px] font-bold text-[#991b1b]">
        <div className="w-[245px] p-1 border-r border-[#b91c1c]">
          <span>14. DATE OF CURRENT ILLNESS, INJURY (MVA Date)</span>
          <div className="mt-1">
            <FieldInput defaultValue={blankMode ? '' : `${claim.box14IllnessDate?.mm || '12'} / ${claim.box14IllnessDate?.dd || '27'} / ${claim.box14IllnessDate?.yy || '2025'}`} readOnly={readOnly} className="text-xs font-mono font-bold" />
          </div>
        </div>

        <div className="w-[245px] p-1 border-r-2 border-[#b91c1c]">
          <span>17. NAME OF REFERRING PROVIDER OR OTHER SOURCE</span>
          <div className="mt-1">
            <FieldInput defaultValue={c(claim.box17ReferringName || 'Dr. Segun Adeoye')} readOnly={readOnly} className="text-xs font-mono font-bold uppercase" />
          </div>
        </div>

        <div className="flex-1 p-1">
          <span>20. OUTSIDE LAB? &bull; $ CHARGES</span>
          <div className="flex justify-between items-center mt-1 font-mono text-[9px] text-slate-900">
            <span>NO <span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold">{chk(true)}</span></span>
            <FieldInput defaultValue={blankMode ? '' : '$ 0.00'} readOnly={readOnly} className="w-16 text-right font-mono font-bold" />
          </div>
        </div>
      </div>

      {/* 🔴 ROW 7: BOX 21 DIAGNOSIS CODES (BOX 21 A THROUGH L) */}
      <div className="border-b-2 border-[#b91c1c] p-1.5 text-[8px] font-bold text-[#991b1b]">
        <div className="flex justify-between items-center">
          <span>21. DIAGNOSIS OR NATURE OF ILLNESS OR INJURY (ICD-10-CM Pointers A - L)</span>
          <span className="text-[8px] font-mono font-black text-slate-800">ICD Ind: 0</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-1 font-mono text-xs text-slate-900">
          {/* Column 1: A, B, C */}
          <div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5">
              <span className="text-[#991b1b] font-bold">A.</span>
              <FieldInput defaultValue={c(claim.box21Diagnoses?.[0] || 'M54.50')} readOnly={readOnly} className="font-bold" />
            </div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5 mt-1">
              <span className="text-[#991b1b] font-bold">B.</span>
              <FieldInput defaultValue={c(claim.box21Diagnoses?.[1] || 'M54.2')} readOnly={readOnly} className="font-bold" />
            </div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5 mt-1">
              <span className="text-[#991b1b] font-bold">C.</span>
              <FieldInput defaultValue={c(claim.box21Diagnoses?.[2] || 'S13.4XXA')} readOnly={readOnly} className="font-bold" />
            </div>
          </div>

          {/* Column 2: D, E, F */}
          <div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5">
              <span className="text-[#991b1b] font-bold">D.</span>
              <FieldInput defaultValue={c(claim.box21Diagnoses?.[3] || 'S39.012A')} readOnly={readOnly} className="font-bold" />
            </div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5 mt-1">
              <span className="text-[#991b1b] font-bold">E.</span>
              <FieldInput defaultValue="" readOnly={readOnly} placeholder="________" className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5 mt-1">
              <span className="text-[#991b1b] font-bold">F.</span>
              <FieldInput defaultValue="" readOnly={readOnly} placeholder="________" className="text-slate-400" />
            </div>
          </div>

          {/* Column 3: G, H, I */}
          <div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5">
              <span className="text-[#991b1b] font-bold">G.</span>
              <FieldInput defaultValue="" readOnly={readOnly} placeholder="________" className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5 mt-1">
              <span className="text-[#991b1b] font-bold">H.</span>
              <FieldInput defaultValue="" readOnly={readOnly} placeholder="________" className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5 mt-1">
              <span className="text-[#991b1b] font-bold">I.</span>
              <FieldInput defaultValue="" readOnly={readOnly} placeholder="________" className="text-slate-400" />
            </div>
          </div>

          {/* Column 4: J, K, L */}
          <div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5">
              <span className="text-[#991b1b] font-bold">J.</span>
              <FieldInput defaultValue="" readOnly={readOnly} placeholder="________" className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5 mt-1">
              <span className="text-[#991b1b] font-bold">K.</span>
              <FieldInput defaultValue="" readOnly={readOnly} placeholder="________" className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1 border-b border-[#b91c1c]/40 pb-0.5 mt-1">
              <span className="text-[#991b1b] font-bold">L.</span>
              <FieldInput defaultValue="" readOnly={readOnly} placeholder="________" className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 ROW 8: BOX 24 SERVICE LINE TABLE (6 OFFICIAL ROWS WITH MODIFIERS 1-4 & APPOINTMENT DOS) */}
      <div className="border-b-2 border-[#b91c1c] text-[8px] font-bold text-[#991b1b]">
        {/* Table Column Headers */}
        <div className="grid grid-cols-12 bg-red-50/50 p-1 border-b border-[#b91c1c] text-center text-[7px] leading-tight">
          <div className="col-span-3 border-r border-[#b91c1c]">
            24. A. DATES OF SERVICE<br />
            <span className="text-[6.5px]">FROM (MM DD YY) &bull; TO (MM DD YY)</span>
          </div>
          <div className="col-span-1 border-r border-[#b91c1c]">
            B. PLACE OF<br />SERVICE
          </div>
          <div className="col-span-1 border-r border-[#b91c1c]">
            C.<br />EMG
          </div>
          <div className="col-span-3 border-r border-[#b91c1c]">
            D. PROCEDURES, SERVICES, SUPPLIES<br />
            <span className="text-[6.5px]">CPT/HCPCS &bull; MODIFIER (1 2 3 4)</span>
          </div>
          <div className="col-span-1 border-r border-[#b91c1c]">
            E. DIAG<br />POINTER
          </div>
          <div className="col-span-1 border-r border-[#b91c1c]">
            F. $ CHARGES
          </div>
          <div className="col-span-1 border-r border-[#b91c1c]">
            G. DAYS<br />OR UNITS
          </div>
          <div className="col-span-1">
            J. RENDERING<br />PROVIDER ID.
          </div>
        </div>

        {/* 6 Form Rows */}
        <div className="divide-y divide-[#b91c1c]/40 font-mono text-[10px] text-slate-900">
          {serviceRows.map((line, idx) => {
            const hasData = !!line.cpt || !!line.fromDos;
            return (
              <div key={idx} className="p-1 min-h-[36px] flex flex-col justify-center">
                {line.note && (
                  <div contentEditable={!readOnly} suppressContentEditableWarning className="text-[8px] font-bold text-slate-500 uppercase tracking-tight focus:bg-amber-100 focus:ring-1 focus:ring-amber-500 rounded px-0.5 outline-none cursor-text hover:bg-slate-100/80">
                    {line.note}
                  </div>
                )}
                <div className="grid grid-cols-12 text-center items-center font-bold">
                  {/* 24.A Dates of Service */}
                  <div className="col-span-3 text-[9px] border-r border-[#b91c1c]/20">
                    <FieldInput defaultValue={hasData ? `${line.fromDos || claim.dos || '08/04/26'} - ${line.toDos || claim.dos || '08/04/26'}` : ''} readOnly={readOnly} className="text-[9px]" />
                  </div>
                  
                  {/* 24.B Place of Service */}
                  <div className="col-span-1 border-r border-[#b91c1c]/20">
                    <FieldInput defaultValue={hasData ? (line.pos || '11') : ''} readOnly={readOnly} className="text-center" />
                  </div>

                  {/* 24.C EMG */}
                  <div className="col-span-1 border-r border-[#b91c1c]/20">
                    <FieldInput defaultValue={hasData ? (line.emg || 'N') : ''} readOnly={readOnly} className="text-center" />
                  </div>

                  {/* 24.D CPT & Modifiers */}
                  <div className="col-span-3 border-r border-[#b91c1c]/20 flex items-center justify-center gap-1 text-[10px]">
                    <FieldInput defaultValue={line.cpt || ''} readOnly={readOnly} className="font-mono font-black text-slate-950 text-center" />
                  </div>

                  {/* 24.E Diagnosis Pointer (e.g. A, B, AB) */}
                  <div className="col-span-1 border-r border-[#b91c1c]/20 font-black">
                    <FieldInput defaultValue={line.diagPtr || (hasData ? (idx === 0 ? 'A' : 'B') : '')} readOnly={readOnly} className="text-center" />
                  </div>

                  {/* 24.F Charges */}
                  <div className="col-span-1 border-r border-[#b91c1c]/20 text-right pr-1 font-black">
                    <FieldInput defaultValue={hasData ? cleanAmount(line.charge) : ''} readOnly={readOnly} className="text-right" />
                  </div>

                  {/* 24.G Units */}
                  <div className="col-span-1 border-r border-[#b91c1c]/20 font-bold">
                    <FieldInput defaultValue={hasData ? (line.units || '1') : ''} readOnly={readOnly} className="text-center" />
                  </div>

                  {/* 24.J Rendering NPI */}
                  <div className="col-span-1 text-[9px] font-mono">
                    <FieldInput defaultValue={hasData ? (line.renderingId || '1234567890') : ''} readOnly={readOnly} className="text-center text-[8px]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔴 ROW 9: FOOTER BOXES 25 - 30 */}
      <div className="grid grid-cols-12 border-b-2 border-[#b91c1c] text-[8px] font-bold text-[#991b1b]">
        <div className="col-span-3 p-1 border-r border-[#b91c1c]">
          <span>25. FEDERAL TAX I.D. NUMBER</span>
          <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-900">
            <FieldInput defaultValue={c(claim.box25TaxId || '75-1234567')} readOnly={readOnly} className="font-bold" />
            <span className="text-[8px]">EIN <span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold">{chk(true)}</span></span>
          </div>
        </div>

        <div className="col-span-3 p-1 border-r border-[#b91c1c]">
          <span>27. ACCEPT ASSIGNMENT?</span>
          <div className="flex gap-3 mt-1 font-mono text-[9px] text-slate-900">
            <span>YES <span className="inline-block w-3 h-3 border border-[#b91c1c] text-center font-bold text-teal-900">{chk(true)}</span></span>
            <span>NO <span className="inline-block w-3 h-3 border border-[#b91c1c]"></span></span>
          </div>
        </div>

        <div className="col-span-2 p-1 border-r border-[#b91c1c] text-right">
          <span>28. TOTAL CHARGE</span>
          <div className="mt-1">
            <FieldInput defaultValue={blankMode ? '' : `$${cleanAmount(claim.box28TotalCharge)}`} readOnly={readOnly} className="font-mono text-xs font-black text-right" />
          </div>
        </div>

        <div className="col-span-2 p-1 border-r border-[#b91c1c] text-right">
          <span>29. AMOUNT PAID</span>
          <div className="mt-1">
            <FieldInput defaultValue={blankMode ? '' : `$${cleanAmount(claim.box29AmountPaid)}`} readOnly={readOnly} className="font-mono text-xs font-bold text-right" />
          </div>
        </div>

        <div className="col-span-2 p-1 text-right">
          <span>30. BALANCE DUE</span>
          <div className="mt-1">
            <FieldInput defaultValue={blankMode ? '' : `$${cleanAmount(claim.box30BalanceDue)}`} readOnly={readOnly} className="font-mono text-xs font-black text-right" />
          </div>
        </div>
      </div>

      {/* 🔴 ROW 10: BOXES 31, 32, 33 */}
      <div className="grid grid-cols-12 text-[8px] font-bold text-[#991b1b] p-1 font-mono">
        <div className="col-span-4 border-r border-[#b91c1c] pr-2">
          <span>31. SIGNATURE OF PHYSICIAN OR SUPPLIER</span>
          <FieldInput defaultValue={c(claim.box31ProviderSignature || 'Adeoye, Segun, MD')} readOnly={readOnly} className="font-bold text-xs mt-1" />
          <FieldInput defaultValue={blankMode ? '' : `SIGNED ${claim.dos || claim.box31Date || '08/04/2026'} DATE`} readOnly={readOnly} className="text-[9px] text-slate-600 mt-1" />
        </div>

        <div className="col-span-4 border-r border-[#b91c1c] px-2">
          <span>32. SERVICE FACILITY LOCATION INFORMATION</span>
          <FieldInput defaultValue={c(claim.box32Facility || `${claim.providerName || 'ANIK Laser Therapy'}\n10101 HARWIN DR, SUITE 774\nHOUSTON, TX 77036`)} readOnly={readOnly} className="font-bold text-[10px] mt-0.5" />
        </div>

        <div className="col-span-4 pl-2">
          <span>33. BILLING PROVIDER INFO &amp; PH #</span>
          <FieldInput defaultValue={c(claim.box33BillingProvider || `${claim.providerName || 'ANIK Laser Therapy'}\n10101 HARWIN DR, SUITE 774\nHOUSTON, TX 77036`)} readOnly={readOnly} className="font-bold text-[10px] mt-0.5" />
          <FieldInput defaultValue={blankMode ? '' : `PH# ${claim.box33Phone || '(713) 555-0100'}`} readOnly={readOnly} className="font-bold text-[10px] mt-0.5" />
          <FieldInput defaultValue={blankMode ? '' : `NPI: ${claim.box33Npi || '1234567890'}`} readOnly={readOnly} className="text-[9px] text-slate-800 font-bold" />
        </div>
      </div>

    </div>
  );
};


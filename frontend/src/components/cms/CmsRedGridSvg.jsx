// src/components/cms/CmsRedGridSvg.jsx
import React from 'react';

/**
 * Standard NUCC 08/05 CMS-1500 Red Grid Vector Outline SVG
 * Includes all sub-checkbox outlines, box dividers, and Box 21 underline bars
 */
export const CmsRedGridSvg = () => {
  return (
    <svg
      viewBox="0 0 850 1100"
      className="w-full h-full absolute inset-0 pointer-events-none select-none text-[#b91c1c]"
      style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
    >
      <defs>
        <style>{`
          .cms-red-line { stroke: #b91c1c; stroke-width: 1.2; fill: none; }
          .cms-red-thin { stroke: #dc2626; stroke-width: 0.8; stroke-dasharray: 2 2; fill: none; }
          .cms-red-box { stroke: #b91c1c; stroke-width: 1; fill: none; }
          .cms-red-text { fill: #991b1b; font-family: sans-serif; font-size: 7px; font-weight: bold; }
          .cms-title { fill: #991b1b; font-family: sans-serif; font-size: 11px; font-weight: 900; }
        `}</style>
      </defs>

      {/* Outer Border */}
      <rect x="25" y="25" width="800" height="1050" className="cms-red-line" strokeWidth="2" />

      {/* HEADER SECTION */}
      <text x="35" y="42" className="cms-title">1500</text>
      <text x="35" y="54" className="cms-title">HEALTH INSURANCE CLAIM FORM</text>
      <text x="35" y="64" className="cms-red-text">APPROVED BY NATIONAL UNIFORM CLAIM COMMITTEE 08/05</text>

      <line x1="25" y1="70" x2="825" y2="70" className="cms-red-line" />

      {/* Carrier Right Header Box */}
      <line x1="500" y1="25" x2="500" y2="70" className="cms-red-line" />
      <text x="508" y="38" className="cms-red-text">CARRIER</text>

      {/* ROW 1: BOX 1 & 1a */}
      <line x1="25" y1="100" x2="825" y2="100" className="cms-red-line" />
      <text x="30" y="79" className="cms-red-text">1. MEDICARE   MEDICAID   TRICARE   CHAMPVA   GROUP HEALTH PLAN   FECA BLKLUNG   OTHER</text>
      
      {/* Box 1 Checkbox Outlines */}
      <rect x="30" y="83" width="12" height="12" className="cms-red-box" />
      <rect x="95" y="83" width="12" height="12" className="cms-red-box" />
      <rect x="155" y="83" width="12" height="12" className="cms-red-box" />
      <rect x="220" y="83" width="12" height="12" className="cms-red-box" />
      <rect x="290" y="83" width="12" height="12" className="cms-red-box" />
      <rect x="375" y="83" width="12" height="12" className="cms-red-box" />
      <rect x="445" y="83" width="12" height="12" className="cms-red-box" />

      <text x="505" y="79" className="cms-red-text">1a. INSURED'S I.D. NUMBER (For Program in Item 1)</text>
      <line x1="500" y1="70" x2="500" y2="100" className="cms-red-line" />

      {/* ROW 2: BOXES 2 - 4 */}
      <line x1="25" y1="130" x2="825" y2="130" className="cms-red-line" />
      <text x="30" y="108" className="cms-red-text">2. PATIENT'S NAME (Last Name, First Name, Middle Initial)</text>
      <text x="310" y="108" className="cms-red-text">3. PATIENT'S BIRTH DATE / SEX</text>
      <rect x="442" y="112" width="12" height="12" className="cms-red-box" />
      <text x="430" y="121" className="cms-red-text">M</text>
      <rect x="475" y="112" width="12" height="12" className="cms-red-box" />
      <text x="465" y="121" className="cms-red-text">F</text>

      <text x="505" y="108" className="cms-red-text">4. INSURED'S NAME (Last Name, First Name, Middle Initial)</text>

      <line x1="305" y1="100" x2="305" y2="130" className="cms-red-line" />
      <line x1="500" y1="100" x2="500" y2="130" className="cms-red-line" />

      {/* ROW 3: BOXES 5 - 7 */}
      <line x1="25" y1="175" x2="825" y2="175" className="cms-red-line" />
      <text x="30" y="138" className="cms-red-text">5. PATIENT'S ADDRESS (No., Street)</text>
      <text x="305" y="138" className="cms-red-text">6. PATIENT RELATIONSHIP TO INSURED</text>
      <rect x="310" y="148" width="12" height="12" className="cms-red-box" /><text x="325" y="157" className="cms-red-text">Self</text>
      <rect x="350" y="148" width="12" height="12" className="cms-red-box" /><text x="365" y="157" className="cms-red-text">Spouse</text>
      <rect x="400" y="148" width="12" height="12" className="cms-red-box" /><text x="415" y="157" className="cms-red-text">Child</text>
      <rect x="445" y="148" width="12" height="12" className="cms-red-box" /><text x="460" y="157" className="cms-red-text">Other</text>

      <text x="505" y="138" className="cms-red-text">7. INSURED'S ADDRESS (No., Street)</text>

      <line x1="300" y1="130" x2="300" y2="175" className="cms-red-line" />
      <line x1="500" y1="130" x2="500" y2="175" className="cms-red-line" />

      {/* ROW 4: BOXES 8 - 11 */}
      <line x1="25" y1="215" x2="825" y2="215" className="cms-red-line" />
      <text x="30" y="183" className="cms-red-text">8. PATIENT STATUS</text>
      <rect x="35" y="193" width="12" height="12" className="cms-red-box" /><text x="50" y="202" className="cms-red-text">Single</text>
      <rect x="90" y="193" width="12" height="12" className="cms-red-box" /><text x="105" y="202" className="cms-red-text">Married</text>
      <rect x="150" y="193" width="12" height="12" className="cms-red-box" /><text x="165" y="202" className="cms-red-text">Other</text>

      <text x="305" y="183" className="cms-red-text">9. OTHER INSURED'S NAME</text>
      <text x="505" y="183" className="cms-red-text">10. IS PATIENT'S CONDITION RELATED TO:</text>
      <text x="508" y="195" className="cms-red-text">a. EMPLOYMENT? (Current or Previous)</text>
      <rect x="645" y="187" width="12" height="12" className="cms-red-box" /><text x="660" y="196" className="cms-red-text">YES</text>
      <rect x="685" y="187" width="12" height="12" className="cms-red-box" /><text x="700" y="196" className="cms-red-text">NO</text>

      <text x="508" y="207" className="cms-red-text">b. AUTO ACCIDENT?</text>
      <rect x="645" y="201" width="12" height="12" className="cms-red-box" /><text x="660" y="210" className="cms-red-text">YES</text>
      <rect x="685" y="201" width="12" height="12" className="cms-red-box" /><text x="700" y="210" className="cms-red-text">NO</text>
      <text x="730" y="207" className="cms-red-text">PLACE (State)</text>

      <line x1="300" y1="175" x2="300" y2="215" className="cms-red-line" />
      <line x1="500" y1="175" x2="500" y2="215" className="cms-red-line" />

      {/* ROW 5: BOXES 12 - 13 SIGNATURES */}
      <line x1="25" y1="270" x2="825" y2="270" className="cms-red-line" />
      <text x="30" y="223" className="cms-red-text">12. PATIENT'S OR AUTHORIZED PERSON'S SIGNATURE (Release of Info)</text>
      <text x="505" y="223" className="cms-red-text">13. INSURED'S OR AUTHORIZED PERSON'S SIGNATURE (Assignment of Benefits)</text>

      <line x1="500" y1="215" x2="500" y2="270" className="cms-red-line" />

      {/* BOXES 14 - 17 ROW */}
      <line x1="25" y1="310" x2="825" y2="310" className="cms-red-line" />
      <text x="30" y="278" className="cms-red-text">14. DATE OF CURRENT ILLNESS, INJURY or PREGNANCY</text>
      <text x="270" y="278" className="cms-red-text">15. SIMILAR ILLNESS DATE</text>
      <text x="505" y="278" className="cms-red-text">16. DATES PATIENT UNABLE TO WORK</text>

      <line x1="265" y1="270" x2="265" y2="310" className="cms-red-line" />
      <line x1="500" y1="270" x2="500" y2="310" className="cms-red-line" />

      {/* BOXES 17 - 20 ROW */}
      <line x1="25" y1="350" x2="825" y2="350" className="cms-red-line" />
      <text x="30" y="318" className="cms-red-text">17. NAME OF REFERRING PROVIDER OR OTHER SOURCE</text>
      <text x="270" y="318" className="cms-red-text">17a. NPI</text>
      <text x="505" y="318" className="cms-red-text">18. HOSPITALIZATION DATES</text>
      <text x="670" y="318" className="cms-red-text">20. OUTSIDE LAB?</text>
      <rect x="735" y="325" width="12" height="12" className="cms-red-box" /><text x="750" y="334" className="cms-red-text">YES</text>
      <rect x="775" y="325" width="12" height="12" className="cms-red-box" /><text x="790" y="334" className="cms-red-text">NO</text>

      <line x1="265" y1="310" x2="265" y2="350" className="cms-red-line" />
      <line x1="500" y1="310" x2="500" y2="350" className="cms-red-line" />
      <line x1="665" y1="310" x2="665" y2="350" className="cms-red-line" />

      {/* BOXES 21 DIAGNOSIS UNDERLINE BARS */}
      <line x1="25" y1="400" x2="825" y2="400" className="cms-red-line" />
      <text x="30" y="358" className="cms-red-text">21. DIAGNOSIS OR NATURE OF ILLNESS OR INJURY (Relate Items 1, 2, 3 or 4 to Item 24E)</text>
      <text x="35" y="375" className="cms-red-text">1.</text><line x1="50" y1="375" x2="250" y2="375" className="cms-red-line" />
      <text x="35" y="392" className="cms-red-text">2.</text><line x1="50" y1="392" x2="250" y2="392" className="cms-red-line" />
      <text x="260" y="375" className="cms-red-text">3.</text><line x1="275" y1="375" x2="475" y2="375" className="cms-red-line" />
      <text x="260" y="392" className="cms-red-text">4.</text><line x1="275" y1="392" x2="475" y2="392" className="cms-red-line" />

      <text x="505" y="358" className="cms-red-text">22. MEDICAID RESUBMISSION CODE</text>
      <text x="505" y="380" className="cms-red-text">23. PRIOR AUTHORIZATION NUMBER</text>
      <line x1="500" y1="350" x2="500" y2="400" className="cms-red-line" />

      {/* BOX 24 SERVICE LINE TABLE HEADER */}
      <line x1="25" y1="430" x2="825" y2="430" className="cms-red-line" fill="none" strokeWidth="1.5" />
      <text x="30" y="412" className="cms-red-text">24. A. DATES OF SERVICE (MM DD YY)</text>
      <text x="210" y="412" className="cms-red-text">B. POS</text>
      <text x="245" y="412" className="cms-red-text">C. EMG</text>
      <text x="275" y="412" className="cms-red-text">D. PROCEDURES, SERVICES, OR SUPPLIES (CPT/HCPCS)</text>
      <text x="505" y="412" className="cms-red-text">E. DIAG PTR</text>
      <text x="560" y="412" className="cms-red-text">F. $ CHARGES</text>
      <text x="645" y="412" className="cms-red-text">G. DAYS/UNITS</text>
      <text x="705" y="412" className="cms-red-text">J. RENDERING ID #</text>

      {/* SERVICE LINES (6 ROWS: Y=430 to Y=670) */}
      {[0, 1, 2, 3, 4, 5].map((idx) => {
        const y = 430 + idx * 40;
        return (
          <g key={idx}>
            <line x1="25" y1={y + 40} x2="825" y2={y + 40} className="cms-red-line" />
            <line x1="25" y1={y + 20} x2="825" y2={y + 20} className="cms-red-thin" />
            <text x="30" y={y + 14} className="cms-red-text">{idx + 1}</text>
          </g>
        );
      })}

      {/* Vertical Columns for Box 24 */}
      <line x1="205" y1="400" x2="205" y2="670" className="cms-red-line" />
      <line x1="240" y1="400" x2="240" y2="670" className="cms-red-line" />
      <line x1="270" y1="400" x2="270" y2="670" className="cms-red-line" />
      <line x1="500" y1="400" x2="500" y2="670" className="cms-red-line" />
      <line x1="555" y1="400" x2="555" y2="670" className="cms-red-line" />
      <line x1="640" y1="400" x2="640" y2="670" className="cms-red-line" />
      <line x1="700" y1="400" x2="700" y2="670" className="cms-red-line" />

      {/* FOOTER SECTION: BOXES 25 - 33 */}
      <line x1="25" y1="710" x2="825" y2="710" className="cms-red-line" />
      <text x="30" y="682" className="cms-red-text">25. FEDERAL TAX I.D. NUMBER</text>
      <rect x="155" y="688" width="12" height="12" className="cms-red-box" /><text x="170" y="697" className="cms-red-text">SSN</text>
      <rect x="190" y="688" width="12" height="12" className="cms-red-box" /><text x="205" y="697" className="cms-red-text">EIN</text>

      <text x="225" y="682" className="cms-red-text">26. PATIENT'S ACCOUNT NO.</text>

      <text x="360" y="682" className="cms-red-text">27. ACCEPT ASSIGNMENT?</text>
      <rect x="420" y="688" width="12" height="12" className="cms-red-box" /><text x="435" y="697" className="cms-red-text">YES</text>
      <rect x="465" y="688" width="12" height="12" className="cms-red-box" /><text x="480" y="697" className="cms-red-text">NO</text>

      <text x="505" y="682" className="cms-red-text">28. TOTAL CHARGE</text>
      <text x="620" y="682" className="cms-red-text">29. AMOUNT PAID</text>
      <text x="720" y="682" className="cms-red-text">30. BALANCE DUE</text>

      <line x1="220" y1="670" x2="220" y2="710" className="cms-red-line" />
      <line x1="355" y1="670" x2="355" y2="710" className="cms-red-line" />
      <line x1="500" y1="670" x2="500" y2="710" className="cms-red-line" />
      <line x1="615" y1="670" x2="615" y2="710" className="cms-red-line" />
      <line x1="715" y1="670" x2="715" y2="710" className="cms-red-line" />

      {/* ROW 2 FOOTER: BOXES 31 - 33 */}
      <text x="30" y="722" className="cms-red-text">31. SIGNATURE OF PHYSICIAN OR SUPPLIER</text>
      <text x="260" y="722" className="cms-red-text">32. SERVICE FACILITY LOCATION INFORMATION</text>
      <text x="540" y="722" className="cms-red-text">33. BILLING PROVIDER INFO &amp; PH #</text>

      <line x1="255" y1="710" x2="255" y2="1075" className="cms-red-line" />
      <line x1="535" y1="710" x2="535" y2="1075" className="cms-red-line" />

      <text x="50" y="1065" className="cms-red-text">APPROVED OMB-0938-0999 FORM CMS-1500 (08-05)</text>
    </svg>
  );
};

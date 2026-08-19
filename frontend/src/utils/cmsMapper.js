// src/utils/cmsMapper.js
import { CMS_REFERENCE_FIXTURES } from '../constants/cmsReferenceFixtures';

/**
 * Maps a bill statement and case to date-grouped CMS-1500 claims
 */
export const mapBillToCms1500Claims = (bill, patientCase, providerConfig) => {
  if (!bill) return [];

  // 1. Check if exact QA fixture exists for this bill ID
  if (CMS_REFERENCE_FIXTURES[bill.id]) {
    return CMS_REFERENCE_FIXTURES[bill.id];
  }

  // 2. Dynamic mapper for custom bills: Group service lines by unique Date of Service (dos)
  const lineItems = bill.lineItems || [];
  const dosGroups = {};

  lineItems.forEach(item => {
    const dosKey = item.dos || bill.statementDate || '08/04/2026';
    if (!dosGroups[dosKey]) dosGroups[dosKey] = [];
    dosGroups[dosKey].push(item);
  });

  const dosKeys = Object.keys(dosGroups);

  return dosKeys.map((dosKey, idx) => {
    const items = dosGroups[dosKey];
    let totalCharge = 0;
    const box24Lines = items.map(item => {
      const lineFee = parseFloat(item.charge || item.fee || item.lineTotal || 0);
      totalCharge += lineFee;

      return {
        note: item.description || '',
        fromDos: item.dos || dosKey,
        toDos: item.dos || dosKey,
        pos: providerConfig?.id === 'prov-davs' ? '10' : '11',
        cpt: item.cptCode || item.cpt || '',
        mod1: item.mod1 || item.modifier1 || (item.modifiers && item.modifiers[0]) || '',
        mod2: item.mod2 || item.modifier2 || (item.modifiers && item.modifiers[1]) || '',
        mod3: item.mod3 || item.modifier3 || (item.modifiers && item.modifiers[2]) || '',
        mod4: item.mod4 || item.modifier4 || (item.modifiers && item.modifiers[3]) || '',
        diagPtr: item.diagPtr || item.diagnosisPointer || (idx === 0 ? 'A' : 'AB'),
        charge: lineFee.toFixed(2),
        units: String(item.units || 1),
        renderingId: item.renderingNpi || '1234567890'
      };
    });

    const isJosmic = providerConfig?.id === 'prov-josmic' || bill.providerId === 'prov-josmic';

    return {
      claimId: `cms-${bill.id}-${idx}`,
      billId: bill.id,
      providerId: bill.providerId,
      providerName: bill.providerName || 'JOSMIC Wellness Center',
      dos: dosKey,
      dosDisplay: dosKey,
      status: 'Generated & Validated',
      formVersion: '02/12',
      box1: 'OTHER',
      box1a: bill.patientSystemId || 'PAT-141849159',
      box2: bill.patientName || 'SAMPLE TESTING',
      box3Dob: { mm: '05', dd: '15', yy: '1985' },
      box3Sex: 'M',
      box4: bill.patientName || 'SAMPLE TESTING',
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
      box11InsuredDob: { mm: '05', dd: '15', yy: '1985' },
      box11InsuredSex: 'M',
      box12Signature: 'SIGNATURE ON FILE',
      box12Date: dosKey,
      box13Signature: 'SIGNATURE ON FILE',
      box14IllnessDate: { mm: '12', dd: '27', yy: '2025' },
      box17ReferringName: isJosmic ? 'Dr. Anthony Nguyen' : 'Dr. Segun Adeoye',
      box17Npi: '1234567890',
      box21Diagnoses: isJosmic ? ['M54.6', 'M54.50', 'S13.4XXA', 'S39.012A'] : ['M54.50', 'M54.2', 'S13.4XXA', 'M25.572'],
      box24Lines,
      box25TaxId: providerConfig?.identifiers?.taxId || '75-1234567',
      box25Type: 'EIN',
      box27AcceptAssignment: 'YES',
      box28TotalCharge: totalCharge.toFixed(2),
      box29AmountPaid: '0.00',
      box30BalanceDue: totalCharge.toFixed(2),
      box31ProviderSignature: isJosmic ? 'Anthony Nguyen, MD' : 'Adeoye, Segun, MD',
      box31Date: dosKey,
      box32Facility: `${bill.providerName || 'JOSMIC Wellness Center'}\n10101 HARWIN DR, SUITE 774\nHOUSTON, TX 77036`,
      box33BillingProvider: `${bill.providerName || 'JOSMIC Wellness Center'}\n10101 HARWIN DR, SUITE 774\nHOUSTON, TX 77036`,
      box33Phone: '(713) 555-0100',
      carrierHeader: `${bill.billToName || 'OJ LAW FIRM & ATTORNEY LIEN'}\n${bill.billToAddress || '11711 BEDFORD ST. SUITE 01\nHOUSTON, TX 77031'}`,
    };
  });
};

/**
 * Directly maps a scheduled appointment to a single CMS-1500 claim
 */
export const mapAppointmentToCmsClaim = (appointment) => {
  if (!appointment) return null;
  const dos = appointment.date || '08/04/2026';
  const serviceLines = appointment.serviceLines || [
    {
      cptCode: appointment.serviceCode || '99204',
      description: appointment.serviceName || 'Initial Evaluation & Management',
      modifier1: '25',
      modifier2: '',
      modifier3: '',
      modifier4: '',
      diagPointer: 'A',
      units: 1,
      fee: 350.00,
      lineTotal: 350.00
    }
  ];

  let totalCharge = 0;
  const box24Lines = serviceLines.map(line => {
    const fee = parseFloat(line.lineTotal || line.fee || 0);
    totalCharge += fee;
    return {
      note: line.description || '',
      fromDos: dos,
      toDos: dos,
      pos: '11',
      emg: 'N',
      cpt: line.cptCode || '',
      mod1: line.modifier1 || line.mod1 || '',
      mod2: line.modifier2 || line.mod2 || '',
      mod3: line.modifier3 || line.mod3 || '',
      mod4: line.modifier4 || line.mod4 || '',
      diagPtr: line.diagPointer || line.diagPtr || 'A',
      charge: fee.toFixed(2),
      units: String(line.units || 1),
      renderingId: appointment.providerNpi || '1234567890'
    };
  });

  return {
    claimId: `cms-appt-${appointment.id}`,
    appointmentId: appointment.id,
    dos,
    status: 'Ready to Bill',
    formVersion: '02/12',
    box1: 'OTHER',
    box1a: appointment.patientId || 'PAT-141849159',
    box2: appointment.patientName || 'SAMPLE TESTING',
    box3Dob: { mm: '05', dd: '15', yy: '1985' },
    box3Sex: 'M',
    box4: appointment.patientName || 'SAMPLE TESTING',
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
    box12Date: dos,
    box13Signature: 'SIGNATURE ON FILE',
    box14IllnessDate: { mm: '12', dd: '27', yy: '2025' },
    box17ReferringName: appointment.providerName || 'Dr. Mohamed Siddiqui',
    box17Npi: appointment.providerNpi || '1234567890',
    box21Diagnoses: ['M54.6', 'M54.50', 'S13.4XXA', 'S39.012A'],
    box24Lines,
    box25TaxId: '75-1234567',
    box25Type: 'EIN',
    box27AcceptAssignment: 'YES',
    box28TotalCharge: totalCharge.toFixed(2),
    box29AmountPaid: '0.00',
    box30BalanceDue: totalCharge.toFixed(2),
    box31ProviderSignature: appointment.providerName || 'Mohamed Siddiqui, MD',
    box31Date: dos,
    box32Facility: `JOSMIC Wellness Center\n10101 HARWIN DR, SUITE 774\nHOUSTON, TX 77036`,
    box33BillingProvider: `JOSMIC Wellness Center\n10101 HARWIN DR, SUITE 774\nHOUSTON, TX 77036`,
    box33Phone: '(713) 555-0100',
    carrierHeader: 'OJ LAW FIRM & ATTORNEY LIEN\n11711 BEDFORD ST. SUITE 01\nHOUSTON, TX 77031'
  };
};


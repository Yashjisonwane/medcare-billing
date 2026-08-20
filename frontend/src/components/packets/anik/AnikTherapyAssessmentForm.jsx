// src/components/packets/anik/AnikTherapyAssessmentForm.jsx
import React, { useState, useEffect } from 'react';

/**
 * ANIK Therapy Assessment Form - ANIK Reference PDF Page 7
 * Now connected dynamically to serviceLines
 */
export const AnikTherapyAssessmentForm = ({ readOnly = false, blankMode = false, packetData = null, serviceLines = [] }) => {
  // We'll support up to 3 sessions per page based on dynamic serviceLines
  const [assessments, setAssessments] = useState({});

  useEffect(() => {
    // If not blank mode and we don't have DB states loaded, we could initialize defaults.
    // For now, we'll let them be editable.
  }, [blankMode, packetData]);

  const updateAssessment = (date, field, value) => {
    if (readOnly) return;
    setAssessments(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [field]: value
      }
    }));
  };

  // Group service lines by Date of Service (dos)
  const dosGroups = {};
  if (!blankMode && serviceLines && serviceLines.length > 0) {
    serviceLines.forEach(line => {
      const dosKey = line.dos || line.dateOfService;
      if (!dosKey) return;
      if (!dosGroups[dosKey]) dosGroups[dosKey] = [];
      dosGroups[dosKey].push(line);
    });
  } else if (!blankMode) {
    // Fallback/Demo if no service lines exist
    dosGroups['01/22/2026'] = [{ cptCode: '97124' }, { cptCode: '97039', units: 3 }];
    dosGroups['01/24/2026'] = [{ cptCode: '97124' }, { cptCode: '97039', units: 3 }];
    dosGroups['01/26/2026'] = [{ cptCode: '97124' }, { cptCode: '97039', units: 3 }];
  }

  const sortedDates = Object.keys(dosGroups).sort((a, b) => new Date(a) - new Date(b));
  // Display up to 3 dates to fit on a single page
  const displayDates = sortedDates.slice(0, 3);

  // Helper to check if a specific CPT exists in a given date's lines
  const hasCpt = (lines, codePrefix) => lines.some(l => l.cptCode && l.cptCode.startsWith(codePrefix));
  const getCptUnits = (lines, codePrefix) => {
    const line = lines.find(l => l.cptCode && l.cptCode.startsWith(codePrefix));
    return line && line.units > 1 ? ` X${line.units}` : '';
  };

  return (
    <div
      className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300 p-10 space-y-5 print:border-none print:shadow-none"
      style={{ width: '850px', height: '1100px', breakAfter: 'page', pageBreakAfter: 'always' }}
    >
      
      {/* Provider Header matching PDF Page 7 */}
      <div className="text-center">
        <h1 className="text-xl font-black uppercase text-teal-800 tracking-tight italic">ANIK LASER THERAPY</h1>
        <p className="text-[10px] font-bold text-slate-600">
          10101 HARWIN DR.STE 274 HOUSTON TX 77036  OFFICE: 713-485-5712  CELL: 832-815-0959  FAX: 832-416-1502
        </p>
        <p className="text-[10px] text-teal-700 font-semibold underline">Email: Aniklasertherapy@gmail.com</p>
        <h2 className="text-sm font-extrabold uppercase mt-2 text-slate-900 tracking-wider">THERAPY ASSESSMENT</h2>
      </div>

      {/* Patient & Diagnosis Banner */}
      <div className="space-y-1.5 text-xs font-mono font-bold border-b border-slate-300 pb-2">
        <div className="flex gap-2">
          <span>PATIENT NAME:</span>
          {blankMode || !packetData ? (
            <div className="border-b border-slate-400 mt-1 w-48">&nbsp;</div>
          ) : (
            <span className="text-slate-900">{packetData.patientName}</span>
          )}
        </div>
        <div className="flex gap-2">
          <span>DIAGNOSIS:</span>
          {blankMode || !packetData ? (
            <div className="border-b border-slate-400 mt-1 w-64">&nbsp;</div>
          ) : (
            <span className="text-slate-900">
              {packetData.diagnosisCodes && packetData.diagnosisCodes.length > 0 
                ? packetData.diagnosisCodes.map(d => d.description || d.code).join(', ') 
                : 'NECK, LOW BACK, LEFT ANKLE'}
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Session Rendering */}
      {displayDates.map((dos, idx) => {
        const lines = dosGroups[dos];
        const state = assessments[dos] || {};
        const tol = state.tol || '';
        const imp = state.imp || '';
        const care = state.care || '';

        // Initial default fallback to make it look like the original PDF if they haven't edited
        const defaultTol = (!state.tol && idx === 0) ? 'FAIRLY' : (!state.tol && idx === 1) ? 'WELL' : tol;
        const defaultImp = (!state.imp && idx === 0) ? 'IMPROVING_SLOWLY' : (!state.imp && idx === 1) ? 'IMPROVING' : imp;
        const defaultCare = (!state.care && (idx === 0 || idx === 1)) ? 'CONTINUES_CARE' : care;

        const currentTol = blankMode ? tol : defaultTol;
        const currentImp = blankMode ? imp : defaultImp;
        const currentCare = blankMode ? care : defaultCare;

        return (
          <div key={dos} className="space-y-2 pt-2">
            <div className="border border-slate-900 text-[10px] font-mono">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-900">
                    <th className="p-1 border-r border-slate-900 w-24">DATE</th>
                    <th className="p-1 border-r border-slate-900">HOT PACK<br/>97010</th>
                    <th className="p-1 border-r border-slate-900">TRACTION<br/>97012</th>
                    <th className="p-1 border-r border-slate-900">ELEC-STIM<br/>97014</th>
                    <th className="p-1 border-r border-slate-900">ULTRASOUND<br/>97035</th>
                    <th className="p-1">MASSAGE<br/>97124</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-900">
                    <td className="p-1 border-r border-slate-900 font-bold">{dos}</td>
                    <td className="p-1 border-r border-slate-900">{hasCpt(lines, '97010') && '✓'}</td>
                    <td className="p-1 border-r border-slate-900">{hasCpt(lines, '97012') && '✓'}</td>
                    <td className="p-1 border-r border-slate-900">{hasCpt(lines, '97014') && '✓'}</td>
                    <td className="p-1 border-r border-slate-900">{hasCpt(lines, '97035') && '✓'}</td>
                    <td className="p-1 font-bold text-center">{hasCpt(lines, '97124') ? '✓' : ''}</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold border-b border-slate-900">
                    <td className="p-1 border-r border-slate-900">ROM EXERCISE<br/>97110</td>
                    <td className="p-1 border-r border-slate-900">OFFICE VISIT<br/>99205</td>
                    <td className="p-1 border-r border-slate-900">CMT SPINAL<br/>97140</td>
                    <td className="p-1 border-r border-slate-900">Follow-up consult<br/>99213</td>
                    <td colSpan="2" className="p-1">LASER THERAPY<br/>97039</td>
                  </tr>
                  <tr>
                    <td className="p-1 border-r border-slate-900">{hasCpt(lines, '97110') && '✓'}</td>
                    <td className="p-1 border-r border-slate-900">{hasCpt(lines, '99205') && '✓'}</td>
                    <td className="p-1 border-r border-slate-900">{hasCpt(lines, '97140') && '✓'}</td>
                    <td className="p-1 border-r border-slate-900">{hasCpt(lines, '99213') && '✓'}</td>
                    <td colSpan="2" className="p-1 font-bold text-center">
                      {hasCpt(lines, '97039') ? `✓${getCptUnits(lines, '97039')}` : ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Assessment Underlines */}
            <div className="text-[10px] space-y-1.5 font-mono pt-1">
              <p className="font-bold">ASSESSMENT:</p>
              <div className="flex items-center gap-6">
                <span>PATIENT TOLERANCE TO TREATMENT:</span>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`tol-${dos}`} checked={currentTol === 'WELL'} onChange={() => updateAssessment(dos, 'tol', 'WELL')} className="hidden" />
                  <span>{currentTol === 'WELL' ? '__' : '____'}</span>
                  {currentTol === 'WELL' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentTol === 'WELL' ? '__ WELL' : ' WELL'}</span>
                </label>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`tol-${dos}`} checked={currentTol === 'FAIRLY'} onChange={() => updateAssessment(dos, 'tol', 'FAIRLY')} className="hidden" />
                  <span>{currentTol === 'FAIRLY' ? '__' : '____'}</span>
                  {currentTol === 'FAIRLY' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentTol === 'FAIRLY' ? '__ FAIRLY' : ' FAIRLY'}</span>
                </label>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`tol-${dos}`} checked={currentTol === 'POORLY'} onChange={() => updateAssessment(dos, 'tol', 'POORLY')} className="hidden" />
                  <span>{currentTol === 'POORLY' ? '__' : '____'}</span>
                  {currentTol === 'POORLY' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentTol === 'POORLY' ? '__ POORLY' : ' POORLY'}</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <span>APPEARS TO BE:</span>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`imp-${dos}`} checked={currentImp === 'IMPROVING'} onChange={() => updateAssessment(dos, 'imp', 'IMPROVING')} className="hidden" />
                  <span>{currentImp === 'IMPROVING' ? '__' : '____'}</span>
                  {currentImp === 'IMPROVING' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentImp === 'IMPROVING' ? '__ IMPROVING' : ' IMPROVING'}</span>
                </label>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`imp-${dos}`} checked={currentImp === 'IMPROVING_SLOWLY'} onChange={() => updateAssessment(dos, 'imp', 'IMPROVING_SLOWLY')} className="hidden" />
                  <span>{currentImp === 'IMPROVING_SLOWLY' ? '__' : '____'}</span>
                  {currentImp === 'IMPROVING_SLOWLY' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentImp === 'IMPROVING_SLOWLY' ? '__ IMPROVING SLOWLY' : ' IMPROVING SLOWLY'}</span>
                </label>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`imp-${dos}`} checked={currentImp === 'NO_CHANGE'} onChange={() => updateAssessment(dos, 'imp', 'NO_CHANGE')} className="hidden" />
                  <span>{currentImp === 'NO_CHANGE' ? '__' : '____'}</span>
                  {currentImp === 'NO_CHANGE' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentImp === 'NO_CHANGE' ? '__ NO CHANGE' : ' NO CHANGE'}</span>
                </label>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`imp-${dos}`} checked={currentImp === 'GETTING_WORSE'} onChange={() => updateAssessment(dos, 'imp', 'GETTING_WORSE')} className="hidden" />
                  <span>{currentImp === 'GETTING_WORSE' ? '__' : '____'}</span>
                  {currentImp === 'GETTING_WORSE' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentImp === 'GETTING_WORSE' ? '__ GETTING WORSE' : ' GETTING WORSE'}</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <span>PATIENT CONTINUES TO HAVE:</span>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`care-${dos}`} checked={currentCare === 'CONTINUES_CARE'} onChange={() => updateAssessment(dos, 'care', 'CONTINUES_CARE')} className="hidden" />
                  <span>{currentCare === 'CONTINUES_CARE' ? '__' : '____'}</span>
                  {currentCare === 'CONTINUES_CARE' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentCare === 'CONTINUES_CARE' ? '__ CONTINUES PRESENT CARE' : ' CONTINUES PRESENT CARE'}</span>
                </label>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`care-${dos}`} checked={currentCare === 'REEVALUATE'} onChange={() => updateAssessment(dos, 'care', 'REEVALUATE')} className="hidden" />
                  <span>{currentCare === 'REEVALUATE' ? '__' : '____'}</span>
                  {currentCare === 'REEVALUATE' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentCare === 'REEVALUATE' ? '__ REEVALUATE DUE TO CHANGES IN CONDITION' : ' REEVALUATE DUE TO CHANGES IN CONDITION'}</span>
                </label>
                <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
                  <input type="radio" name={`care-${dos}`} checked={currentCare === '30_DAY_REEVA'} onChange={() => updateAssessment(dos, 'care', '30_DAY_REEVA')} className="hidden" />
                  <span>{currentCare === '30_DAY_REEVA' ? '__' : '____'}</span>
                  {currentCare === '30_DAY_REEVA' && <strong className="text-slate-900 font-black">✓</strong>}
                  <span>{currentCare === '30_DAY_REEVA' ? '__ 30 DAY RE-EVA' : ' 30 DAY RE-EVA'}</span>
                </label>
              </div>
            </div>
          </div>
        );
      })}

      {displayDates.length === 0 && !blankMode && (
        <div className="text-center text-slate-400 py-10 font-bold text-xs border border-dashed border-slate-300">
          No Service Lines Found For This Provider
        </div>
      )}

    </div>
  );
};

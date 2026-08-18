// src/components/packets/anik/AnikTherapyAssessmentForm.jsx
import React, { useState } from 'react';

/**
 * ANIK Therapy Assessment Form — ANIK Reference PDF Page 7
 */
export const AnikTherapyAssessmentForm = ({ readOnly = false, blankMode = false, packetData = null }) => {
  // Session 1 Assessment State (01/22/2026)
  const [s1Tolerance, setS1Tolerance] = useState('FAIRLY');
  const [s1Improving, setS1Improving] = useState('IMPROVING_SLOWLY');
  const [s1Care, setS1Care] = useState('CONTINUES_CARE');

  // Session 2 Assessment State (01/24/2026)
  const [s2Tolerance, setS2Tolerance] = useState('WELL');
  const [s2Improving, setS2Improving] = useState('IMPROVING');
  const [s2Care, setS2Care] = useState('CONTINUES_CARE');

  // Session 3 Assessment State (01/26/2026) — Blank in reference sample
  const [s3Tolerance, setS3Tolerance] = useState('');
  const [s3Improving, setS3Improving] = useState('');
  const [s3Care, setS3Care] = useState('');

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

      {/* ================= SESSION 1: 01/22/2026 ================= */}
      <div className="space-y-2">
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
                <td className="p-1 border-r border-slate-900 font-bold">01/22/2026</td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 font-bold text-center">✓</td>
              </tr>
              <tr className="bg-slate-100 font-bold border-b border-slate-900">
                <td className="p-1 border-r border-slate-900">ROM EXERCISE<br/>97110</td>
                <td className="p-1 border-r border-slate-900">OFFICE VISIT<br/>99205</td>
                <td className="p-1 border-r border-slate-900">CMT SPINAL<br/>97140</td>
                <td className="p-1 border-r border-slate-900">Follow-up consult<br/>99213</td>
                <td colSpan="2" className="p-1">LASER THERAPY<br/>97039</td>
              </tr>
              <tr>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td colSpan="2" className="p-1 font-bold text-center">✓ X3</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Assessment Underlines S1 */}
        <div className="text-[10px] space-y-1.5 font-mono pt-1">
          <p className="font-bold">ASSESSMENT:</p>
          <div className="flex items-center gap-6">
            <span>PATIENT TOLERANCE TO TREATMENT:</span>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Tol" checked={s1Tolerance === 'WELL'} onChange={() => !readOnly && setS1Tolerance('WELL')} className="hidden" />
              <span>____ WELL {s1Tolerance === 'WELL' && '✓'}</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Tol" checked={s1Tolerance === 'FAIRLY'} onChange={() => !readOnly && setS1Tolerance('FAIRLY')} className="hidden" />
              <span>__<strong className="text-slate-900 font-black">✓</strong>__ FAIRLY</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Tol" checked={s1Tolerance === 'POORLY'} onChange={() => !readOnly && setS1Tolerance('POORLY')} className="hidden" />
              <span>____ POORLY {s1Tolerance === 'POORLY' && '✓'}</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <span>APPEARS TO BE:</span>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Imp" checked={s1Improving === 'IMPROVING'} onChange={() => !readOnly && setS1Improving('IMPROVING')} className="hidden" />
              <span>____ IMPROVING</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Imp" checked={s1Improving === 'IMPROVING_SLOWLY'} onChange={() => !readOnly && setS1Improving('IMPROVING_SLOWLY')} className="hidden" />
              <span>__<strong className="text-slate-900 font-black">✓</strong>__ IMPROVING SLOWLY</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Imp" checked={s1Improving === 'NO_CHANGE'} onChange={() => !readOnly && setS1Improving('NO_CHANGE')} className="hidden" />
              <span>____ NO CHANGE</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Imp" checked={s1Improving === 'GETTING_WORSE'} onChange={() => !readOnly && setS1Improving('GETTING_WORSE')} className="hidden" />
              <span>____ GETTING WORSE</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <span>PATIENT CONTINUES TO HAVE:</span>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Care" checked={s1Care === 'CONTINUES_CARE'} onChange={() => !readOnly && setS1Care('CONTINUES_CARE')} className="hidden" />
              <span>__<strong className="text-slate-900 font-black">✓</strong>__ CONTINUES PRESENT CARE</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Care" checked={s1Care === 'REEVALUATE'} onChange={() => !readOnly && setS1Care('REEVALUATE')} className="hidden" />
              <span>____ REEVALUATE DUE TO CHANGES IN CONDITION</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s1Care" checked={s1Care === '30_DAY_REEVA'} onChange={() => !readOnly && setS1Care('30_DAY_REEVA')} className="hidden" />
              <span>____ 30 DAY RE-EVA</span>
            </label>
          </div>
        </div>
      </div>

      {/* ================= SESSION 2: 01/24/2026 ================= */}
      <div className="space-y-2 pt-2">
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
                <td className="p-1 border-r border-slate-900 font-bold">01/24/2026</td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 font-bold text-center">✓</td>
              </tr>
              <tr className="bg-slate-100 font-bold border-b border-slate-900">
                <td className="p-1 border-r border-slate-900">ROM EXERCISE<br/>97110</td>
                <td className="p-1 border-r border-slate-900">OFFICE VISIT<br/>99205</td>
                <td className="p-1 border-r border-slate-900">CMT SPINAL<br/>97140</td>
                <td className="p-1 border-r border-slate-900">Follow-up consult<br/>99213</td>
                <td colSpan="2" className="p-1">LASER THERAPY<br/>97039</td>
              </tr>
              <tr>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td colSpan="2" className="p-1 font-bold text-center">✓ X3</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Assessment Underlines S2 */}
        <div className="text-[10px] space-y-1.5 font-mono pt-1">
          <p className="font-bold">ASSESSMENT:</p>
          <div className="flex items-center gap-6">
            <span>PATIENT TOLERANCE TO TREATMENT:</span>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Tol" checked={s2Tolerance === 'WELL'} onChange={() => !readOnly && setS2Tolerance('WELL')} className="hidden" />
              <span>__<strong className="text-slate-900 font-black">✓</strong>__ WELL</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Tol" checked={s2Tolerance === 'FAIRLY'} onChange={() => !readOnly && setS2Tolerance('FAIRLY')} className="hidden" />
              <span>____ FAIRLY</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Tol" checked={s2Tolerance === 'POORLY'} onChange={() => !readOnly && setS2Tolerance('POORLY')} className="hidden" />
              <span>____ POORLY</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <span>APPEARS TO BE:</span>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Imp" checked={s2Improving === 'IMPROVING'} onChange={() => !readOnly && setS2Improving('IMPROVING')} className="hidden" />
              <span>__<strong className="text-slate-900 font-black">✓</strong>__ IMPROVING</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Imp" checked={s2Improving === 'IMPROVING_SLOWLY'} onChange={() => !readOnly && setS2Improving('IMPROVING_SLOWLY')} className="hidden" />
              <span>____ IMPROVING SLOWLY</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Imp" checked={s2Improving === 'NO_CHANGE'} onChange={() => !readOnly && setS2Improving('NO_CHANGE')} className="hidden" />
              <span>____ NO CHANGE</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Imp" checked={s2Improving === 'GETTING_WORSE'} onChange={() => !readOnly && setS2Improving('GETTING_WORSE')} className="hidden" />
              <span>____ GETTING WORSE</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <span>PATIENT CONTINUES TO HAVE:</span>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Care" checked={s2Care === 'CONTINUES_CARE'} onChange={() => !readOnly && setS2Care('CONTINUES_CARE')} className="hidden" />
              <span>__<strong className="text-slate-900 font-black">✓</strong>__ CONTINUES PRESENT CARE</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Care" checked={s2Care === 'REEVALUATE'} onChange={() => !readOnly && setS2Care('REEVALUATE')} className="hidden" />
              <span>____ REEVALUATE DUE TO CHANGES IN CONDITION</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s2Care" checked={s2Care === '30_DAY_REEVA'} onChange={() => !readOnly && setS2Care('30_DAY_REEVA')} className="hidden" />
              <span>____ 30 DAY RE-EVA</span>
            </label>
          </div>
        </div>
      </div>

      {/* ================= SESSION 3: 01/26/2026 (BLANK ASSESSMENT VALUES IN REFERENCE) ================= */}
      <div className="space-y-2 pt-2">
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
                <td className="p-1 border-r border-slate-900 font-bold">01/26/2026</td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 font-bold text-center">✓</td>
              </tr>
              <tr className="bg-slate-100 font-bold border-b border-slate-900">
                <td className="p-1 border-r border-slate-900">ROM EXERCISE<br/>97110</td>
                <td className="p-1 border-r border-slate-900">OFFICE VISIT<br/>99205</td>
                <td className="p-1 border-r border-slate-900">CMT SPINAL<br/>97140</td>
                <td className="p-1 border-r border-slate-900">Follow-up consult<br/>99213</td>
                <td colSpan="2" className="p-1">LASER THERAPY<br/>97039</td>
              </tr>
              <tr>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900"></td>
                <td className="p-1 border-r border-slate-900 font-bold text-center">✓</td>
                <td colSpan="2" className="p-1 font-bold text-center">✓ X3</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Assessment Underlines S3 (Blank by default per PDF Page 7) */}
        <div className="text-[10px] space-y-1.5 font-mono pt-1">
          <p className="font-bold">ASSESSMENT:</p>
          <div className="flex items-center gap-6">
            <span>PATIENT TOLERANCE TO TREATMENT:</span>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Tol" checked={s3Tolerance === 'WELL'} onChange={() => !readOnly && setS3Tolerance('WELL')} className="hidden" />
              <span>____ WELL {s3Tolerance === 'WELL' && '✓'}</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Tol" checked={s3Tolerance === 'FAIRLY'} onChange={() => !readOnly && setS3Tolerance('FAIRLY')} className="hidden" />
              <span>____ FAIRLY {s3Tolerance === 'FAIRLY' && '✓'}</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Tol" checked={s3Tolerance === 'POORLY'} onChange={() => !readOnly && setS3Tolerance('POORLY')} className="hidden" />
              <span>____ POORLY {s3Tolerance === 'POORLY' && '✓'}</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <span>APPEARS TO BE:</span>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Imp" checked={s3Improving === 'IMPROVING'} onChange={() => !readOnly && setS3Improving('IMPROVING')} className="hidden" />
              <span>____ IMPROVING {s3Improving === 'IMPROVING' && '✓'}</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Imp" checked={s3Improving === 'IMPROVING_SLOWLY'} onChange={() => !readOnly && setS3Improving('IMPROVING_SLOWLY')} className="hidden" />
              <span>____ IMPROVING SLOWLY {s3Improving === 'IMPROVING_SLOWLY' && '✓'}</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Imp" checked={s3Improving === 'NO_CHANGE'} onChange={() => !readOnly && setS3Improving('NO_CHANGE')} className="hidden" />
              <span>____ NO CHANGE {s3Improving === 'NO_CHANGE' && '✓'}</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Imp" checked={s3Improving === 'GETTING_WORSE'} onChange={() => !readOnly && setS3Improving('GETTING_WORSE')} className="hidden" />
              <span>____ GETTING WORSE {s3Improving === 'GETTING_WORSE' && '✓'}</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <span>PATIENT CONTINUES TO HAVE:</span>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Care" checked={s3Care === 'CONTINUES_CARE'} onChange={() => !readOnly && setS3Care('CONTINUES_CARE')} className="hidden" />
              <span>____ CONTINUES PRESENT CARE {s3Care === 'CONTINUES_CARE' && '✓'}</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Care" checked={s3Care === 'REEVALUATE'} onChange={() => !readOnly && setS3Care('REEVALUATE')} className="hidden" />
              <span>____ REEVALUATE DUE TO CHANGES IN CONDITION {s3Care === 'REEVALUATE' && '✓'}</span>
            </label>
            <label className="cursor-pointer hover:opacity-80 transition-opacity duration-100">
              <input type="radio" name="s3Care" checked={s3Care === '30_DAY_REEVA'} onChange={() => !readOnly && setS3Care('30_DAY_REEVA')} className="hidden" />
              <span>____ 30 DAY RE-EVA {s3Care === '30_DAY_REEVA' && '✓'}</span>
            </label>
          </div>
        </div>
      </div>

    </div>
  );
};

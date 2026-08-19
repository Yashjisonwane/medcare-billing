// src/constants/usHolidays.js

export const US_FEDERAL_HOLIDAYS = [
  { id: 'hol-new-year', name: "New Year's Day", month: 1, day: 1, type: 'FIXED' },
  { id: 'hol-mlk', name: 'Martin Luther King Jr. Day', month: 1, nth: 3, dayOfWeek: 1, type: 'FLOATING' }, // 3rd Mon in Jan
  { id: 'hol-presidents', name: "Presidents' Day (Washington's Birthday)", month: 2, nth: 3, dayOfWeek: 1, type: 'FLOATING' }, // 3rd Mon in Feb
  { id: 'hol-memorial', name: 'Memorial Day', month: 5, last: true, dayOfWeek: 1, type: 'FLOATING' }, // Last Mon in May
  { id: 'hol-juneteenth', name: 'Juneteenth National Independence Day', month: 6, day: 19, type: 'FIXED' },
  { id: 'hol-independence', name: 'Independence Day', month: 7, day: 4, type: 'FIXED' },
  { id: 'hol-labor', name: 'Labor Day', month: 9, nth: 1, dayOfWeek: 1, type: 'FLOATING' }, // 1st Mon in Sept
  { id: 'hol-columbus', name: "Columbus Day / Indigenous Peoples' Day", month: 10, nth: 2, dayOfWeek: 1, type: 'FLOATING' }, // 2nd Mon in Oct
  { id: 'hol-veterans', name: 'Veterans Day', month: 11, day: 11, type: 'FIXED' },
  { id: 'hol-thanksgiving', name: 'Thanksgiving Day', month: 11, nth: 4, dayOfWeek: 4, type: 'FLOATING' }, // 4th Thurs in Nov
  { id: 'hol-christmas', name: 'Christmas Day', month: 12, day: 25, type: 'FIXED' },
];

// Helper to format Date object to YYYY-MM-DD
const formatDateStr = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Calculate exact observed dates for a given year
export const getUSHolidaysForYear = (year) => {
  const results = [];

  US_FEDERAL_HOLIDAYS.forEach(hol => {
    let actualDate;

    if (hol.type === 'FIXED') {
      actualDate = new Date(year, hol.month - 1, hol.day);
    } else if (hol.last) {
      // Last weekday of month (e.g. Memorial Day = last Mon in May)
      const lastDayOfMonth = new Date(year, hol.month, 0);
      let day = lastDayOfMonth.getDate();
      while (new Date(year, hol.month - 1, day).getDay() !== hol.dayOfWeek) {
        day--;
      }
      actualDate = new Date(year, hol.month - 1, day);
    } else if (hol.nth) {
      // Nth weekday of month (e.g. 1st Mon, 3rd Mon, 4th Thurs)
      let count = 0;
      let day = 1;
      while (count < hol.nth && day <= 31) {
        const d = new Date(year, hol.month - 1, day);
        if (d.getMonth() !== hol.month - 1) break;
        if (d.getDay() === hol.dayOfWeek) {
          count++;
          if (count === hol.nth) {
            actualDate = d;
            break;
          }
        }
        day++;
      }
    }

    if (actualDate) {
      // Calculate observed date (if fixed lands on Sat -> Fri, Sun -> Mon)
      let observedDate = new Date(actualDate);
      if (hol.type === 'FIXED') {
        const dow = actualDate.getDay();
        if (dow === 6) { // Saturday -> Observed on Friday
          observedDate.setDate(actualDate.getDate() - 1);
        } else if (dow === 0) { // Sunday -> Observed on Monday
          observedDate.setDate(actualDate.getDate() + 1);
        }
      }

      const dateStr = formatDateStr(actualDate);
      const observedStr = formatDateStr(observedDate);

      results.push({
        id: hol.id,
        name: hol.name,
        date: dateStr,
        observedDate: observedStr,
        isObservedDiff: dateStr !== observedStr
      });
    }
  });

  return results.sort((a, b) => a.observedDate.localeCompare(b.observedDate));
};

// Check if a specific YYYY-MM-DD date string is a US Federal Holiday
export const isUSFederalHoliday = (dateStr) => {
  if (!dateStr) return { isHoliday: false };
  
  const [yearStr] = dateStr.split('-');
  const year = parseInt(yearStr) || new Date().getFullYear();
  const holidays = getUSHolidaysForYear(year);

  const matched = holidays.find(h => h.date === dateStr || h.observedDate === dateStr);
  if (matched) {
    return {
      isHoliday: true,
      name: matched.name,
      observedDate: matched.observedDate,
      date: matched.date
    };
  }

  return { isHoliday: false };
};

// Check if a specific YYYY-MM-DD date string falls on a weekend (Saturday or Sunday)
export const isWeekend = (dateStr) => {
  if (!dateStr) return { isWeekend: false, dayName: '' };
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday
  if (day === 0) return { isWeekend: true, dayName: 'Sunday' };
  if (day === 6) return { isWeekend: true, dayName: 'Saturday' };
  return { isWeekend: false, dayName: '' };
};

// Check if clinic is closed on dateStr (either Weekend or US Federal Holiday)
export const isClinicClosed = (dateStr) => {
  if (!dateStr) return { isClosed: false, reason: '' };

  const weekendCheck = isWeekend(dateStr);
  if (weekendCheck.isWeekend) {
    return {
      isClosed: true,
      isWeekend: true,
      isHoliday: false,
      reason: `Weekend (${weekendCheck.dayName}) â€” Clinic is closed`
    };
  }

  const holidayCheck = isUSFederalHoliday(dateStr);
  if (holidayCheck.isHoliday) {
    return {
      isClosed: true,
      isWeekend: false,
      isHoliday: true,
      reason: `US Federal Holiday (${holidayCheck.name}) â€” Clinic is closed`,
      holidayName: holidayCheck.name
    };
  }

  return { isClosed: false, isWeekend: false, isHoliday: false, reason: '' };
};

// Get the next valid open clinic business day (skips Sat, Sun, Holidays)
export const getNextBusinessDay = (startDateStr) => {
  const current = startDateStr ? new Date(startDateStr + 'T00:00:00') : new Date();
  let candidate = new Date(current);
  candidate.setDate(candidate.getDate() + 1);

  for (let i = 0; i < 14; i++) {
    const formatted = formatDateStr(candidate);
    const closed = isClinicClosed(formatted);
    if (!closed.isClosed) {
      return formatted;
    }
    candidate.setDate(candidate.getDate() + 1);
  }
  return formatDateStr(candidate);
};

export const getNextUpcomingHoliday = () => {
  const today = formatDateStr(new Date());
  const year = new Date().getFullYear();
  let holidays = getUSHolidaysForYear(year);

  let upcoming = holidays.find(h => h.observedDate >= today);
  if (!upcoming) {
    holidays = getUSHolidaysForYear(year + 1);
    upcoming = holidays[0];
  }

  return upcoming;
};


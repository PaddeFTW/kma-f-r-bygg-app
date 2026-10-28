export const CALENDAR_FILTERS = [
  { id: 'personal', label: 'Personal', color: '#FF4C51' },
  { id: 'business', label: 'Business', color: '#8C57FF' },
  { id: 'family', label: 'Family', color: '#FFB400' },
  { id: 'holiday', label: 'Holiday', color: '#56CA00' },
  { id: 'etc', label: 'ETC', color: '#16B1FF' },
]

export const calendarEvents = [
  {
    id: 1,
    title: 'Design Review',
    calendar: 'business',
    start: new Date(2022, 0, 12, 12, 56),
    end: new Date(2022, 0, 13, 0, 0),
    allDay: false,
  },
  {
    id: 2,
    title: "Doctor's Appointment",
    calendar: 'personal',
    start: new Date(2022, 0, 20, 10, 0),
    end: new Date(2022, 0, 20, 11, 0),
    allDay: false,
  },
  {
    id: 3,
    title: 'Meeting With Client',
    calendar: 'business',
    start: new Date(2022, 0, 20, 14, 0),
    end: new Date(2022, 0, 20, 15, 30),
    allDay: false,
  },
  {
    id: 4,
    title: 'Family Trip',
    calendar: 'holiday',
    start: new Date(2022, 0, 22, 0, 0),
    end: new Date(2022, 0, 24, 0, 0),
    allDay: true,
  },
  {
    id: 5,
    title: 'Dart Game?',
    calendar: 'etc',
    start: new Date(2022, 0, 12, 18, 0),
    end: new Date(2022, 0, 12, 20, 0),
    allDay: false,
  },
  {
    id: 6,
    title: 'Meditation',
    calendar: 'family',
    start: new Date(2022, 0, 13, 9, 0),
    end: new Date(2022, 0, 13, 10, 0),
    allDay: false,
  },
  {
    id: 7,
    title: 'Dinner',
    calendar: 'family',
    start: new Date(2022, 0, 15, 19, 0),
    end: new Date(2022, 0, 15, 21, 0),
    allDay: false,
  },
  {
    id: 8,
    title: 'Product Meeting',
    calendar: 'business',
    start: new Date(2022, 0, 5, 11, 0),
    end: new Date(2022, 0, 5, 12, 30),
    allDay: false,
  },
  {
    id: 9,
    title: 'Monthly Meetup',
    calendar: 'etc',
    start: new Date(2022, 0, 8, 0, 0),
    end: new Date(2022, 0, 8, 23, 59),
    allDay: true,
  },
]

export function getFilterColor(id) {
  return CALENDAR_FILTERS.find((f) => f.id === id)?.color || '#8C57FF'
}

export function formatMonthTitle(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatWeekRange(date) {
  const start = startOfWeek(date)
  const end = addDays(start, 6)
  const sameMonth = start.getMonth() === end.getMonth()
  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`
  }
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export function formatDayTitle(date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatListTime(event) {
  if (event.allDay) return 'all-day'
  const opts = { hour: 'numeric', minute: '2-digit', hour12: true }
  const start = event.start.toLocaleTimeString('en-US', opts).toLowerCase().replace(' ', '')
  const end = event.end.toLocaleTimeString('en-US', opts).toLowerCase().replace(' ', '')
  return `${start} - ${end}`
}

export function formatMonthEventTime(date) {
  const h = date.getHours()
  const m = date.getMinutes()
  const ampm = h >= 12 ? 'p' : 'a'
  const hour12 = h % 12 || 12
  if (m === 0) return `${hour12}${ampm}`
  return `${hour12}:${String(m).padStart(2, '0')}${ampm}`
}

export function startOfWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1)
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function eventOccursOnDay(event, day) {
  const dayStart = new Date(day)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(day)
  dayEnd.setHours(23, 59, 59, 999)
  return event.start <= dayEnd && event.end >= dayStart
}

export function getMonthCells(current) {
  const first = startOfMonth(current)
  const gridStart = startOfWeek(first)
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}

export function getWeekDays(current) {
  const start = startOfWeek(current)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

export function formatHourLabel(h) {
  if (h === 0) return '12AM'
  if (h === 12) return '12PM'
  if (h < 12) return `${h}AM`
  return `${h - 12}PM`
}

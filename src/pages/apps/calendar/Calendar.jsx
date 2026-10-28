import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import VerticalLayout from '../../../layouts/VerticalLayout'
import {
  CALENDAR_FILTERS,
  calendarEvents,
  getFilterColor,
  formatMonthTitle,
  formatWeekRange,
  formatDayTitle,
  formatListTime,
  formatMonthEventTime,
  formatHourLabel,
  addDays,
  addMonths,
  isSameDay,
  isSameMonth,
  eventOccursOnDay,
  getMonthCells,
  getWeekDays,
  WEEKDAY_SHORT,
  HOURS,
} from './calendarData'

const VIEWS = ['month', 'week', 'day', 'list']

function EventChip({ event, compact }) {
  const color = getFilterColor(event.calendar)
  const label = compact
    ? `${!event.allDay ? `${formatMonthEventTime(event.start)} ` : ''}${event.title}`
    : event.title

  return (
    <Box
      title={event.title}
      sx={{
        px: 1.25,
        py: 0.5,
        mb: 0.75,
        borderRadius: '4px',
        bgcolor: color,
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.35,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {label}
    </Box>
  )
}

function TimeGridEvent({ event }) {
  const color = getFilterColor(event.calendar)
  const startH = event.start.getHours() + event.start.getMinutes() / 60
  const endH = event.end.getHours() + event.end.getMinutes() / 60
  const topHours = Math.max(startH, HOURS[0])
  const bottomHours = Math.min(endH <= startH ? startH + 1 : endH, HOURS[HOURS.length - 1] + 1)
  const top = ((topHours - HOURS[0]) / HOURS.length) * 100
  const height = Math.max(((bottomHours - topHours) / HOURS.length) * 100, 4)

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 4,
        right: 4,
        top: `${top}%`,
        height: `${height}%`,
        bgcolor: color,
        borderRadius: '4px',
        px: 1.5,
        py: 0.75,
        overflow: 'hidden',
        zIndex: 2,
        color: '#fff',
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', color: '#fff' }}>
        {event.title}
      </Typography>
      <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#fff', opacity: 0.9 }}>
        {formatListTime(event)}
      </Typography>
    </Box>
  )
}

function MonthView({ current, events, onSelectDay }) {
  const theme = useTheme()
  const cells = useMemo(() => getMonthCells(current), [current])
  const border = theme.palette.divider

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 560 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${border}` }}>
        {WEEKDAY_SHORT.map((d) => (
          <Box key={d} sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {d}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'repeat(6, minmax(88px, 1fr))',
        }}
      >
        {cells.map((day) => {
          const inMonth = isSameMonth(day, current)
          const dayEvents = events.filter((e) => eventOccursOnDay(e, day))
          return (
            <Box
              key={day.toISOString()}
              onClick={() => onSelectDay(day)}
              sx={{
                borderRight: `1px solid ${border}`,
                borderBottom: `1px solid ${border}`,
                p: 1.25,
                cursor: 'pointer',
                '&:nth-of-type(7n)': { borderRight: 0 },
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  width: 28,
                  height: 28,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  fontWeight: isSameDay(day, new Date(2022, 0, 12)) ? 600 : 400,
                  color: !inMonth
                    ? 'text.disabled'
                    : isSameDay(day, new Date(2022, 0, 12))
                      ? '#fff'
                      : 'text.secondary',
                  bgcolor: isSameDay(day, new Date(2022, 0, 12)) ? 'primary.main' : 'transparent',
                }}
              >
                {day.getDate()}
              </Typography>
              {dayEvents.slice(0, 3).map((ev) => (
                <EventChip key={ev.id} event={ev} compact />
              ))}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

function TimeGridView({ days, events, highlightDay }) {
  const theme = useTheme()
  const border = theme.palette.divider
  const hourHeight = 52

  return (
    <Box sx={{ minHeight: 560, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', borderBottom: `1px solid ${border}`, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 2 }}>
        <Box sx={{ width: 56, flexShrink: 0, borderRight: `1px solid ${border}` }} />
        {days.map((day) => {
          const highlighted = highlightDay && isSameDay(day, highlightDay)
          return (
            <Box
              key={day.toISOString()}
              sx={{
                flex: 1,
                py: 1.5,
                textAlign: 'center',
                borderRight: `1px solid ${border}`,
                bgcolor: highlighted ? 'rgba(140, 87, 255, 0.08)' : 'transparent',
                '&:last-of-type': { borderRight: 0 },
              }}
            >
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {WEEKDAY_SHORT[day.getDay()]}
                {days.length > 1 ? ` ${day.getMonth() + 1}/${day.getDate()}` : ''}
              </Typography>
            </Box>
          )
        })}
      </Box>

      <Box sx={{ display: 'flex', borderBottom: `1px solid ${border}`, minHeight: 36 }}>
        <Box sx={{ width: 56, flexShrink: 0, borderRight: `1px solid ${border}`, display: 'grid', placeItems: 'center' }}>
          <Typography variant="caption" color="text.disabled">
            all-day
          </Typography>
        </Box>
        {days.map((day) => (
          <Box
            key={`all-${day.toISOString()}`}
            sx={{ flex: 1, borderRight: `1px solid ${border}`, px: 0.5, py: 0.5, '&:last-of-type': { borderRight: 0 } }}
          >
            {events
              .filter((e) => e.allDay && eventOccursOnDay(e, day))
              .map((ev) => (
                <EventChip key={ev.id} event={ev} compact />
              ))}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: 56, flexShrink: 0, borderRight: `1px solid ${border}` }}>
          {HOURS.map((h) => (
            <Box key={h} sx={{ height: hourHeight, pt: 0.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.disabled">
                {formatHourLabel(h)}
              </Typography>
            </Box>
          ))}
        </Box>
        {days.map((day) => {
          const highlighted = highlightDay && isSameDay(day, highlightDay)
          const dayEvents = events.filter((e) => !e.allDay && eventOccursOnDay(e, day))
          return (
            <Box
              key={`col-${day.toISOString()}`}
              sx={{
                flex: 1,
                position: 'relative',
                borderRight: `1px solid ${border}`,
                bgcolor: highlighted ? 'rgba(140, 87, 255, 0.06)' : 'transparent',
                '&:last-of-type': { borderRight: 0 },
              }}
            >
              {HOURS.map((h) => (
                <Box key={h} sx={{ height: hourHeight, borderBottom: `1px solid ${border}` }} />
              ))}
              {dayEvents.map((ev) => (
                <TimeGridEvent key={ev.id} event={ev} />
              ))}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

function ListView({ current, events }) {
  const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
  const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59)

  const grouped = useMemo(() => {
    const inMonth = events
      .filter((e) => e.start <= monthEnd && e.end >= monthStart)
      .sort((a, b) => a.start - b.start)
    const map = new Map()
    inMonth.forEach((ev) => {
      const key = ev.start.toDateString()
      if (!map.has(key)) map.set(key, { date: new Date(ev.start), items: [] })
      map.get(key).items.push(ev)
    })
    return Array.from(map.values())
  }, [events, current])

  if (!grouped.length) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No events in this month</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: 480 }}>
      {grouped.map(({ date, items }) => (
        <Box key={date.toISOString()}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              px: 4,
              py: 2,
              bgcolor: 'action.hover',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={500} color="text.secondary">
              {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {date.toLocaleDateString('en-US', { weekday: 'long' })}
            </Typography>
          </Box>
          {items.map((ev) => (
            <Box
              key={ev.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                px: 4,
                py: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ width: 150, flexShrink: 0 }}>
                {formatListTime(ev)}
              </Typography>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getFilterColor(ev.calendar) }} />
              <Typography variant="body2" fontWeight={500}>
                {ev.title}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default function Calendar() {
  const theme = useTheme()
  const [view, setView] = useState('month')
  const [current, setCurrent] = useState(new Date(2022, 0, 12))
  const [filters, setFilters] = useState(() =>
    Object.fromEntries(CALENDAR_FILTERS.map((f) => [f.id, true])),
  )

  const allChecked = CALENDAR_FILTERS.every((f) => filters[f.id])
  const visibleEvents = useMemo(
    () => calendarEvents.filter((e) => filters[e.calendar]),
    [filters],
  )

  const title = useMemo(() => {
    if (view === 'week') return formatWeekRange(current)
    if (view === 'day') return formatDayTitle(current)
    return formatMonthTitle(current)
  }, [view, current])

  const navigate = (dir) => {
    if (view === 'month' || view === 'list') setCurrent((d) => addMonths(d, dir))
    else if (view === 'week') setCurrent((d) => addDays(d, dir * 7))
    else setCurrent((d) => addDays(d, dir))
  }

  return (
    <VerticalLayout>
      <Card
        sx={{
          display: 'flex',
          overflow: 'hidden',
          minHeight: { xs: 560, md: 'calc(100vh - 180px)' },
        }}
      >
        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            p: 3,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Button fullWidth variant="contained" size="large" sx={{ mb: 6 }}>
            Add Event
          </Button>
          <Typography
            variant="body2"
            sx={{ display: 'block', mb: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'text.disabled' }}
          >
            Filter
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allChecked}
                  indeterminate={!allChecked && CALENDAR_FILTERS.some((f) => filters[f.id])}
                  onChange={() => {
                    const next = !allChecked
                    setFilters(Object.fromEntries(CALENDAR_FILTERS.map((f) => [f.id, next])))
                  }}
                  sx={{ color: 'secondary.main', '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: 'secondary.main' } }}
                />
              }
              label={<Typography variant="body2">View All</Typography>}
              sx={{ ml: 0 }}
            />
            {CALENDAR_FILTERS.map((f) => (
              <FormControlLabel
                key={f.id}
                control={
                  <Checkbox
                    checked={filters[f.id]}
                    onChange={() => setFilters((prev) => ({ ...prev, [f.id]: !prev[f.id] }))}
                    sx={{ color: f.color, '&.Mui-checked': { color: f.color } }}
                  />
                }
                label={<Typography variant="body2">{f.label}</Typography>}
                sx={{ ml: 0 }}
              />
            ))}
          </FormGroup>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              px: 3,
              py: 2.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => navigate(-1)}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton size="small" onClick={() => navigate(1)}>
                <ChevronRightIcon />
              </IconButton>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={() => setCurrent(new Date(2022, 0, 12))}
                sx={{ ml: 1, borderColor: 'divider', color: 'text.primary' }}
              >
                Today
              </Button>
              <Typography variant="h5" sx={{ ml: 2 }}>
                {title}
              </Typography>
            </Box>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={view}
              onChange={(_, v) => v && setView(v)}
              sx={{
                bgcolor: 'action.hover',
                borderRadius: 1,
                p: 0.5,
                gap: 0.5,
                '& .MuiToggleButtonGroup-grouped': {
                  border: 0,
                  borderRadius: '4px !important',
                  mx: 0,
                },
                '& .MuiToggleButton-root': {
                  textTransform: 'capitalize',
                  px: 3,
                  py: 0.75,
                  color: 'text.secondary',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    color: 'primary.main',
                    bgcolor: 'background.paper',
                    boxShadow: (t) =>
                      t.palette.mode === 'dark'
                        ? '0px 2px 6px rgba(19, 17, 32, 0.4)'
                        : '0px 2px 6px rgba(47, 43, 61, 0.14)',
                    '&:hover': { bgcolor: 'background.paper' },
                  },
                },
              }}
            >
              {VIEWS.map((v) => (
                <ToggleButton key={v} value={v}>
                  {v}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', bgcolor: theme.palette.background.paper }}>
            {view === 'month' && (
              <MonthView
                current={current}
                events={visibleEvents}
                onSelectDay={(d) => {
                  setCurrent(d)
                  setView('day')
                }}
              />
            )}
            {view === 'week' && (
              <TimeGridView days={getWeekDays(current)} events={visibleEvents} highlightDay={new Date(2022, 0, 13)} />
            )}
            {view === 'day' && <TimeGridView days={[current]} events={visibleEvents} />}
            {view === 'list' && <ListView current={current} events={visibleEvents} />}
          </Box>
        </Box>
      </Card>
    </VerticalLayout>
  )
}

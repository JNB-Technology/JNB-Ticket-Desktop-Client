import React, { useState, useEffect, useRef } from 'react';
import mockTicketsData from '../../mockdata/mockTickets.json';
import './CalendarPage.css';

interface Ticket {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  creator: string;
  business: string;
  assignee: string;
  createdAt: Date;
  updates: number;
  description: string;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hours = Math.floor(i / 4).toString().padStart(2, '0');
  const minutes = ((i % 4) * 15).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
});

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysFromPrevMonth = firstDay.getDay();
  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) => ({
    date: new Date(year, month - 1, prevMonth.getDate() - daysFromPrevMonth + i + 1),
    isCurrentMonth: false,
  }));

  const currentMonthDays = Array.from({ length: lastDay.getDate() }, (_, i) => ({
    date: new Date(year, month, i + 1),
    isCurrentMonth: true,
  }));

  const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => ({
    date: new Date(year, month + 1, i + 1),
    isCurrentMonth: false,
  }));

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};

const formatMonth = (date: Date) => date.toLocaleString('default', { month: 'long', year: 'numeric' });

const CalendarPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentTimePosition, setCurrentTimePosition] = useState(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const timeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsedTickets: Ticket[] = (mockTicketsData as unknown as Ticket[]).map(ticket => ({
      ...ticket,
      createdAt: new Date(ticket.createdAt),
    }));
    setTickets(parsedTickets);
  }, []);

  const updateCurrentTime = () => {
    const now = new Date();
    setCurrentTime(now);
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const position = (totalMinutes / 1440) * (timeContainerRef.current?.scrollHeight || 0);
    setCurrentTimePosition(position);

    if (timeContainerRef.current) {
      const containerHeight = timeContainerRef.current.clientHeight;
      const scrollPosition = position - containerHeight / 2;
      timeContainerRef.current.scrollTop = scrollPosition;
    }
  };

  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getTicketsForDay = (day: { date: Date }) => {
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      return (
        ticketDate.getDate() === day.date.getDate() &&
        ticketDate.getMonth() === day.date.getMonth() &&
        ticketDate.getFullYear() === day.date.getFullYear()
      );
    });
  };

  const EventBadge: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
    const priorityColors = {
      high: 'bg-red-200 text-red-800',
      medium: 'bg-yellow-200 text-yellow-800',
      low: 'bg-green-200 text-green-800',
      default: 'bg-blue-200 text-blue-800',
    };

    return (
      <div
        className={`
          ${priorityColors[ticket.priority] || priorityColors.default}
          text-xs px-2 py-0.5 rounded-full truncate max-w-[90%]
          hover:z-10 hover:scale-105 transition-transform cursor-pointer
        `}
        title={`${ticket.title} - ${new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      >
        {ticket.title}
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
          className="calendar-nav-button"
        >
          ←
        </button>
        <div className="calendar-header-title">
          <h2>{formatMonth(currentDate)}</h2>
          <div className="current-time">{formatTimeDisplay(currentTime)}</div>
        </div>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
          className="calendar-nav-button"
        >
          →
        </button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-header-day">
            {day}
          </div>
        ))}
        {getDaysInMonth(currentDate).map((day, idx) => (
          <div
            key={idx}
            className={`
              calendar-day
              ${day.isCurrentMonth ? 'current-month' : 'other-month'}
              ${isToday(day.date) ? 'today' : ''}
            `}
          >
            <span className="date">{day.date.getDate()}</span>
            <div className="tickets">
              {getTicketsForDay(day).map((ticket, ticketIdx) => (
                <EventBadge key={ticketIdx} ticket={ticket} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="time-panel" ref={timeContainerRef}>
        {timeSlots.map((time, idx) => (
          <div key={idx} className="time-slot">
            <span>{time}</span>
          </div>
        ))}
        <div className="current-time-indicator" style={{ top: `${currentTimePosition}px` }}>
          <div className="current-time-label">{formatTimeDisplay(currentTime)}</div>
          <div className="current-time-line"></div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

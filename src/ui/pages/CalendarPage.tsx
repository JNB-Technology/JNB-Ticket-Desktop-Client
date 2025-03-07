import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import mockTicketsData from '../../mockdata/mockTickets.json';
import './CalendarPage.css';

type ViewType = 'day' | 'week' | 'month';

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const parsedTickets = (mockTicketsData as any[]).map(ticket => ({
      ...ticket,
      start: new Date(ticket.createdAt),
      end: new Date(new Date(ticket.createdAt).getTime() + 60 * 60 * 1000), // 1 hour duration
    }));
    setTickets(parsedTickets);
  }, []);

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  });

  const getDaysInView = () => {
    const days = [];
    const startDate = new Date(currentDate);
    
    if (view === 'day') {
      days.push(startDate);
    } else if (view === 'week') {
      startDate.setDate(currentDate.getDate() - currentDate.getDay());
      for (let i = 0; i < 7; i++) {
        days.push(new Date(startDate.setDate(startDate.getDate() + (i === 0 ? 0 : 1))));
      }
    } else if (view === 'month') {
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      // Add days from previous month to start the calendar from Sunday
      const startPadding = firstDay.getDay();
      for (let i = startPadding - 1; i >= 0; i--) {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() - i - 1);
        days.push(date);
      }
      
      // Add all days of current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
      }
      
      // Add days from next month to complete the grid
      const endPadding = 42 - days.length; // 6 rows * 7 days = 42
      for (let i = 1; i <= endPadding; i++) {
        const date = new Date(lastDay);
        date.setDate(lastDay.getDate() + i);
        days.push(date);
      }
    }
    return days;
  };

  const getTicketsForTimeSlot = (date: Date, timeSlot: string) => {
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.start);
      const [hours, minutes] = timeSlot.split(':').map(Number);
      return ticketDate.getHours() === hours && 
             Math.floor(ticketDate.getMinutes() / 30) * 30 === minutes &&
             ticketDate.getDate() === date.getDate() &&
             ticketDate.getMonth() === date.getMonth() &&
             ticketDate.getFullYear() === date.getFullYear();
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="calendar-nav">
          <button onClick={() => setCurrentDate(new Date())}>Today</button>
          <button onClick={() => handleNavigate('prev')}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button onClick={() => handleNavigate('next')}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <h2>{currentDate.toLocaleDateString('default', { 
            month: 'long', 
            year: 'numeric',
            day: view === 'day' ? 'numeric' : undefined
          })}</h2>
        </div>
        <div className="view-options">
          <button 
            className={view === 'day' ? 'active' : ''} 
            onClick={() => setView('day')}
          >
            Day
          </button>
          <button 
            className={view === 'week' ? 'active' : ''} 
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button 
            className={view === 'month' ? 'active' : ''} 
            onClick={() => setView('month')}
          >
            Month
          </button>
        </div>
        <button className="create-event">
          <FontAwesomeIcon icon={faPlus} /> Create
        </button>
      </header>

      <div className={`calendar-grid ${view}`}>
        {view === 'month' ? (
          <div className="month-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="month-header">{day}</div>
            ))}
            {getDaysInView().map((date, idx) => (
              <div 
                key={idx} 
                className={`month-cell ${isToday(date) ? 'today' : ''} ${
                  date.getMonth() === currentDate.getMonth() ? 'current-month' : 'other-month'
                }`}
              >
                <span className="date-number">{date.getDate()}</span>
                <div className="month-events">
                  {tickets
                    .filter(ticket => {
                      const ticketDate = new Date(ticket.start);
                      return ticketDate.getDate() === date.getDate() &&
                             ticketDate.getMonth() === date.getMonth() &&
                             ticketDate.getFullYear() === date.getFullYear();
                    })
                    .slice(0, 3) // Show only first 3 events
                    .map((ticket, ticketIdx) => (
                      <div 
                        key={ticketIdx}
                        className={`month-event priority-${ticket.priority}`}
                        title={ticket.title}
                      >
                        {ticket.title}
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="calendar-grid">
            <div className="time-axis">
              {timeSlots.map(time => (
                <div key={time} className="time-slot">
                  <span>{time}</span>
                </div>
              ))}
            </div>
            <div className="days-grid" style={{ 
              gridTemplateColumns: `repeat(${getDaysInView().length}, 1fr)` 
            }}>
              {getDaysInView().map((date, dayIndex) => (
                <div key={dayIndex} className={`day-column ${isToday(date) ? 'today' : ''}`}>
                  <div className={`day-header ${isToday(date) ? 'today' : ''}`}>
                    <span className="day-name">
                      {date.toLocaleDateString('default', { weekday: 'short' })}
                    </span>
                    <span className="day-number">
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="time-slots">
                    {timeSlots.map((timeSlot, timeIndex) => (
                      <div key={timeIndex} className="calendar-cell">
                        {getTicketsForTimeSlot(date, timeSlot).map((ticket, ticketIndex) => (
                          <div 
                            key={ticketIndex}
                            className={`event-block priority-${ticket.priority}`}
                            title={ticket.title}
                          >
                            <span className="event-time">
                              {new Date(ticket.start).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            <span className="event-title">{ticket.title}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;

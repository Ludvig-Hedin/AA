import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { getCurrentUser } from '../services/supabase';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
  description?: string;
  color?: string;
  attendees?: string[];
}

interface CalendarViewProps {
  events: Event[];
  currentDate: Date;
  view: 'day' | 'week' | 'month';
  onEventClick: (event: Event) => void;
}

// Helper functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const getWeekDays = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(date);
    newDate.setDate(diff + i);
    weekDays.push(newDate);
  }
  return weekDays;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Calendar Day View Component
const DayView: React.FC<{ date: Date; events: Event[]; onEventClick: (event: Event) => void }> = ({ 
  date, 
  events, 
  onEventClick 
}) => {
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  const filteredEvents = events.filter(event => 
    event.start.getDate() === date.getDate() &&
    event.start.getMonth() === date.getMonth() &&
    event.start.getFullYear() === date.getFullYear()
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="text-xl font-semibold mb-4 p-4 border-b border-[#232425]">
        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
      <div className="relative min-h-[1440px]"> {/* 24 hours * 60px per hour */}
        {hoursOfDay.map(hour => (
          <div key={hour} className="flex border-b border-[#232425] h-[60px]">
            <div className="w-16 text-right pr-2 text-gray-400 text-sm">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}
            </div>
            <div className="flex-1 relative"></div>
          </div>
        ))}
        
        {filteredEvents.map(event => {
          const startHour = event.start.getHours() + (event.start.getMinutes() / 60);
          const endHour = event.end.getHours() + (event.end.getMinutes() / 60);
          const duration = endHour - startHour;
          
          return (
            <div 
              key={event.id}
              className={`absolute left-16 right-4 rounded px-2 py-1 text-white overflow-hidden cursor-pointer`}
              style={{
                top: `${startHour * 60}px`,
                height: `${duration * 60}px`,
                backgroundColor: event.color || '#2383E2'
              }}
              onClick={() => onEventClick(event)}
            >
              <div className="font-semibold truncate">{event.title}</div>
              <div className="text-xs opacity-90">{formatTime(event.start)} - {formatTime(event.end)}</div>
              {event.location && <div className="text-xs mt-1">{event.location}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Calendar Week View Component
const WeekView: React.FC<{ date: Date; events: Event[]; onEventClick: (event: Event) => void }> = ({ 
  date, 
  events, 
  onEventClick 
}) => {
  const weekDays = getWeekDays(date);
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="h-full overflow-auto">
      <div className="flex border-b border-[#232425] sticky top-0 bg-[#1A1B1C] z-10">
        <div className="w-16"></div>
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`flex-1 text-center p-2 ${
              day.getDate() === new Date().getDate() && 
              day.getMonth() === new Date().getMonth() && 
              day.getFullYear() === new Date().getFullYear() 
                ? 'bg-blue-900 bg-opacity-30' 
                : ''
            }`}
          >
            <div className="font-semibold">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className="text-sm">{formatDate(day)}</div>
          </div>
        ))}
      </div>
      
      <div className="relative min-h-[1440px]"> {/* 24 hours * 60px per hour */}
        {hoursOfDay.map(hour => (
          <div key={hour} className="flex border-b border-[#232425] h-[60px]">
            <div className="w-16 text-right pr-2 text-gray-400 text-sm">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}
            </div>
            <div className="flex flex-1">
              {weekDays.map((day, index) => (
                <div key={index} className="flex-1 border-l border-[#232425] relative"></div>
              ))}
            </div>
          </div>
        ))}
        
        {events.map(event => {
          const dayIndex = weekDays.findIndex(day => 
            day.getDate() === event.start.getDate() &&
            day.getMonth() === event.start.getMonth() &&
            day.getFullYear() === event.start.getFullYear()
          );
          
          if (dayIndex === -1) return null;
          
          const startHour = event.start.getHours() + (event.start.getMinutes() / 60);
          const endHour = event.end.getHours() + (event.end.getMinutes() / 60);
          const duration = endHour - startHour;
          
          const leftPosition = 16 + (dayIndex * (100 / 7)) + '%';
          const width = 100 / 7 - 0.5 + '%';
          
          return (
            <div 
              key={event.id}
              className="absolute rounded px-2 py-1 text-white overflow-hidden cursor-pointer"
              style={{
                top: `${startHour * 60}px`,
                height: `${duration * 60}px`,
                left: leftPosition,
                width: width,
                backgroundColor: event.color || '#2383E2'
              }}
              onClick={() => onEventClick(event)}
            >
              <div className="font-semibold truncate">{event.title}</div>
              <div className="text-xs opacity-90">{formatTime(event.start)} - {formatTime(event.end)}</div>
              {event.location && <div className="text-xs mt-1 truncate">{event.location}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Calendar Month View Component
const MonthView: React.FC<{ date: Date; events: Event[]; onEventClick: (event: Event) => void }> = ({ 
  date, 
  events, 
  onEventClick 
}) => {
  const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(date.getFullYear(), date.getMonth());
  
  // Create the days array with empty slots for days from previous month
  const days: (Date | null)[] = Array.from({ length: firstDayOfMonth }, () => null);
  
  // Add days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }
  
  // Calculate events for each day
  const eventsByDay = days.map(day => {
    if (!day) return [];
    return events.filter(event => 
      event.start.getDate() === day.getDate() &&
      event.start.getMonth() === day.getMonth() &&
      event.start.getFullYear() === day.getFullYear()
    );
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-7 border-b border-[#232425] text-center py-2 font-semibold sticky top-0 bg-[#1A1B1C] z-10">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      <div className="grid grid-cols-7 auto-rows-fr h-full">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`border border-[#232425] min-h-[100px] p-2 ${
              day && day.getDate() === new Date().getDate() && 
              day.getMonth() === new Date().getMonth() && 
              day.getFullYear() === new Date().getFullYear() 
                ? 'bg-blue-900 bg-opacity-30' 
                : ''
            }`}
          >
            {day && (
              <>
                <div className="text-right mb-2">
                  <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 ${
                    day.getDate() === new Date().getDate() && 
                    day.getMonth() === new Date().getMonth() && 
                    day.getFullYear() === new Date().getFullYear() 
                      ? 'bg-blue-600' 
                      : ''
                  }`}>
                    {day.getDate()}
                  </span>
                </div>
                <div className="space-y-1 max-h-[240px] overflow-y-auto">
                  {eventsByDay[index].map(event => (
                    <div 
                      key={event.id}
                      className="text-xs p-1 rounded truncate cursor-pointer"
                      style={{ backgroundColor: event.color || '#2383E2' }}
                      onClick={() => onEventClick(event)}
                    >
                      {formatTime(event.start)} {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Calendar Component
const Calendar: React.FC = () => {
  const [userName, setUserName] = useState<string>("User");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Helper function to create dates with specific times
  const createDate = (dayOffset: number, hours: number, minutes: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };
  
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Meeting with Sofia',
      start: createDate(0, 10, 0),
      end: createDate(0, 11, 30),
      location: 'Conference Room A',
      description: 'Discuss project roadmap',
      attendees: ['Sofia', 'Ludvig', 'Johan']
    },
    {
      id: '2',
      title: 'Lunch with team',
      start: createDate(0, 12, 30),
      end: createDate(0, 13, 30),
      location: 'Cafeteria',
      color: '#4CAF50'
    },
    {
      id: '3',
      title: 'Client presentation',
      start: createDate(0, 14, 0),
      end: createDate(0, 15, 30),
      location: 'Main Boardroom',
      description: 'Present quarterly results',
      color: '#FF5722'
    },
    {
      id: '4',
      title: 'Weekly team sync',
      start: createDate(1, 9, 0),
      end: createDate(1, 10, 0),
      location: 'Zoom call',
      color: '#9C27B0'
    },
    {
      id: '5',
      title: 'Product review',
      start: createDate(2, 11, 0),
      end: createDate(2, 12, 0),
      location: 'Meeting Room B',
      color: '#FF9800'
    }
  ]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user info
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserName(user.email);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const getCalendarTitle = () => {
    if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } else if (view === 'week') {
      const weekDays = getWeekDays(currentDate);
      const firstDay = weekDays[0];
      const lastDay = weekDays[6];
      const sameMonth = firstDay.getMonth() === lastDay.getMonth();
      
      if (sameMonth) {
        return `${firstDay.toLocaleDateString('en-US', { month: 'long' })} ${firstDay.getDate()} - ${lastDay.getDate()}, ${firstDay.getFullYear()}`;
      } else {
        return `${firstDay.toLocaleDateString('en-US', { month: 'short' })} ${firstDay.getDate()} - ${lastDay.toLocaleDateString('en-US', { month: 'short' })} ${lastDay.getDate()}, ${firstDay.getFullYear()}`;
      }
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-[#121314] text-[#FFFEFC]' : 'bg-[#FFFEFC] text-[#040404]'}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar userName={userName} isDarkMode={isDarkMode} />
        
        {/* Main content */}
        <div className="flex-1 overflow-auto relative flex justify-center">
          <div className="w-full max-w-[1160px] mx-auto">
            {/* Top nav with blur effect */}
            <div className="sticky top-0 z-10 backdrop-blur-xl bg-opacity-50 dark:bg-opacity-50 bg-[#FFFEFC] dark:bg-[#121314] border-b border-[#232425] p-3 flex items-center">
              <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-gray-300 mr-4">
                <span className="material-icons">arrow_back</span>
                <span className="ml-1">Dashboard</span>
              </Link>
              
              <h1 className="text-xl font-semibold">Calendar</h1>
              
              <div className="ml-auto flex items-center space-x-3">
                <button
                  className="px-3 py-1 text-sm border border-[#333435] rounded-full hover:bg-[#232425] cursor-pointer"
                  onClick={handleToday}
                >
                  Today
                </button>
                <div className="flex items-center">
                  <button
                    className="p-1 text-gray-400 hover:text-gray-200 cursor-pointer"
                    onClick={handlePrevious}
                  >
                    <span className="material-icons">chevron_left</span>
                  </button>
                  <button
                    className="p-1 text-gray-400 hover:text-gray-200 cursor-pointer"
                    onClick={handleNext}
                  >
                    <span className="material-icons">chevron_right</span>
                  </button>
                </div>
                <span className="text-lg">{getCalendarTitle()}</span>
              </div>
            </div>
            
            {/* Calendar toolbar */}
            <div className="p-3 bg-[#1A1B1C] border-b border-[#232425] flex items-center">
              <div className="flex space-x-3">
                <button 
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-opacity-80 ${view === 'day' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#232425]'}`}
                  onClick={() => setView('day')}
                >
                  Day
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-opacity-80 ${view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#232425]'}`}
                  onClick={() => setView('week')}
                >
                  Week
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-opacity-80 ${view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-[#232425]'}`}
                  onClick={() => setView('month')}
                >
                  Month
                </button>
              </div>
              
              <div className="ml-auto">
                <button 
                  className="px-3 py-1 flex items-center text-sm bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700"
                  onClick={() => window.alert('Create event feature coming soon!')}
                >
                  <span className="material-icons text-sm mr-1">add</span>
                  Create
                </button>
              </div>
            </div>
            
            {/* Calendar view */}
            <div className="bg-[#1A1B1C] rounded-lg m-6 overflow-hidden shadow-sm h-[calc(100vh-200px)]">
              {view === 'day' && (
                <DayView 
                  date={currentDate}
                  events={events}
                  onEventClick={handleEventClick}
                />
              )}
              
              {view === 'week' && (
                <WeekView 
                  date={currentDate}
                  events={events}
                  onEventClick={handleEventClick}
                />
              )}
              
              {view === 'month' && (
                <MonthView 
                  date={currentDate}
                  events={events}
                  onEventClick={handleEventClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Event details modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-[#1A1B1C] rounded-lg shadow-lg p-6 w-full max-w-md m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Event Details</h2>
              <button
                className="text-gray-400 hover:text-gray-200"
                onClick={() => setShowEventModal(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="border-l-4 pl-3 mb-4" style={{ borderColor: selectedEvent.color || '#2383E2' }}>
              <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
              <div className="text-sm text-gray-400">
                {selectedEvent.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-sm text-gray-400">
                {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
              </div>
            </div>
            
            {selectedEvent.location && (
              <div className="mb-3 flex items-start">
                <span className="material-icons text-gray-400 mr-2">location_on</span>
                <div>{selectedEvent.location}</div>
              </div>
            )}
            
            {selectedEvent.description && (
              <div className="mb-3 flex items-start">
                <span className="material-icons text-gray-400 mr-2">description</span>
                <div>{selectedEvent.description}</div>
              </div>
            )}
            
            {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
              <div className="mb-3 flex items-start">
                <span className="material-icons text-gray-400 mr-2">people</span>
                <div>{selectedEvent.attendees.join(', ')}</div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-3 py-1 text-sm border border-[#333435] rounded-lg hover:bg-[#232425]"
                onClick={() => window.alert('Edit event feature coming soon!')}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 text-sm border border-[#333435] rounded-lg hover:bg-[#232425]"
                onClick={() => window.alert('Delete event feature coming soon!')}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 
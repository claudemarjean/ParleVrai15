import router from '../router/index.js';
import authService from '../services/auth.js';
import progressService from '../services/progress.js';
import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

/**
 * Page Calendrier
 */

export function renderCalendarPage() {
  const app = document.getElementById('app');
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  app.innerHTML = '';
  
  // Header
  const header = createHeader(true, authService.isAdmin());
  app.appendChild(header);
  
  // Main content
  const main = document.createElement('main');
  main.className = 'calendar-page';
  main.innerHTML = `
    <div class="container container-sm">
      <div class="page-header fade-in">
        <h1>📅 Calendrier</h1>
        <p class="text-gray">Visualise ta progression jour après jour</p>
      </div>

      <div class="calendar-container card fade-in">
        <div class="calendar-header">
          <button id="prev-month" class="btn btn-secondary btn-sm">←</button>
          <h2 id="current-month">${getMonthName(currentMonth)} ${currentYear}</h2>
          <button id="next-month" class="btn btn-secondary btn-sm">→</button>
        </div>
        
        <div id="calendar-grid" class="calendar-grid">
          ${renderCalendar(currentMonth, currentYear)}
        </div>
      </div>

      <div class="calendar-legend card fade-in mt-lg">
        <h3>Légende</h3>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-dot completed"></div>
            <span>Leçon complétée</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot today"></div>
            <span>Aujourd'hui</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot future"></div>
            <span>Jour futur</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  app.appendChild(main);
  
  // Footer
  const footer = createFooter();
  app.appendChild(footer);
  
  // Attacher les événements
  attachCalendarEvents(currentMonth, currentYear);
}

/**
 * Rendre le calendrier
 */
function renderCalendar(month, year) {
  const calendar = progressService.getCalendar(month, year);
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date().toISOString().split('T')[0];
  
  let html = '';
  
  // Jours de la semaine
  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  daysOfWeek.forEach(day => {
    html += `<div class="calendar-day-name">${day}</div>`;
  });
  
  // Jours vides avant le premier jour du mois
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }
  
  // Jours du mois
  calendar.forEach(day => {
    const isToday = day.date === today;
    const isFuture = new Date(day.date) > new Date();
    const classes = ['calendar-day'];
    
    if (day.completed) classes.push('completed');
    if (isToday) classes.push('today');
    if (isFuture) classes.push('future');
    
    html += `
      <div class="${classes.join(' ')}" data-date="${day.date}">
        <div class="day-number">${day.day}</div>
        ${day.completed ? '<div class="day-status">✓</div>' : ''}
      </div>
    `;
  });
  
  return html;
}

/**
 * Attacher les événements
 */
function attachCalendarEvents(currentMonth, currentYear) {
  let month = currentMonth;
  let year = currentYear;
  
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');
  const monthTitle = document.getElementById('current-month');
  const calendarGrid = document.getElementById('calendar-grid');
  
  prevBtn.addEventListener('click', () => {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    updateCalendar();
  });
  
  nextBtn.addEventListener('click', () => {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    updateCalendar();
  });
  
  function updateCalendar() {
    monthTitle.textContent = `${getMonthName(month)} ${year}`;
    calendarGrid.innerHTML = renderCalendar(month, year);
  }
  
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authService.logout();
      router.logout();
    });
  }
}

/**
 * Obtenir le nom du mois
 */
function getMonthName(month) {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[month];
}

/**
 * Styles du calendrier
 */
export const calendarPageStyles = `
.calendar-page {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - 200px);
}

.page-header {
  margin-bottom: var(--spacing-2xl);
}

.calendar-container {
  padding: var(--spacing-xl);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.calendar-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-sm);
}

.calendar-day-name {
  text-align: center;
  font-weight: 600;
  color: var(--gray-600);
  padding: var(--spacing-sm);
  font-size: 0.875rem;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  background-color: var(--gray-50);
  position: relative;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.calendar-day:hover:not(.empty):not(.future) {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.calendar-day.empty {
  background-color: transparent;
  cursor: default;
}

.calendar-day.completed {
  background-color: var(--success);
  color: white;
}

.calendar-day.today {
  border: 2px solid var(--primary);
  font-weight: 700;
}

.calendar-day.future {
  background-color: var(--gray-100);
  color: var(--gray-400);
  cursor: default;
}

.day-number {
  font-size: 1rem;
  font-weight: 600;
}

.day-status {
  font-size: 1.25rem;
  margin-top: var(--spacing-xs);
}

.calendar-legend {
  padding: var(--spacing-lg);
}

.calendar-legend h3 {
  margin-bottom: var(--spacing-md);
  font-size: 1rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.legend-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.legend-dot.completed {
  background-color: var(--success);
}

.legend-dot.today {
  border: 2px solid var(--primary);
  background-color: var(--gray-50);
}

.legend-dot.future {
  background-color: var(--gray-100);
}

@media (max-width: 768px) {
  .calendar-grid {
    gap: 2px;
  }
  
  .calendar-day {
    padding: var(--spacing-xs);
  }
  
  .day-number {
    font-size: 0.875rem;
  }
  
  .day-status {
    font-size: 1rem;
  }
  
  .calendar-day-name {
    font-size: 0.75rem;
  }
}
`;

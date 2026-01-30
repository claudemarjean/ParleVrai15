/**
 * Service de gestion de la progression utilisateur
 */

class ProgressService {
  constructor() {
    this.progress = this.loadProgress();
  }

  /**
   * Charger la progression depuis le localStorage
   */
  loadProgress() {
    const stored = localStorage.getItem('progress');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      completedLessons: [],
      currentStreak: 0,
      longestStreak: 0,
      totalMinutes: 0,
      lastCompletedDate: null
    };
  }

  /**
   * Sauvegarder la progression
   */
  saveProgress() {
    localStorage.setItem('progress', JSON.stringify(this.progress));
  }

  /**
   * Marquer une leçon comme complétée
   */
  completeLesson(lessonId) {
    const today = new Date().toISOString().split('T')[0];
    
    if (!this.progress.completedLessons.find(l => l.id === lessonId)) {
      this.progress.completedLessons.push({
        id: lessonId,
        completedAt: today
      });
      
      // Ajouter 15 minutes
      this.progress.totalMinutes += 15;
      
      // Calculer la série
      this.updateStreak(today);
      
      this.saveProgress();
    }
  }

  /**
   * Mettre à jour la série de jours consécutifs
   */
  updateStreak(today) {
    const lastDate = this.progress.lastCompletedDate;
    
    if (!lastDate) {
      this.progress.currentStreak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastDate === yesterdayStr) {
        this.progress.currentStreak++;
      } else if (lastDate !== today) {
        this.progress.currentStreak = 1;
      }
    }
    
    this.progress.lastCompletedDate = today;
    
    if (this.progress.currentStreak > this.progress.longestStreak) {
      this.progress.longestStreak = this.progress.currentStreak;
    }
  }

  /**
   * Vérifier si une leçon est complétée
   */
  isLessonCompleted(lessonId) {
    return this.progress.completedLessons.some(l => l.id === lessonId);
  }

  /**
   * Récupérer les statistiques
   */
  getStats() {
    return {
      completedCount: this.progress.completedLessons.length,
      currentStreak: this.progress.currentStreak,
      longestStreak: this.progress.longestStreak,
      totalMinutes: this.progress.totalMinutes,
      totalHours: Math.floor(this.progress.totalMinutes / 60)
    };
  }

  /**
   * Récupérer le calendrier des leçons
   */
  getCalendar(month, year) {
    // Retourner les jours du mois avec statut complété/non complété
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const completed = this.progress.completedLessons.some(
        l => l.completedAt === dateStr
      );
      
      calendar.push({
        day,
        date: dateStr,
        completed
      });
    }
    
    return calendar;
  }
}

export default new ProgressService();

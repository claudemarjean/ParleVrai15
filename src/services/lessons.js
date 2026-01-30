/**
 * Service de gestion des leçons
 * Préparé pour intégration Supabase
 */

class LessonService {
  constructor() {
    this.lessons = this.loadLessons();
  }

  /**
   * Charger les leçons depuis le localStorage
   */
  loadLessons() {
    const stored = localStorage.getItem('lessons');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Données de démonstration
    return [
      {
        id: 1,
        level: 'Débutant',
        theme: 'Se présenter',
        date: '2026-01-30',
        reading: "Bonjour ! Je m'appelle Marie. J'ai 25 ans et j'habite à Paris. Je suis étudiante en médecine. J'aime beaucoup lire et faire du sport. Le weekend, j'aime me promener dans les parcs de la ville.",
        grammar: {
          title: "Les verbes « être » et « avoir » au présent",
          explanation: "Ces deux verbes sont essentiels en français.\n\nÊTRE: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont\n\nAVOIR: j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont",
          examples: [
            "Je suis étudiant → I am a student",
            "J'ai 25 ans → I am 25 years old"
          ]
        },
        vocabulary: [
          { word: "se présenter", translation: "to introduce oneself" },
          { word: "habiter", translation: "to live" },
          { word: "étudiant(e)", translation: "student" },
          { word: "aimer", translation: "to like/love" },
          { word: "se promener", translation: "to take a walk" }
        ],
        exercise: {
          instruction: "Présentez-vous à voix haute en suivant ce modèle",
          template: "Bonjour ! Je m'appelle [votre nom]. J'ai [votre âge] ans. J'habite à [votre ville]. Je suis [votre profession]. J'aime [vos passions].",
          tips: [
            "Parlez lentement et clairement",
            "Répétez plusieurs fois",
            "Enregistrez-vous si possible"
          ]
        },
        aiPrompt: "Tu es un professeur de français bienveillant. Je viens de faire ma première leçon sur les présentations. Pose-moi 3 questions simples en français pour pratiquer (ex: Comment tu t'appelles ? Où habites-tu ?). Après mes réponses, corrige-moi gentiment et encourage-moi. Parle simplement."
      },
      {
        id: 2,
        level: 'Débutant',
        theme: 'Les courses',
        date: '2026-01-31',
        reading: "Je vais au marché tous les samedis. J'achète des fruits frais, des légumes et du pain. Le vendeur est très sympa. Il me dit toujours « Bonjour madame ! » avec un grand sourire. J'aime l'ambiance du marché.",
        grammar: {
          title: "Les articles définis et indéfinis",
          explanation: "Les articles s'accordent avec le nom en genre et en nombre.\n\nDÉFINIS (le, la, les): objets spécifiques\nINDÉFINIS (un, une, des): objets non spécifiques\n\nPartitifs (du, de la): quantités non précises",
          examples: [
            "Je vais au marché (le marché)",
            "J'achète des fruits (fruits en général)",
            "Je veux du pain (une quantité de pain)"
          ]
        },
        vocabulary: [
          { word: "le marché", translation: "the market" },
          { word: "acheter", translation: "to buy" },
          { word: "frais/fraîche", translation: "fresh" },
          { word: "le vendeur", translation: "the seller" },
          { word: "sympa", translation: "nice (informal)" }
        ],
        exercise: {
          instruction: "Simulez un dialogue au marché",
          template: "Vendeur: Bonjour ! Que désirez-vous ?\nVous: Bonjour ! Je voudrais [produit], s'il vous plaît.\nVendeur: Voilà ! Ce sera [prix] euros.\nVous: Merci beaucoup !",
          tips: [
            "Utilisez « s'il vous plaît » et « merci »",
            "Pratiquez les deux rôles",
            "Variez les produits"
          ]
        },
        aiPrompt: "Tu es un vendeur sympathique au marché français. Je veux pratiquer mes achats. Démarre la conversation en me saluant et en me demandant ce que je veux. Ensuite, réagis naturellement à mes demandes, propose des produits, annonce des prix simples. Reste dans le contexte du marché français traditionnel."
      }
    ];
  }

  /**
   * Sauvegarder les leçons
   */
  saveLessons() {
    localStorage.setItem('lessons', JSON.stringify(this.lessons));
  }

  /**
   * Récupérer toutes les leçons
   */
  getAllLessons() {
    return this.lessons;
  }

  /**
   * Récupérer une leçon par ID
   */
  getLessonById(id) {
    return this.lessons.find(lesson => lesson.id === parseInt(id));
  }

  /**
   * Récupérer la leçon du jour
   */
  getTodayLesson() {
    const today = new Date().toISOString().split('T')[0];
    return this.lessons.find(lesson => lesson.date === today) || this.lessons[0];
  }

  /**
   * Créer une nouvelle leçon
   */
  createLesson(lessonData) {
    const newLesson = {
      id: Date.now(),
      ...lessonData,
      createdAt: new Date().toISOString()
    };
    this.lessons.push(newLesson);
    this.saveLessons();
    return newLesson;
  }

  /**
   * Mettre à jour une leçon
   */
  updateLesson(id, lessonData) {
    const index = this.lessons.findIndex(lesson => lesson.id === parseInt(id));
    if (index !== -1) {
      this.lessons[index] = { ...this.lessons[index], ...lessonData };
      this.saveLessons();
      return this.lessons[index];
    }
    return null;
  }

  /**
   * Supprimer une leçon
   */
  deleteLesson(id) {
    const index = this.lessons.findIndex(lesson => lesson.id === parseInt(id));
    if (index !== -1) {
      this.lessons.splice(index, 1);
      this.saveLessons();
      return true;
    }
    return false;
  }
}

export default new LessonService();

/**
 * Service d'authentification avec Supabase
 * Gère l'authentification et l'accès via la table ivony_users_apps
 */

import { supabase } from './supabaseClient.js';
import { IVONY_CONFIG } from '../utils/constants.js';

class AuthService {
  constructor() {
    this.user = null;
    this.userAppAccess = null;
    this.authStateChangeCallback = null;
    this.setupAuthListener();
  }

  /**
   * Écouter les changements d'état d'authentification Supabase
   * Synchronise automatiquement l'état de l'app avec Supabase
   */
  setupAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ Utilisateur connecté:', session.user.email);
        await this.loadUserData(session.user.id);
        await this.updateLastAccess(session.user.id);
        
        // Notifier le router du changement
        if (this.authStateChangeCallback) {
          this.authStateChangeCallback(true, this.user?.isAdmin || false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 Utilisateur déconnecté');
        this.user = null;
        this.userAppAccess = null;
        
        // Notifier le router du changement
        if (this.authStateChangeCallback) {
          this.authStateChangeCallback(false, false);
        }
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token rafraîchi');
      } else if (event === 'USER_UPDATED') {
        console.log('📝 Utilisateur mis à jour');
        if (session?.user) {
          await this.loadUserData(session.user.id);
        }
      }
    });
  }

  /**
   * Enregistrer un callback pour les changements d'état d'auth
   * Utilisé par le router pour se synchroniser
   */
  onAuthStateChange(callback) {
    this.authStateChangeCallback = callback;
  }

  /**
   * Inscription d'un nouvel utilisateur
   * 1. Crée le compte dans Supabase Auth
   * 2. Crée l'entrée dans ivony_users_apps avec le téléphone
   */
  async signup(email, password, name, phoneNumber = null) {
    try {
      // Nettoyer et normaliser l'email
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      const cleanPhone = phoneNumber ? phoneNumber.trim() : null;
      
      // Validation côté service (sécurité supplémentaire)
      if (!cleanEmail || !cleanName || !password) {
        return {
          success: false,
          error: 'Tous les champs sont requis'
        };
      }
      
      // Validation format email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleanEmail)) {
        return {
          success: false,
          error: 'Format d\'email invalide'
        };
      }
      
      // Validation mot de passe
      if (password.length < 6) {
        return {
          success: false,
          error: 'Le mot de passe doit contenir au moins 6 caractères'
        };
      }
      
      // Vérifier si le numéro de téléphone existe déjà
      if (cleanPhone) {
        console.log('🔍 Vérification doublon téléphone:', cleanPhone);
        
        const { data: existingPhones, error: phoneCheckError } = await supabase
          .from('ivony_users_apps')
          .select('id, phone_number')
          .eq('application_id', IVONY_CONFIG.APPLICATION_ID)
          .eq('phone_number', cleanPhone);
        
        if (phoneCheckError) {
          console.error('❌ Erreur vérification téléphone:', phoneCheckError);
          return {
            success: false,
            error: 'Erreur lors de la vérification du numéro de téléphone'
          };
        }
        
        if (existingPhones && existingPhones.length > 0) {
          console.warn('⚠️ Numéro de téléphone déjà utilisé:', cleanPhone);
          return {
            success: false,
            error: 'Ce numéro de téléphone est déjà associé à un compte'
          };
        }
        
        console.log('✅ Numéro de téléphone disponible');
      }
      
      console.log('📝 Tentative d\'inscription pour:', cleanEmail);
      
      // Étape 1 : Inscription avec Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            name: cleanName,
            phone: cleanPhone
          }
        }
      });

      if (signUpError) {
        console.error('❌ Erreur signUp:', signUpError);
        return { 
          success: false, 
          error: this.formatAuthError(signUpError) 
        };
      }

      if (!authData.user) {
        console.error('❌ Pas d\'utilisateur retourné par Supabase');
        return { 
          success: false, 
          error: 'Erreur lors de la création du compte' 
        };
      }

      console.log('✅ Utilisateur créé dans Supabase Auth:', authData.user.id);

      // Étape 2 : Créer l'accès à l'application dans ivony_users_apps
      const accessResult = await this.ensureUserAppAccess(authData.user.id, cleanPhone, cleanEmail);
      
      if (!accessResult.success) {
        console.error('⚠️ Erreur création accès app:', accessResult.error);
        // L'utilisateur est créé mais pas l'accès - on continue quand même
      } else {
        console.log('✅ Accès créé dans ivony_users_apps');
      }

      // Charger les données complètes de l'utilisateur
      await this.loadUserData(authData.user.id);

      return { 
        success: true, 
        user: this.user,
        needsEmailConfirmation: !authData.session // Vrai si confirmation email requise
      };
    } catch (error) {
      console.error('❌ Erreur inattendue signup:', error);
      return { 
        success: false, 
        error: 'Une erreur inattendue s\'est produite' 
      };
    }
  }

  /**
   * Connexion d'un utilisateur existant
   * 1. Authentifie avec Supabase Auth (email ou téléphone)
   * 2. Vérifie/crée l'accès dans ivony_users_apps
   * 3. Vérifie que le status est 'active'
   */
  async login(identifier, password) {
    try {
      // Nettoyer l'identifiant
      const cleanIdentifier = identifier.trim();
      
      // Déterminer si c'est un email ou un téléphone
      const isEmail = cleanIdentifier.includes('@');
      let userEmail = null;
      
      if (isEmail) {
        // Connexion par email
        userEmail = cleanIdentifier.toLowerCase();
        console.log('🔐 Tentative de connexion par email:', userEmail);
        
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password
        });
        
        if (signInError) {
          console.error('❌ Erreur signIn:', signInError);
          return { 
            success: false, 
            error: this.formatAuthError(signInError) 
          };
        }
        
        if (!authData.user) {
          console.error('❌ Pas d\'utilisateur retourné par Supabase');
          return { 
            success: false, 
            error: 'Erreur lors de la connexion' 
          };
        }
        
        return await this.completeLogin(authData.user.id, userEmail);
      } else {
        // Connexion par téléphone - chercher l'utilisateur dans ivony_users_apps
        console.log('🔐 Tentative de connexion par téléphone:', cleanIdentifier);
        console.log('🔍 APPLICATION_ID utilisé:', IVONY_CONFIG.APPLICATION_ID);
        
        // Récupérer tous les utilisateurs de cette app et filtrer par téléphone
        const { data: userAppsList, error: lookupError } = await supabase
          .from('ivony_users_apps')
          .select('user_id, metadata, phone_number, application_id')
          .eq('phone_number', cleanIdentifier);
        
        console.log('📊 Résultat recherche téléphone (sans filtre app):', { 
          userAppsList, 
          lookupError,
          cleanIdentifier 
        });
        
        if (lookupError) {
          console.error('❌ Erreur recherche téléphone:', lookupError);
          return { 
            success: false, 
            error: 'Erreur lors de la recherche du numéro de téléphone' 
          };
        }
        
        if (!userAppsList || userAppsList.length === 0) {
          console.error('❌ Numéro de téléphone non trouvé dans la base');
          return { 
            success: false, 
            error: 'Identifiant ou mot de passe incorrect' 
          };
        }
        
        // Filtrer par application_id manuellement si plusieurs résultats
        const userAppAccess = userAppsList.find(
          app => app.application_id === IVONY_CONFIG.APPLICATION_ID
        ) || userAppsList[0];
        
        console.log('📱 Données utilisateur trouvées:', userAppAccess);
        
        // L'email devrait être stocké dans metadata lors de l'inscription
        if (userAppAccess.metadata?.email) {
          userEmail = userAppAccess.metadata.email;
          console.log('✅ Email trouvé dans metadata:', userEmail);
        } else {
          // Fallback: pas d'email dans metadata, impossible de se connecter par téléphone
          console.error('❌ Email non trouvé dans metadata pour ce téléphone');
          console.log('Metadata disponible:', userAppAccess.metadata);
          return {
            success: false,
            error: 'Connexion par téléphone non disponible. Utilisez votre email.'
          };
        }
        
        // Se connecter avec l'email trouvé
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password
        });
        
        if (signInError) {
          console.error('❌ Erreur signIn:', signInError);
          return { 
            success: false, 
            error: this.formatAuthError(signInError) 
          };
        }
        
        if (!authData.user) {
          console.error('❌ Pas d\'utilisateur retourné par Supabase');
          return { 
            success: false, 
            error: 'Erreur lors de la connexion' 
          };
        }
        
        return await this.completeLogin(authData.user.id, userEmail);
      }
    } catch (error) {
      console.error('❌ Erreur inattendue login:', error);
      return { 
        success: false, 
        error: 'Une erreur inattendue s\'est produite' 
      };
    }
  }
  
  /**
   * Compléter le processus de connexion
   */
  async completeLogin(userId, email) {
    try {

      console.log('✅ Authentification réussie:', userId);

      // Étape 2 : Vérifier/créer l'accès à l'application
      const accessResult = await this.ensureUserAppAccess(userId);
      
      if (!accessResult.success) {
        console.error('❌ Erreur accès application:', accessResult.error);
        return { 
          success: false, 
          error: 'Erreur d\'accès à l\'application' 
        };
      }

      // Étape 3 : Vérifier le status
      if (accessResult.userAppAccess.status !== IVONY_CONFIG.STATUS.ACTIVE) {
        console.warn('⚠️ Compte non actif:', accessResult.userAppAccess.status);
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: 'Votre compte est désactivé. Contactez un administrateur.' 
        };
      }

      // Charger les données complètes de l'utilisateur
      await this.loadUserData(userId);

      // Mettre à jour last_access_at
      await this.updateLastAccess(userId);

      console.log('✅ Connexion réussie pour:', email);

      return { 
        success: true, 
        user: this.user 
      };
    } catch (error) {
      console.error('❌ Erreur completeLogin:', error);
      return { 
        success: false, 
        error: 'Une erreur inattendue s\'est produite' 
      };
    }
  }

  /**
   * Vérifier ou créer l'accès de l'utilisateur à l'application
   * dans la table ivony_users_apps
   */
  async ensureUserAppAccess(userId, phoneNumber = null, email = null) {
    try {
      console.log('🔍 Vérification accès app pour user:', userId);
      
      // Vérifier si l'accès existe déjà
      const { data: existingAccess, error: selectError } = await supabase
        .from('ivony_users_apps')
        .select('*')
        .eq('user_id', userId)
        .eq('application_id', IVONY_CONFIG.APPLICATION_ID)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        // PGRST116 = pas de résultats, c'est normal
        console.error('❌ Erreur lecture ivony_users_apps:', selectError);
        return { success: false, error: selectError.message };
      }

      // Si l'accès existe, le retourner
      if (existingAccess) {
        console.log('✅ Accès existant trouvé:', existingAccess.id);
        this.userAppAccess = existingAccess;
        return { success: true, userAppAccess: existingAccess };
      }

      console.log('➕ Création d\'un nouvel accès dans ivony_users_apps...');

      // Sinon, créer un nouvel accès
      const insertData = {
        user_id: userId,
        application_id: IVONY_CONFIG.APPLICATION_ID,
        role: IVONY_CONFIG.ROLES.USER,
        status: IVONY_CONFIG.STATUS.ACTIVE,
        metadata: {}
      };
      
      // Ajouter le téléphone si fourni
      if (phoneNumber) {
        insertData.phone_number = phoneNumber;
      }
      
      // Stocker l'email dans metadata pour permettre la connexion par téléphone
      if (email) {
        insertData.metadata.email = email;
      }
      
      const { data: newAccess, error: insertError } = await supabase
        .from('ivony_users_apps')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erreur création accès:', insertError);
        console.error('Détails:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details
        });
        return { success: false, error: insertError.message };
      }

      console.log('✅ Nouvel accès créé:', newAccess.id);
      this.userAppAccess = newAccess;
      return { success: true, userAppAccess: newAccess };
    } catch (error) {
      console.error('❌ Erreur inattendue ensureUserAppAccess:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Charger les données complètes de l'utilisateur
   */
  async loadUserData(userId) {
    try {
      // Récupérer les infos auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return;
      }

      // Récupérer les infos d'accès app
      const { data: appAccess } = await supabase
        .from('ivony_users_apps')
        .select('*')
        .eq('user_id', userId)
        .eq('application_id', IVONY_CONFIG.APPLICATION_ID)
        .single();

      this.userAppAccess = appAccess;

      // Construire l'objet utilisateur
      this.user = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
        isAdmin: appAccess?.role === IVONY_CONFIG.ROLES.ADMIN,
        role: appAccess?.role || IVONY_CONFIG.ROLES.USER,
        status: appAccess?.status || IVONY_CONFIG.STATUS.ACTIVE,
        metadata: appAccess?.metadata || {},
        createdAt: authUser.created_at
      };
    } catch (error) {
      console.error('Erreur loadUserData:', error);
    }
  }

  /**
   * Mettre à jour la date du dernier accès
   */
  async updateLastAccess(userId) {
    try {
      await supabase
        .from('ivony_users_apps')
        .update({ last_access_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('application_id', IVONY_CONFIG.APPLICATION_ID);
    } catch (error) {
      console.error('Erreur updateLastAccess:', error);
    }
  }

  /**
   * Vérifier et restaurer la session au démarrage de l'application
   */
  async checkSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erreur getSession:', error);
        return { success: false, user: null };
      }

      if (!session?.user) {
        return { success: false, user: null };
      }

      // Vérifier l'accès à l'application
      const accessResult = await this.ensureUserAppAccess(session.user.id);
      
      if (!accessResult.success) {
        await supabase.auth.signOut();
        return { success: false, user: null };
      }

      // Vérifier le status
      if (accessResult.userAppAccess.status !== IVONY_CONFIG.STATUS.ACTIVE) {
        await supabase.auth.signOut();
        return { success: false, user: null };
      }

      // Charger les données
      await this.loadUserData(session.user.id);

      // Mettre à jour last_access_at
      await this.updateLastAccess(session.user.id);

      return { success: true, user: this.user };
    } catch (error) {
      console.error('Erreur checkSession:', error);
      return { success: false, user: null };
    }
  }

  /**
   * Déconnexion
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erreur logout:', error);
        return { success: false, error: error.message };
      }

      this.user = null;
      this.userAppAccess = null;
      
      return { success: true };
    } catch (error) {
      console.error('Erreur logout:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer l'utilisateur actuel
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    return this.user !== null;
  }

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin() {
    return this.user?.isAdmin || false;
  }

  /**
   * Formater les erreurs d'authentification en messages utilisateur
   */
  formatAuthError(error) {
    const errorMessages = {
      'Invalid login credentials': 'Email ou mot de passe incorrect',
      'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
      'User already registered': 'Un compte existe déjà avec cet email',
      'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
      'Unable to validate email address: invalid format': 'Format d\'email invalide',
      'Signup requires a valid password': 'Mot de passe requis'
    };

    return errorMessages[error.message] || error.message || 'Erreur d\'authentification';
  }
}

export default new AuthService();

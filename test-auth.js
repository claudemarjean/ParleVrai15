/**
 * Script de test pour vérifier l'intégration Supabase Auth
 * 
 * Ce fichier peut être exécuté dans la console du navigateur
 * pour tester les fonctionnalités d'authentification
 */

// Import du service (si vous êtes dans la console du navigateur de l'app)
// const authService = window.authService;

/**
 * Test 1 : Vérifier la configuration Supabase
 */
async function testSupabaseConfig() {
  console.group('🧪 Test 1: Configuration Supabase');
  
  try {
    const { supabase, isSupabaseConfigured } = await import('./src/services/supabaseClient.js');
    
    if (isSupabaseConfigured()) {
      console.log('✅ Supabase est configuré correctement');
      
      // Test de connexion basique
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ Erreur de session:', error);
      } else {
        console.log('✅ Connection Supabase OK');
        console.log('Session active:', !!data.session);
      }
    } else {
      console.warn('⚠️ Supabase n\'est pas configuré - Vérifiez votre fichier .env');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  console.groupEnd();
}

/**
 * Test 2 : Tester l'inscription
 */
async function testSignup(email, password, name) {
  console.group('🧪 Test 2: Inscription');
  
  try {
    const authService = (await import('./src/services/auth.js')).default;
    
    console.log(`📝 Inscription de: ${email}`);
    const result = await authService.signup(email, password, name);
    
    if (result.success) {
      console.log('✅ Inscription réussie');
      console.log('Utilisateur:', result.user);
      console.log('Confirmation email nécessaire:', result.needsEmailConfirmation);
      
      // Vérifier la création dans ivony_users_apps
      await testUserAppAccess(result.user.id);
    } else {
      console.error('❌ Inscription échouée:', result.error);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  console.groupEnd();
}

/**
 * Test 3 : Tester la connexion
 */
async function testLogin(email, password) {
  console.group('🧪 Test 3: Connexion');
  
  try {
    const authService = (await import('./src/services/auth.js')).default;
    
    console.log(`🔐 Connexion de: ${email}`);
    const result = await authService.login(email, password);
    
    if (result.success) {
      console.log('✅ Connexion réussie');
      console.log('Utilisateur:', result.user);
      
      // Vérifier last_access_at
      await testUserAppAccess(result.user.id);
    } else {
      console.error('❌ Connexion échouée:', result.error);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  console.groupEnd();
}

/**
 * Test 4 : Tester la restauration de session
 */
async function testCheckSession() {
  console.group('🧪 Test 4: Restauration de session');
  
  try {
    const authService = (await import('./src/services/auth.js')).default;
    
    console.log('🔍 Vérification de la session...');
    const result = await authService.checkSession();
    
    if (result.success && result.user) {
      console.log('✅ Session restaurée');
      console.log('Utilisateur:', result.user);
    } else {
      console.log('ℹ️ Pas de session active');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  console.groupEnd();
}

/**
 * Test 5 : Vérifier l'accès dans ivony_users_apps
 */
async function testUserAppAccess(userId) {
  console.group('🧪 Test 5: Vérification ivony_users_apps');
  
  try {
    const { supabase } = await import('./src/services/supabaseClient.js');
    const { IVONY_CONFIG } = await import('./src/utils/constants.js');
    
    const { data, error } = await supabase
      .from('ivony_users_apps')
      .select('*')
      .eq('user_id', userId)
      .eq('application_id', IVONY_CONFIG.APPLICATION_ID)
      .single();
    
    if (error) {
      console.error('❌ Erreur lecture ivony_users_apps:', error);
    } else if (data) {
      console.log('✅ Accès trouvé dans ivony_users_apps:');
      console.table({
        'ID': data.id,
        'Role': data.role,
        'Status': data.status,
        'Last Access': data.last_access_at,
        'Created': data.created_at
      });
    } else {
      console.warn('⚠️ Pas d\'accès trouvé pour cet utilisateur');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  console.groupEnd();
}

/**
 * Test 6 : Tester la déconnexion
 */
async function testLogout() {
  console.group('🧪 Test 6: Déconnexion');
  
  try {
    const authService = (await import('./src/services/auth.js')).default;
    
    const result = await authService.logout();
    
    if (result.success) {
      console.log('✅ Déconnexion réussie');
      console.log('Utilisateur actuel:', authService.getCurrentUser());
    } else {
      console.error('❌ Déconnexion échouée:', result.error);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  console.groupEnd();
}

/**
 * Exécuter tous les tests (nécessite un compte test)
 */
async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'authentification Supabase\n');
  
  // Configuration
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';
  
  // Test 1: Configuration
  await testSupabaseConfig();
  await sleep(1000);
  
  // Test 2: Inscription
  await testSignup(testEmail, testPassword, testName);
  await sleep(2000);
  
  // Test 3: Déconnexion
  await testLogout();
  await sleep(1000);
  
  // Test 4: Connexion
  await testLogin(testEmail, testPassword);
  await sleep(1000);
  
  // Test 5: Vérification session
  await testCheckSession();
  
  console.log('\n✅ Tous les tests sont terminés');
  console.log('⚠️ N\'oubliez pas de supprimer le compte test de votre base de données');
}

// Helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export pour utilisation dans la console
if (typeof window !== 'undefined') {
  window.AuthTests = {
    testSupabaseConfig,
    testSignup,
    testLogin,
    testCheckSession,
    testUserAppAccess,
    testLogout,
    runAllTests
  };
  
  console.log('📦 Tests disponibles via window.AuthTests:');
  console.log('- AuthTests.testSupabaseConfig()');
  console.log('- AuthTests.testSignup(email, password, name)');
  console.log('- AuthTests.testLogin(email, password)');
  console.log('- AuthTests.testCheckSession()');
  console.log('- AuthTests.testUserAppAccess(userId)');
  console.log('- AuthTests.testLogout()');
  console.log('- AuthTests.runAllTests() // Exécute tous les tests');
}

export {
  testSupabaseConfig,
  testSignup,
  testLogin,
  testCheckSession,
  testUserAppAccess,
  testLogout,
  runAllTests
};

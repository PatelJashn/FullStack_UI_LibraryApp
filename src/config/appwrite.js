import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Appwrite configuration
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!APPWRITE_PROJECT_ID) {
  console.error('❌ VITE_APPWRITE_PROJECT_ID is not set in environment variables');
}

// Create Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export the client for custom operations
export { client };

// Database and Collection IDs (you'll need to create these in Appwrite console)
export const DATABASE_ID = 'ui_library_db';
export const COLLECTIONS = {
  USERS: 'users',
  UI_COMPONENTS: 'ui_components',
  CATEGORIES: 'categories'
};

// Storage bucket IDs
export const STORAGE_BUCKETS = {
  COMPONENT_IMAGES: 'component_images',
  USER_AVATARS: 'user_avatars'
};

console.log('🔧 Appwrite Configuration:', {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID ? '✅ Set' : '❌ Missing',
  databaseId: DATABASE_ID
});

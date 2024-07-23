const config = {
appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATEBASE_ID),
appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTON_ID),
editorAPI: String(import.meta.env.VITE_TINY_MCE_EDITOR_API_KEY),
}

export default config;
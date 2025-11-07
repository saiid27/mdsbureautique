let firebaseClientPromise;

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};

function ensureConfig() {
  const placeholders = Object.values(firebaseConfig).some((value) =>
    typeof value === "string" ? value.startsWith("YOUR_") || value === "" : false
  );

  if (placeholders) {
    throw new Error(
      "Firebase configuration is missing. Update src/firebase.js with your project credentials."
    );
  }
}

export async function getFirebase() {
  if (!firebaseClientPromise) {
    firebaseClientPromise = (async () => {
      ensureConfig();
      const { initializeApp } = await import(
        "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"
      );
      const authModule = await import(
        "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"
      );

      const app = initializeApp(firebaseConfig);
      const auth = authModule.getAuth(app);

      return { auth, ...authModule };
    })();
  }

  return firebaseClientPromise;
}


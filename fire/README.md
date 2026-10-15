# Firebase authentication

React + Vite app with email/password sign-up and login, Google sign-in, and a simple task list. Signed-in users can add, view, edit, and delete their tasks. Tasks are saved in Cloud Firestore under each user's account, so they sync across devices.

## Firebase setup

1. In the Firebase console, open **Authentication → Sign-in method** and enable **Email/Password** and **Google**.
2. In the Firebase console, create a **Cloud Firestore** database.
3. Publish the rules from `firestore.rules`. You can paste them into **Firestore Database → Rules** in the Firebase console, or deploy them with `firebase deploy --only firestore:rules --project YOUR_PROJECT_ID`.
4. Add your development hostname (usually `localhost`) to **Authentication → Settings → Authorized domains** if it is not already listed.
5. Start the app with `npm run dev`.

The app stores tasks at `users/{userId}/tasks/{taskId}`. The Firestore rules let signed-in users access only their own tasks and restrict task text to 1–500 characters. These are Firestore rules, not Cloud Storage rules: task records are database documents, not uploaded files.

Tasks previously saved in browser local storage are not copied to Firestore automatically. The Firebase web app configuration in `src/assets/firebase.js` is public client configuration. Do not add service-account credentials or other private keys to the browser app.

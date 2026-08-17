// Shared Firebase initialization — loaded AFTER firebase-*-compat.js CDN scripts.
// All pages that load this file get window.auth, window.db, and window.storage.
(function () {
  var cfg = {
    apiKey:            "AIzaSyD8Awegn3klfuxft439QO05sS6i_JMIF5M",
    authDomain:        "dv-peer-tutoring-website.firebaseapp.com",
    projectId:         "dv-peer-tutoring-website",
    storageBucket:     "dv-peer-tutoring-website.firebasestorage.app",
    messagingSenderId: "956297409423",
    appId:             "1:956297409423:web:1fdb8b42c9f271a4a1d1fa"
  };

  // Guard against double-init (multiple scripts on the same page)
  if (!firebase.apps.length) firebase.initializeApp(cfg);

  window.auth = firebase.auth();
  window.db   = firebase.firestore();
  if (typeof firebase.storage === 'function') {
    window.storage = firebase.storage();
  }
})();

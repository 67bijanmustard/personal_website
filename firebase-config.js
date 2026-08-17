// Shared Firebase initialization — loaded AFTER firebase-*-compat.js CDN scripts.
// All pages that load this file get window.auth, window.db, and window.storage.
(function () {
  var cfg = {
    apiKey:            "AIzaSyBCb0Cklt60pdxBE7oLuyuGlYdJoK4iqSk",
    authDomain:        "dv-peer-tutoring.firebaseapp.com",
    projectId:         "dv-peer-tutoring",
    storageBucket:     "dv-peer-tutoring.firebasestorage.app",
    messagingSenderId: "213126769176",
    appId:             "1:213126769176:web:a89c92a8c1f80096cc316d"
  };

  // Guard against double-init (multiple scripts on the same page)
  if (!firebase.apps.length) firebase.initializeApp(cfg);

  window.auth = firebase.auth();
  window.db   = firebase.firestore();
  if (typeof firebase.storage === 'function') {
    window.storage = firebase.storage();
  }
})();

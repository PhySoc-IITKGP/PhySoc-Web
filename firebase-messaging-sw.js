importScripts(
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js",
);
importScripts(
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
    apiKey: "AIzaSyC-hEoR15_jl3_Uen6-oZkqBySWB7U6LuA",
  authDomain: "physoc-iitkgp.firebaseapp.com",
  projectId: "physoc-iitkgp",
  storageBucket: "physoc-iitkgp.firebasestorage.app",
  messagingSenderId: "340020337012",
  appId: "1:340020337012:web:74c211e87f613cdd4c3421",
  measurementId: "G-M2K1YZPN4H"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body || "",
    });
});

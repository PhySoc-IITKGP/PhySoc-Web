importScripts(
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js",
);
importScripts(
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
    apiKey: "AIzaSyCHnRe2xBVl23ZCTy9B_999ppMKUR4udg",
    authDomain: "auroritical-physoc-mirror.firebaseapp.com",
    projectId: "auroritical-physoc-mirror",
    storageBucket: "auroritical-physoc-mirror.firebasestorage.app",
    messagingSenderId: "267376635317",
    appId: "1:267376635317:web:84592356f1ecb66183bdfc",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body || "",
    });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging.js";
import { shouldShowPrompt, markPromptShown } from "./js/notification.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHnReX2bXVl23ZCTy9B_999ppMKUR4udg",
  authDomain: "auroritical-physoc-mirror.firebaseapp.com",
  projectId: "auroritical-physoc-mirror",
  storageBucket: "auroritical-physoc-mirror.firebasestorage.app",
  messagingSenderId: "267376635317",
  appId: "1:267376635317:web:84592356f1ecb66183bdfc",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

navigator.serviceWorker.register("/firebase-messaging-sw.js");

window.requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "denied") {
      showToast(
        "Notifications are blocked. Enable them in browser settings.",
        "error",
      );
      return;
    }

    if (permission !== "granted") {
      showToast("Enable notifications to stay updated with PhySoc", "warning", {
        actionText: "Enable",
        cancelText: "Later",
        onAction: () => requestPermission(),
      });
      return;
    }

    showToast("Enabling notifications...", "info");

    const token = await getToken(messaging, {
      vapidKey:
        "BOuyyOGhF9NlqDihzFLmZt60Acf5uosmZbQHQAUfNGSiijvw5CJzrbLT_hl217PBTOFrF4yNRDazzi7TCCXY_bA",
    });

    if (!token) {
      showToast("Failed to generate notification token", "error");
      return;
    }

    console.log("FCM Token:", token);

    showToast("Notifications enabled successfully", "success");
    markPromptShown();
  } catch (err) {
    console.error(err);
    showToast("Something went wrong", "error");
  }
};

onMessage(messaging, (payload) => {
  const title = payload?.notification?.title || "New Notification";
  const body = payload?.notification?.body || "";

  showToast(`${title} — ${body}`, "info");
});

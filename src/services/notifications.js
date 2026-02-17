import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const getNotificationsCollection = (uid) =>
  collection(db, "users", uid, "notifications");

export const createNotification = async (
  uid,
  { title, message, type = "info" },
) => {
  if (!uid) return;
  await addDoc(getNotificationsCollection(uid), {
    title: title || "Notification",
    message: message || "",
    type,
    read: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const subscribeNotifications = (uid, callback) => {
  if (!uid) return () => {};
  const notificationsQuery = query(
    getNotificationsCollection(uid),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(notificationsQuery, (snapshot) => {
    const rows = snapshot.docs.map((entry) => ({
      id: entry.id,
      ...entry.data(),
    }));
    callback(rows);
  });
};

export const subscribeUnreadNotificationsCount = (uid, callback) => {
  if (!uid) return () => {};
  const unreadQuery = query(
    getNotificationsCollection(uid),
    where("read", "==", false),
  );

  return onSnapshot(unreadQuery, (snapshot) => {
    callback(snapshot.size);
  });
};

export const markNotificationRead = async (uid, notificationId) => {
  if (!uid || !notificationId) return;
  const notificationRef = doc(db, "users", uid, "notifications", notificationId);
  await updateDoc(notificationRef, {
    read: true,
    updatedAt: serverTimestamp(),
  });
};

export const deleteNotification = async (uid, notificationId) => {
  if (!uid || !notificationId) return;
  const notificationRef = doc(db, "users", uid, "notifications", notificationId);
  await deleteDoc(notificationRef);
};

export const markAllNotificationsRead = async (uid) => {
  if (!uid) return;
  const unreadQuery = query(
    getNotificationsCollection(uid),
    where("read", "==", false),
  );
  const unreadSnapshot = await getDocs(unreadQuery);

  await Promise.all(
    unreadSnapshot.docs.map((entry) =>
      updateDoc(entry.ref, {
        read: true,
        updatedAt: serverTimestamp(),
      }),
    ),
  );
};

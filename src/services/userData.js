import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const USERS_COLLECTION = "users";

const generateUserId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KYRO-${timestamp}-${randomPart}`;
};

const parseLocalJson = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const getLegacyMining = () => ({
  diamonds: Number(localStorage.getItem("mining_diamonds")) || 0,
  streak: Number(localStorage.getItem("mining_streak")) || 0,
  lastMined: localStorage.getItem("mining_last_date") || "",
});

export const fetchUserProfile = async (uid) => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

export const saveUserProfile = async (uid, data) => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await setDoc(
    userRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const migrateLocalStorageToFirebase = async (uid, email = "") => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(userRef);
  const existing = snap.exists() ? snap.data() : {};

  const legacyUser = parseLocalJson("kyro_user");
  const legacyMining = getLegacyMining();

  const payload = {
    id: existing.id || legacyUser?.id || generateUserId(),
    name: existing.name || legacyUser?.name || "",
    email: existing.email || email || legacyUser?.email || "",
    referral: existing.referral || legacyUser?.referral || "",
    profilePic: existing.profilePic || legacyUser?.profilePic || "",
    mining: {
      diamonds: existing.mining?.diamonds ?? legacyMining.diamonds,
      streak: existing.mining?.streak ?? legacyMining.streak,
      lastMined: existing.mining?.lastMined ?? legacyMining.lastMined,
    },
    updatedAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(userRef, payload, { merge: true });

  // Migration complete: remove old local keys to avoid stale writes.
  localStorage.removeItem("kyro_user");
  localStorage.removeItem("mining_diamonds");
  localStorage.removeItem("mining_streak");
  localStorage.removeItem("mining_last_date");
};

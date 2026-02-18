import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const ADMINS_COLLECTION = "admins";
export const SUPER_ADMIN_EMAILS = [
  "opeyemiadeleke1008@gmail.com",
  "your-second-superadmin@email.com",
];

export const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

export const isSuperAdminEmail = (email) =>
  SUPER_ADMIN_EMAILS.includes(normalizeEmail(email));

export const fetchAdminRecordByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const adminsRef = collection(db, ADMINS_COLLECTION);
  const q = query(adminsRef, where("email", "==", normalizedEmail), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};

export const canAccessAdmin = ({ email, adminRecord }) => {
  if (isSuperAdminEmail(email)) return true;
  if (!adminRecord) return false;
  return adminRecord.status !== "Suspended";
};

export const getAllowedRole = ({ email, desiredRole }) => {
  if (isSuperAdminEmail(email)) return "Super Admin";
  if (desiredRole === "Moderator") return "Moderator";
  return "Admin";
};

export const syncAdminOnLogin = async ({ email, displayName = "" }) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const existing = await fetchAdminRecordByEmail(normalizedEmail);
  const role = getAllowedRole({
    email: normalizedEmail,
    desiredRole: existing?.role || "Admin",
  });

  if (existing) {
    await updateDoc(doc(db, ADMINS_COLLECTION, existing.id), {
      role,
      status: existing.status || "Active",
      lastLogin: "just now",
      updatedAt: serverTimestamp(),
    });
    return { ...existing, role };
  }

  if (!isSuperAdminEmail(normalizedEmail)) return null;

  const payload = {
    name: displayName || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    role: "Super Admin",
    status: "Active",
    twoFactor: false,
    department: "Operations",
    lastLogin: "just now",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await addDoc(collection(db, ADMINS_COLLECTION), payload);
  return payload;
};

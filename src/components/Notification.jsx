import React, { useEffect, useMemo, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Aside from "../layout/Aside";
import UserNavbar from "./UserNavbar";
import { auth } from "../firebase";
import {
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeNotifications,
} from "../services/notifications";

const formatTime = (timestamp) => {
  if (!timestamp?.toDate) return "Just now";
  const date = timestamp.toDate();
  return date.toLocaleString();
};

function Notification() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        navigate("/signup");
        return;
      }
      setUid(authUser.uid);
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!uid) return () => {};
    const unsubscribeNotifications = subscribeNotifications(uid, setNotifications);
    return () => unsubscribeNotifications();
  }, [uid]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <UserNavbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <Aside
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8 relative md:top-0 top-15 scrollbar-hidden">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase italic text-orange-500">
              Notifications
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              {unreadCount} unread updates
            </p>
          </div>
          <button
            onClick={() => markAllNotificationsRead(uid)}
            className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer"
          >
            Mark All As Read
          </button>
        </header>

        <section className="bg-[#0B0E14] border border-white/10 rounded-2xl divide-y divide-white/5">
          {notifications.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No notifications yet.
            </div>
          )}

          {notifications.map((item) => (
            <article
              key={item.id}
              className={`p-4 md:p-5 flex items-start gap-4 ${item.read ? "opacity-70" : ""}`}
            >
              <div className="mt-1">
                <Bell
                  size={16}
                  className={item.read ? "text-gray-500" : "text-orange-500"}
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold">{item.title || "Notification"}</p>
                <p className="text-xs text-gray-400 mt-1">{item.message}</p>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                  {formatTime(item.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!item.read && (
                  <button
                    onClick={() => markNotificationRead(uid, item.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-orange-500 hover:text-black transition-all cursor-pointer"
                    title="Mark as read"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(uid, item.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  title="Delete notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Notification;

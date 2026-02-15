import React, { useEffect } from "react";
import { Info, X, CheckCircle, AlertCircle } from "lucide-react";

const NotificationToast = ({ message, isOpen, onClose, type = "info" }) => {
  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          color: "green",
          title: "Success"
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "red",
          title: "Error"
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "yellow",
          title: "Warning"
        };
      default:
        return {
          icon: Info,
          color: "orange",
          title: "System Message"
        };
    }
  };

  const { icon: Icon, color, title } = getTypeConfig();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Total time visible
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-9999 transition-all duration-500 ease-out transform ${
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className={`bg-[#0B0E14] border border-${color}-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)] p-4 rounded-2xl flex items-center gap-4 min-w-[280px]`}>
        <div className={`bg-${color}-500/10 p-2 rounded-lg`}>
          <Icon size={18} className={`text-${color}-500`} />
        </div>
        
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{title}</p>
          <p className="text-xs font-bold text-white italic">{message}</p>
        </div>

        <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
          <X size={14} />
        </button>
        
        {/* Progress Bar Animation */}
        <div className={`absolute bottom-0 left-0 h-[2px] bg-${color}-500 transition-all duration-2000 ease-linear`}
             style={{ width: isOpen ? "100%" : "0%" }} />
      </div>
    </div>
  );
};

export default NotificationToast;
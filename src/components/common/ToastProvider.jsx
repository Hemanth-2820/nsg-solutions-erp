import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './toast.css';

const TOAST_DURATION = 4000;

const TOAST_CONFIG = {
  success: { icon: CheckCircle2, label: 'Success' },
  error: { icon: XCircle, label: 'Error' },
  warning: { icon: AlertTriangle, label: 'Warning' },
  info: { icon: Info, label: 'Info' },
};

const ToastContext = createContext({
  showToast: (msg, type = 'success') => {},
});

export const useToast = () => useContext(ToastContext);

function ToastItem({ id, msg, type, onDismiss }) {
  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      layout
      role="status"
      aria-live="polite"
      className={`toast toast-${type}`}
      initial={{ opacity: 0, x: 48, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
    >
      <div className="toast-icon-wrap" aria-hidden="true">
        <Icon size={18} strokeWidth={2.25} />
      </div>

      <div className="toast-body">
        <span className="toast-label">{config.label}</span>
        <p className="toast-message">{msg}</p>
      </div>

      <button
        type="button"
        className="toast-close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
      >
        <X size={16} strokeWidth={2.25} />
      </button>

      <span
        className="toast-progress"
        style={{ animationDuration: `${TOAST_DURATION}ms` }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
  }, []);

  useEffect(() => {
    const toastMethods = {
      success: (msg) => showToast(msg, 'success'),
      error: (msg) => showToast(msg, 'error'),
      warning: (msg) => showToast(msg, 'warning'),
      info: (msg) => showToast(msg, 'info'),
    };
    window.toast = toastMethods;
    window.showToast = showToast;
    return () => {
      delete window.toast;
      delete window.showToast;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-label="Notifications">
        <AnimatePresence mode="popLayout">
          {toasts.map(({ id, msg, type }) => (
            <ToastItem key={id} id={id} msg={msg} type={type} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

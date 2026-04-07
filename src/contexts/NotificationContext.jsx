import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);

  /**
   * Show a notification.
   * @param {string} message
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {number} duration  ms before auto-dismiss; 0 = persistent
   */
  const notify = useCallback((message, type = "info", duration = 4000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification({ message, type });
    if (duration > 0) {
      timerRef.current = setTimeout(() => setNotification(null), duration);
    }
  }, []);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification(null);
  }, []);

  return (
    <NotificationContext value={{ notification, notify, dismiss }}>
      {children}
    </NotificationContext>
  );
}

export const useNotification = () => useContext(NotificationContext);

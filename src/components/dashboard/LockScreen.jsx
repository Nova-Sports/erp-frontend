import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { Lock } from "lucide-react";
import { useState } from "react";
import { Modal } from "../modal/Modal";

export default function LockScreen({ showLockScreen, setShowLockScreen }) {
  /* ========================= All States ========================= */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");

  /*  ========================= All Functions ========================= */
  const handleUnlock = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post(
        "/sales/password-verify",
        { password },
        {
          headers: authHeader(),
        },
      );
      if (data?.success) {
        // onUnlock();
        setShowLockScreen(false);
        setPassword("");
        setError(null);
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ========================= All UseEffects ========================= */

  return (
    <div className="">
      {/*=======================================
          Lock Screen Modal    
      ========================================= */}
      <Modal
        open={showLockScreen}
        onHide={() => setShowLockScreen(false)}
        position="center"
        size="sm"
        disableBackdropClose={true}
        fullscreen={true}
        customBackDropClass="fixed inset-0 flex-center z-50 bg-gradient-to-br from-primary/80 via-white/90 to-primary/80 backdrop-blur-sm"
        appendClass={"center-box-shadow"}
      >
        <Modal.Body>
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary/10 rounded-full p-4 mb-2">
              <Lock size={48} className="text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-primary mb-1 tracking-tight">
              App Locked
            </h2>
            <p className="text-gray-600 text-center text-base max-w-xs">
              For your security, please enter your sign-in password to unlock
              the application.
            </p>
          </div>
          <form
            onSubmit={handleUnlock}
            className="w-full flex flex-col items-center gap-3"
          >
            <input
              // ref={inputRef}
              type="password"
              className="form-control border-2 border-primary/40 px-4 py-2 rounded-lg mb-1 w-full text-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              disabled={loading}
            />
            {error && (
              <div className="text-red-500 text-sm mb-1 w-full text-center animate-shake">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg w-full text-lg font-semibold shadow transition-all duration-150 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Unlocking..." : "Unlock"}
            </button>
          </form>
        </Modal.Body>
        {/* <Modal.Footer>
          <button
            onClick={() => setShowLockScreen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

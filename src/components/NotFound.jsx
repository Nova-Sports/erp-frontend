import { useNavigate, useLocation } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] p-8 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <FileQuestion size={38} className="text-primary" />
      </div>
      <h1 className="text-3xl font-black text-gray-800 mb-2">404</h1>
      <p className="text-lg font-semibold text-gray-600 mb-1">Page Not Found</p>
      <p className="text-sm text-gray-400 max-w-xs mb-8 font-mono break-all">
        {pathname}
      </p>
      <button
        onClick={() => navigate(-1)}
        className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}

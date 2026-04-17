import { Lock } from "lucide-react";

export default function Password() {
  return (
    <div className="px-4 py-2">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lock size={20} className="text-brand" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-dark">
              Password Management
            </h1>
            <p className="text-gray-500 text-sm">
              Manage and update account passwords
            </p>
          </div>
        </div>
      </div>

      {/* Empty content placeholder */}
      <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Lock size={30} className="text-gray-300" />
        </div>
        <h3 className="text-gray-600 font-semibold text-lg mb-2">
          Coming Soon
        </h3>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
          Password management features are currently under development.
        </p>
      </div>
    </div>
  );
}

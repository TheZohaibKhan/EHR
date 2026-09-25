import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen font-sans text-white">
      <NavBar />
      {/* Background is handled by App.js (Background3D) */}

      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          SELECT LOGIN TYPE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Patient Login */}
          <button
            onClick={() => navigate("/patient_login")}
            className="group relative p-1 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30"
          >
            <div className="bg-gray-900/40 backdrop-blur-xl h-full rounded-xl p-8 flex flex-col items-center border border-white/10 group-hover:bg-gray-900/60 transition-colors">
              <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">👤</span>
              <span className="text-2xl font-bold">Patient</span>
              <span className="text-sm text-gray-400 mt-2">Access your records</span>
            </div>
          </button>

          {/* Doctor Login */}
          <button
            onClick={() => navigate("/doctor_login")}
            className="group relative p-1 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30"
          >
            <div className="bg-gray-900/40 backdrop-blur-xl h-full rounded-xl p-8 flex flex-col items-center border border-white/10 group-hover:bg-gray-900/60 transition-colors">
              <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">👨‍⚕️</span>
              <span className="text-2xl font-bold">Doctor</span>
              <span className="text-sm text-gray-400 mt-2">Manage patients</span>
            </div>
          </button>

          {/* Admin Login */}
          <button
            onClick={() => navigate("/diagnostic_login")}
            className="group relative p-1 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
          >
            <div className="bg-gray-900/40 backdrop-blur-xl h-full rounded-xl p-8 flex flex-col items-center border border-white/10 group-hover:bg-gray-900/60 transition-colors">
              <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛡️</span>
              <span className="text-2xl font-bold">Admin</span>
              <span className="text-sm text-gray-400 mt-2">System controls</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

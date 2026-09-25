import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import NavBar_Logout from "./NavBar_Logout";
import BlockchainClock from "./BlockchainClock"; // New component

// Fix Leaflet Default Icon issue in Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const DiagnosticDashBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("dashboard");

  // Real Hospital Data for Sangamner, Maharashtra
  const hospitals = [
    { id: 1, name: "Chaitanya Hospital", lat: 19.5771, lng: 74.2079, type: "General", status: "Active", address: "Tajane Mala, Navin Nagar Rd" },
    { id: 2, name: "Medicover Hospitals", lat: 19.4280, lng: 74.2008, type: "Multi-Specialty", status: "Active", address: "Gunjalwadi Rd" },
    { id: 3, name: "Pasaydan Hospital", lat: 19.5539, lng: 74.2263, type: "General", status: "Active", address: "Rangargalli" },
    { id: 4, name: "Nagare Accident Hospital", lat: 19.5810, lng: 74.2050, type: "Trauma/Emergency", status: "Active", address: "Navin Nagar Rd" },
    { id: 5, name: "Saisuman Hrudayalaya", lat: 19.5678, lng: 74.2115, type: "Cardiac Care", status: "Active", address: "Tajane Mala" },
  ];

  // Updated Patient Visit Data simulating real-time flow
  const patientVisits = [
    { id: 101, patient: "Amit Deshmukh", hospital: "Chaitanya Hospital", type: "Regular", status: "Primary Care", time: "10:30 AM" },
    { id: 102, patient: "Priya Patil", hospital: "Medicover Hospitals", type: "Referred", status: "Specialist Consult", time: "11:15 AM" },
    { id: 103, patient: "Rahul Wagh", hospital: "Nagare Accident Hospital", type: "Emergency", status: "Critical", time: "11:45 AM" },
    { id: 104, patient: "Sujata Kulkarni", hospital: "Saisuman Hrudayalaya", type: "Regular", status: "Cardiac Checkup", time: "12:10 PM" },
    { id: 105, patient: "Vikram Shinde", hospital: "Pasaydan Hospital", type: "Regular", status: "Discharged", time: "01:00 PM" },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 animate-fade-in-up">
            <div onClick={() => setActiveModule("patients")} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-500/20 cursor-pointer hover:scale-105 transition-transform hover:shadow-teal-500/10">
              <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Total Patients (Sangamner)</h3>
              <p className="text-4xl font-bold text-white">3,245</p>
              <div className="text-teal-400 text-xs mt-2">↑ 8% this week</div>
            </div>
            <div onClick={() => setActiveModule("users")} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-500/20 cursor-pointer hover:scale-105 transition-transform hover:shadow-blue-500/10">
              <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Active Doctors</h3>
              <p className="text-4xl font-bold text-white">42</p>
              <div className="text-blue-400 text-xs mt-2">● Online across 5 facilities</div>
            </div>
            <div onClick={() => setActiveModule("map")} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20 cursor-pointer hover:scale-105 transition-transform hover:shadow-purple-500/10">
              <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Network Status</h3>
              <p className="text-4xl font-bold text-white shadow-glow">{hospitals.length} Nodes</p>
              <div className="text-purple-400 text-xs mt-2">100% Uptime</div>
            </div>
            <div onClick={() => setActiveModule("patients")} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-yellow-500/20 cursor-pointer hover:scale-105 transition-transform hover:shadow-yellow-500/10 animate-pulse">
              <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Emergency Alerts</h3>
              <p className="text-4xl font-bold text-white">1</p>
              <div className="text-yellow-400 text-xs mt-2">Nagare Accident Hospital</div>
            </div>
          </div>
        );

      case "map":
        return (
          <div className="h-[600px] w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-700 relative animate-fade-in">
            {/* Center map on Sangamner */}
            <MapContainer center={[19.5761, 74.2070]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {hospitals.map((hospital) => (
                <Marker key={hospital.id} position={[hospital.lat, hospital.lng]}>
                  <Popup>
                    <div className="text-black font-sans min-w-[200px]">
                      <h3 className="font-bold text-lg mb-1">{hospital.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{hospital.address}</p>
                      <div className="flex justify-between items-center text-sm border-t pt-2">
                        <span className="font-semibold text-blue-600">{hospital.type}</span>
                        <span className="font-bold text-green-600 px-2 py-0.5 bg-green-100 rounded-full text-xs">{hospital.status}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <div className="absolute top-4 right-4 bg-white/95 p-4 rounded-lg shadow-xl z-[1000] max-w-xs text-black border border-gray-300">
              <h4 className="font-bold border-b border-gray-300 pb-2 mb-2 text-sm uppercase tracking-wide">Live Sangamner Network</h4>
              <ul className="text-xs space-y-2 max-h-[300px] overflow-y-auto">
                {hospitals.map(h => (
                  <li key={h.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-semibold">{h.name}</span>
                      <span className="text-[10px] text-gray-500">{h.type}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${h.status === "Active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "patients":
        return (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-fade-in">
            <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
              <h3 className="text-lg font-bold">Recent Patient Activity (Real-time Feed)</h3>
              <button className="text-xs bg-teal-600 px-3 py-1 rounded text-white hover:bg-teal-500">Export Log</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-4">Time</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Visit Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm divide-y divide-gray-700">
                {patientVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-700/50 transition duration-150">
                    <td className="p-4 font-mono text-gray-500 text-xs">{visit.time}</td>
                    <td className="p-4 font-bold text-white">{visit.patient}</td>
                    <td className="p-4">{visit.hospital}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${visit.type === 'Emergency' ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-green-900/30 text-green-300 border-green-800'}`}>
                        {visit.type}
                      </span>
                    </td>
                    <td className="p-4">{visit.status}</td>
                    <td className="p-4">
                      <button className="text-teal-400 hover:text-white text-xs underline">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Add User Form */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4 text-teal-400">Manage Registry (Add/Remove)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="ID" className="bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-teal-500 outline-none" />
                <input type="text" placeholder="Name" className="bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-teal-500 outline-none" />
                <select className="bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-teal-500 outline-none">
                  <option>Patient</option>
                  <option>Doctor</option>
                </select>
                <button className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 rounded transition-colors" onClick={() => alert("User Added to Registry!")}>
                  Add User
                </button>
              </div>
            </div>

            {/* User List */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="p-4 border-b border-gray-700 bg-gray-900/50">
                <h3 className="text-lg font-bold">Registered Users (Sangamner Region)</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300 text-sm divide-y divide-gray-700">
                  {[
                    { id: "ID-1023", name: "Amit Deshmukh", role: "Patient", status: "Active" },
                    { id: "ID-4091", name: "Dr. Rajesh Patil", role: "Doctor", status: "Active" },
                    { id: "ID-9021", name: "Priya Patil", role: "Patient", status: "Active" },
                    { id: "ID-5510", name: "Dr. Neha Gupta", role: "Doctor", status: "Active" },
                  ].map((user, idx) => (
                    <tr key={idx} className="hover:bg-gray-700/50 transition">
                      <td className="p-4 font-mono text-teal-400">{user.id}</td>
                      <td className="p-4 font-bold text-white">{user.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'Doctor' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}>{user.role}</span>
                      </td>
                      <td className="p-4 text-green-400">{user.status}</td>
                      <td className="p-4">
                        <button className="bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white px-3 py-1 rounded text-xs border border-red-800 transition-colors"
                          onClick={(e) => { e.target.closest('tr').style.opacity = '0.3'; alert(`Removed User: ${user.name}`); }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <NavBar_Logout />

      {/* Top Bar with Blockchain Clock */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center sticky top-0 z-40">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Admin Console
        </h2>
        <div className="hidden md:block">
          <BlockchainClock />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveModule("dashboard")}
              className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${activeModule === "dashboard" ? "bg-teal-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}
            >
              <span>📊</span>
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveModule("map")}
              className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${activeModule === "map" ? "bg-teal-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}
            >
              <span>🗺️</span>
              <span>Network Map</span>
            </button>
            <button
              onClick={() => setActiveModule("patients")}
              className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${activeModule === "patients" ? "bg-teal-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}
            >
              <span>🏥</span>
              <span>Patient Log</span>
            </button>
            <button
              onClick={() => setActiveModule("users")}
              className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${activeModule === "users" ? "bg-teal-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}
            >
              <span>👥</span>
              <span>User Mgmt</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full text-left p-3 rounded-lg flex items-center space-x-3 text-gray-400 hover:bg-red-900/30 hover:text-red-400 mt-auto"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-500 uppercase mb-2">System Status</div>
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Blockchain Synced</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white capitalize">{activeModule.replace("-", " ")}</h1>
                <p className="text-gray-400 text-sm">Real-time data visualization</p>
              </div>
              {/* Mobile Clock Fallback */}
              <div className="md:hidden">
                <span className="text-teal-400 font-mono text-sm">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DiagnosticDashBoard;

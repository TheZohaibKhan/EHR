import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "../CSS/PatientDashBoard.css"; // Reuse existing CSS or creates new one
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";

const AdminDashboard = () => {
    const [web3, setWeb3] = useState(null);
    const [patientContract, setPatientContract] = useState(null);
    const [doctorContract, setDoctorContract] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                try {
                    // Get Network ID
                    const networkId = await web3Instance.eth.net.getId();

                    // Load Patient Contract
                    const patientNetwork = PatientRegistration.networks[networkId];
                    const patientInstance = new web3Instance.eth.Contract(
                        PatientRegistration.abi,
                        patientNetwork && patientNetwork.address
                    );
                    setPatientContract(patientInstance);

                    // Load Doctor Contract
                    const doctorNetwork = DoctorRegistration.networks[networkId];
                    const doctorInstance = new web3Instance.eth.Contract(
                        DoctorRegistration.abi,
                        doctorNetwork && doctorNetwork.address
                    );
                    setDoctorContract(doctorInstance);

                    // Fetch Data
                    const allUsers = [];

                    // Fetch Patients
                    if (patientNetwork) {
                        try {
                            // Check if the new method exists in the ABI (it should after compile)
                            const patientIds = await patientInstance.methods.getAllPatientIds().call();
                            for (const id of patientIds) {
                                const details = await patientInstance.methods.getPatientDetails(id).call();
                                // details object will have numeric keys and named keys if ABI supports it.
                                // details: {0: wallet, 1: name, ... 7: dateOfRegistration}
                                // Based on my edit, dateOfRegistration is last.
                                allUsers.push({
                                    type: "Patient",
                                    name: details.name || details[1],
                                    id: id,
                                    walletAddress: details.walletAddress || details[0],
                                    dateOfRegistration: details.dateOfRegistration || details[7] || 0 // Fallback to 0 if undefined
                                });
                            }
                        } catch (err) {
                            console.error("Error fetching patients:", err);
                        }
                    }

                    // Fetch Doctors
                    if (doctorNetwork) {
                        try {
                            const doctorIds = await doctorInstance.methods.getAllDoctorIds().call();
                            for (const id of doctorIds) {
                                const details = await doctorInstance.methods.getDoctorDetails(id).call();
                                // Doctor details struct is larger:
                                // 0: wallet, 1: name, ... 10: dateOfRegistration
                                allUsers.push({
                                    type: "Doctor",
                                    name: details._doctorName || details[1], // Names in DoctorRegistration return are _doctorName
                                    id: id,
                                    walletAddress: details._walletAddress || details[0],
                                    dateOfRegistration: details._dateOfRegistration || details[10] || 0
                                });
                            }
                        } catch (err) {
                            console.error("Error fetching doctors:", err);
                        }
                    }

                    // Sort by Date (Descending - newest first)
                    allUsers.sort((a, b) => b.dateOfRegistration - a.dateOfRegistration);
                    setUsers(allUsers);
                    setLoading(false);

                } catch (error) {
                    console.error("Error initializing Web3 or Contracts:", error);
                    setLoading(false);
                }
            } else {
                console.log("Please install MetaMask extension");
                setLoading(false);
            }
        };

        init();
    }, []);

    return (
        <div>
            <NavBar_Logout />
            <div className="bg-gray-900 min-h-screen p-10 font-mono text-white">
                <h2 className="text-4xl font-bold mb-8 text-center text-teal-400">Admin Dashboard</h2>

                {loading ? (
                    <div className="text-center text-xl">Loading Blockchain Data...</div>
                ) : (
                    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-700">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-teal-300 border-b border-gray-700">
                                    <th className="p-4">Time Registered</th>
                                    <th className="p-4">User Type</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">ID / HH Number</th>
                                    <th className="p-4">Wallet Address</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={index} className="hover:bg-gray-700 transition-colors">
                                            <td className="p-4 text-gray-300">
                                                {user.dateOfRegistration > 0
                                                    ? new Date(parseInt(user.dateOfRegistration) * 1000).toLocaleString()
                                                    : "N/A"}
                                            </td>
                                            <td className={`p-4 font-bold ${user.type === 'Doctor' ? 'text-blue-400' : 'text-green-400'}`}>
                                                {user.type}
                                            </td>
                                            <td className="p-4 text-white font-semibold">{user.name}</td>
                                            <td className="p-4 text-gray-400">{user.id}</td>
                                            <td className="p-4 text-xs font-mono text-gray-500">{user.walletAddress}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            No users found on the blockchain.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

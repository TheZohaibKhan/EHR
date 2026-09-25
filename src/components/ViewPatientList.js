import React, { useState, useEffect } from "react";
import Web3 from "web3";
import NavBar_Logout from "./NavBar_Logout";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useNavigate } from "react-router-dom";

function ViewPatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not found.");
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();

        // 1.Get Doctor Registration Contract
        const docNetwork = DoctorRegistration.networks[networkId];
        if (!docNetwork) throw new Error("DoctorRegistration contract not deployed.");

        const docContract = new web3.eth.Contract(DoctorRegistration.abi, docNetwork.address);

        // 2. Get Doctor HH Number
        // Assuming current account is a doctor. Check if registered.
        const isDoc = await docContract.methods.isDoctor(accounts[0]).call();
        if (!isDoc) throw new Error("Account is not a registered doctor.");

        const doctorId = await docContract.methods.getDoctorHHNumber(accounts[0]).call();

        // 3. Get Patient Registration Contract
        const patNetwork = PatientRegistration.networks[networkId];
        if (!patNetwork) throw new Error("PatientRegistration contract not deployed.");

        const patContract = new web3.eth.Contract(PatientRegistration.abi, patNetwork.address);

        // 4. Get Patient List
        const patientList = await patContract.methods.getPatientList(doctorId).call();
        // patientList is array of structs {patient_id, patient_name}

        setPatients(patientList);
        setLoading(false);

      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <NavBar_Logout />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-teal-400">My Patients</h1>

        {loading ? (
          <div className="text-center text-gray-400">Loading patients...</div>
        ) : error ? (
          <div className="text-center text-red-400">Error: {error}</div>
        ) : patients.length === 0 ? (
          <div className="text-center text-gray-500">No patients assigned yet.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((pat, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-teal-500 transition duration-300">
                <h3 className="text-xl font-semibold mb-2">{pat.patient_name}</h3>
                <p className="text-gray-400 mb-4">ID: <span className="text-white">{pat.patient_id}</span></p>
                <button
                  onClick={() => navigate(`/patient/${pat.patient_id}/viewrecords`)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                >
                  View Records
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPatientList;

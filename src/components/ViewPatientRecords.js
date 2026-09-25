import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import NavBar_Logout from "./NavBar_Logout";
import UploadEhr from "../build/contracts/UploadEhr.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";

function ViewPatientRecords() {
  const { id } = useParams(); // Get from URL
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    const loadRecords = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not found.");
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();

        // 1. Resolve Patient Address from HH Number
        const patNetwork = PatientRegistration.networks[networkId];
        if (!patNetwork) throw new Error("PatientRegistration contract not deployed.");

        const patContract = new web3.eth.Contract(PatientRegistration.abi, patNetwork.address);

        // Check if patient exists
        const isRegistered = await patContract.methods.isRegisteredPatient(id).call();
        if (!isRegistered) throw new Error("Patient not found.");

        const patientDetails = await patContract.methods.getPatientDetails(id).call();
        const patientAddress = patientDetails[0];
        setPatientName(patientDetails[1]);

        // --- ACCESS CONTROL CHECK ---
        const viewerAddress = accounts[0];
        let isAuthorized = false;

        // 1. Check if viewer is the patient themselves
        if (viewerAddress.toLowerCase() === patientAddress.toLowerCase()) {
          isAuthorized = true;
        } else {
          // 2. Check if viewer is an authorized Doctor
          const docNetwork = DoctorRegistration.networks[networkId];
          if (docNetwork) {
            const docContract = new web3.eth.Contract(DoctorRegistration.abi, docNetwork.address);
            const isDoctor = await docContract.methods.isDoctor(viewerAddress).call();

            if (isDoctor) {
              const doctorId = await docContract.methods.getDoctorHHNumber(viewerAddress).call();
              // Check permission on PatientRegistration contract
              const hasPermission = await patContract.methods.isPermissionGranted(id, doctorId).call();
              if (hasPermission) {
                isAuthorized = true;
              } else {
                throw new Error("Access Denied: You possess a Doctor account but have not been granted permission by this patient.");
              }
            } else {
              throw new Error("Access Denied: You are not the patient nor a registered doctor.");
            }
          } else {
            console.warn("DoctorRegistration contract not deployed, skipping doctor check.");
          }
        }

        if (!isAuthorized) {
          // Fallback if logic slips through, though errors above should catch it
          throw new Error("Access Denied.");
        }
        // -----------------------------

        // 2. Fetch Records
        const uploadNetwork = UploadEhr.networks[networkId];
        if (!uploadNetwork) throw new Error("UploadEhr contract not deployed.");

        const uploadContract = new web3.eth.Contract(UploadEhr.abi, uploadNetwork.address);

        // Use getPatientRecords to view specific patient's data
        const recs = await uploadContract.methods.getPatientRecords(patientAddress).call();
        setRecords(recs);
        setLoading(false);

      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      loadRecords();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <NavBar_Logout />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-teal-400">Medical Records</h1>
        {patientName && <h2 className="text-xl text-center text-gray-400 mb-8">Patient: {patientName} ({id})</h2>}

        {loading ? (
          <div className="text-center text-gray-400">Loading records...</div>
        ) : error ? (
          <div className="text-center text-red-400">Error: {error}</div>
        ) : records.length === 0 ? (
          <div className="text-center text-gray-500 text-xl mt-12">No medical records found for this patient.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {records.map((rec, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-teal-500 transition duration-300">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                  <h3 className="text-lg font-semibold text-teal-300">Record #{index + 1}</h3>
                  <span className="text-xs text-gray-500">{new Date(rec.timeStamp).toLocaleDateString()}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Hash:</span> <span className="font-mono text-xs">{rec.medicalRecordHash.substring(0, 10)}...</span></p>
                  <p><span className="text-gray-500">Uploaded By:</span> <span className="font-mono text-xs">{rec.uploadedBy.substring(0, 10)}...</span></p>
                </div>
                <div className="mt-6">
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${rec.medicalRecordHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded transition"
                  >
                    View Document
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPatientRecords;

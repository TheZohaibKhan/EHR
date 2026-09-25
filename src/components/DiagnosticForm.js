import React, { useState, useEffect } from "react";
import Web3 from "web3";
import NavBar_Logout from "./NavBar_Logout";
import UploadEhr from "../build/contracts/UploadEhr.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { uploadFileToPinata } from "../utils/pinataClient";

function DiagnosticForm() {
  const [patientId, setPatientId] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      // Get Patient Address
      const patientNetworkData = PatientRegistration.networks[networkId];
      if (!patientNetworkData) {
        setStatus("PatientRegistration contract not deployed to detected network.");
        return;
      }
      const patientContract = new web3.eth.Contract(
        PatientRegistration.abi,
        patientNetworkData.address
      );

      // Verify patient exists and get wallet address
      const isRegistered = await patientContract.methods.isRegisteredPatient(patientId).call();
      if (!isRegistered) {
        setStatus("Patient not found with this ID.");
        return;
      }

      const patientDetails = await patientContract.methods.getPatientDetails(patientId).call();
      const patientAddress = patientDetails[0];

      // Upload Record
      const uploadNetworkData = UploadEhr.networks[networkId];
      if (!uploadNetworkData) {
        setStatus("UploadEhr contract not deployed.");
        return;
      }
      const uploadContract = new web3.eth.Contract(
        UploadEhr.abi,
        uploadNetworkData.address
      );

      // IPFS Upload (Pinata)
      let finalHash = fileHash;
      if (file) {
        try {
          setStatus("Uploading to Pinata IPFS...");
          finalHash = await uploadFileToPinata(file);
        } catch (ipfsError) {
          console.error("Pinata Upload Failed", ipfsError);
          setStatus("Pinata Upload Failed. Check your API keys.");
          return;
        }
      } else if (!fileHash) {
        setStatus("Please select a file or provide a hash.");
        return;
      }

      const timestamp = new Date().toISOString();
      setStatus("Confirming transaction...");

      const receipt = await uploadContract.methods.addRecordForPatient(
        patientAddress,
        timestamp,
        finalHash
      ).send({ from: accounts[0] });

      setStatus(`Record uploaded! IPFS: ${finalHash} | Tx: ${receipt.transactionHash}`);
      setPatientId("");
      setFileHash("");
      setDescription("");
      setFile(null);

    } catch (error) {
      console.error(error);
      setStatus("Error uploading record: " + error.message);
    }
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gray-900 min-h-screen text-white p-10 font-sans flex justify-center">
        <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">Diagnostic Upload Form</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-teal-500 focus:outline-none"
                placeholder="Enter 6-digit ID"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Upload File (IPFS)</label>
              <input
                type="file"
                onChange={captureFile}
                className="w-full p-3 bg-gray-700 rounded border border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Medical Record Hash (IPFS or Link)</label>
              <input
                type="text"
                value={fileHash}
                onChange={(e) => setFileHash(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-teal-500 focus:outline-none"
                placeholder="Paste IPFS hash or file link"
              />
              <p className="text-xs text-gray-400 mt-1">* For demo, leave blank to generate a mock hash.</p>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-teal-600 hover:bg-teal-700 rounded font-bold transition duration-300"
            >
              Upload Record
            </button>
          </form>

          {status && (
            <div className={`mt-6 p-4 rounded text-center ${status.includes("Error") ? "bg-red-900/50 text-red-200" : "bg-green-900/50 text-green-200"}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiagnosticForm;

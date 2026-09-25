import React, { useState } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import UploadEhr from "../build/contracts/UploadEhr.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { uploadFileToPinata } from "../utils/pinataClient";

function DoctorForm() {
    const { id } = useParams(); // Doctor's ID
    const navigate = useNavigate();
    const [patientId, setPatientId] = useState("");
    const [fileHash, setFileHash] = useState("");
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    const captureFile = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        setFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Processing...");

        try {
            if (!window.ethereum) throw new Error("MetaMask not found");
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            // contracts
            const patNetwork = PatientRegistration.networks[networkId];
            if (!patNetwork) throw new Error("PatientRegistration not deployed");
            const patContract = new web3.eth.Contract(PatientRegistration.abi, patNetwork.address);

            const networkData = UploadEhr.networks[networkId];
            if (!networkData) throw new Error("UploadEhr not deployed");
            const uploadContract = new web3.eth.Contract(UploadEhr.abi, networkData.address);

            // Verify patient
            const isRegistered = await patContract.methods.isRegisteredPatient(patientId).call();
            if (!isRegistered) {
                setStatus("Patient not found.");
                return;
            }

            // Check Permission
            const hasPermission = await patContract.methods.isPermissionGranted(patientId, id).call();
            if (!hasPermission) {
                setStatus("You do not have permission. Request access first.");
                return;
            }

            // Upload to IPFS (Pinata)
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

            const patientDetails = await patContract.methods.getPatientDetails(patientId).call();
            const patientAddress = patientDetails[0];

            const timestamp = new Date().toISOString();
            setStatus("Confirming transaction...");
            const receipt = await uploadContract.methods.addRecordForPatient(
                patientAddress,
                timestamp,
                finalHash
            ).send({ from: accounts[0] });

            setStatus(`Record uploaded! IPFS: ${finalHash} | Tx: ${receipt.transactionHash}`);
            setPatientId("");
            setFile(null);
            setFileHash("");

        } catch (error) {
            console.error(error);
            setStatus("Error: " + error.message);
        }
    };

    return (
        <div>
            <NavBar_Logout />
            <div className="bg-gray-900 min-h-screen text-white p-10 font-sans flex justify-center">
                <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">Doctor Prescription Upload</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Patient ID</label>
                            <input
                                type="text"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-teal-500 focus:outline-none"
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
                        <div className="text-center text-gray-500">- OR -</div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Manual IPFS Hash</label>
                            <input
                                type="text"
                                value={fileHash}
                                onChange={(e) => setFileHash(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-teal-500 focus:outline-none"
                                placeholder="Qm..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3 bg-teal-600 hover:bg-teal-700 rounded font-bold transition duration-300"
                        >
                            Upload & Record on Blockchain
                        </button>
                    </form>

                    {status && (
                        <div className={`mt-6 p-4 rounded text-center ${status.includes("Error") || status.includes("Failed") ? "bg-red-900/50 text-red-200" : "bg-green-900/50 text-green-200"}`}>
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorForm;

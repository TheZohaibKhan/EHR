import React, { useState } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import UploadEhr from "../build/contracts/UploadEhr.json";
import { uploadFileToPinata } from "../utils/pinataClient";

function PatientUpload() {
    const { id } = useParams(); // Patient's ID
    const navigate = useNavigate();
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

            const uploadNetwork = UploadEhr.networks[networkId];
            if (!uploadNetwork) throw new Error("UploadEhr not deployed");
            const uploadContract = new web3.eth.Contract(UploadEhr.abi, uploadNetwork.address);

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

            const timestamp = new Date().toISOString();
            setStatus("Confirming transaction...");

            // Patient adds record to themselves
            const receipt = await uploadContract.methods.addRecord(
                timestamp,
                finalHash
            ).send({ from: accounts[0] });

            setStatus(`Success! IPFS: ${finalHash} | Tx: ${receipt.transactionHash}`);
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
                    <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">Upload Your Medical Record</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Upload File (to IPFS)</label>
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
                            Securely Upload & Store on Blockchain
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

export default PatientUpload;

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const DoctorDashBoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);

  const uploadRecord = () => {
    navigate("/doctor/" + id + "/doctorform");
  };


  const viewPatientList = () => {
    navigate("/doctor/" + id + "/patientlist");
  };

  const viewDoctorProfile = () => {
    navigate("/doctor/" + id + "/viewdoctorprofile");
  };

  useEffect(() => {
    const init = async () => {
      // Check if Web3 is injected by MetaMask or any other provider
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);

          // Call the getDoctorDetails function of the smart contract
          const result = await contractInstance.methods.getDoctorDetails(id).call();
          setDoctorDetails(result);
        } catch (error) {
          console.error('Error initializing Web3 or fetching doctor details:', error);
          setError('Error initializing Web3 or fetching doctor details');
        }
      } else {
        console.error('Please install MetaMask extension');
        setError('Please install MetaMask extension');
      }
    };

    init();
  }, [id]);

  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyId, setEmergencyId] = useState("");
  const [patientContract, setPatientContract] = useState(null);

  useEffect(() => {
    const networkId = async () => {
      const web3 = new Web3(window.ethereum);
      const netId = await web3.eth.net.getId();
      const deployedNetwork = PatientRegistration.networks[netId];
      if (deployedNetwork) {
        const instance = new web3.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork.address
        );
        setPatientContract(instance);
      }
    }
    networkId();
  }, []);


  const handleEmergencyAccess = async () => {
    try {
      if (!patientContract) return;
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await patientContract.methods.emergencyAccess(emergencyId).send({ from: accounts[0] });
      alert("Emergency Access Granted! You can now view the patient's records.");
      setShowEmergencyModal(false);
      // Optionally navigate to view records
    } catch (err) {
      console.error(err);
      alert("Failed to grant emergency access. Ensure you are a registered doctor and the patient ID is valid.");
    }
  };

  return (
    <div>
      <NavBar_Logout></NavBar_Logout>
      <div className="bg-transparent p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center relative">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Doctor Dashboard</h2>
        {doctorDetails && (
          <p className="text-xl sm:text-2xl mb-24">
            Welcome{" "}
            <span className="font-bold text-yellow-500">{doctorDetails[1]}!</span>
          </p>
        )}
        <div className="space-y-4 space-x-4">
          <button
            onClick={viewDoctorProfile}
            className="px-6 py-3 bg-teal-500 hover-bg-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300"
          >
            View Profile
          </button>

          <button
            onClick={viewPatientList}
            className="px-6 py-3 bg-teal-500 hover-bg-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300"
          >
            View Patient List
          </button>

          <button
            onClick={uploadRecord}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-purple-500 transition duration-300 transform hover:scale-105"
          >
            Upload Record
          </button>

          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-red-500 transition duration-300 animate-pulse font-bold"
          >
            🚨 Emergency Access
          </button>

        </div>

        {showEmergencyModal && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg border border-red-500 shadow-2xl max-w-md w-full">
              <h3 className="text-2xl text-red-500 font-bold mb-4">📢 Emergency Access Declaration</h3>
              <p className="text-gray-300 mb-6">
                By proceeding, you declare a medical emergency. This action will be permanently recorded on the blockchain.
              </p>
              <label className="block text-white mb-2">Patient ID:</label>
              <input
                type="text"
                value={emergencyId}
                onChange={(e) => setEmergencyId(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white mb-6"
                placeholder="Enter 6-digit ID"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmergencyAccess}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                >
                  Confirm & Access
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


export default DoctorDashBoardPage;

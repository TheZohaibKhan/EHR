import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/PatientDashBoard.css";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const PatientDashBoard = () => {
  const { id } = useParams(); // Retrieve the id from the URL parameter
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showFindDoctor, setShowFindDoctor] = useState(false);

  /* Grant Access State */
  const [showGrantAccess, setShowGrantAccess] = useState(false);
  const [doctorIdToGrant, setDoctorIdToGrant] = useState("");
  const [grantStatus, setGrantStatus] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract(contractInstance);
        setPatientId(id);
        try {
          const result = await contractInstance.methods.getPatientDetails(id).call();
          setPatientDetails(result);
        } catch (error) {
          console.error('Error retrieving patient details:', error);
          setError('Error retrieving patient details');
        }
      } else {
        console.log('Please install MetaMask extension');
        setError('Please install MetaMask extension');
      }
    };

    init();
  }, [id]);

  const viewRecord = () => {
    navigate("/patient/" + id + "/viewrecords");
  };

  const viewprofile = () => {
    navigate("/patient/" + id + "/viewprofile");
  };

  const uploadRecord = () => {
    navigate("/patient/" + id + "/upload");
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    setGrantStatus("Processing...");
    try {
      if (!contract) throw new Error("Contract not loaded");
      const accounts = await web3.eth.getAccounts();

      // Call grantPermission(patientId, doctorId, patientName)
      await contract.methods.grantPermission(
        id,
        doctorIdToGrant,
        patientDetails.name
      ).send({ from: accounts[0] });

      setGrantStatus("Access Granted Successfully!");
      setDoctorIdToGrant("");
      setTimeout(() => {
        setShowGrantAccess(false);
        setGrantStatus("");
      }, 2000);

    } catch (err) {
      console.error(err);
      setGrantStatus("Error: " + err.message);
    }
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-transparent p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Patient Dashboard</h2>
        {patientDetails && (
          <p className="text-xl sm:text-2xl mb-24">
            Welcome{" "}
            <span className="font-bold text-yellow-500">{patientDetails.name}!</span>
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-5 w-full px-4 sm:px-0">
          <button
            onClick={viewprofile}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300 transform hover:scale-105"
          >
            View Profile
          </button>
          <button
            onClick={viewRecord}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300 transform hover:scale-105"
          >
            View Record
          </button>
          <button
            onClick={uploadRecord}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105"
          >
            Upload Record
          </button>
          <button
            onClick={() => setShowGrantAccess(true)}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-green-600 hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
          >
            Grant Access
          </button>
          <button
            onClick={() => setShowFindDoctor(true)}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">🩺</span>
            <span>Find Nearby Doctors</span>
          </button>
        </div>

        {/* Grant Access Modal */}
        {showGrantAccess && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
              <h3 className="text-2xl font-bold mb-4 text-teal-400">Grant Access to Doctor</h3>
              <form onSubmit={handleGrantAccess}>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Doctor ID</label>
                  <input
                    type="text"
                    value={doctorIdToGrant}
                    onChange={(e) => setDoctorIdToGrant(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:border-teal-500 focus:outline-none"
                    placeholder="Enter Doctor ID"
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setShowGrantAccess(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded"
                  >
                    Grant
                  </button>
                </div>
                {grantStatus && (
                  <p className={`mt-4 text-center ${grantStatus.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                    {grantStatus}
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Find Doctor Modal */}
        {showFindDoctor && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-teal-500/30 shadow-2xl flex flex-col">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                  Recommended Doctors in Sangamner
                </h3>
                <button onClick={() => setShowFindDoctor(false)} className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 1, name: "Dr. Rajesh Patil", spec: "Cardiologist", hosp: "Saisuman Hrudayalaya", exp: "12 Years", loc: "Tajane Mala, Sangamner", rating: 4.8 },
                    { id: 2, name: "Dr. Anjali Deshmukh", spec: "General Physician", hosp: "Chaitanya Hospital", exp: "8 Years", loc: "Navin Nagar Rd, Sangamner", rating: 4.5 },
                    { id: 3, name: "Dr. Sameer Khan", spec: "Orthopedic", hosp: "Nagare Accident Hospital", exp: "15 Years", loc: "Navin Nagar Rd, Sangamner", rating: 4.9 },
                    { id: 4, name: "Dr. Neha Gupta", spec: "Pediatrician", hosp: "Medicover Hospitals", exp: "6 Years", loc: "Gunjalwadi Rd, Sangamner", rating: 4.7 },
                  ].map((doc) => (
                    <div key={doc.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-teal-500/50 transition-all hover:bg-gray-800/50 group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">{doc.name}</h4>
                          <p className="text-sm text-blue-400">{doc.spec}</p>
                        </div>
                        <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center">
                          ★ {doc.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1 flex items-center">
                        <span className="mr-2">🏥</span> {doc.hosp}
                      </p>
                      <p className="text-xs text-gray-400 mb-3 flex items-center">
                        <span className="mr-2">📍</span> {doc.loc}
                      </p>
                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2 rounded transition-colors">
                          Book Appointment
                        </button>
                        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 rounded transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashBoard;

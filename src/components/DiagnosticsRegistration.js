import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorRegistration.css";
import NavBar from "./NavBar";

const DiagnosticRegistry = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [diagnosticAddress, setDiagnosticAddress] = useState("");
  const [diagnosticName, setDiagnosticName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [diagnosticLocation, setDiagnosticLocation] = useState("");
  const [id, setId] = useState("");
  const [idError, setIdError] = useState("");
  const [password, setPassword] = useState(""); // Define password state variable
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          console.log("Current Application Network ID:", networkId);
          console.log("DiagnosticRegistration Artifact Networks:", DiagnosticRegistration.networks);

          let deployedNetwork = DiagnosticRegistration.networks[networkId];

          // Fallback for Ganache: If networkId is 1337 but artifact has 5777
          if (!deployedNetwork && DiagnosticRegistration.networks[5777]) {
            console.log("Swapping network ID match: 1337 -> 5777");
            deployedNetwork = DiagnosticRegistration.networks[5777];
          }
          const contractInstance = new web3Instance.eth.Contract(
            DiagnosticRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);


  const handleRegister = async () => {
    if (
      !diagnosticAddress ||
      !diagnosticName ||
      !hospitalName ||
      !diagnosticLocation ||
      !email ||
      !id ||
      !password ||
      !confirmPassword
    ) {
      alert(
        "You have missing input fields. Please fill in all the required fields."
      );
      return;
    }

    // Password validation: minimum length
    if (password.length < 8) {
      setPassword("");
      setConfirmPassword("");
      setPasswordError("Password must be atleast 8 characters long.");
      return;
    }

    // Password validation: minimum length
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPassword("");
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError(""); // Clear email error if valid
    }

    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      let deployedNetwork = DiagnosticRegistration.networks[networkId];
      // Fallback for Ganache
      if (!deployedNetwork && DiagnosticRegistration.networks[5777]) {
        console.log("Swapping network ID match in handleRegister: 1337 -> 5777");
        deployedNetwork = DiagnosticRegistration.networks[5777];
      }

      if (!deployedNetwork) {
        alert("Smart contract not deployed to this network.");
        return;
      }

      const contract = new web3.eth.Contract(
        DiagnosticRegistration.abi,
        deployedNetwork.address
      );

      const isRegDoc = await contract.methods
        .isRegisteredDiagnostic(id)
        .call();

      if (isRegDoc) {
        alert("Diagnostic already exists");
        return;
      }

      await contract.methods
        .registerDiagnostic(
          diagnosticName,
          hospitalName,
          diagnosticLocation,
          email,
          id,
          password // Include password in the function call
        )
        .send({ from: diagnosticAddress });

      alert("Diagnostic registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the diagnostic.");
    }
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
  };

  const handleIdChange = (e) => {
    const inputId = e.target.value;
    const phoneRegex = /^\d{6}$/;
    if (phoneRegex.test(inputId)) {
      setId(inputId);
      setIdError("");
    } else {
      setId(inputId);
      setIdError("Please enter a 6-digit ID.");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };


  const cancelOperation = () => {
    navigate("/");
  };

  return (
    <div>
      <NavBar></NavBar>
      <div className="createehr min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-800 font-mono">
        <div className="w-full max-w-2xl">
          <h2 className="text-3xl text-white mb-6 font-bold text-center">
            Admin Registration
          </h2>
          <form className="bg-gray-900 p-6 rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="diagnosticAddress"
              >
                Wallet Public Address
              </label>
              <input
                id="diagnosticAddress"
                name="diagnosticAddress"
                type="text"
                required
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
                placeholder="Crypto Wallet Public Address"
                value={diagnosticAddress}
                onChange={(e) => setDiagnosticAddress(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="diagnosticName">
                Diagnostic Center Name
              </label>
              <input
                id="diagnosticName"
                name="diagnosticName"
                type="text"
                required
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
                placeholder="Enter Diagnostic's Center Full Name"
                value={diagnosticName}
                onChange={(e) => setDiagnosticName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="hospitalName"
              >
                Hospital Name
              </label>
              <input
                id="hospitalName"
                name="hospitalName"
                type="text"
                required
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
                placeholder="Enter Hospital Name"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="diagnosticLocation">
                Location
              </label>
              <input
                type="text"
                id="diagnosticLocation"
                name="diagnosticLocation"
                placeholder="Enter the location of Diagnostic center"
                value={diagnosticLocation}
                onChange={(e) => setDiagnosticLocation(e.target.value)}
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${emailError && "border-red-500"
                  }`}
                placeholder="Enter your Email-id"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="id">
                ID
              </label>
              <input
                id="id"
                name="id"
                type="text"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${idError && "border-red-500"}`}
                placeholder="ID"
                value={id}
                onChange={handleIdChange}
              />
              {idError && (
                <p className="text-red-500 text-sm mt-1">{idError}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${passwordError && "border-red-500"
                  }`}
                placeholder="Enter your Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${confirmPasswordError && "border-red-500"
                  }`}
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
              )}
            </div>

          </form>
          <div className="space-x-4 text-center mt-6">
            <button
              type="button"
              onClick={handleRegister}
              className="py-3 px-4 bg-teal-500 text-white rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Register
            </button>
            <button
              onClick={cancelOperation}
              className="py-3 px-4 bg-teal-500 text-white rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticRegistry;

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDoctorRegistration {
    function isDoctor(address _doctor) external view returns (bool);
    function getDoctorId(address _doctor) external view returns (string memory);
}

contract PatientRegistration {
    struct Patient {
        address walletAddress;
        string name;
        string dateOfBirth;
        string gender;
        string bloodGroup;
        string homeAddress;
        string email;
        string id;
        string password;
        uint256 dateOfRegistration;
    }

    struct PatientList{
        string patient_id;
        string patient_name;
    }

    IDoctorRegistration public doctorContract;

    mapping(string => bool) public isPatientRegistered;
    mapping(string => Patient) public patients;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;
    string[] public allPatientIds;

    event PatientRegistered(string id, string name, address walletAddress);
    event EmergencyAccessDeclared(address indexed doctor, string patientId, uint256 timestamp);


    function registerPatient(
        address _walletAddress,
        string memory _name,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _bloodGroup,
        string memory _homeAddress,
        string memory _email,
        string memory _id,
        string memory _password

    ) external {
        require(!isPatientRegistered[_id], "Patient already registered");

        Patient memory newPatient = Patient({
            walletAddress: _walletAddress,
            name: _name,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            bloodGroup: _bloodGroup,
            homeAddress: _homeAddress,
            email: _email,    
            id: _id,        
            password: _password, // Store password in the struct
            dateOfRegistration: block.timestamp
        });

        patients[_id] = newPatient;
        isPatientRegistered[_id] = true;
        allPatientIds.push(_id);
        emit PatientRegistered(_id, _name, _walletAddress);
    }

    function isRegisteredPatient(string memory _id) external view returns (bool) {
        return isPatientRegistered[_id];
    }
    
    // Add a function to validate patient's password
    function validatePassword(string memory _id, string memory _password) external view returns (bool) {
        require(isPatientRegistered[_id], "Patient not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(patients[_id].password));
    }

    function getAllPatientIds() external view returns (string[] memory) {
        return allPatientIds;
    }

    function getPatientDetails(string memory _id) external view returns (
    address walletAddress,
    string memory name,
    string memory dateOfBirth,
    string memory gender,
    string memory bloodGroup,
    string memory homeAddress,
    string memory email,
    uint256 dateOfRegistration
    ) {
        require(isPatientRegistered[_id], "Patient not registered");
        Patient memory patient = patients[_id];
        return (patient.walletAddress, patient.name, patient.dateOfBirth, patient.gender, patient.bloodGroup, patient.homeAddress, patient.email, patient.dateOfRegistration);
    }

    function grantPermission(
        string memory _patientId,
        string memory _doctorId,
        string memory _patientName
    ) external {
        require(!doctorPermissions[_patientId][_doctorId], "View Access already given to the Doctor!");
        // Check if the patient number already exists in the list
        bool exists = false;
        for (uint i = 0; i < Dpermission[_doctorId].length; i++) {
            if (keccak256(abi.encodePacked(Dpermission[_doctorId][i].patient_id)) == keccak256(abi.encodePacked(_patientId))) {
                exists = true;
                break;
            }
        }

        // If the patient number does not exist, add it to the list
        if (!exists) {
            PatientList memory newRecord = PatientList(
                _patientId,
                _patientName
            );
            Dpermission[_doctorId].push(newRecord);
        }
        doctorPermissions[_patientId][_doctorId] = true;
    }

    function isPermissionGranted(string memory _patientId,string memory _doctorId) external view returns (bool) {
        return doctorPermissions[_patientId][_doctorId];
    }

    function getPatientList(string memory _doctorId) public view returns (PatientList[] memory) {
        return Dpermission[_doctorId];
    }

    function setDoctorContract(address _doctorContractAddress) external {
        doctorContract = IDoctorRegistration(_doctorContractAddress);
    }

    function emergencyAccess(string memory _patientId) external {
        require(address(doctorContract) != address(0), "Doctor contract not set");
        require(doctorContract.isDoctor(msg.sender), "Caller is not a registered doctor");
        require(isPatientRegistered[_patientId], "Patient not registered");

        string memory doctorId = doctorContract.getDoctorId(msg.sender);
        require(bytes(doctorId).length > 0, "Doctor ID not found");

        doctorPermissions[_patientId][doctorId] = true;
        
         // Add to patient list if not exists
        bool exists = false;
        for (uint i = 0; i < Dpermission[doctorId].length; i++) {
            if (keccak256(abi.encodePacked(Dpermission[doctorId][i].patient_id)) == keccak256(abi.encodePacked(_patientId))) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            PatientList memory newRecord = PatientList(
                _patientId,
                patients[_patientId].name
            );
            Dpermission[doctorId].push(newRecord);
        }

        emit EmergencyAccessDeclared(msg.sender, _patientId, block.timestamp);
    }
}

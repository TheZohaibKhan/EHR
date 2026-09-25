// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DoctorRegistration {
    struct Doctor {
        address walletAddress;
        string doctorName;
        string hospitalName;
        string dateOfBirth;
        string gender;
        string email;
        string id;
        string specialization;
        string department;
        string designation;
        string workExperience;
        string password;
        uint256 dateOfRegistration;
    }

    struct PatientList{
        string patient_id;
        string patient_name;
    }

    mapping(string => address) private doctorAddresses;
    mapping(string => Doctor) private doctors;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;
    mapping(address => bool) public registeredDoctorAddresses;
    mapping(address => string) public doctorAddressToId;
    string[] public allDoctorIds;

    event DoctorRegistered(string id, string doctorName, address walletAddress);

    function registerDoctor(
        string memory _doctorName,
        string memory _hospitalName,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _email,
        string memory _id,
        string memory _specialization,
        string memory _department,
        string memory _designation,
        string memory _workExperience,
        string memory _password
    ) external {
        require(doctorAddresses[_id] == address(0), "Doctor already registered");

        Doctor memory newDoctor = Doctor({
            walletAddress: msg.sender,
            doctorName: _doctorName,
            hospitalName: _hospitalName,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            email: _email,
            id: _id,
            specialization: _specialization,
            department: _department,
            designation: _designation,
            workExperience: _workExperience,
            password: _password,
            dateOfRegistration: block.timestamp
        });

        doctors[_id] = newDoctor;
        doctorAddresses[_id] = msg.sender;
        registeredDoctorAddresses[msg.sender] = true;
        doctorAddressToId[msg.sender] = _id;
        allDoctorIds.push(_id);
        emit DoctorRegistered(_id, _doctorName, msg.sender);
    }

    function isDoctor(address _doctor) external view returns (bool) {
        return registeredDoctorAddresses[_doctor];
    }

    function getDoctorId(address _doctor) external view returns (string memory) {
        return doctorAddressToId[_doctor];
    }


    function isRegisteredDoctor(string memory _id) external view returns (bool) {
        return doctorAddresses[_id] != address(0);
    }

    function getAllDoctorIds() external view returns (string[] memory) {
        return allDoctorIds;
    }

    function getDoctorDetails(string memory _id) external view returns (
        address _walletAddress,
        string memory _doctorName,
        string memory _hospitalName,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _email,
        string memory _specialization,
        string memory _department,
        string memory _designation,
        string memory _workExperience,
        uint256 _dateOfRegistration
    ) {
        require(doctorAddresses[_id] != address(0), "Doctor not registered");
        Doctor memory doctor = doctors[_id];
        return (
            doctor.walletAddress,
            doctor.doctorName,
            doctor.hospitalName,
            doctor.dateOfBirth,
            doctor.gender,
            doctor.email,
            doctor.specialization,
            doctor.department,
            doctor.designation,
            doctor.workExperience,
            doctor.dateOfRegistration
        );
    }

    function validatePassword(string memory _id, string memory _password) external view returns (bool) {
        require(doctorAddresses[_id] != address(0), "Doctor not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(doctors[_id].password));
    }

    function grantPermission(
        string memory _patientId,
        string memory _doctorId,
        string memory _patientName
    ) external {
            PatientList memory newRecord = PatientList(
                _patientId,
                _patientName
            );
            Dpermission[_doctorId].push(newRecord);
        doctorPermissions[_patientId][_doctorId] = true;
    }

    function isPermissionGranted(string memory _patientId,string memory _doctorId) external view returns (bool) {
        return doctorPermissions[_patientId][_doctorId];
    }

    function revokePermission(string memory _patientId, string memory _doctorId) public {
        doctorPermissions[_patientId][_doctorId] = false;

        // Remove the patient's record from the list
        for (uint i = 0; i < Dpermission[_doctorId].length; i++) {
            if (keccak256(abi.encodePacked(Dpermission[_doctorId][i].patient_id)) == keccak256(abi.encodePacked(_patientId))) {
                // Delete the patient's record by shifting elements
                for (uint j = i; j < Dpermission[_doctorId].length - 1; j++) {
                    Dpermission[_doctorId][j] = Dpermission[_doctorId][j + 1];
                }
                Dpermission[_doctorId].pop();
                break;
            }
        }
    }


    function getPatientList(string memory _doctorId) public view returns (PatientList[] memory) {
        return Dpermission[_doctorId];
    }

}

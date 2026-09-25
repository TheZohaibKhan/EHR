// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UploadEhr {
    struct PatientRecord {
        string timeStamp;
        string medicalRecordHash;
        address uploadedBy; // Track who uploaded it
    }

    mapping(address => PatientRecord[]) public patientRecords;

    function addRecord(string memory _timeStamp, string memory _medicalRecordHash) public {
        patientRecords[msg.sender].push(PatientRecord(_timeStamp, _medicalRecordHash, msg.sender));
    }

    function addRecordForPatient(address _patient, string memory _timeStamp, string memory _medicalRecordHash) public {
        patientRecords[_patient].push(PatientRecord(_timeStamp, _medicalRecordHash, msg.sender));
    }

    function getRecords() public view returns (PatientRecord[] memory) {
        return patientRecords[msg.sender];
    }
    
    function getPatientRecords(address _patient) public view returns (PatientRecord[] memory) {
        return patientRecords[_patient];
    }
}

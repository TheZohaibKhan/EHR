const DoctorRegistration = artifacts.require("DoctorRegistration");
const PatientRegistration = artifacts.require("PatientRegistration");

module.exports = async function (deployer) {
    // Get deployed instances
    const doctorInstance = await DoctorRegistration.deployed();
    const patientInstance = await PatientRegistration.deployed();

    // Link Patient contract to Doctor contract
    // This allows Patient contract to verify if a caller is a valid doctor
    await patientInstance.setDoctorContract(doctorInstance.address);

    console.log("Linked PatientRegistration to DoctorRegistration at: " + doctorInstance.address);
};

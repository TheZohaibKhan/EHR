import axios from "axios";

// Access Pinata API keys from environment variables
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;
const PINATA_GATEWAY = process.env.REACT_APP_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";

export const uploadFileToPinata = async (file) => {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
        throw new Error(
            "Pinata API keys not found. Please set REACT_APP_PINATA_API_KEY and REACT_APP_PINATA_SECRET_API_KEY in your .env file."
        );
    }

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    const blob = new Blob([file]);
    const fileName = file.name || 'medical_record.pdf';
    data.append('file', blob, fileName);

    const metadata = JSON.stringify({
        name: "MedicalRecord_" + new Date().toISOString(),
    });
    data.append("pinataMetadata", metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    data.append("pinataOptions", options);

    try {
        const res = await axios.post(url, data, {
            maxBodyLength: "Infinity",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_API_KEY,
            },
        });
        return res.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        if (error.response) {
            console.error("Pinata Error Details:", error.response.data);
        }
        throw error;
    }
};

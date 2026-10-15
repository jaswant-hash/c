// Import useState hook from React to manage component state
import { useState } from "react";

// Dropbox Access Token directly hardcoded (same as TOKEN in dropbox.ipynb)
const TOKEN = "sl.u.AGyLhFO_L-hypU3gNqbFiSO9xaG9EoMatYS59Z_Hxqrtf6PSjjn4ZfPiUL24AWC5zCR8Vm-7ZCCJ6o8twCNWAS7c-O2tpZSdt953PRORX6qAgGpTVpCFpr8lQgZYTcwaWnKyZUHFKlKA6uq0LiuAqHC9xsE1Iunl9Jr4-PRmVRWlQp_NAT2Ae4dD7W8scq-iXrcrRnn9tqDEAkIq1eqYoHV6CMuzyua5YXl8PkV7lEz-sX3NaS4vriG4YUSe5jkqGbEuKZK0-s1y4fJnhqQ540c3W2K9yVl-e5KwMybtgUKJN4gqwTa2Y0jegao64Fff8S8GXvX72fCp-ecjRh03qTmn8qt-8Wj0wwNc56Vz82gx6HjT-DK9bFQvMB32Bv82phBg8QSMYNOqSFlLWfKTJrMS3VZXQiajhdyr4e4KsV3Yuk3LAmqS_fwMoi4NGTIDUbPBlAf7xJvQwX-KZbO_8TF0DPoU8UCWO_Ua9QeEOeQrEDH3Y0khDtCe5utzWVorY0JareM0xhvDNGd1r9KGzvSIFWR390_7YypocWwJluhQrxA3VM_Qrcgf4MyS82P-jZd3-Ikhgrsm67DXbo8JQDlVUExwvI9CoX_Z8KsE6e5Bp6Nub45u8ccYrLRu4nJmSa9aqpm6IGAd5FBvBhQEHcwPjJ1L-wr3kqBKmnrZBaWR8L3LqNUZ266bBqJPxs6D7ajv33ROoFzrrrBUEO840FnugXn23szbfIh6uXVydXvfCQRXe8Nx1c-nJGktsu01kZVqOlYP7DI1_opdfqpn8thi1uhf-h3RZ5XZauMI8QBV7KB0-tyOqCZ4-07AWDVrELzByPNL8tvwQyiiG7NeHq18V-fwDo_QwUYCwv_l34Y6x1YY4TIovzOCpVBBmC-pVA_Sk9bHKK0Tg-JwOC1Nixru82n9AMyiUnoogMI3Etbgd6rJJFsmgCeLdWXpCj8d8j4HPmBtqjLKXPbyLF0kVXaa1O-mYBPJ1rBFlbl2pobsID9CvBcEZqU6vcIpnAGOLh-ZIrvxPV6MS1C6fhc2SdajZ-ED3TzTm82OnF1GaOQ5hjBoEvNHzprQyX0FJp0mdHJRdLdxgr9MOa0zhcuwhqTgELafH1wAhMuftxCuTZAzxn_P5d8ekPnUfyTNrLElsU79gcxsLUnOp2nm7_STDc3yXutbVitRjOc7MEdQWDetMomS_FTzV-vzwynNEZCUU5U0USflK9XUDyQ6U-kOgC_CiDABCWbBl9xJ7ZUdYuOgTf5kR7kYhz_6uByc0k_JKGe1OXfNBk7W1czmHIbn59P2aIbNgDrP2yS9Ir9RSeZj9WO8yS2m16obXoM4tWVe_XlIK8UplnTcBkTaZISR8IM-z1UwHed0Q7JBWBmp_INPARKmpmfwYdUG2fx44kJZ7jN-sczsw8YzNiSE5L0TOiBq5afqchY2K7wCgrRxr-t6g";

function App() {
  // State to store the selected file for upload
  const [selectedFile, setSelectedFile] = useState(null);

  // State to display status and error messages
  const [statusMessage, setStatusMessage] = useState("");

  // State to store file name for downloading
  const [downloadFileName, setDownloadFileName] = useState("");

  // 1. Function to handle file selection from the file input
  const handleFileChange = (e) => {
    // Select the first file from the file input
    setSelectedFile(e.target.files[0]);
  };

  // 2. Function to upload the selected file to Dropbox (matching option 1 in dropbox.ipynb)
  const handleUpload = async () => {
    // Validate that a file has been selected
    if (!selectedFile) {
      setStatusMessage("Error: Please select a file to upload.");
      return;
    }

    // Indicate upload in progress
    setStatusMessage("Uploading file, please wait...");

    try {
      // Call Dropbox API v2 files/upload endpoint using browser fetch
      const response = await fetch(
        "https://content.dropboxapi.com/2/files/upload",
        {
          method: "POST",
          headers: {
            // Bearer token authorization using constant TOKEN
            Authorization: `Bearer ${TOKEN}`,
            // Dropbox parameters: upload path and overwrite mode (matching mode=dropbox.files.WriteMode.overwrite)
            "Dropbox-API-Arg": JSON.stringify({
              path: "/" + selectedFile.name,
              mode: "overwrite",
              autorename: true,
              mute: false,
              strict_conflict: false,
            }),
            // Binary stream content type for file upload
            "Content-Type": "application/octet-stream",
          },
          // Send raw file data in the request body
          body: selectedFile,
        }
      );

      // Parse JSON response from Dropbox API
      const data = await response.json();

      // Check response status
      if (response.ok) {
        setStatusMessage("Upload successful: " + data.name);
      } else {
        setStatusMessage("Upload failed: " + (data.error_summary || JSON.stringify(data)));
      }
    } catch (error) {
      // Catch network or runtime errors
      setStatusMessage("Error: " + error.message);
    }
  };

  // 3. Function to download a file from Dropbox (matching option 2 in dropbox.ipynb)
  const handleDownload = async () => {
    // Validate that file name is entered
    if (!downloadFileName.trim()) {
      setStatusMessage("Error: Please enter a file name to download.");
      return;
    }

    // Indicate download in progress
    setStatusMessage("Downloading file, please wait...");

    try {
      // Call Dropbox API v2 files/download endpoint
      const response = await fetch(
        "https://content.dropboxapi.com/2/files/download",
        {
          method: "POST",
          headers: {
            // Bearer token authorization using constant TOKEN
            Authorization: `Bearer ${TOKEN}`,
            // Dropbox parameter: path of file to download
            "Dropbox-API-Arg": JSON.stringify({
              path: "/" + downloadFileName.trim(),
            }),
          },
        }
      );

      // Check if download succeeded
      if (response.ok) {
        // Convert response data to blob
        const blob = await response.blob();
        // Create downloadable object URL
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        // Prefix with downloaded_ matching the python notebook logic
        link.download = "downloaded_" + downloadFileName.trim();
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        setStatusMessage("Download successful: downloaded_" + downloadFileName.trim());
      } else {
        const errorData = await response.json();
        setStatusMessage("Download failed: " + (errorData.error_summary || "File not found"));
      }
    } catch (error) {
      // Catch network or runtime errors
      setStatusMessage("Error: " + error.message);
    }
  };

  // Render plain HTML page without CSS (no prompt/input for API key)
  return (
    <div>
      {/* Heading */}
      <h1>Dropbox File Upload & Download</h1>

      {/* 1. Upload Section */}
      <div>
        <h2>1. Upload File</h2>
        {/* File chooser input */}
        <input type="file" onChange={handleFileChange} />
        <br />
        <br />
        {/* Upload action button */}
        <button onClick={handleUpload}>Upload</button>
      </div>

      <hr />

      {/* 2. Download Section */}
      <div>
        <h2>2. Download File</h2>
        {/* File name input for download */}
        <input
          type="text"
          value={downloadFileName}
          onChange={(e) => setDownloadFileName(e.target.value)}
          placeholder="Enter Dropbox file name (e.g. test.txt)"
        />
        {" "}
        {/* Download action button */}
        <button onClick={handleDownload}>Download</button>
      </div>

      <hr />

      {/* Status Output Section */}
      <div>
        <h3>Status Message</h3>
        <p>{statusMessage || "Waiting for action..."}</p>
      </div>
    </div>
  );
}

// Export default component
export default App;

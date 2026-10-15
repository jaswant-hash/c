import { useState, useEffect } from "react"
import { Dropbox } from "dropbox"
import "./App.css"

const dbx = new Dropbox({
  accessToken: "sl.u.AGxcZgkaBFdJw75ocl-pjdgQqA2BVSPcxqbwqKpRSX_dwJZGTEHRy4b1v2P5TtTfXmAUaknpo6ZZdP_K21fRA_TMzJIEErxEtz_hvulNYebin6gGe9b3OfYro3UoG7chLNPkkEzWSK-S_Hc0DKTjCUxH0tZWNs2La49XGbtxApdesaX9N4nqTXAeG_kH5FA5n9QvHM-U0PLH0T0ovNIDvEQ0wz2v-IoZ2dENGXaYSUIKDAl5ZRvzn0_y8sJHVM7QNW8yLGsvGyC_bR2nu6V6jmO8vVJ5rO_lGAwKlM3PwhwU0964_PyXY7ub7oJK17SxkbvvgcsB8qNaMnJper2Z0_RvWyDEIwlGMIhuh6OVFDBwDO1RX_StwgDDHbPFSxecBha1jIS3GI4WcbQcCkx9zLZHVxWDIEKCMPU0wMrLtfuwJ-HdoB-VdOc0Xw8PQGfSpeoNsoRgI3oA2KOgEsQRLt-f1tc4XHXFaRxqeXMz4DKmPgLKDccQnQWC9xkVlgctqSab1mFsVtukdTbH9ngu_oqIp13BUfhy3eXJJ2Sn67iywh-gNwuOaDBSuW9K3hOoao208eYnvMYHsKEk_lfWFp8LEGYunYX_VfAIJKsmcNhAPEXpmLhfk2oMpA-ujwxZdL92bRRokRO21TZ5DZ0BNZT6q3ufSjFrwRmfqfBKuWGkaU-j12L4Xki9IFUC0ia1vV6s0tW31w_rwkSPomPSAXWXOgD73aygHYKi4LoTEReW0eEpXO3vB-rtul2T8G7UathAKRfAfwv5C_Kq82Xx-XgGEZQDLm0u69Lk68pKfL_YLKSKXaubSYgByD9ERR13fYY99UUdsvGhifSh35hjmxVm9a2n65k12qNJs1iteex-MB0iE5r_in9fNpHSvdT1R8NhEaatdtKNzbEwgiVbPgeBIweTMFrPb1HYwju15YUc8MpBB2u12Tcjunpy_-T0Vlo5e3q6kRZU7ua0FajoReZ3g60x2454DBPKD2-CqiSe8b4YlUyLayqO96a-2BMf_iFJiHZT-IgCj8F2qArnZWIcs4oS2dWPsqqs3MKJMXWl2KMDCo-N_kfESlpwTOCgm4AI0T7g9ttGk2ye9VwkQb1q7Xon0raT6940wzzb-94t5MvWM4SI2Wq-XEwimBiemueTtbam8TF0KBL3J7JdvLFj3uGQZJ9I0IWi65CMXlA7hN6hrTP24z8-w18PSpWK8_uS2QFRWyOuPjsEB2oHYE02MyDtQi3Pywuruc7llxIcy0XhcLo-le5THzkWwafHHttjP9W4Pxnzy4T65e6ONw2vRWqUWpIaeBfCqXhfdv7TKmhsa-olRj3ziMBejXF-KLQNXi4IbqJK824HA9EC3vjE6bdX6WMwURj2wFb0KXVbUzeCJjza4kp7fvgLTm3Nje081jwNQjOOcc_-je4sIuDgIp00lmJnMNhwRGjnETATBohnvRLNPLf3JoBZDWUcJSs"
})

export default function App() {
  const [msg, setMsg] = useState("");
  const [file, setfile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);

  async function fetchFiles() {
    try {
      const res = await dbx.filesListFolder({ path: "" });
      const fileEntries = res.result.entries.filter(e => e[".tag"] === "file");
      setFiles(fileEntries);
    } catch (e) {
      console.log("List error:", e);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  async function upload() {
    if (!file) return setMsg("Please select a file first.");
    setLoading(true);
    setMsg("");
    try {
      await dbx.filesUpload({
        path: "/" + file.name,
        contents: file,
        mode: { ".tag": "overwrite" }
      });
      setMsg("✅ File uploaded successfully!");
      setfile(null);
      document.getElementById("file-input").value = "";
      await fetchFiles();
    } catch (e) {
      console.log("Full error:", e);
      setMsg("❌ Upload failed: " + JSON.stringify(e.error || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function downloadFile(filePath, fileName) {
    setDownloading(fileName);
    try {
      const res = await dbx.filesDownload({ path: filePath });
      const blob = res.result.fileBlob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.log("Download error:", e);
      alert("Download failed: " + JSON.stringify(e.error || e.message));
    } finally {
      setDownloading(null);
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">📦 Dropbox File Manager</h1>

        <div className="upload-box">
          <h2 className="section-title">Upload a File</h2>
          <input
            id="file-input"
            type="file"
            onChange={e => setfile(e.target.files[0])}
            className="file-input"
          />
          <button
            onClick={upload}
            disabled={loading}
            className={`btn${loading ? " btn-disabled" : ""}`}
          >
            {loading ? "Uploading..." : "⬆ Upload"}
          </button>
          {msg && <p className="msg">{msg}</p>}
        </div>

        <div className="list-box">
          <div className="list-header">
            <h2 className="section-title">Previously Uploaded Files</h2>
            <button onClick={fetchFiles} className="refresh-btn">🔄 Refresh</button>
          </div>

          {files.length === 0 ? (
            <p className="empty-text">No files found in your Dropbox root.</p>
          ) : (
            <ul className="file-list">
              {files.map((f) => (
                <li key={f.id} className="file-item">
                  <div className="file-info">
                    <span className="file-name">📄 {f.name}</span>
                    <span className="file-size">{formatSize(f.size)}</span>
                  </div>
                  <button
                    onClick={() => downloadFile(f.path_lower, f.name)}
                    disabled={downloading === f.name}
                    className="download-btn"
                  >
                    {downloading === f.name ? "Downloading..." : "⬇ Download"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
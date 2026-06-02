import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AssetManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API = "https://fileuploader-2lyb.onrender.com/upload";


  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/files`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteFile = async (publicId: string) => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this file? This action cannot be undone."
    );

    if (!confirmDelete) return;

    await fetch(`${API}/delete/${encodeURIComponent(publicId)}`, {
      method: "DELETE",
    });

    fetchFiles();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const getFileIcon = (file: any) => {
    if (file.resource_type === "image") return "🖼️";
    if (file.format === "pdf") return "📄";
    if (file.format === "zip") return "🗜️";
    if (file.format === "doc" || file.format === "docx") return "📝";
    return "📁";
  };

  const formatFileName = (url: string) => {
    return url.split("/").pop()?.split("?")[0] || "unknown-file";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Asset Manager</h2>

        <button
          onClick={fetchFiles}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading files...</p>}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
        {files.map((file) => (
          <div
            key={file.public_id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 border"
          >
            {/* PREVIEW */}
            {file.resource_type === "image" ? (
              <img
                src={file.secure_url}
                className="w-full h-40 object-cover rounded-xl"
              />
            ) : (
              <div className="h-40 flex flex-col items-center justify-center bg-gray-100 rounded-xl">
                <span className="text-4xl">{getFileIcon(file)}</span>
                <p className="text-xs mt-2 text-gray-600">
                  {file.format?.toUpperCase()} FILE
                </p>
              </div>
            )}

            {/* FILE INFO */}
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-800 break-all">
                {formatFileName(file.secure_url)}
              </p>

              <p className="text-xs text-gray-500 break-all mt-1">
                {file.secure_url}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => copyUrl(file.secure_url)}
                className="flex-1 bg-green-600 text-white py-1 rounded-lg text-xs hover:bg-green-700"
              >
                Copy
              </button>

              <button
                onClick={() => deleteFile(file.public_id)}
                className="flex-1 bg-red-600 text-white py-1 rounded-lg text-xs hover:bg-red-700"
              >
                Delete
              </button>
            </div>

            {/* WARNING TAG */}
            {file.resource_type !== "image" && (
              <p className="text-[10px] text-red-500 mt-2 text-center">
                ⚠️ Non-preview file — handle carefully
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
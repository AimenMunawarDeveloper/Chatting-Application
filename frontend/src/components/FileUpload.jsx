import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faImage, faFile } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PropTypes from "prop-types";

const FileUpload = ({ onFileUpload, isOpen, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/file/upload`,
        formData,
        {
          ...getHeader(),
          headers: {
            ...getHeader().headers,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      const fileInfo = response.data;
      const messageType = file.type.startsWith("image/") ? "image" : "file";

      onFileUpload(fileInfo, messageType);
      onClose();
    } catch (error) {
      console.error("File upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full left-12 mb-2 w-64 bg-white rounded-lg shadow-lg border z-50">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold text-gray-800">Send File</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {uploading ? (
        <div className="p-4">
          <div className="text-center mb-2">
            <div className="text-sm text-gray-600">Uploading...</div>
            <div className="text-xs text-gray-500">{uploadProgress}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brightMagenta h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faImage} className="text-brightMagenta" />
              <span className="text-sm font-medium text-gray-700">
                Send Image
              </span>
            </div>
          </label>

          <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.zip,.rar"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faFile} className="text-brightMagenta" />
              <span className="text-sm font-medium text-gray-700">
                Send File
              </span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FileUpload;

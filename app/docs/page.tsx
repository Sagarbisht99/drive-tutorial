"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "../component/Loader"; // Import your loader

interface FileType {
  _id: string;
  fileName: string;
  fileSize: string;
  url: string;
  userId: string;
  type: string;
  createdAt: string;
}

const formatSize = (bytes: string) => {
  const size = parseInt(bytes, 10);
  if (isNaN(size)) return "Unknown";
  const units = ["Bytes", "KB", "MB", "GB"];
  let i = 0;
  let value = size;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(2)} ${units[i]}`;
};

const timeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} day(s) ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} month(s) ago`;
  return `${Math.floor(diff / 31536000)} year(s) ago`;
};

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return "📄";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return "🖼️";
    case "doc":
    case "docx":
      return "📝";
    case "xls":
    case "xlsx":
      return "📊";
    case "zip":
    case "rar":
      return "🗜️";
    case "mp4":
    case "avi":
    case "mov":
      return "🎬";
    case "mp3":
    case "wav":
      return "🎵";
    case "txt":
      return "📃";
    default:
      return "📄";
  }
};

const DocsPage = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingFile, setEditingFile] = useState<FileType | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [deletingFile, setDeletingFile] = useState<FileType | null>(null); // State for the file to delete
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false); // State for showing delete confirmation

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch files");

      const data = await response.json();
      setFiles(data.files);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const deleteHandler = async () => {
    if (!deletingFile) return;

    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deletingFile._id }),
      });

      const data = await res.json();
      if (data.success) {
        // Remove the deleted file from state or refetch
        console.log("Deleted successfully");
        fetchFiles();
      } else {
        console.error("Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
    } finally {
      setShowDeleteConfirmation(false); // Close confirmation popup after action
      setDeletingFile(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Close confirmation popup without deleting
    setDeletingFile(null);
  };

  const editFileName = async () => {
    if (!editingFile || !newFileName) return;

    try {
      const response = await fetch(`/api/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingFile._id,
          newName: newFileName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update files in the state
        fetchFiles();
        setEditingFile(null);
        setNewFileName("");
        console.log("File name updated successfully:", data);
      } else {
        console.error("Error updating file name:", data.error);
      }
    } catch (error) {
      console.error("Error in editing file name:", error);
    }
  };

  if (loading) {
    // Display the loader while fetching data
    return <Loader />;
  }

  return (
    <div className="pt-24 pb-10 px-4 min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-indigo-400">
          Documents
        </h1>

        <ul className="space-y-4">
          {files.map((file) => (
            <li
              key={file._id}
              className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="text-lg font-medium">{file.fileName}</p>
                    <p className="text-sm text-gray-400">
                      {formatSize(file.fileSize)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-xs text-gray-400">
                    {timeAgo(file.createdAt)}
                  </span>
                  <button
                    onClick={() => {
                      setEditingFile(file);
                      setNewFileName(file.fileName);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                  >
                    Rename
                  </button>
                  <Link
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => {
                      setDeletingFile(file);
                      setShowDeleteConfirmation(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {files.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <p className="text-lg text-gray-500 text-center">No files found.</p>
            <Link href="/" passHref>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm shadow-md transition duration-300">
                Upload Docs
              </button>
            </Link>
          </div>
        )}
      </div>

      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Edit File Name</h2>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex justify-between">
              <button
                onClick={editFileName}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditingFile(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Are you sure?</h2>
            <p className="text-sm text-gray-400 mb-4">Do you really want to delete this file? This action cannot be undone.</p>
            <div className="flex justify-between">
              <button
                onClick={deleteHandler}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocsPage;
"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);

    } else {
      setFileName(null);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileEntry = formData.get("fileInput");

    if (!(fileEntry instanceof File) || fileEntry.size === 0) {
      toast.error("No file selected!");
      return;
    }

    try {
      setIsUploading(true);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Upload failed.");
        return;
      }

      const data = await response.json();
      console.log("Upload success:", data);
      setFileName(null);

      toast.success("File uploaded successfully! 🎉");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4">
      <form
        onSubmit={submitHandler}
        className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-white text-center drop-shadow-lg">
          Upload Your File ✨
        </h2>

        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center w-full h-48 px-4 transition bg-[#1e1e1e]/70 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-[#2a2a2a]">
            <div className="flex flex-col items-center justify-center pt-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-400 group-hover:text-white animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m4 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-white">
                Drag & Drop or Choose File
              </p>
            </div>
            <input
              type="file"
              name="fileInput"
              className="opacity-0 w-0 h-0"
              onChange={handleFileChange}
              required
            />
          </label>
        </div>

        {fileName && (
          <div className="mt-4 text-white text-center">
            <p>📄 {fileName}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-3 font-semibold rounded-lg transition ${
            isUploading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

    
      </form>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        theme="dark"
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default Page;

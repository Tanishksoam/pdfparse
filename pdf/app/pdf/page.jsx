"use client";

import { useState } from "react";

export default function PDFParser() {
  const [file, setFile] = useState(null);
  const [pdfText, setPdfText] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
    setPdfText(""); // Clear previously parsed text if a new file is uploaded
  };

  const handleSubmit = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/pdf-parse", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPdfText(data.text);
      } else {
        console.log("PDF parsing failed");
      }
    } catch (error) {
      console.log("Error uploading PDF:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">PDF Text Parser</h1>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={!file}
        className={`px-4 py-2 text-white rounded ${
          file
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
      {pdfText && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">Parsed Text:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {pdfText}
          </pre>
        </div>
      )}
    </div>
  );
}

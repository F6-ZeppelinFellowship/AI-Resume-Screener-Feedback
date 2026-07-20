"use client";

import { useRef, useState } from "react";
import type { AppStatus } from "../lib/types";

const ACCEPTED_TYPES = [".pdf", ".docx"];
const MAX_SIZE_MB = 5;

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<AppStatus>("idle");
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateAndSetFile(selected: File) {
    // Reset status so the UI doesn't keep showing a stale success/error message after changing inputs.
    setStatus("idle");

    const ext = "." + selected.name.split(".").pop()?.toLowerCase();
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const mimeOk = !selected.type || allowedMimes.includes(selected.type);

    if (!ACCEPTED_TYPES.includes(ext) || !mimeOk) {
      setFileError("Only PDF or DOCX files are allowed.");
      setFile(null);
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File must be under ${MAX_SIZE_MB} MB.`);
      setFile(null);
      return;
    }
    setFileError("");
    setFile(selected);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSetFile(dropped);
  }

  function handleSubmit() {
    if (!file || !jobDescription.trim()) return;
    setStatus("loading");
    // TODO: Replace with a real fetch to FastAPI /api/analyze
    setTimeout(() => setStatus("success"), 1500);
  }

  const canSubmit = file !== null && jobDescription.trim().length > 0 && status !== "loading";

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      {/* Drag-and-drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) validateAndSetFile(selected);
            e.currentTarget.value = "";
          }}
        />
        {file ? (
          <p className="font-medium text-green-700">{file.name}</p>
        ) : (
          <p className="text-gray-600">
            Drag and drop your resume here, or click to browse
            <span className="mt-1 block text-sm text-gray-400">PDF or DOCX, max {MAX_SIZE_MB} MB</span>
          </p>
        )}
      </div>

      {fileError && <p className="text-sm text-red-600">{fileError}</p>}

      {/* Job description */}
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the target job description here..."
        rows={8}
        disabled={status === "loading"}
        className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
      />

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {status === "loading" ? "Analyzing..." : "Analyze Resume"}
      </button>

      {status === "success" && (
        <p className="text-center text-sm text-green-700">Analysis complete (mock). Dashboard renders here.</p>
      )}
    </div>
  );
}
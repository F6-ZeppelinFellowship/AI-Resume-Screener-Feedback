"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import Dashboard from "./Dashboard";
import type { AppStatus } from "../lib/types";

const ACCEPTED_TYPES = [".pdf", ".docx"];
const ACCEPT_ATTR = ACCEPTED_TYPES.join(",");
const MAX_SIZE_MB = 5;

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<AppStatus>("idle");
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateAndSetFile(selected: File) {
    // Reset stale success state when inputs change
    if (status === "success") setStatus("idle");
    const ext = "." + selected.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
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

  function openPicker() {
    if (status === "loading") return;
    inputRef.current?.click();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (status === "loading") return;
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSetFile(dropped);
  }

  function removeFile(e: React.MouseEvent) {
    e.stopPropagation();
    setFile(null);
    if (status === "success") setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleSubmit() {
    if (!file || !jobDescription.trim()) return;
    setStatus("loading");
    // TODO: replace mock with real fetch to FastAPI /api/analyze
    setTimeout(() => setStatus("success"), 1500);
  }

  const canSubmit =
    file !== null && jobDescription.trim().length > 0 && status !== "loading";

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid md:grid-cols-2">
          {/* Left: resume upload */}
          <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">Resume</h2>
            <p className="mb-4 text-sm text-slate-500">
              PDF or DOCX, up to {MAX_SIZE_MB} MB
            </p>

            <div
              role="button"
              tabIndex={status === "loading" ? -1 : 0}
              aria-disabled={status === "loading"}
              aria-label="Upload resume file"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPicker();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={openPicker}
              className={`flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : file
                    ? "border-emerald-300 bg-emerald-50/50"
                    : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/40"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT_ATTR}
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) validateAndSetFile(selected);
                  // Allow re-selecting the same file
                  e.target.value = "";
                }}
              />

              {file ? (
                <div className="flex items-center gap-3 px-4">
                  <FileText className="h-8 w-8 shrink-0 text-emerald-600" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={removeFile}
                    aria-label="Remove file"
                    className="ml-2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud
                    className={`mb-3 h-9 w-9 ${isDragging ? "text-indigo-500" : "text-slate-400"}`}
                  />
                  <p className="text-sm font-medium text-slate-700">
                    Drop your resume here
                  </p>
                  <p className="mt-1 text-xs text-slate-400">or click to browse</p>
                </>
              )}
            </div>

            {fileError && (
              <p className="mt-3 text-sm text-red-600">{fileError}</p>
            )}
          </div>

          {/* Right: job description */}
          <div className="p-6">
            <h2 className="mb-1 text-sm font-semibold text-slate-900">
              Job description
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Paste the posting you are targeting
            </p>

            <textarea
              value={jobDescription}
              onChange={(e) => {
                if (status === "success") setStatus("idle");
                setJobDescription(e.target.value);
              }}
              placeholder="Paste the full job description here..."
              disabled={status === "loading"}
              className="h-52 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
            <p className="mt-2 text-right text-xs text-slate-400">
              {jobDescription.length} characters
            </p>
          </div>
        </div>

        {/* Footer: action */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-xs text-slate-500">
            {status === "success"
              ? "Analysis complete (mock data shown below)."
              : "Your resume is analyzed against the job description."}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "loading" ? "Analyzing..." : "Analyze resume"}
          </button>
        </div>
      </div>

      {/* Results dashboard, shown after analysis */}
      {status === "success" && (
        <div className="mt-8">
          <Dashboard />
        </div>
      )}
    </div>
  );
}
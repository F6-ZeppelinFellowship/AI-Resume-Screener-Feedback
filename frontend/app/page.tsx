import UploadForm from "./components/UploadForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">AI Resume Screener</h1>
      <p className="mb-8 text-center text-gray-600">
        Upload your resume and a job description to get instant feedback
      </p>
      <UploadForm />
    </main>
  );
}
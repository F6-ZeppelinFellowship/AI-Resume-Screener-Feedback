import UploadForm from "./components/UploadForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16">
      <div className="mx-auto mb-10 max-w-4xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-600">
          AI Resume Screener
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Know your match before you apply
        </h1>
        <p className="mt-2 max-w-xl text-slate-600">
          Upload your resume and paste a job description. Get a match score,
          missing keywords, and concrete suggestions to improve.
        </p>
      </div>
      <UploadForm />
    </main>
  );
}
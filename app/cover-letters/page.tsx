"use client";

import { useEffect, useState } from "react";
import { 
  Mail, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  ClipboardCheck,
  Copy
} from "lucide-react";
import { api, ApiService } from "@/lib/api";

export default function CoverLettersPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  
  // Loading & states
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [letter, setLetter] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch resume list on mount
  useEffect(() => {
    async function fetchResumes() {
      try {
        const response = await api.get("/resumeversions/resume/1");
        setResumes(response.data);
        if (response.data.length > 0) {
          setSelectedVersionId(response.data[0].id.toString());
        }
      } catch (err) {
        console.error("Failed to load resume versions:", err);
      } finally {
        setLoadingResumes(false);
      }
    }
    fetchResumes();
  }, []);

  const handleGenerateLetter = async () => {
    if (!selectedVersionId) {
      setError("Please select a resume version.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the target job description.");
      return;
    }

    setGenerating(true);
    setError(null);
    setLetter(null);
    setCopied(false);

    try {
      // In local development, we trigger letter generation using jobId = 1
      const data = await ApiService.generateCoverLetter(
        Number(selectedVersionId),
        1,
        tone
      );
      setLetter(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate cover letter. Make sure local Ollama is running.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!letter?.content) return;
    navigator.clipboard.writeText(letter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          AI Cover Letter Generator
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Generate a highly-targeted cover letter matching your resume skills against any target job description.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: PARAMETER SELECTION (1/3 Width) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            
            {/* Resume selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Select Resume Version
              </label>
              {loadingResumes ? (
                <div className="flex items-center gap-2 text-sm text-zinc-500 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  Loading versions...
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-xs text-zinc-400 py-2">
                  No resumes found. Please upload one in the Resume Manager first.
                </div>
              ) : (
                <select
                  value={selectedVersionId}
                  onChange={(e) => setSelectedVersionId(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-800 p-3 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500"
                >
                  {resumes.map((res) => (
                    <option key={res.id} value={res.id}>
                      v{res.version_number} — {res.original_filename}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-400  uppercase tracking-wider">
                Requested Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-800 p-3 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500"
              >
                <option value="Professional">Professional & Corporate</option>
                <option value="Conversational">Warm & Conversational</option>
                <option value="Enthusiastic">High-Energy & Passionate</option>
              </select>
            </div>

            {/* Job description input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Paste Job Description
              </label>
              <textarea
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target SDE job posting text here..."
                className="w-full dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-800 p-3 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500 leading-relaxed resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs flex gap-2 items-center">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerateLetter}
              disabled={generating || resumes.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-150 disabled:text-zinc-400 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Drafting cover letter...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: LETTER VIEWER (2/3 Width) */}
        <div className="lg:col-span-2">
          {letter ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
              
              {/* Paper Header Menu */}
              <div className="bg-zinc-50 dark:bg-zinc-900/60 px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                  Draft Document
                </span>
                
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold transition-all px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {copied ? (
                    <>
                      <ClipboardCheck className="h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Letter
                    </>
                  )}
                </button>
              </div>

              {/* Cover Letter Paper Layout */}
              <div className="p-10 bg-white dark:bg-zinc-900/40 min-h-[500px]">
                <pre className="text-sm font-sans text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {letter.content}
                </pre>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm text-center py-36 text-zinc-400 flex flex-col items-center justify-center">
              <Mail className="h-14 w-14 text-zinc-300 dark:text-zinc-700 mb-4 animate-pulse" />
              <h4 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">Awaiting Inputs</h4>
              <p className="text-sm max-w-sm">Select your resume version, paste a job description, and click generate to draft a highly tailored cover letter.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

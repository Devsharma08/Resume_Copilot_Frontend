"use client";

import { useEffect, useState } from "react";
import { 
  Briefcase, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ChevronRight,
  TrendingUp,
  FileText,
  Sparkles
} from "lucide-react";
import { api, ApiService } from "@/lib/api";

export default function JobMatcherPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  
  // Loading & state
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch resume list on page load so user can select a version
  useEffect(() => {
    async function fetchResumes() {
      try {
        // We fetch the versions for our default resume profile (id = 1)
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

  const handleMatchAnalysis = async () => {
    if (!selectedVersionId) {
      setError("Please select a resume version first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the target job description.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setReport(null);

    try {
      // In local development, we trigger the match using jobId = 1
      const data = await ApiService.generateCompatibilityReport(
        Number(selectedVersionId),
        1
      );
      setReport(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to analyze compatibility. Make sure your local LLM is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Job Compatibility Matcher
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Compare your parsed resume skills with a target SDE job description to find keyword matches and skill gaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: SELECTION & PASTE INPUT (1/3 Width) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            
            {/* Resume Selector */}
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

            {/* Job Description TextArea */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Paste Job Description
              </label>
              <textarea
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the SDE job posting text here..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-800 p-3 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500 leading-relaxed resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs flex gap-2 items-center">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleMatchAnalysis}
              disabled={analyzing || resumes.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-150 disabled:text-zinc-400 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing compatibility...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Match Score
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: COMPARISON REPORT (2/3 Width) */}
        <div className="lg:col-span-2">
          {report ? (
            <div className="space-y-6">
              
              {/* Score Header Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Analysis Complete</h3>
                  <p className="text-xs text-zinc-500">
                    Your skills have been cross-checked with the job requirements.
                  </p>
                </div>
                
                {/* Score Widget */}
                <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 px-6 py-4 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-black text-blue-600">{report.compatibility_score}%</div>
                    <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Compatibility</div>
                  </div>
                </div>
              </div>

              {/* Skills Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Matched Skills */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Matched Skills
                  </h4>
                  {report.matched_skills && report.matched_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {report.matched_skills.map((skill: string) => (
                        <span key={skill} className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs px-2.5 py-1 rounded-full font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No direct matches found.</p>
                  )}
                </div>

                {/* Gaps / Missing Skills */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Missing Skills (Gaps)
                  </h4>
                  {report.missing_skills && report.missing_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {report.missing_skills.map((skill: string) => (
                        <span key={skill} className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-green-500 italic">You meet all listed skill requirements!</p>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm text-center py-36 text-zinc-400 flex flex-col items-center justify-center">
              <Briefcase className="h-14 w-14 text-zinc-300 dark:text-zinc-700 mb-4 animate-pulse" />
              <h4 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">Awaiting Job Details</h4>
              <p className="text-sm max-w-sm">Select your resume, paste a target job description on the left, and click analyze to check compatibility.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

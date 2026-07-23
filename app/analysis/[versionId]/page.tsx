"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Award, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Loader2,
  FileText,
  Activity,
  Maximize2
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AnalysisPage() {
  const { versionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        // Fetch detailed resume version which includes parsed JSON and related analysis
        const response = await api.get(`/resumeversions/${versionId}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load ATS analysis reports.");
      } finally {
        setLoading(false);
      }
    }
    if (versionId) {
      fetchAnalysis();
    }
  }, [versionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-sm text-zinc-500">Retrieving ATS scoring metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-100 dark:border-red-900 max-w-xl mx-auto mt-12 space-y-4 text-center">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto" />
        <h3 className="font-bold text-red-950 dark:text-red-400">Analysis Unavailable</h3>
        <p className="text-sm text-red-600/80 dark:text-red-400/80">
          {error || "We could not find analysis logs for this resume version."}
        </p>
        <Link
          href="/resumes"
          className="inline-flex items-center gap-2 text-xs bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-lg border hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Resumes
        </Link>
      </div>
    );
  }

  // Fallback default state if analysis hasn't completed
  const analysis = data.analysis || {
    overall_score: 75,
    ats_score: 75,
    grammar_score: 80,
    formatting_score: 70,
    feedback: {
      ats_improvements: ["Add more quantifiable metrics.", "Include core keywords."],
      grammar_improvements: ["Tense consistency is slightly off."],
      formatting_improvements: ["Simplify layout headers."],
      overall_feedback: "A good starting resume template, but needs optimization for ATS systems."
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="space-y-1">
          <Link href="/resumes" className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5 hover:underline font-semibold w-fit mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Resumes
          </Link>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            ATS Score Analysis
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Version {data.version_number} — {data.original_filename}
          </p>
        </div>
      </div>

      {/* Main Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Overall Score Circle Gauge */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Overall Score</span>
          <div className="relative flex items-center justify-center">
            {/* SVG circle backdrop */}
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="8" className="text-zinc-100 dark:text-zinc-850" fill="transparent" />
              <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="8" className="text-blue-600" fill="transparent"
                strokeDasharray={339.29}
                strokeDashoffset={339.29 - (339.29 * analysis.overall_score) / 100}
              />
            </svg>
            <span className="absolute text-3xl font-black text-zinc-900 dark:text-white">
              {analysis.overall_score}%
            </span>
          </div>
        </div>

        {/* Subsection score bars */}
        <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">ATS Keyword Match</span>
              <span className="text-zinc-900 dark:text-white">{analysis.ats_score}%</span>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${analysis.ats_score}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Grammar & Syntax</span>
              <span className="text-zinc-900 dark:text-white">{analysis.grammar_score}%</span>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${analysis.grammar_score}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Formatting & Structure</span>
              <span className="text-zinc-900 dark:text-white">{analysis.formatting_score}%</span>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${analysis.formatting_score}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Feedback & Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Overall feedback summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Executive Summary
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {analysis.feedback?.overall_feedback || "No general summary compiled."}
            </p>
          </div>
        </div>

        {/* Right Column: List details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Recommendations for Improvements
            </h3>
            
            <div className="space-y-6">
              {/* ATS improvements */}
              {analysis.feedback?.ats_improvements && analysis.feedback.ats_improvements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    ATS Optimization
                  </h4>
                  <ul className="space-y-2">
                    {analysis.feedback.ats_improvements.map((imp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                        <AlertCircle className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Grammar improvements */}
              {analysis.feedback?.grammar_improvements && analysis.feedback.grammar_improvements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                    Grammar & Readability
                  </h4>
                  <ul className="space-y-2">
                    {analysis.feedback.grammar_improvements.map((imp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                        <CheckCircle className="h-4.5 w-4.5 text-green-500 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formatting improvements */}
              {analysis.feedback?.formatting_improvements && analysis.feedback.formatting_improvements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    Structure & Layout
                  </h4>
                  <ul className="space-y-2">
                    {analysis.feedback.formatting_improvements.map((imp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                        <AlertCircle className="h-4.5 w-4.5 text-purple-500 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  FolderCode,
  Award,
  Link as LinkIcon,
  Mail,
  Phone,
  User,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { ApiService } from "@/lib/api";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";

export default function ResumesPage() {
  const userId = 1;
  const queryClient = useQueryClient();
  const resumeId = 1;

  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);

  // fetch resume with react query
  const { data: resumes = [], isLoading: loading } = useQuery({
    queryKey: ['resumes', resumeId],
    queryFn: async () => {
      const response = await ApiService.getResumeVersion(resumeId);
      if (response.length > 0 && selectedVersionId === null) {
        setSelectedVersionId(response[0].id);
      }
      return response;
    }
  });

  // upload mutation with react query
  const uploadMutation = useMutation({
    mutationFn: (file: File) => ApiService.uploadResumeVersion(resumeId, file),
    onSuccess: (data) => {
      // invalidate the query
      queryClient.invalidateQueries({ queryKey: ['resumes', resumeId] });
      setSelectedVersionId(data.id);
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const selectedResume = resumes?.find((r: any) => r.id === selectedVersionId);
  const uploading = uploadMutation.isPending;
  const error = uploadMutation.error ? (uploadMutation.error as any).response?.data?.detail || "Failed to upload." : null;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Resume Version Manager
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Upload new resume files to parse them into structured profiles and
            compare version histories.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT PANEL: UPLOAD & HISTORY (1/3 Width) */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Upload Widget */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
              Upload New Version
            </h3>

            <label className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-all bg-zinc-50/50 dark:bg-zinc-950/20 group">
              {uploading ? (
                <div className="space-y-2 flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  <span className="text-xs text-zinc-500 font-medium">
                    Local Qwen parsing file...
                  </span>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <Upload className="h-8 w-8 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                    Choose PDF/DOCX file
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Max size 10MB
                  </span>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs flex gap-2 items-center">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Version List */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
              Version History
            </h3>
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-zinc-500 py-4">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                Loading version list...
              </div>
            ) : resumes.length === 0 ? (
              <p className="text-xs text-zinc-400 leading-relaxed">
                No versions uploaded yet. Use the upload box above.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {resumes.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => setSelectedVersionId(res.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedVersionId === res.id
                        ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                        v{res.version_number}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(res.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs truncate font-medium">
                      {res.original_filename}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: FULL DETAILED VIEW (2/3 Width) */}
        <div className="flex-1 w-full">
          {selectedResume ? (
            <div className="space-y-6">
              {/* Detailed Header Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                        {selectedResume.parsed_resume?.personal_info?.name ||
                          "Dev Sharma"}
                      </h2>
                      <span className="text-xs font-mono bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                        v{selectedResume.version_number}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Parsed successfully by Qwen
                    </p>
                  </div>

                  <Link
                    href={`/analysis/${selectedResume.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm w-fit"
                  >
                    View ATS Review
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Contact Info Row */}
                <div className="flex flex-wrap gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                  {selectedResume.parsed_resume?.personal_info?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-zinc-400" />
                      {selectedResume.parsed_resume.personal_info.email}
                    </div>
                  )}
                  {selectedResume.parsed_resume?.personal_info?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-zinc-400" />
                      {selectedResume.parsed_resume.personal_info.phone}
                    </div>
                  )}
                </div>

                {/* Profile Links */}
                {selectedResume.parsed_resume?.personal_info?.links &&
                  selectedResume.parsed_resume.personal_info.links.length >
                    0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {selectedResume.parsed_resume.personal_info.links.map(
                        (link: string, idx: number) => (
                          <a
                            key={idx}
                            href={
                              link.startsWith("http") ? link : `https://${link}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800"
                          >
                            <LinkIcon className="h-3 w-3" />
                            {link}
                            <ExternalLink className="h-2.5 w-2.5 ml-0.5 text-zinc-400" />
                          </a>
                        ),
                      )}
                    </div>
                  )}
              </div>

              {/* Summary Section */}
              {selectedResume.parsed_resume?.summary && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Professional Summary
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {selectedResume.parsed_resume.summary}
                  </p>
                </div>
              )}

              {/* Skills Section */}
              {selectedResume.parsed_resume?.skills &&
                selectedResume.parsed_resume.skills.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-500" />
                      Key Skills & Focus Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedResume.parsed_resume.skills.map(
                        (skill: string) => (
                          <span
                            key={skill}
                            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs px-3 py-1.5 rounded-lg font-medium"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Experience Section */}
              {selectedResume.parsed_resume?.experience &&
                selectedResume.parsed_resume.experience.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <Briefcase className="h-4 w-4 text-purple-500" />
                      Work Experience
                    </h3>
                    <div className="space-y-6 divide-y divide-zinc-100 dark:divide-zinc-800">
                      {selectedResume.parsed_resume.experience.map(
                        (exp: any, idx: number) => (
                          <div
                            key={idx}
                            className={`space-y-2 ${idx > 0 ? "pt-6" : ""}`}
                          >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
                              <h4 className="font-bold text-zinc-900 dark:text-white">
                                {exp.role}{" "}
                                <span className="text-zinc-400 font-normal">
                                  at
                                </span>{" "}
                                {exp.company}
                              </h4>
                              <span className="text-xs text-zinc-500 font-medium">
                                {exp.start_date} — {exp.end_date || "Present"}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Projects Section */}
              {selectedResume.parsed_resume?.projects &&
                selectedResume.parsed_resume.projects.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <FolderCode className="h-4 w-4 text-blue-500" />
                      Technical Projects
                    </h3>
                    <div className="space-y-6 divide-y divide-zinc-100 dark:divide-zinc-800">
                      {selectedResume.parsed_resume.projects.map(
                        (proj: any, idx: number) => (
                          <div
                            key={idx}
                            className={`space-y-2 ${idx > 0 ? "pt-6" : ""}`}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-zinc-900 dark:text-white">
                                {proj.title}
                              </h4>
                              {proj.links && proj.links.length > 0 && (
                                <a
                                  href={
                                    proj.links[0].startsWith("http")
                                      ? proj.links[0]
                                      : `https://${proj.links[0]}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold hover:underline"
                                >
                                  Codebase <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                              {proj.description}
                            </p>
                            {proj.technologies &&
                              proj.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {proj.technologies.map((tech: string) => (
                                    <span
                                      key={tech}
                                      className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded font-mono"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Education Section */}
              {selectedResume.parsed_resume?.education &&
                selectedResume.parsed_resume.education.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <GraduationCap className="h-4 w-4 text-orange-500" />
                      Education
                    </h3>
                    <div className="space-y-6 divide-y divide-zinc-100 dark:divide-zinc-800">
                      {selectedResume.parsed_resume.education.map(
                        (edu: any, idx: number) => (
                          <div
                            key={idx}
                            className={`space-y-1.5 ${idx > 0 ? "pt-6" : ""}`}
                          >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1">
                              <h4 className="font-bold text-zinc-900 dark:text-white">
                                {edu.degree} in {edu.field_of_study || "Major"}
                              </h4>
                              <span className="text-xs text-zinc-500 font-medium">
                                {edu.start_date} — {edu.end_date || "Present"}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 font-medium">
                              {edu.institution}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Certifications Section */}
              {selectedResume.parsed_resume?.certifications &&
                selectedResume.parsed_resume.certifications.length > 0 && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      Certifications & Achievements
                    </h3>
                    <ul className="space-y-2 list-disc list-inside text-sm text-zinc-600 dark:text-zinc-300">
                      {selectedResume.parsed_resume.certifications.map(
                        (cert: any, idx: number) => (
                          <li key={idx} className="leading-relaxed">
                            <strong className="text-zinc-800 dark:text-zinc-200">
                              {cert.title}
                            </strong>
                            {cert.date && (
                              <span className="text-zinc-400 text-xs ml-2">
                                ({cert.date})
                              </span>
                            )}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm text-center py-36 text-zinc-400 flex flex-col items-center justify-center">
              <FileText className="h-14 w-14 text-zinc-300 dark:text-zinc-700 mb-4 animate-bounce" />
              <h4 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                No Version Selected
              </h4>
              <p className="text-sm max-w-sm">
                Select an uploaded version from the left panel, or upload a new
                file to parse your profile data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

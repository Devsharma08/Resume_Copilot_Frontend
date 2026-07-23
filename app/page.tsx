"use client";

import Link from "next/link";
import { 
  FileText, 
  Briefcase, 
  Mail, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function DashboardPage() {
  // We can fetch these stats using TanStack Query later. 
  // For now, we will render a sleek, professional placeholder state.
  const stats = [
    { name: "Total Resumes", value: "3", icon: FileText, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
    { name: "Average ATS Score", value: "82%", icon: TrendingUp, color: "text-green-600 bg-green-50 dark:bg-green-950/40" },
    { name: "Matched Jobs", value: "5", icon: Briefcase, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40" },
  ];

  const quickActions = [
    {
      title: "Upload & Parse Resume",
      description: "Upload your resume in PDF/DOCX format to parse and generate ATS feedback.",
      href: "/resumes",
      icon: FileText,
      actionText: "Upload Resume",
    },
    {
      title: "Analyze Job Compatibility",
      description: "Paste a job description and check compatibility with your uploaded resume versions.",
      href: "/jobs",
      icon: Briefcase,
      actionText: "Run Analysis",
    },
    {
      title: "Generate Cover Letter",
      description: "Create a highly-tailored cover letter based on your matched resume profile.",
      href: "/cover-letters",
      icon: Mail,
      actionText: "Write Letter",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Ready to optimize your career application?
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Upload your resume, analyze compatibility scores with local AI models, and build customized application materials for high-tier SDE roles.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="h-5 w-5" />
          100% Private Local AI
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  {stat.name}
                </p>
                <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-blue-500 transition-all group"
              >
                <div className="space-y-3">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg w-fit group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">
                    {action.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <Link
                  href={action.href}
                  className="mt-6 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 border-t border-zinc-100 dark:border-zinc-800 pt-4 hover:text-blue-700"
                >
                  {action.actionText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

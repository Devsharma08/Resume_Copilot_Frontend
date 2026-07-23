"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard Overview";
      case "/resumes":
        return "Manage Resumes";
      case "/jobs":
        return "Compatibility Matcher";
      case "/cover-letters":
        return "AI Cover Letter Generator";
      default:
        if (pathname.startsWith("/analysis/")) return "ATS Score Analysis";
        return "Career Copilot";
    }
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white capitalize">
        {getPageTitle()}
      </h2>
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Dev Sharma
          </span>
          <span className="text-xs text-zinc-500">Candidate</span>
        </div>
      </div>
    </header>
  );
}

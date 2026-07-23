"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Mail, 
  Sparkles 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "My Resumes", href: "/resumes", icon: FileText },
    { name: "Job Matcher", href: "/jobs", icon: Briefcase },
    { name: "Cover Letters", href: "/cover-letters", icon: Mail },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white tracking-tight">
            <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
            Career Copilot
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 font-mono">
        Engine: Qwen 2.5 (Local)
      </div>
    </aside>
  );
}

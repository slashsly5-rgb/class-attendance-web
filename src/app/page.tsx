import Link from "next/link";
import { GraduationCap, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-20 px-8 text-center sm:px-16">

        <div className="mb-12 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="M8 11h8" />
            <path d="M12 8v6" />
          </svg>
        </div>

        <h1 className="mb-6 max-w-2xl text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Class Attendance MVP
        </h1>

        <p className="mb-12 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          A modern, geofenced attendance system. Choose your portal below to get started.
        </p>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/lecturer"
            className="group flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-zinc-900 px-6 text-lg font-medium text-white transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 sm:w-[240px]"
          >
            <Users className="h-6 w-6 transition-transform group-hover:-translate-y-1" />
            Lecturer Portal
          </Link>

          <Link
            href="/enroll"
            className="group flex h-16 w-full items-center justify-center gap-3 rounded-xl border-2 border-zinc-200 bg-white px-6 text-lg font-medium text-zinc-900 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:scale-105 active:scale-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:border-zinc-700 dark:hover:bg-zinc-900 sm:w-[240px]"
          >
            <GraduationCap className="h-6 w-6 transition-transform group-hover:-translate-y-1" />
            Student Enroll
          </Link>
        </div>

      </main>
    </div>
  );
}

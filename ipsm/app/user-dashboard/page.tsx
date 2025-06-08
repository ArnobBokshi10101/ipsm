"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Report, ReportStatus, ReportType } from "@prisma/client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface UserReport extends Report {
  id: string;
  reportId: string;
  type: ReportType;
  title: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session?.user.role === "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const statusMatch = filter === "ALL" || report.status === filter;
    const searchMatch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportId.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusColor = (status: ReportStatus) => {
    const colors = {
      PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      RESOLVED: "bg-green-500/10 text-green-500 border-green-500/20",
      DISMISSED: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[status];
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <svg className="w-4 h-4\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor">
            <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "IN_PROGRESS":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "RESOLVED":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "DISMISSED":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07D348]"></div>
      </div>
    );
  }

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "PENDING").length,
    inProgress: reports.filter(r => r.status === "IN_PROGRESS").length,
    resolved: reports.filter(r => r.status === "RESOLVED").length,
    dismissed: reports.filter(r => r.status === "DISMISSED").length,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#07D348] to-[#24fe41] flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-white bg-clip-text text-transparent">CivicSafe</span>
              </Link>
              <span className="text-neutral-400">|</span>
              <h1 className="text-lg font-semibold text-neutral-200">My Dashboard</h1>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-neutral-400">
                Welcome, {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-900 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all hover:border-neutral-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/submit-report">
            <div className="group relative overflow-hidden rounded-xl border border-[#07D348]/20 bg-gradient-to-br from-[#07D348]/10 to-transparent p-6 transition-all hover:border-[#07D348]/40 hover:bg-[#07D348]/20 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#07D348]/20">
                  <svg className="h-6 w-6 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Submit New Report</h3>
                  <p className="text-sm text-neutral-400">Report a new incident</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/track-report">
            <div className="group relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 transition-all hover:border-blue-500/40 hover:bg-blue-500/20 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Track Report</h3>
                  <p className="text-sm text-neutral-400">Check report status</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/community">
            <div className="group relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-6 transition-all hover:border-purple-500/40 hover:bg-purple-500/20 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                  <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Community</h3>
                  <p className="text-sm text-neutral-400">Join discussions</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Total Reports</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-neutral-800 rounded-lg">
                <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-400">Pending</p>
                <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400">Resolved</p>
                <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400">Dismissed</p>
                <p className="text-2xl font-bold text-red-500">{stats.dismissed}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 w-full sm:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ReportStatus | "ALL")}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#07D348]/20 focus:border-[#07D348]/30 transition-all"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(ReportStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-[#07D348]/20 focus:border-[#07D348]/30 transition-all"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <svg className="mx-auto h-12 w-12 text-neutral-500 mb-4\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor">
                <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-neutral-300 mb-2">No reports found</h3>
              <p className="text-neutral-500 mb-4">
                {searchTerm || filter !== "ALL" 
                  ? "Try adjusting your search or filter criteria" 
                  : "You haven't submitted any reports yet"}
              </p>
              {!searchTerm && filter === "ALL" && (
                <Link href="/submit-report">
                  <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#07D348] to-[#24fe41] text-white rounded-lg hover:opacity-90 transition-opacity">
                    Submit Your First Report
                  </button>
                </Link>
              )}
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h3 className="text-lg font-medium text-neutral-200 group-hover:text-white transition-colors">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {report.status.replace('_', ' ')}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
                          {report.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {report.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{report.location || "Location not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M8 7h8M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                        </svg>
                        <span>ID: {report.reportId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {report.image && (
                      <div className="mt-4">
                        <div className="relative w-full h-48 rounded-lg border border-neutral-800 overflow-hidden">
                          <Image
                            src={report.image}
                            alt="Report evidence"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2">
                    <Link href={`/track-report?id=${report.reportId}`}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Track
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination could be added here if needed */}
        {filteredReports.length > 0 && (
          <div className="mt-8 text-center text-sm text-neutral-500">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        )}
      </main>
    </div>
  );
}
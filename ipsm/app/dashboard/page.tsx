"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { Report, ReportStatus, ReportType } from "@prisma/client";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Dashboard() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<ReportType | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [classifications, setClassifications] = useState<Record<string, string>>({});

  const filteredReports = useMemo(() => 
    reports.filter((report) => {
      const statusMatch = filter === "ALL" || report.status === filter;
      const typeMatch = typeFilter === "ALL" || report.type === typeFilter;
      return statusMatch && typeMatch;
    }),
  [reports, filter, typeFilter]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const classifyReports = async () => {
      for (const report of filteredReports) {
        if (!classifications[report.id]) {
          await classifyIncident(report.id, report.description);
        }
      }
    };

    classifyReports();
  }, [filteredReports]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const classifyIncident = async (reportId: string, description: string) => {
    try {
      const response = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      
      const { department } = await response.json();
      setClassifications(prev => ({
        ...prev,
        [reportId]: department || "General"
      }));
    } catch (error) {
      console.error("Classification error:", error);
      setClassifications(prev => ({
        ...prev,
        [reportId]: "Classification Failed"
      }));
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: ReportStatus) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) fetchReports();
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    const colors = {
      PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      RESOLVED: "bg-green-500/10 text-green-400 border-green-500/20",
      DISMISSED: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status];
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      Fire: "bg-red-500/10 text-red-400 border-red-500/20",
      Medical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Police: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Traffic: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Crime: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      Disaster: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      General: "bg-white/5 text-white/60 border-white/10",
    };
    return colors[department] || "bg-white/5 text-white/60 border-white/10";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07D348]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] [background-size:50px_50px]" />
      
      <nav className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-6">
              <span className="text-white/60">
                {session?.user?.name || "Admin"}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10 transition-all hover:border-white/20"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ReportStatus | "ALL")}
              className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#07D348]/20 focus:border-[#07D348]/30 transition-all backdrop-blur-sm"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(ReportStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ReportType | "ALL")}
              className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#07D348]/20 focus:border-[#07D348]/20 transition-all backdrop-blur-sm"
            >
              <option value="ALL">All Types</option>
              {Object.values(ReportType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="text-white/60">
            {filteredReports.length} Reports
          </div>
        </div>

        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex justify-between items-start gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-medium text-white">
                      {report.title}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">
                    {report.description}
                  </p>
                  
                  {!classifications[report.id] ? (
                    <div className="mt-2 flex items-center gap-2 text-xs text-white/40">
                      Analyzing report...
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-white/40">Assigned to:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getDepartmentColor(
                          classifications[report.id]
                        )}`}
                      >
                        {classifications[report.id]} Department
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-6 text-sm text-white/50">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                      </div>
                      {report.type}
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                      </div>
                      {report.location || "N/A"}
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                      </div>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {report.image && (
                    <div className="mt-4 relative w-full h-48 rounded-lg border border-white/10 overflow-hidden">
                      <Image
                        src={report.image}
                        alt="Report evidence"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>

                <select
                  value={report.status}
                  onChange={(e) => updateReportStatus(report.id, e.target.value as ReportStatus)}
                  className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#07D348] focus:border-[#07D348] hover:border-white/20 transition-colors backdrop-blur-sm"
                >
                  {Object.values(ReportStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-white/50 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              No reports found matching the selected filters.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
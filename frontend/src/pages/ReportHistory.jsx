// src/pages/ReportHistory.jsx

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  FlaskConical,
  Download,
  Eye,
  Sparkles,
} from "lucide-react";

import BackButton from "../components/BackButton";
import VirtualLabReportPreview from "../components/VirtualLabReportPreview";

import { useReports } from "../context/ReportsContext";
import { EXPERIMENT_CATALOG, SUBJECTS } from "../data/experiments";

const formatDate = (value) => {
  if (!value) return "Draft";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatSubject = (subject = "") =>
  subject.charAt(0).toUpperCase() + subject.slice(1);

export default function ReportHistory() {
  // SAFE CONTEXT FALLBACK
  const reportsContext = useReports() || {};

  const {
    reports = [],
    loading = false,
    usingLocalFallback = true,
    generateReport = async () => {},
    exportMarkdown = () => {},
  } = reportsContext;

  const [selectedReport, setSelectedReport] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState("all");

  // FILTERED REPORTS
  const filteredReports = useMemo(() => {
    if (subjectFilter === "all") return reports;

    return reports.filter(
      (report) => report.subject === subjectFilter
    );
  }, [reports, subjectFilter]);

  // REPORT GROUPING
  const reportsByExperiment = useMemo(() => {
    const grouped = new Map();

    reports.forEach((report) => {
      const existing = grouped.get(report.experiment_id) || [];

      grouped.set(report.experiment_id, [
        ...existing,
        report,
      ]);
    });

    return grouped;
  }, [reports]);

  // GENERATE REPORT
  const handleGenerate = async (experimentId) => {
    try {
      setGeneratingId(experimentId);

      const report = await generateReport(experimentId);

      if (report) {
        setSelectedReport(report);
      }
    } catch (error) {
      console.error("Report generation failed:", error);
    } finally {
      setGeneratingId(null);
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />

          <p className="text-lg font-semibold text-white/80">
            Loading reports...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <BackButton label="Back to Lab" />

        {/* HERO */}
        <section className="relative mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl">
          <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <Sparkles size={16} />
                Academic Lab Documentation
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                Virtual Lab Reports
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
                Generate structured scientific reports from
                observations, conclusions, experiment completion,
                and quiz performance.
              </p>
            </div>

            {/* STATS */}
            <div className="rounded-3xl border border-white/15 bg-white/10 px-10 py-8 text-center backdrop-blur-xl">
              <span className="block text-6xl font-black">
                {reports.length}
              </span>

              <small className="mt-2 block text-sm uppercase tracking-[0.2em] text-white/70">
                Reports Saved
              </small>
            </div>
          </div>
        </section>

        {/* FALLBACK NOTICE */}
        {usingLocalFallback && (
          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5 text-amber-200">
            Reports are currently being stored locally in your
            browser because the backend server is offline.
          </div>
        )}

        {/* GENERATE REPORTS */}
        <section className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black">
                Generate Experiment Report
              </h2>

              <p className="mt-2 text-white/60">
                Create polished scientific reports instantly.
              </p>
            </div>

            <div className="rounded-2xl bg-cyan-400/10 px-5 py-3 text-cyan-300">
              {EXPERIMENT_CATALOG.length} Experiments
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {EXPERIMENT_CATALOG.map((experiment) => {
              const history =
                reportsByExperiment.get(experiment.id) || [];

              return (
                <div
                  key={experiment.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition duration-300 hover:border-cyan-400/30"
                >
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div>
                      <h3 className="text-xl font-bold">
                        {experiment.title}
                      </h3>

                      <p className="mt-2 text-sm text-white/60">
                        {formatSubject(experiment.subject)} •{" "}
                        {history.length} previous reports
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleGenerate(experiment.id)
                      }
                      disabled={
                        generatingId === experiment.id
                      }
                      className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-bold text-slate-900 transition duration-300 hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
                    >
                      {generatingId === experiment.id
                        ? "Generating..."
                        : "Generate Report"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* HISTORY */}
        <section className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-black">
                Report History
              </h2>

              <p className="mt-2 text-white/60">
                View and export previously generated reports.
              </p>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3">
              {["all", ...SUBJECTS].map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() =>
                    setSubjectFilter(subject)
                  }
                  className={`rounded-2xl px-4 py-2 text-sm font-black uppercase tracking-wide transition ${
                    subjectFilter === subject
                      ? "bg-white text-slate-900"
                      : "bg-slate-800 text-white/70 hover:bg-slate-700"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* EMPTY */}
          {filteredReports.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 py-20 text-center">
              <FileText
                className="mx-auto mb-5 text-white/30"
                size={60}
              />

              <h3 className="text-2xl font-bold">
                No Reports Yet
              </h3>

              <p className="mt-3 text-white/50">
                Generate your first scientific experiment report.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredReports.map((report) => {
                const experiment =
                  EXPERIMENT_CATALOG.find(
                    (item) =>
                      item.id === report.experiment_id
                  );

                return (
                  <div
                    key={report.id}
                    className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-bold">
                        {report.title}
                      </h3>

                      <p className="mt-2 text-sm text-white/60">
                        {formatSubject(report.subject)} •{" "}
                        {formatDate(report.updated_at)} •{" "}
                        {report.status}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {experiment && (
                        <Link
                          to={experiment.link}
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold transition hover:bg-white/10"
                        >
                          <FlaskConical size={16} />
                          Experiment
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedReport(report)
                        }
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold text-slate-900 transition hover:scale-105"
                      >
                        <Eye size={16} />
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          exportMarkdown(report)
                        }
                        className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 font-bold text-slate-900 transition hover:scale-105"
                      >
                        <Download size={16} />
                        Markdown
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* REPORT MODAL */}
        {selectedReport && (
          <VirtualLabReportPreview
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </div>
    </main>
  );
}

export default ReportHistory;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiAlertTriangle,
  FiClock,
  FiUsers,
  FiRefreshCw,
  FiPlusCircle,
} from "react-icons/fi";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getMyEmergencies } from "../../services/emergencyService";

const STATUS_STYLE = {
  pending: { label: "Pending", text: "text-[var(--accent-warning)]", bg: "bg-[var(--accent-warning-dim)]" },
  assigned: { label: "Responder assigned", text: "text-[var(--accent-info)]", bg: "bg-[var(--accent-info-dim)]" },
  in_progress: { label: "In progress", text: "text-[var(--accent-info)]", bg: "bg-[var(--accent-info-dim)]" },
  completed: { label: "Completed", text: "text-[var(--accent-safe)]", bg: "bg-[var(--accent-safe-dim)]" },
};

function MyReports() {
  const { user } = useSelector((state) => state.auth);
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  const fetchReports = async () => {
    setStatus("loading");
    try {
      const data = await getMyEmergencies(user.token);
      setReports(Array.isArray(data) ? data : []);
      setStatus("ok");
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchReports();
    } else {
      setStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold font-display">My Reports</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            Every emergency you've reported and its current status.
          </p>
        </div>
        <button
          onClick={fetchReports}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] hover:border-[var(--border-strong)] px-3 py-2 rounded-lg transition-colors"
        >
          <FiRefreshCw size={14} className={status === "loading" ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {status === "loading" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] animate-pulse" />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-10 text-center">
          <FiFileText className="mx-auto text-[var(--text-muted)] mb-3" size={28} />
          <p className="font-medium">Couldn't load your reports right now</p>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
            This view needs the server to return reports for your account.
            Try refreshing, or report a new emergency below.
          </p>
          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-2 mt-5 bg-[var(--accent-emergency)] hover:bg-[#e63e40] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <FiPlusCircle size={16} />
            Report an emergency
          </Link>
        </div>
      )}

      {status === "ok" && reports.length === 0 && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-10 text-center">
          <FiFileText className="mx-auto text-[var(--text-muted)] mb-3" size={28} />
          <p className="font-medium">No reports yet</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            When you report an emergency, it'll show up here so you can track it.
          </p>
          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-2 mt-5 bg-[var(--accent-emergency)] hover:bg-[#e63e40] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <FiPlusCircle size={16} />
            Report an emergency
          </Link>
        </div>
      )}

      {status === "ok" && reports.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {reports.map((report) => {
            const st = STATUS_STYLE[report.status] || STATUS_STYLE.pending;
            return (
              <div
                key={report._id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-lg bg-[var(--accent-emergency-dim)] flex items-center justify-center shrink-0">
                      <FiAlertTriangle className="text-[var(--accent-emergency)]" size={16} />
                    </span>
                    <h3 className="font-semibold capitalize">{report.emergencyType}</h3>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${st.bg} ${st.text}`}>
                    {st.label}
                  </span>
                </div>

                {report.description && (
                  <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                    {report.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] font-mono-data">
                  {report.affectedPeople != null && (
                    <span className="flex items-center gap-1">
                      <FiUsers size={12} /> {report.affectedPeople}
                    </span>
                  )}
                  {report.severity != null && (
                    <span className="flex items-center gap-1">
                      Severity {report.severity}/5
                    </span>
                  )}
                  {report.createdAt && (
                    <span className="flex items-center gap-1 ml-auto">
                      <FiClock size={12} /> {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {report.assignedResponder?.name && (
                  <p className="text-xs text-[var(--accent-info)] mt-3 pt-3 border-t border-[var(--border-subtle)]">
                    Responder: {report.assignedResponder.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyReports;
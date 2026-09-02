import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ScanSearch,
  Bot,
  Wrench,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Activity,
  Database,
  Cpu,
  Send,
} from "lucide-react";

import LandingPage from "./LandingPage";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview & Analytics",
    icon: LayoutDashboard,
  },
  {
    id: "inspection",
    label: "AI Inspection",
    description: "Upload & Analyze",
    icon: ScanSearch,
  },
  {
    id: "assistant",
    label: "Vehicle AI Assistant",
    description: "Ask about your vehicle",
    icon: Bot,
  },
  {
    id: "advisor",
    label: "Modification Advisor",
    description: "Modification Guidance",
    icon: Wrench,
  },
  {
    id: "cost",
    label: "Cost Estimator",
    description: "Estimate modification cost",
    icon: CircleDollarSign,
  },
  {
    id: "history",
    label: "Inspection History",
    description: "Past inspections",
    icon: ClipboardList,
  },
  {
    id: "reports",
    label: "Reports",
    description: "Generated reports",
    icon: FileText,
  },
  {
    id: "settings",
    label: "Settings",
    description: "System preferences",
    icon: Settings,
  },
];

function Sidebar({ activePage, setActivePage, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[270px]
          flex-col border-r border-slate-800/80
          bg-[#070d18]
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-[92px] items-center border-b border-slate-800/70 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.12)]">
              <ShieldCheck className="h-6 w-6 text-cyan-300" />
            </div>

            <div>
              <h1 className="text-[16px] font-bold tracking-wide text-white">
                AI VEHICLE
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-cyan-300">
                COMPLIANCE ASSISTANT
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Navigation
          </p>

          <div className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileOpen(false);
                  }}
                  className={`
                    group relative flex w-full items-center gap-3 rounded-xl
                    px-3 py-3 text-left transition-all duration-200
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-600/25 to-violet-600/20 text-white shadow-[inset_0_0_0_1px_rgba(59,130,246,0.35)]"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                  )}

                  <div
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                      ${
                        active
                          ? "bg-blue-500/15 text-cyan-300"
                          : "bg-white/[0.03] text-slate-500 group-hover:text-cyan-300"
                      }
                    `}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold">
                      {item.label}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* System Status */}
        <div className="border-t border-slate-800/70 p-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span className="text-[11px] font-semibold text-white">
                System Status
              </span>
            </div>

            <div className="space-y-2.5">
              <StatusRow icon={Cpu} label="AI Models" value="Ready" />
              <StatusRow icon={Bot} label="Ollama" value="Ready" />
              <StatusRow icon={Database} label="Database" value="Connected" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function StatusRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-slate-500" />
        <span className="text-[10px] text-slate-400">{label}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.8)]" />
        <span className="text-[10px] font-medium text-emerald-400">
          {value}
        </span>
      </div>
    </div>
  );
}

function TopBar({ setMobileOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-800/70 bg-[#050914]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Dashboard
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Overview of your vehicle inspections and compliance status
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-500" />

          <input
            type="text"
            placeholder="Search inspections..."
            className="w-40 bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
          />

          <kbd className="rounded border border-slate-700 px-1.5 py-0.5 text-[9px] text-slate-500">
            Ctrl /
          </kbd>
        </div>

        {/* Notification */}
        <button className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-slate-400 hover:text-white">
          <Bell className="h-4.5 w-4.5" />

          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            3
          </span>
        </button>

        {/* User */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-sm font-bold text-white">
            A
          </div>

          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-white">Admin User</p>
            <p className="text-[10px] text-slate-500">Inspector</p>
          </div>

          <ChevronDown className="hidden h-4 w-4 text-slate-500 lg:block" />
        </div>
      </div>
    </header>
  );
}

function Dashboard() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // Fetch inspection data from backend / SQLite
  // ---------------------------------------------------------

  const fetchInspections = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/inspections"
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          "Failed to load inspection data."
        );
      }

      setInspections(
        Array.isArray(data.inspections)
          ? data.inspections
          : []
      );
    } catch (err) {
      console.error(
        "Dashboard fetch error:",
        err
      );

      setError(
        "Unable to load inspection data."
      );
    } finally {
      setLoading(false);
    }
  };


  // ---------------------------------------------------------
  // Load data when Dashboard opens
  // ---------------------------------------------------------

  useEffect(() => {
    fetchInspections();
  }, []);


  // ---------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------

  const totalInspections =
    inspections.length;


  const numberPlateDetections =
    inspections.filter(
      (inspection) =>
        inspection.number_plate_detected === true
    ).length;


  const ledDetections =
    inspections.filter(
      (inspection) =>
        inspection.led_detected === true
    ).length;


  const numberPlateRate =
    totalInspections > 0
      ? Math.round(
          (numberPlateDetections /
            totalInspections) *
            100
        )
      : 0;


  const ledDetectionRate =
    totalInspections > 0
      ? Math.round(
          (ledDetections /
            totalInspections) *
            100
        )
      : 0;


  // ---------------------------------------------------------
  // Average number plate confidence
  // ---------------------------------------------------------

  const plateConfidenceValues =
    inspections
      .map(
        (inspection) =>
          inspection.number_plate_confidence
      )
      .filter(
        (value) =>
          typeof value === "number"
      );


  const averagePlateConfidence =
    plateConfidenceValues.length > 0
      ? (
          plateConfidenceValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          plateConfidenceValues.length
        ) * 100
      : 0;


  // ---------------------------------------------------------
  // Average LED confidence
  // ---------------------------------------------------------

  const ledConfidenceValues =
    inspections
      .map(
        (inspection) =>
          inspection.led_confidence
      )
      .filter(
        (value) =>
          typeof value === "number"
      );


  const averageLedConfidence =
    ledConfidenceValues.length > 0
      ? (
          ledConfidenceValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          ledConfidenceValues.length
        ) * 100
      : 0;


  // ---------------------------------------------------------
  // Dashboard stat cards
  // ---------------------------------------------------------

  const stats = [
    {
      title: "Total Inspections",

      value: loading
        ? "..."
        : String(totalInspections),

      change:
        totalInspections > 0
          ? `${totalInspections} stored in database`
          : "No inspections yet",

      color: "blue",
    },

    {
      title: "Number Plates Detected",

      value: loading
        ? "..."
        : String(numberPlateDetections),

      change:
        totalInspections > 0
          ? `${numberPlateRate}% detection rate`
          : "No inspection data",

      color: "violet",
    },

    {
      title: "LED Detections",

      value: loading
        ? "..."
        : String(ledDetections),

      change:
        totalInspections > 0
          ? `${ledDetectionRate}% detection rate`
          : "No inspection data",

      color: "orange",
    },

    {
      title: "Avg. Confidence",

      value: loading
        ? "..."
        : `${averagePlateConfidence.toFixed(1)}%`,

      change:
        totalInspections > 0
          ? `LED avg ${averageLedConfidence.toFixed(1)}%`
          : "No confidence data",

      color: "green",
    },
  ];


  // ---------------------------------------------------------
  // Format date
  // ---------------------------------------------------------

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(
      dateString
    );

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // ---------------------------------------------------------
  // Inspection status
  // ---------------------------------------------------------

  const getInspectionStatus = (
    inspection
  ) => {
    if (
      inspection.led_detected &&
      inspection.number_plate_detected
    ) {
      return {
        label: "Needs Verification",
        className: "text-orange-400",
        dot: "bg-orange-400",
      };
    }

    if (
      inspection.number_plate_detected
    ) {
      return {
        label: "Plate Detected",
        className: "text-emerald-400",
        dot: "bg-emerald-400",
      };
    }

    return {
      label: "Review Required",
      className: "text-slate-400",
      dot: "bg-slate-500",
    };
  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          PAGE HEADING
      ================================================== */}

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Overview
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          Vehicle Compliance Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor AI-powered vehicle inspections, modifications and compliance.
        </p>

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (

        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">

          <p className="text-xs text-red-400">
            {error}
          </p>

          <button
            onClick={fetchInspections}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Retry
          </button>

        </div>

      )}


      {/* ==================================================
          STATS
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}

      </div>


      {/* ==================================================
          MAIN DASHBOARD
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">


        {/* ==================================================
            INSPECTION OVERVIEW
        ================================================== */}

        <DashboardPanel title="Inspection Overview">

          <div className="h-[300px] rounded-xl border border-slate-800 bg-slate-950/30 p-5">

            {loading ? (

              <div className="flex h-full items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

                  <p className="mt-3 text-xs text-slate-500">
                    Loading inspection data...
                  </p>

                </div>

              </div>

            ) : totalInspections === 0 ? (

              <div className="flex h-full items-center justify-center">

                <div className="text-center">

                  <Activity className="mx-auto h-10 w-10 text-cyan-400/50" />

                  <p className="mt-3 text-sm font-medium text-slate-400">
                    No inspections yet
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Run an AI inspection to populate this dashboard.
                  </p>

                </div>

              </div>

            ) : (

              <div className="flex h-full flex-col justify-center">

                <div className="mb-6">

                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Stored AI inspections
                  </p>

                  <p className="mt-1 text-4xl font-bold text-white">
                    {totalInspections}
                  </p>

                </div>


                {/* Number plate detection */}

                <div className="mb-5">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs text-slate-400">
                      Number Plate Detection
                    </span>

                    <span className="text-xs font-semibold text-cyan-400">
                      {numberPlateDetections} / {totalInspections}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all"
                      style={{
                        width: `${numberPlateRate}%`,
                      }}
                    />

                  </div>

                </div>


                {/* LED detection */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs text-slate-400">
                      LED Light Detection
                    </span>

                    <span className="text-xs font-semibold text-orange-400">
                      {ledDetections} / {totalInspections}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-orange-400 transition-all"
                      style={{
                        width: `${ledDetectionRate}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            )}

          </div>

        </DashboardPanel>


        {/* ==================================================
            DETECTION SUMMARY
        ================================================== */}

        <DashboardPanel title="Detection Summary">

          <div className="flex h-[300px] flex-col justify-center">

            {loading ? (

              <div className="flex items-center justify-center">

                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

              </div>

            ) : (

              <div className="space-y-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      Number Plates
                    </p>

                    <p className="mt-1 text-2xl font-bold text-cyan-400">
                      {numberPlateDetections}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      Detection Rate
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {numberPlateRate}%
                    </p>

                  </div>

                </div>


                <div className="h-px bg-slate-800" />


                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      LED Lights
                    </p>

                    <p className="mt-1 text-2xl font-bold text-orange-400">
                      {ledDetections}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      Detection Rate
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {ledDetectionRate}%
                    </p>

                  </div>

                </div>


                <div className="h-px bg-slate-800" />


                <div>

                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Average Plate Confidence
                  </p>

                  <p className="mt-1 text-2xl font-bold text-violet-400">
                    {averagePlateConfidence.toFixed(1)}%
                  </p>

                </div>

              </div>

            )}

          </div>

        </DashboardPanel>

      </div>


      {/* ==================================================
          RECENT INSPECTIONS
      ================================================== */}

      <DashboardPanel title="Recent Inspections">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px] text-left">

            <thead>

              <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">

                <th className="px-4 py-3">
                  Inspection ID
                </th>

                <th className="px-4 py-3">
                  Image
                </th>

                <th className="px-4 py-3">
                  Date
                </th>

                <th className="px-4 py-3">
                  Number Plate
                </th>

                <th className="px-4 py-3">
                  LED
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-4 py-10 text-center text-xs text-slate-500"
                  >
                    Loading inspections...
                  </td>

                </tr>

              ) : inspections.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-4 py-10 text-center text-xs text-slate-600"
                  >
                    No inspections stored yet.
                  </td>

                </tr>

              ) : (

                inspections
                  .slice(0, 10)
                  .map((inspection) => {

                    const status =
                      getInspectionStatus(
                        inspection
                      );

                    return (

                      <tr
                        key={inspection.id}
                        className="border-b border-slate-900 transition hover:bg-white/[0.02]"
                      >

                        <td className="px-4 py-4 text-xs font-medium text-slate-300">

                          INS-
                          {String(
                            inspection.id
                          ).padStart(
                            5,
                            "0"
                          )}

                        </td>


                        <td className="px-4 py-4 text-xs text-slate-400">

                          {inspection.filename
                            ? inspection.filename.slice(
                                0,
                                18
                              ) + "..."
                            : "—"}

                        </td>


                        <td className="px-4 py-4 text-xs text-slate-500">

                          {formatDate(
                            inspection.created_at
                          )}

                        </td>


                        <td className="px-4 py-4">

                          {inspection.number_plate_detected ? (

                            <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-[10px] font-bold text-cyan-400">
                              Detected
                            </span>

                          ) : (

                            <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-500">
                              Not Detected
                            </span>

                          )}

                        </td>


                        <td className="px-4 py-4">

                          {inspection.led_detected ? (

                            <span className="rounded-md bg-orange-500/10 px-2 py-1 text-[10px] font-bold text-orange-400">
                              Detected
                            </span>

                          ) : (

                            <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-500">
                              Not Detected
                            </span>

                          )}

                        </td>


                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${status.className}`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            {status.label}

                          </span>

                        </td>

                      </tr>

                    );
                  })

              )}

            </tbody>

          </table>

        </div>

      </DashboardPanel>


      {/* ==================================================
          REFRESH BUTTON
      ================================================== */}

      <div className="flex justify-end">

        <button
          onClick={fetchInspections}
          disabled={loading}
          className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >

          {loading
            ? "Refreshing..."
            : "Refresh Dashboard"}

        </button>

      </div>

    </div>
  );
}

function StatCard({ title, value, change, color }) {
  const colors = {
    blue: "border-blue-500/20 bg-blue-500/5 text-blue-400",
    violet: "border-violet-500/20 bg-violet-500/5 text-violet-400",
    green: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    orange: "border-orange-500/20 bg-orange-500/5 text-orange-400",
  };

  return (
    <div className="group rounded-2xl border border-slate-800 bg-[#0a111d]/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className={`mt-2 text-[10px] font-semibold ${colors[color].split(" ").pop()}`}>
            {change}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colors[color]}`}
        >
          <Activity className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function DashboardPanel({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0a111d]/80 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.15)] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">{title}</h2>

        <button className="text-[10px] font-medium text-cyan-400 transition hover:text-cyan-300">
          View All
        </button>
      </div>

      {children}
    </section>
  );
}

function VehicleAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: message },
    ]);

    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "No response received.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to connect to the AI service. Please make sure FastAPI and Ollama are running.",
        },
      ]);
    }
  };

  const suggestions = [
    "Are oversized wheels legal?",
    "What modifications are detected?",
    "Is an LED bar compliant?",
    "How does vehicle inspection work?",
  ];

  return (
    <div className="min-h-[75vh]">

      {/* Welcome screen */}
      {messages.length === 0 ? (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="w-full max-w-3xl text-center">

            {/* AI icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
              <Bot className="h-9 w-9 text-cyan-300" />
            </div>

            {/* Welcome */}
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              AI Vehicle Assistant
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Welcome to your
              <span className="block text-cyan-300">
                AI Vehicle Bot
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Your intelligent vehicle compliance assistant.
              Ask questions about vehicle modifications, safety,
              inspections and compliance.
            </p>

            {/* Status */}
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Qwen 2.5 3B • Ollama Online
            </div>

            {/* Input */}
            <div className="mx-auto mt-10 max-w-2xl">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#0a111d] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)] focus-within:border-cyan-400/40">

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Ask something about your vehicle..."
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />

                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Send className="h-4 w-4" />
                </button>

              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-[11px] text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>

          </div>
        </div>
      ) : (

        /* Chat screen */
        <div className="mx-auto max-w-4xl">

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              AI Assistant
            </p>

            <h1 className="mt-1 text-2xl font-bold text-white">
              Vehicle Compliance Assistant
            </h1>
          </div>

          <div className="min-h-[55vh] space-y-4 rounded-2xl border border-slate-800 bg-[#0a111d]/80 p-5">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-cyan-500/15 text-cyan-100"
                      : "border border-slate-800 bg-slate-900 text-slate-300"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

          </div>

          {/* Chat input */}
          <div className="mt-4 flex gap-3 rounded-2xl border border-slate-800 bg-[#0a111d] p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask about your vehicle..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

function AIInspection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const analyzeVehicle = async () => {
    if (!selectedFile) {
      setError("Please select a vehicle image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/api/inspection/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Vehicle analysis failed."
        );
      }

      if (!data.success) {
        throw new Error(
          data.error || "Vehicle analysis failed."
        );
      }

      console.log("FULL INSPECTION RESULT:", data);

      setResult(data.result);

    } catch (err) {
      console.error("Inspection error:", err);

      setError(
        err.message ||
          "Unable to connect to the inspection service."
      );

    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // NUMBER PLATE RESULT
  // ---------------------------------------------------------

  const numberPlate = result?.number_plate;

  const bestPlate = numberPlate?.best_detection;
// ---------------------------------------------------------
// LED RESULT
// ---------------------------------------------------------

const ledPredictions =
  result?.led_light?.[0]?.predictions?.predictions || [];

const bestLed =
  ledPredictions.length > 0
    ? ledPredictions.reduce((best, current) =>
        Number(current?.confidence || 0) >
        Number(best?.confidence || 0)
          ? current
          : best
      )
    : null;

// Only consider LED detected if confidence is 70% or higher
const LED_CONFIDENCE_THRESHOLD = 0.70;

const ledDetected =
  bestLed &&
  Number(bestLed.confidence || 0) >= LED_CONFIDENCE_THRESHOLD;
  return (
    <div className="space-y-6">

      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Computer Vision
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          AI Vehicle Inspection
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Detect number plates and LED lights using AI.
        </p>
      </div>


      {/* -------------------------------------------------- */}
      {/* MAIN */}
      {/* -------------------------------------------------- */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">

        {/* ==================================================
            LEFT — IMAGE
        ================================================== */}

        <section className="rounded-2xl border border-slate-800 bg-[#0a111d]/80 p-5">

          <div className="mb-4">

            <h2 className="text-sm font-semibold text-white">
              Vehicle Image
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG or WEBP
            </p>

          </div>


          {!preview ? (

            <label className="flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 transition hover:border-cyan-400/50">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">

                <ScanSearch className="h-7 w-7 text-cyan-400" />

              </div>

              <h3 className="mt-5 text-sm font-semibold text-white">
                Upload Vehicle Image
              </h3>

              <p className="mt-2 text-xs text-slate-500">
                Select a clear image of the vehicle
              </p>

              <span className="mt-5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300">
                Choose Image
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>

          ) : (

            <div>

              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black">

                <img
                  src={preview}
                  alt="Vehicle preview"
                  className="max-h-[500px] w-full object-contain"
                />

              </div>

              <div className="mt-4 flex flex-wrap gap-3">

                <label className="cursor-pointer rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300">

                  Change Image

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                </label>


                <button
                  onClick={analyzeVehicle}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
                >

                  <ScanSearch className="h-4 w-4" />

                  {loading
                    ? "Analyzing..."
                    : "Analyze Vehicle"}

                </button>

              </div>

            </div>

          )}

        </section>


        {/* ==================================================
            RIGHT — RESULTS
        ================================================== */}

        <section className="rounded-2xl border border-slate-800 bg-[#0a111d]/80 p-5">

          <div className="mb-5">

            <h2 className="text-sm font-semibold text-white">
              Inspection Result
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Number plate + LED light detection
            </p>

          </div>


          {/* WAITING */}

          {!result && !error && !loading && (

            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30">

              <div className="text-center">

                <ShieldCheck className="mx-auto h-10 w-10 text-cyan-400/40" />

                <p className="mt-3 text-sm font-medium text-slate-400">
                  Waiting for inspection
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Upload an image and run the AI analysis.
                </p>

              </div>

            </div>

          )}


          {/* LOADING */}

          {loading && (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-400">
                  AI is analyzing the vehicle...
                </p>

              </div>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">

              <p className="text-xs font-semibold text-red-400">
                Inspection Error
              </p>

              <p className="mt-2 text-xs leading-5 text-red-300/80">
                {error}
              </p>

            </div>

          )}


          {/* RESULTS */}

          {result && (

            <div className="space-y-4">


              {/* ==================================================
                  NUMBER PLATE STATUS
              ================================================== */}

              {numberPlate && (

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        Number Plate Detection
                      </p>

                      <p className="mt-1 text-lg font-bold text-emerald-400">
                        {numberPlate.status}
                      </p>

                    </div>

                    <ShieldCheck className="h-8 w-8 text-emerald-400" />

                  </div>

                </div>

              )}


              {/* ==================================================
                  NUMBER PLATE DETAILS
              ================================================== */}

              {bestPlate && (

                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">

                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Detected Number Plate
                  </p>

                  {bestPlate.plate_number ? (

                    <p className="mt-2 text-2xl font-bold tracking-[0.18em] text-cyan-300">
                      {bestPlate.plate_number}
                    </p>

                  ) : (

                    <p className="mt-2 text-sm font-semibold text-orange-400">
                      Plate detected — characters not readable
                    </p>

                  )}


                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div>

                      <p className="text-[10px] text-slate-600">
                        YOLO Confidence
                      </p>

                      <p className="mt-1 text-sm font-semibold text-cyan-400">
                        {(Number(bestPlate.confidence || 0) * 100).toFixed(1)}%
                      </p>

                    </div>


                    <div>

                      <p className="text-[10px] text-slate-600">
                        OCR Confidence
                      </p>

                      <p className="mt-1 text-sm font-semibold text-violet-400">
                        {(Number(bestPlate.ocr_confidence || 0) * 100).toFixed(1)}%
                      </p>

                    </div>

                  </div>

                </div>

              )}


              {/* ==================================================
                  LED LIGHT DETECTION
              ================================================== */}

              <div
                className={`rounded-xl border p-4 ${
                  ledDetected
                    ? "border-orange-500/20 bg-orange-500/5"
                    : "border-slate-800 bg-slate-950/40"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      LED Bar Light Detection
                    </p>

                    <p
                      className={`mt-1 text-lg font-bold ${
                        ledDetected
                          ? "text-orange-400"
                          : "text-slate-400"
                      }`}
                    >
                      {ledDetected
                        ? "LED Light Detected"
                        : "No LED Light Detected"}
                    </p>

                  </div>

                  <Activity
                    className={`h-8 w-8 ${
                      ledDetected
                        ? "text-orange-400"
                        : "text-slate-600"
                    }`}
                  />

                </div>


                {bestLed && (

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">

                      <p className="text-[10px] text-slate-600">
                        Detected Class
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {bestLed.class || "LED_Light"}
                      </p>

                    </div>


                    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">

                      <p className="text-[10px] text-slate-600">
                        Confidence
                      </p>

                      <p className="mt-1 text-sm font-semibold text-orange-400">
                        {(Number(bestLed.confidence || 0) * 100).toFixed(1)}%
                      </p>

                    </div>

                  </div>

                )}

              </div>


              {/* ==================================================
                  ANNOTATED IMAGE
              ================================================== */}

              {numberPlate?.annotated_image && (

                <div className="overflow-hidden rounded-xl border border-slate-800 bg-black">

                  <div className="border-b border-slate-800 bg-slate-950/60 px-4 py-3">

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                      AI Detection View
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Number plate detection and OCR view
                    </p>

                  </div>

                  <img
                    src={`http://127.0.0.1:8000/inspection-results/${numberPlate.annotated_image}`}
                    alt="AI detected number plate"
                    className="max-h-[420px] w-full object-contain"
                  />

                </div>

              )}


              {/* ==================================================
                  NUMBER PLATE MESSAGE
              ================================================== */}

              {numberPlate?.message && (

                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">

                  <p className="text-xs leading-5 text-slate-400">
                    {numberPlate.message}
                  </p>

                </div>

              )}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

// =========================================================
// INSPECTION HISTORY
// =========================================================

function InspectionHistory() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInspections = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/api/inspections"
        );

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          );
        }

        const data = await response.json();

        setInspections(
          Array.isArray(data.inspections)
            ? data.inspections
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load inspection history:",
          err
        );

        setError(
          "Unable to load inspection history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInspections();
  }, []);

  // -------------------------------------------------------
  // Loading
  // -------------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Records
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Inspection History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View previous AI vehicle inspections.
          </p>
        </div>

        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-800 bg-[#0a111d]/80">
          <div className="text-center">

            <Activity className="mx-auto h-8 w-8 animate-pulse text-cyan-400" />

            <p className="mt-3 text-sm text-slate-400">
              Loading inspection records...
            </p>

          </div>
        </div>

      </div>
    );
  }

  // -------------------------------------------------------
  // Error
  // -------------------------------------------------------

  if (error) {
    return (
      <div className="space-y-6">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Records
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Inspection History
          </h1>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm font-medium text-red-400">
            {error}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Make sure the FastAPI backend is running on port 8000.
          </p>
        </div>

      </div>
    );
  }

  // -------------------------------------------------------
  // Empty state
  // -------------------------------------------------------

  if (inspections.length === 0) {
    return (
      <div className="space-y-6">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Records
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Inspection History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View previous AI vehicle inspections.
          </p>
        </div>

        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30">

          <div className="text-center">

            <Activity className="mx-auto h-10 w-10 text-cyan-400/50" />

            <p className="mt-3 text-sm font-medium text-slate-400">
              No inspections yet
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Completed vehicle inspections will appear here.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // -------------------------------------------------------
  // History
  // -------------------------------------------------------

  return (
    <div className="space-y-6">

      {/* Page heading */}

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Records
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          Inspection History
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View previous AI vehicle inspections.
        </p>

      </div>


      {/* Summary */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">

          <p className="text-xs text-slate-500">
            Total Inspections
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {inspections.length}
          </p>

        </div>


        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

          <p className="text-xs text-slate-500">
            Number Plates Detected
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {
              inspections.filter(
                (inspection) =>
                  inspection.number_plate_detected
              ).length
            }
          </p>

        </div>


        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">

          <p className="text-xs text-slate-500">
            LED Modifications Detected
          </p>

          <p className="mt-2 text-2xl font-bold text-orange-400">
            {
              inspections.filter(
                (inspection) =>
                  inspection.led_detected
              ).length
            }
          </p>

        </div>

      </div>


      {/* Inspection table */}

      <DashboardPanel title="Previous Inspections">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead>

              <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">

                <th className="px-4 py-3">
                  ID
                </th>

                <th className="px-4 py-3">
                  Date
                </th>

                <th className="px-4 py-3">
                  Number Plate
                </th>

                <th className="px-4 py-3">
                  Confidence
                </th>

                <th className="px-4 py-3">
                  LED Light
                </th>

                <th className="px-4 py-3">
                  Confidence
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {inspections.map((inspection) => {

                const plateDetected =
                  Boolean(
                    inspection.number_plate_detected
                  );

                const ledDetected =
                  Boolean(
                    inspection.led_detected
                  );

                const needsVerification =
                  !plateDetected ||
                  ledDetected;

                return (

                  <tr
                    key={inspection.id}
                    className="border-b border-slate-900 transition hover:bg-white/[0.02]"
                  >

                    {/* ID */}

                    <td className="px-4 py-4">

                      <span className="text-xs font-semibold text-cyan-400">
                        INS-
                        {String(
                          inspection.id
                        ).padStart(5, "0")}
                      </span>

                    </td>


                    {/* Date */}

                    <td className="px-4 py-4">

                      <p className="text-xs text-white">
                        {inspection.created_at
                          ? new Date(
                              inspection.created_at
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-600">
                        {inspection.created_at
                          ? new Date(
                              inspection.created_at
                            ).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : ""}
                      </p>

                    </td>


                    {/* Number plate */}

                    <td className="px-4 py-4">

                      {plateDetected ? (

                        <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400">

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                          Detected

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">

                          <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />

                          Not Detected

                        </span>

                      )}

                    </td>


                    {/* Plate confidence */}

                    <td className="px-4 py-4">

                      {plateDetected ? (

                        <span className="text-xs font-semibold text-cyan-400">

                          {(
                            Number(
                              inspection.number_plate_confidence || 0
                            ) * 100
                          ).toFixed(1)}
                          %

                        </span>

                      ) : (

                        <span className="text-xs text-slate-600">
                          —
                        </span>

                      )}

                    </td>


                    {/* LED */}

                    <td className="px-4 py-4">

                      {ledDetected ? (

                        <span className="inline-flex items-center gap-2 text-xs font-medium text-orange-400">

                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />

                          Detected

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">

                          <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />

                          Not Detected

                        </span>

                      )}

                    </td>


                    {/* LED confidence */}

                    <td className="px-4 py-4">

                      {ledDetected ? (

                        <span className="text-xs font-semibold text-orange-400">

                          {(
                            Number(
                              inspection.led_confidence || 0
                            ) * 100
                          ).toFixed(1)}
                          %

                        </span>

                      ) : (

                        <span className="text-xs text-slate-600">
                          —
                        </span>

                      )}

                    </td>


                    {/* Status */}

                    <td className="px-4 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${
                          needsVerification
                            ? "text-orange-400"
                            : "text-emerald-400"
                        }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            needsVerification
                              ? "bg-orange-400"
                              : "bg-emerald-400"
                          }`}
                        />

                        {needsVerification
                          ? "Needs Verification"
                          : "No Issues Detected"}

                      </span>

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>

      </DashboardPanel>

    </div>
  );
}

function App() {
  const [showLanding, setShowLanding] = useState(true);

  const [activePage, setActivePage] = useState("dashboard");

  const [mobileOpen, setMobileOpen] = useState(false);

  // ---------------------------------------------------------
  // LANDING PAGE
  // ---------------------------------------------------------

  if (showLanding) {
    return (
      <LandingPage
        onInspect={() => {
          setShowLanding(false);
          setActivePage("dashboard");
        }}
      />
    );
  }

  // ---------------------------------------------------------
  // MAIN APPLICATION
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#050914] text-slate-200">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:pl-[270px]">

        <TopBar setMobileOpen={setMobileOpen} />

        <main className="px-4 py-6 sm:px-6 lg:px-8">

          {activePage === "dashboard" ? (
            <Dashboard />

          ) : activePage === "assistant" ? (
            <VehicleAssistant />

          ) : activePage === "inspection" ? (
            <AIInspection />

          ) : activePage === "history" ? (
            <InspectionHistory />

          ) : (
            <div className="flex min-h-[60vh] items-center justify-center">

              <div className="text-center">

                <Activity className="mx-auto h-10 w-10 text-cyan-400" />

                <h2 className="mt-4 text-xl font-bold text-white">
                  {NAV_ITEMS.find(
                    (item) => item.id === activePage
                  )?.label}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  This module will be connected next.
                </p>

              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;
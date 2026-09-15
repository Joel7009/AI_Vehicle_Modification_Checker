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
    id: "history",
    label: "Inspection History",
    description: "Past inspections",
    icon: ClipboardList,
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
    flex-col overflow-hidden
    border-r border-cyan-400/[0.08]
    bg-[#070d18]/95 backdrop-blur-xl
    transition-transform duration-300
    lg:translate-x-0
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
  `}
>
  {/* Ambient sidebar glow */}
  <div className="pointer-events-none absolute -left-24 top-[25%] h-72 w-72 rounded-full bg-cyan-400/[0.035] blur-[100px]" />
  <div className="pointer-events-none absolute -right-24 top-[55%] h-64 w-64 rounded-full bg-violet-500/[0.025] blur-[100px]" />

  {/* Brand */}
  <div className="relative flex h-[92px] shrink-0 items-center border-b border-slate-800/70 px-5">
    <div className="flex items-center gap-3">
      {/* Logo */}
      <div
        className="
          flex h-11 w-11 items-center justify-center rounded-xl
          border border-cyan-400/40
          bg-cyan-400/[0.08]
          shadow-[0_0_25px_rgba(34,211,238,0.12)]
          transition-all duration-300
          hover:border-cyan-300/70
          hover:bg-cyan-400/[0.14]
          hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]
        "
      >
        <ShieldCheck className="h-6 w-6 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]" />
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
      className="
        ml-auto rounded-lg p-2
        text-slate-400
        transition-all duration-200
        hover:bg-white/[0.06]
        hover:text-cyan-300
      "
    >
      <X className="h-5 w-5" />
    </button>
  </div>

  {/* Navigation */}
  <div className="relative flex min-h-0 flex-1 flex-col">
    {/* Navigation label */}
    <div className="shrink-0 px-6 pt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        Navigation
      </p>
    </div>

    {/* Navigation items */}
    <nav className="flex flex-1 flex-col justify-evenly px-3 py-5">
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
              group relative flex w-full items-center gap-3
              rounded-2xl px-3 py-3.5 text-left
              transition-all duration-300 ease-out

              ${
                active
                  ? `
                    border border-cyan-400/20
                    bg-gradient-to-r
                    from-cyan-400/[0.10]
                    via-blue-500/[0.08]
                    to-violet-500/[0.10]
                    text-white
                    shadow-[0_0_30px_rgba(34,211,238,0.08),inset_0_0_20px_rgba(34,211,238,0.025)]
                  `
                  : `
                    border border-transparent
                    text-slate-400
                    hover:border-cyan-400/[0.12]
                    hover:bg-white/[0.035]
                    hover:text-white
                    hover:shadow-[0_0_25px_rgba(34,211,238,0.06)]
                  `
              }
            `}
          >
            {/* Active cyan line */}
            {active && (
              <span
                className="
                  absolute left-0 top-1/2 h-9 w-[3px]
                  -translate-y-1/2 rounded-r-full
                  bg-cyan-400
                  shadow-[0_0_8px_rgba(34,211,238,0.8),0_0_18px_rgba(34,211,238,0.45)]
                "
              />
            )}

            {/* Icon glass container */}
            <div
              className={`
                relative flex h-10 w-10 shrink-0
                items-center justify-center rounded-xl
                border
                transition-all duration-300

                ${
                  active
                    ? `
                      border-cyan-400/20
                      bg-cyan-400/[0.09]
                      text-cyan-300
                      shadow-[0_0_18px_rgba(34,211,238,0.10)]
                    `
                    : `
                      border-slate-800/80
                      bg-slate-900/50
                      text-slate-500
                      group-hover:border-cyan-400/20
                      group-hover:bg-cyan-400/[0.06]
                      group-hover:text-cyan-300
                      group-hover:shadow-[0_0_15px_rgba(34,211,238,0.08)]
                    `
                }
              `}
            >
              <Icon
                className={`
                  h-[18px] w-[18px]
                  transition-all duration-300
                  ${
                    active
                      ? "scale-105 drop-shadow-[0_0_7px_rgba(34,211,238,0.75)]"
                      : "group-hover:scale-110"
                  }
                `}
              />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p
                className={`
                  truncate text-[12px] font-semibold
                  transition-colors duration-300
                  ${active ? "text-white" : "text-slate-400 group-hover:text-white"}
                `}
              >
                {item.label}
              </p>

              <p
                className="
                  mt-0.5 truncate text-[10px]
                  text-slate-500
                  transition-colors duration-300
                  group-hover:text-slate-400
                "
              >
                {item.description}
              </p>
            </div>

            {/* Hover / active arrow */}
            <span
              className={`
                mr-1 text-lg leading-none
                transition-all duration-300
                ${
                  active
                    ? "translate-x-0 text-cyan-300 opacity-100"
                    : "-translate-x-2 text-cyan-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                }
              `}
            >
              ›
            </span>
          </button>
        );
      })}
    </nav>
  </div>

  {/* System Status */}
  <div className="relative shrink-0 border-t border-slate-800/70 bg-[#070d18]/60 p-4">
    <div
      className="
        rounded-2xl
        border border-slate-800/80
        bg-white/[0.025]
        p-3
        shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
        backdrop-blur-xl
      "
    >
      <div className="mb-3 flex items-center gap-2">
        <Activity
          className="
            h-4 w-4 text-emerald-400
            drop-shadow-[0_0_7px_rgba(52,211,153,0.8)]
          "
        />

        <span className="text-[11px] font-semibold text-white">
          System Status
        </span>

        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
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

function CursorStatCard({
  stat,
  onMouseMove,
}) {
  return (
    <div
      onMouseMove={onMouseMove}
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-white/[0.07]
        bg-slate-950/30
        p-5
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-cyan-400/[0.18]
        hover:shadow-[0_0_35px_rgba(34,211,238,0.07)]
      "
    >

      {/* Cursor glass gloss */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
        "
        style={{
          background:
            "radial-gradient(180px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.11), rgba(34,211,238,0.045) 38%, transparent 72%)",
        }}
      />

      {/* Glass reflection */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-br
          from-white/[0.025]
          via-transparent
          to-cyan-400/[0.018]
        "
      />

      {/* Content */}

      <div className="relative z-20">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {stat.title}
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {stat.value}
            </p>

          </div>

          <div
            className={`
              flex h-9 w-9 items-center
              justify-center rounded-xl
              border
              transition-all duration-300
              group-hover:scale-110
              ${
                stat.color === "blue"
                  ? "border-blue-400/10 bg-blue-400/[0.05] text-blue-400"
                  : stat.color === "violet"
                  ? "border-violet-400/10 bg-violet-400/[0.05] text-violet-400"
                  : stat.color === "orange"
                  ? "border-orange-400/10 bg-orange-400/[0.05] text-orange-400"
                  : "border-emerald-400/10 bg-emerald-400/[0.05] text-emerald-400"
              }
            `}
          >
            <span className="text-xs">
              {stat.color === "blue"
                ? "AI"
                : stat.color === "violet"
                ? "NP"
                : stat.color === "orange"
                ? "LED"
                : "✓"}
            </span>
          </div>

        </div>

        <div className="mt-4 flex items-center gap-2">

          <span className="h-1 w-1 rounded-full bg-cyan-400/70" />

          <p className="text-[10px] text-slate-600">
            {stat.change}
          </p>

        </div>

      </div>

    </div>
  );
}

function Dashboard() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // CURSOR GLASS EFFECT
  // =========================================================

  const handleGlassMove = (event) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    element.style.setProperty("--mouse-x", `${x}px`);
    element.style.setProperty("--mouse-y", `${y}px`);
  };

  const glassProps = {
    onMouseMove: handleGlassMove,
    className: `
      group relative overflow-hidden
      border border-white/[0.07]
      bg-slate-950/30
      backdrop-blur-xl
      transition-all duration-300
      hover:border-cyan-400/[0.16]
      hover:shadow-[0_0_35px_rgba(34,211,238,0.06)]
    `,
  };

  // =========================================================
  // FETCH INSPECTIONS FROM BACKEND / SQLITE
  // =========================================================

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

      const records = Array.isArray(data.inspections)
        ? data.inspections
        : [];

      records.sort((a, b) => {
        const dateA = new Date(
          a.created_at || 0
        ).getTime();

        const dateB = new Date(
          b.created_at || 0
        ).getTime();

        return dateB - dateA;
      });

      setInspections(records);
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

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    fetchInspections();
  }, []);

  // =========================================================
  // STATISTICS
  // =========================================================

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

  // =========================================================
  // DETECTION RATES
  // =========================================================

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

  // =========================================================
  // PLATE CONFIDENCE
  // =========================================================

  const plateConfidenceValues =
    inspections
      .map(
        (inspection) =>
          inspection.number_plate_confidence
      )
      .filter(
        (value) =>
          typeof value === "number" &&
          Number.isFinite(value)
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

  // =========================================================
  // LED CONFIDENCE
  // =========================================================

  const ledConfidenceValues =
    inspections
      .map(
        (inspection) =>
          inspection.led_confidence
      )
      .filter(
        (value) =>
          typeof value === "number" &&
          Number.isFinite(value)
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

  // =========================================================
  // COMBINED AI CONFIDENCE
  // =========================================================

  const allConfidenceValues = [
    ...plateConfidenceValues,
    ...ledConfidenceValues,
  ];

  const averageAIConfidence =
    allConfidenceValues.length > 0
      ? (
          allConfidenceValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          allConfidenceValues.length
        ) * 100
      : 0;

  // =========================================================
  // LATEST INSPECTION
  // =========================================================

  const latestInspection =
    inspections.length > 0
      ? inspections[0]
      : null;

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

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

  // =========================================================
  // STATUS
  // =========================================================

  const getInspectionStatus = (
    inspection
  ) => {
    if (
      inspection.led_detected &&
      inspection.number_plate_detected
    ) {
      return {
        label: "Needs Verification",
        className:
          "text-orange-400",
        dot: "bg-orange-400",
      };
    }

    if (inspection.led_detected) {
      return {
        label: "LED Detected",
        className:
          "text-orange-400",
        dot: "bg-orange-400",
      };
    }

    if (
      inspection.number_plate_detected
    ) {
      return {
        label: "Plate Detected",
        className:
          "text-emerald-400",
        dot: "bg-emerald-400",
      };
    }

    return {
      label: "Review Required",
      className:
        "text-slate-400",
      dot: "bg-slate-500",
    };
  };

  // =========================================================
  // LAST 7 DAYS
  // =========================================================

  const getLastSevenDays = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(
        0,
        0,
        0,
        0
      );

      date.setDate(
        date.getDate() - i
      );

      const count =
        inspections.filter(
          (inspection) => {
            if (!inspection.created_at) {
              return false;
            }

            const inspectionDate =
              new Date(
                inspection.created_at
              );

            return (
              inspectionDate.getFullYear() ===
                date.getFullYear() &&
              inspectionDate.getMonth() ===
                date.getMonth() &&
              inspectionDate.getDate() ===
                date.getDate()
            );
          }
        ).length;

      days.push({
        label:
          date.toLocaleDateString(
            "en-IN",
            {
              weekday: "short",
            }
          ),
        date,
        count,
      });
    }

    return days;
  };

  const activityData =
    getLastSevenDays();

  const maxActivity =
    Math.max(
      ...activityData.map(
        (day) => day.count
      ),
      1
    );

  // =========================================================
  // STAT CARDS
  // =========================================================

  const stats = [
    {
      title: "Total Inspections",
      value: loading
        ? "..."
        : String(
            totalInspections
          ),
      change:
        totalInspections > 0
          ? `${totalInspections} stored in database`
          : "No inspections yet",
      color: "blue",
    },
    {
      title:
        "Number Plates Detected",
      value: loading
        ? "..."
        : String(
            numberPlateDetections
          ),
      change:
        totalInspections > 0
          ? `${numberPlateRate}% detection rate`
          : "No inspection data",
      color: "violet",
    },
    {
      title: "LED BAR Light Detections",
      value: loading
        ? "..."
        : String(
            ledDetections
          ),
      change:
        totalInspections > 0
          ? `${ledDetectionRate}% detection rate`
          : "No inspection data",
      color: "orange",
    },
    {
      title:
        "AI Detection Confidence",
      value: loading
        ? "..."
        : `${averageAIConfidence.toFixed(
            1
          )}%`,
      change:
        totalInspections > 0
          ? `Plate ${averagePlateConfidence.toFixed(
              1
            )}% • LED ${averageLedConfidence.toFixed(
              1
            )}%`
          : "No confidence data",
      color: "green",
    },
  ];

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        {...glassProps}
        className={`
          ${glassProps.className}
          rounded-2xl
          px-6 py-5
        `}
      >

        {/* Cursor gloss */}

        <div
          className="
            pointer-events-none
            absolute inset-0 z-0
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
          style={{
            background:
              "radial-gradient(220px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.10), rgba(34,211,238,0.045) 35%, transparent 70%)",
          }}
        />

        {/* Glass reflection */}

        <div
          className="
            pointer-events-none
            absolute inset-0
            bg-gradient-to-br
            from-white/[0.025]
            via-transparent
            to-cyan-400/[0.025]
          "
        />

        <div className="relative z-20">

          <div className="flex flex-wrap items-end justify-between gap-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                AI Vision • Overview
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Vehicle Compliance Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor AI-powered vehicle inspections,
                detections and system activity.
              </p>
            </div>

            {/* Database status */}

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5">

              <span
                className="
                  h-1.5 w-1.5 rounded-full
                  bg-emerald-400
                  shadow-[0_0_10px_rgba(52,211,153,0.9)]
                  animate-pulse
                "
              />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                Database Live
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3">

          <p className="text-xs text-red-400">
            {error}
          </p>

          <button
            onClick={
              fetchInspections
            }
            className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Retry
          </button>

        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <CursorStatCard
            key={stat.title}
            stat={stat}
            onMouseMove={
              handleGlassMove
            }
          />
        ))}

      </div>

      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">

        {/* ===================================================
            INSPECTION ACTIVITY
        =================================================== */}

        <DashboardPanel title="Inspection Activity">

          <div
            {...glassProps}
            className={`
              ${glassProps.className}
              rounded-xl p-5
            `}
          >

            {/* Cursor gloss */}

            <div
              className="
                pointer-events-none
                absolute inset-0 z-10
                opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
              "
              style={{
                background:
                  "radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), rgba(34,211,238,0.035) 40%, transparent 72%)",
              }}
            />

            <div className="relative z-20">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Last 7 Days
                  </p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    {totalInspections}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Total stored inspections
                  </p>
                </div>

                <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] px-3 py-2 text-right">

                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    AI Confidence
                  </p>

                  <p className="mt-1 text-lg font-bold text-cyan-400">
                    {averageAIConfidence.toFixed(
                      1
                    )}%
                  </p>

                </div>

              </div>

              {loading ? (

                <div className="flex h-[190px] items-center justify-center">

                  <div className="text-center">

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

                    <p className="mt-3 text-xs text-slate-500">
                      Loading activity...
                    </p>

                  </div>

                </div>

              ) : totalInspections === 0 ? (

                <div className="flex h-[190px] items-center justify-center">

                  <div className="text-center">

                    <Activity className="mx-auto h-9 w-9 text-cyan-400/40" />

                    <p className="mt-3 text-sm font-medium text-slate-400">
                      No inspection activity
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Run an AI inspection to populate analytics.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="h-[190px]">

                  <div className="flex h-[150px] items-end gap-2 sm:gap-4">

                    {activityData.map(
                      (day) => {

                        const height =
                          day.count === 0
                            ? 4
                            : Math.max(
                                10,
                                (day.count /
                                  maxActivity) *
                                  100
                              );

                        return (
                          <div
                            key={day.date.toISOString()}
                            className="group flex h-full flex-1 flex-col justify-end"
                          >

                            <div className="mb-2 text-center text-[9px] font-semibold text-slate-600 opacity-0 transition group-hover:opacity-100">
                              {day.count}
                            </div>

                            <div
                              className="
                                relative w-full
                                overflow-hidden
                                rounded-t-lg
                                border border-cyan-400/10
                                bg-gradient-to-t
                                from-cyan-500/20
                                to-violet-500/20
                                transition-all duration-500
                                group-hover:from-cyan-400/40
                                group-hover:to-violet-400/40
                                group-hover:shadow-[0_0_18px_rgba(34,211,238,0.10)]
                              "
                              style={{
                                height: `${height}%`,
                                minHeight:
                                  "4px",
                              }}
                            >

                              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-cyan-400/[0.06] blur-md" />

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                  <div className="mt-3 flex gap-2 sm:gap-4">

                    {activityData.map(
                      (day) => (
                        <div
                          key={`label-${day.date.toISOString()}`}
                          className="flex-1 text-center text-[9px] font-medium uppercase tracking-wider text-slate-600"
                        >
                          {day.label}
                        </div>
                      )
                    )}

                  </div>

                </div>

              )}

            </div>

          </div>

        </DashboardPanel>

        {/* ===================================================
            DETECTION SUMMARY
        =================================================== */}

        <DashboardPanel title="Detection Summary">

          <div
            {...glassProps}
            className={`
              ${glassProps.className}
              rounded-xl p-5
            `}
          >

            {/* Cursor gloss */}

            <div
              className="
                pointer-events-none
                absolute inset-0 z-10
                opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
              "
              style={{
                background:
                  "radial-gradient(180px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), rgba(34,211,238,0.035) 40%, transparent 72%)",
              }}
            />

            <div className="relative z-20 space-y-5">

              {/* Number Plate */}

              <div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05]">

                      <span className="text-xs font-bold text-cyan-400">
                        NP
                      </span>

                    </div>

                    <div>

                      <p className="text-xs font-semibold text-white">
                        Number Plate
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-600">
                        Detection only
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-lg font-bold text-cyan-400">
                      {loading
                        ? "..."
                        : numberPlateDetections}
                    </p>

                    <p className="text-[9px] text-slate-600">
                      {numberPlateRate}%
                    </p>

                  </div>

                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-700"
                    style={{
                      width: `${numberPlateRate}%`,
                    }}
                  />

                </div>

              </div>

              <div className="h-px bg-slate-800/80" />

              {/* LED */}

              <div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.05]">

                      <span className="text-[10px] font-bold text-orange-400">
                        LED
                      </span>

                    </div>

                    <div>

                      <p className="text-xs font-semibold text-white">
                        LED Bar Light
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-600">
                        Modification detection
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-lg font-bold text-orange-400">
                      {loading
                        ? "..."
                        : ledDetections}
                    </p>

                    <p className="text-[9px] text-slate-600">
                      {ledDetectionRate}%
                    </p>

                  </div>

                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
                    style={{
                      width: `${ledDetectionRate}%`,
                    }}
                  />

                </div>

              </div>

              {/* Confidence */}

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-violet-400/10 bg-violet-400/[0.035] p-3">

                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    Plate Confidence
                  </p>

                  <p className="mt-1 text-lg font-bold text-violet-400">
                    {averagePlateConfidence.toFixed(
                      1
                    )}%
                  </p>

                </div>

                <div className="rounded-xl border border-orange-400/10 bg-orange-400/[0.035] p-3">

                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    LED Confidence
                  </p>

                  <p className="mt-1 text-lg font-bold text-orange-400">
                    {averageLedConfidence.toFixed(
                      1
                    )}%
                  </p>

                </div>

              </div>

            </div>

          </div>

        </DashboardPanel>

      </div>

      {/* =====================================================
          LATEST INSPECTION
      ===================================================== */}

      <DashboardPanel title="Latest AI Inspection">

        {!latestInspection ? (

          <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-slate-800/80 bg-slate-950/30">

            <div className="text-center">

              <Activity className="mx-auto h-8 w-8 text-slate-700" />

              <p className="mt-3 text-sm text-slate-500">
                No inspection available
              </p>

              <p className="mt-1 text-xs text-slate-700">
                Upload a vehicle image to start an AI inspection.
              </p>

            </div>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">

            {/* Main info */}

            <div
              {...glassProps}
              className={`
                ${glassProps.className}
                rounded-xl p-5
              `}
            >

              <div
                className="
                  pointer-events-none
                  absolute inset-0 z-10
                  opacity-0
                  transition-opacity duration-300
                  group-hover:opacity-100
                "
                style={{
                  background:
                    "radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), rgba(34,211,238,0.035) 40%, transparent 72%)",
                }}
              />

              <div className="relative z-20">

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                      Most Recent
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-white">
                      INS-
                      {String(
                        latestInspection.id
                      ).padStart(
                        5,
                        "0"
                      )}
                    </h3>

                    <p className="mt-1 max-w-[320px] truncate text-xs text-slate-500">
                      {latestInspection.filename ||
                        "Vehicle image"}
                    </p>

                  </div>

                  {(() => {
                    const status =
                      getInspectionStatus(
                        latestInspection
                      );

                    return (
                      <div
                        className={`
                          inline-flex items-center gap-2
                          rounded-full
                          border border-white/[0.05]
                          bg-white/[0.025]
                          px-3 py-1.5
                          text-[10px] font-semibold
                          ${status.className}
                        `}
                      >

                        <span
                          className={`
                            h-1.5 w-1.5 rounded-full
                            ${status.dot}
                          `}
                        />

                        {status.label}

                      </div>
                    );
                  })()}

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-xl border border-slate-800/70 bg-white/[0.02] p-3">

                    <p className="text-[9px] uppercase tracking-wider text-slate-600">
                      Plate
                    </p>

                    <p
                      className={
                        latestInspection.number_plate_detected
                          ? "mt-1 text-xs font-bold text-cyan-400"
                          : "mt-1 text-xs font-bold text-slate-500"
                      }
                    >
                      {latestInspection.number_plate_detected
                        ? "Detected"
                        : "Not Detected"}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800/70 bg-white/[0.02] p-3">

                    <p className="text-[9px] uppercase tracking-wider text-slate-600">
                      LED
                    </p>

                    <p
                      className={
                        latestInspection.led_detected
                          ? "mt-1 text-xs font-bold text-orange-400"
                          : "mt-1 text-xs font-bold text-emerald-400"
                      }
                    >
                      {latestInspection.led_detected
                        ? "Detected"
                        : "Clear"}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800/70 bg-white/[0.02] p-3">

                    <p className="text-[9px] uppercase tracking-wider text-slate-600">
                      Plate Confidence
                    </p>

                    <p className="mt-1 text-xs font-bold text-violet-400">
                      {typeof latestInspection.number_plate_confidence ===
                      "number"
                        ? `${(
                            latestInspection.number_plate_confidence *
                            100
                          ).toFixed(
                            1
                          )}%`
                        : "—"}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800/70 bg-white/[0.02] p-3">

                    <p className="text-[9px] uppercase tracking-wider text-slate-600">
                      Date
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-300">
                      {formatDate(
                        latestInspection.created_at
                      )}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* AI Engine */}

            <div
              {...glassProps}
              className={`
                ${glassProps.className}
                min-w-[210px]
                rounded-xl
                bg-gradient-to-br
                from-cyan-400/[0.045]
                to-violet-500/[0.045]
                p-5
              `}
            >

              <div
                className="
                  pointer-events-none
                  absolute inset-0 z-10
                  opacity-0
                  transition-opacity duration-300
                  group-hover:opacity-100
                "
                style={{
                  background:
                    "radial-gradient(160px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.09), rgba(34,211,238,0.04) 40%, transparent 75%)",
                }}
              />

              <div className="relative z-20 flex h-full flex-col justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
                      AI Vision
                    </span>

                  </div>

                  <p className="mt-3 text-xl font-bold text-white">
                    Analysis
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Computer vision models processed the latest vehicle image.
                  </p>

                </div>

                <div className="mt-5">

                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    Detection Engine
                  </p>

                  <p className="mt-1 text-xs font-semibold text-emerald-400">
                    ● Online
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

      </DashboardPanel>

      {/* =====================================================
          RECENT INSPECTIONS
      ===================================================== */}

      <DashboardPanel title="Recent Inspections">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px] text-left">

            <thead>

              <tr className="border-b border-slate-800/80 text-[10px] uppercase tracking-[0.14em] text-slate-600">

                <th className="px-4 py-3">
                  Inspection
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
                    className="px-4 py-12 text-center"
                  >

                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

                    <p className="mt-3 text-xs text-slate-500">
                      Loading inspections...
                    </p>

                  </td>

                </tr>

              ) : inspections.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-4 py-12 text-center"
                  >

                    <Activity className="mx-auto h-8 w-8 text-slate-700" />

                    <p className="mt-3 text-xs text-slate-500">
                      No inspections stored yet.
                    </p>

                  </td>

                </tr>

              ) : (

                inspections
                  .slice(0, 10)
                  .map(
                    (inspection) => {

                      const status =
                        getInspectionStatus(
                          inspection
                        );

                      return (
                        <tr
                          key={
                            inspection.id
                          }
                          className="
                            group
                            border-b
                            border-slate-900/80
                            transition-all duration-300
                            hover:bg-cyan-400/[0.018]
                          "
                        >

                          {/* ID */}

                          <td className="px-4 py-4">

                            <span className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 transition group-hover:border-cyan-400/15 group-hover:text-cyan-300">
                              INS-
                              {String(
                                inspection.id
                              ).padStart(
                                5,
                                "0"
                              )}
                            </span>

                          </td>

                          {/* Image */}

                          <td className="px-4 py-4">

                            <p className="max-w-[180px] truncate text-xs text-slate-400">
                              {inspection.filename ||
                                "—"}
                            </p>

                          </td>

                          {/* Date */}

                          <td className="px-4 py-4 text-xs text-slate-500">
                            {formatDate(
                              inspection.created_at
                            )}
                          </td>

                          {/* Plate */}

                          <td className="px-4 py-4">

                            {inspection.number_plate_detected ? (

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/10 bg-cyan-400/[0.06] px-2.5 py-1 text-[10px] font-bold text-cyan-400">

                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.7)]" />

                                Detected

                              </span>

                            ) : (

                              <span className="inline-flex rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[10px] font-medium text-slate-500">
                                Not Detected
                              </span>

                            )}

                          </td>

                          {/* LED */}

                          <td className="px-4 py-4">

                            {inspection.led_detected ? (

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/10 bg-orange-400/[0.06] px-2.5 py-1 text-[10px] font-bold text-orange-400">

                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.7)]" />

                                Detected

                              </span>

                            ) : (

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2.5 py-1 text-[10px] font-medium text-emerald-400">

                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                                Clear

                              </span>

                            )}

                          </td>

                          {/* Status */}

                          <td className="px-4 py-4">

                            <span
                              className={`
                                inline-flex
                                items-center gap-1.5
                                text-[10px]
                                font-semibold
                                ${status.className}
                              `}
                            >

                              <span
                                className={`
                                  h-1.5 w-1.5
                                  rounded-full
                                  ${status.dot}
                                `}
                              />

                              {status.label}

                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )

              )}

            </tbody>

          </table>

        </div>

      </DashboardPanel>

      {/* =====================================================
          REFRESH
      ===================================================== */}

      <div className="flex items-center justify-between">

        <p className="text-[10px] uppercase tracking-[0.14em] text-slate-700">
          AI Vehicle Compliance • SQLite Data Engine
        </p>

        <button
          onClick={
            fetchInspections
          }
          disabled={loading}
          className="
            rounded-xl
            border border-cyan-400/10
            bg-cyan-400/[0.035]
            px-4 py-2.5
            text-xs font-semibold
            text-slate-400
            transition-all duration-300
            hover:border-cyan-400/25
            hover:bg-cyan-400/[0.07]
            hover:text-cyan-300
            hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
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

function AIVehicleCore({ isThinking = false, compact = false }) {
  return (
    <>
      <style>{`
        @keyframes aiCoreBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.72;
          }
          50% {
            transform: scale(1.06);
            opacity: 1;
          }
        }

        @keyframes aiCoreGlow {
          0%, 100% {
            opacity: 0.25;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.65;
            transform: scale(1.08);
          }
        }

        @keyframes aiRingOuter {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes aiRingInner {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes aiScan {
          0% {
            transform: translateY(-34px);
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(34px);
            opacity: 0;
          }
        }

        @keyframes aiParticleOne {
          0%, 100% {
            transform: rotate(0deg) translateX(42px) rotate(0deg);
            opacity: 0.25;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translateX(42px) rotate(-360deg);
            opacity: 0.25;
          }
        }

        @keyframes aiParticleTwo {
          0%, 100% {
            transform: rotate(180deg) translateX(38px) rotate(-180deg);
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: rotate(-180deg) translateX(38px) rotate(180deg);
            opacity: 0.3;
          }
        }

        @keyframes aiParticleThree {
          0%, 100% {
            transform: rotate(90deg) translateX(48px) rotate(-90deg);
            opacity: 0.2;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            transform: rotate(450deg) translateX(48px) rotate(-450deg);
            opacity: 0.2;
          }
        }

        @keyframes aiLedBlink {
          0%, 42%, 48%, 100% {
            opacity: 1;
          }
          45% {
            opacity: 0.15;
          }
        }

        @keyframes aiThinking {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes aiThinkingRing {
          from {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.08);
          }
          to {
            transform: rotate(360deg) scale(1);
          }
        }

        .ai-core-breath {
          animation: aiCoreBreath 3.4s ease-in-out infinite;
        }

        .ai-core-glow {
          animation: aiCoreGlow 3.4s ease-in-out infinite;
        }

        .ai-ring-outer {
          animation: aiRingOuter 18s linear infinite;
        }

        .ai-ring-inner {
          animation: aiRingInner 12s linear infinite;
        }

        .ai-scan {
          animation: aiScan 3.2s ease-in-out infinite;
        }

        .ai-particle-one {
          animation: aiParticleOne 7s linear infinite;
        }

        .ai-particle-two {
          animation: aiParticleTwo 9s linear infinite;
        }

        .ai-particle-three {
          animation: aiParticleThree 6s linear infinite;
        }

        .ai-led {
          animation: aiLedBlink 2.8s ease-in-out infinite;
        }

        .ai-thinking-core {
          animation: aiThinking 1.1s ease-in-out infinite;
        }

        .ai-thinking-ring {
          animation: aiThinkingRing 2.2s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-core-breath,
          .ai-core-glow,
          .ai-ring-outer,
          .ai-ring-inner,
          .ai-scan,
          .ai-particle-one,
          .ai-particle-two,
          .ai-particle-three,
          .ai-led,
          .ai-thinking-core,
          .ai-thinking-ring {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className={`relative mx-auto ${
          compact ? "h-16 w-16" : "h-32 w-32"
        }`}
      >
        {/* Large ambient glow */}
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl ${
            compact ? "h-14 w-14" : "h-28 w-28"
          } ${isThinking ? "ai-core-glow" : "ai-core-glow"}`}
        />

        {/* Outer technical ring */}
        <div
          className={`ai-ring-outer pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20 ${
            compact ? "h-[58px] w-[58px]" : "h-[116px] w-[116px]"
          }`}
        >
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.95)]" />
          <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan-400/70" />
        </div>

        {/* Inner technical ring */}
        <div
          className={`ai-ring-inner pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 ${
            compact ? "h-[46px] w-[46px]" : "h-[92px] w-[92px]"
          }`}
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-5 -translate-x-1/2 rounded-full bg-cyan-300/50 blur-[1px]" />
          <span className="absolute bottom-0 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full bg-cyan-400/30" />
        </div>

        {/* Orbiting particles */}
        <div className="pointer-events-none absolute inset-0">
          <span className="ai-particle-one absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.95)]" />

          <span className="ai-particle-two absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.9)]" />

          <span className="ai-particle-three absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
        </div>

        {/* Main glass core */}
        <div
          className={`ai-core-breath absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28%] border border-cyan-300/30 bg-slate-950/70 backdrop-blur-xl ${
            compact ? "h-12 w-12" : "h-20 w-20"
          } ${
            isThinking
              ? "ai-thinking-core border-cyan-300/60 shadow-[0_0_55px_rgba(34,211,238,0.42)]"
              : "shadow-[0_0_40px_rgba(34,211,238,0.18)]"
          }`}
        >
          {/* Inner glass highlight */}
          <div className="pointer-events-none absolute inset-[2px] rounded-[27%] border border-white/[0.06]" />

          {/* Scanning beam */}
          <div
            className={`ai-scan pointer-events-none absolute left-2 right-2 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent ${
              compact ? "top-1/2" : "top-1/2"
            }`}
          />

          {/* Robot */}
          <Bot
            className={`relative z-10 ${
              compact ? "h-6 w-6" : "h-10 w-10"
            } text-cyan-300 ${
              isThinking
                ? "drop-shadow-[0_0_14px_rgba(34,211,238,0.95)]"
                : "drop-shadow-[0_0_9px_rgba(34,211,238,0.65)]"
            }`}
          />

          {/* AI status LEDs */}
          <span
            className="ai-led absolute left-[24%] top-[23%] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_7px_rgba(103,232,249,1)]"
          />
          <span
            className="ai-led absolute right-[24%] top-[23%] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_7px_rgba(103,232,249,1)]"
            style={{ animationDelay: "0.35s" }}
          />
        </div>

        {/* Thinking energy pulse */}
        {isThinking && (
          <>
            <div className="ai-thinking-ring pointer-events-none absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />
          </>
        )}
      </div>
    </>
  );
}

function VehicleAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || isThinking) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setIsThinking(true);

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
    } finally {
      setIsThinking(false);
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
      {/* ========================================================= */}
      {/* WELCOME SCREEN                                           */}
      {/* ========================================================= */}

      {messages.length === 0 ? (
        <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">

          {/* Background AI atmosphere */}
          <div className="pointer-events-none absolute left-1/2 top-[30%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.035] blur-[100px]" />

          <div className="pointer-events-none absolute left-1/2 top-[30%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.035]" />

          <div className="relative z-10 w-full max-w-3xl text-center">

            {/* ================================================= */}
            {/* AI CORE                                           */}
            {/* ================================================= */}

            <div className="mb-7">
              <AIVehicleCore />
            </div>

            {/* AI Core status */}
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.035] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-300 backdrop-blur-xl">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              </span>

              AI Core Operational
            </div>

            {/* ================================================= */}
            {/* WELCOME                                            */}
            {/* ================================================= */}

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              AI Vehicle Assistant
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Welcome to your

              <span className="block bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
                AI Vehicle Bot
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Your intelligent vehicle compliance assistant.
              Ask questions about vehicle modifications, safety,
              inspections and compliance.
            </p>

            {/* Ollama status */}
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.035] px-3 py-1.5 text-[10px] font-medium text-emerald-400 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

              Qwen 2.5 3B • Ollama Online
            </div>

            {/* ================================================= */}
            {/* INPUT                                              */}
            {/* ================================================= */}

            <div className="mx-auto mt-10 max-w-2xl">
              <div className="group relative">

                {/* Input glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 blur-sm transition duration-500 group-focus-within:opacity-100" />

                <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-950/45 p-2 shadow-[0_15px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300 group-focus-within:border-cyan-400/30 group-focus-within:bg-slate-950/60">

                  {/* Glass highlight */}
                  <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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
                    disabled={isThinking}
                    className="relative z-10 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 disabled:cursor-wait"
                  />

                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isThinking}
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/90 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 hover:bg-cyan-300 hover:shadow-[0_0_28px_rgba(34,211,238,0.3)] disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    {isThinking ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* SUGGESTIONS                                        */}
            {/* ================================================= */}

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  disabled={isThinking}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-slate-950/25 px-3 py-2 text-[11px] text-slate-400 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-cyan-400/[0.045] hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="mr-1.5 text-cyan-400/60 transition-colors group-hover:text-cyan-300">
                    ◇
                  </span>

                  {suggestion}
                </button>
              ))}
            </div>

            {/* Tiny system indicator */}
            <div className="mt-8 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.2em] text-slate-700">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-slate-800" />

              Vehicle Intelligence Engine

              <span className="h-px w-10 bg-gradient-to-l from-transparent to-slate-800" />
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================= */
        /* CHAT SCREEN                                             */
        /* ======================================================= */

        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-5 flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                AI Assistant
              </p>

              <h1 className="mt-1 text-2xl font-bold text-white">
                Vehicle Compliance Assistant
              </h1>
            </div>

            {/* Compact live AI core */}
            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">
                <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                  AI Engine
                </p>

                <p
                  className={`text-[10px] ${
                    isThinking
                      ? "text-cyan-300"
                      : "text-emerald-400"
                  }`}
                >
                  {isThinking
                    ? "Processing..."
                    : "Operational"}
                </p>
              </div>

              <AIVehicleCore
                isThinking={isThinking}
                compact
              />
            </div>
          </div>

          {/* Chat messages */}
          <div className="min-h-[55vh] space-y-4 rounded-2xl border border-white/[0.06] bg-slate-950/35 p-5 backdrop-blur-xl">

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
                      ? "border border-cyan-400/10 bg-cyan-400/10 text-cyan-100"
                      : "border border-white/[0.06] bg-slate-900/60 text-slate-300 backdrop-blur-xl"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex items-center gap-3 text-xs text-slate-500">

                <div className="flex items-center gap-1 rounded-full border border-cyan-400/10 bg-cyan-400/[0.035] px-3 py-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>

                AI is analyzing your request...
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="mt-4 flex gap-3 rounded-2xl border border-white/[0.06] bg-slate-950/45 p-2 backdrop-blur-xl transition-all focus-within:border-cyan-400/25">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask about your vehicle..."
              disabled={isThinking}
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 disabled:cursor-wait"
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || isThinking}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-25"
            >
              {isThinking ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InspectionPipeline({ loading, completed }) {
  const stages = [
    {
      number: "01",
      title: "CAPTURE",
      subtitle: "Vehicle image",
      icon: ScanSearch,
    },
    {
      number: "02",
      title: "DETECT",
      subtitle: "AI vision",
      icon: Activity,
    },
    {
      number: "03",
      title: "ANALYZE",
      subtitle: "Compliance scan",
      icon: Bot,
    },
    {
      number: "04",
      title: "RESULT",
      subtitle: "Inspection",
      icon: ShieldCheck,
    },
  ];

  return (
    <>
      <style>{`
        @keyframes inspectionEnergy {
          0% {
            left: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes inspectionPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(34,211,238,0);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 24px rgba(34,211,238,0.25);
          }
        }

        @keyframes inspectionCore {
          0%, 100% {
            opacity: 0.35;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes inspectionScan {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        .inspection-energy {
          animation: inspectionEnergy 1.8s linear infinite;
        }

        .inspection-pulse {
          animation: inspectionPulse 1.6s ease-in-out infinite;
        }

        .inspection-core {
          animation: inspectionCore 1.4s ease-in-out infinite;
        }

        .inspection-scan {
          animation: inspectionScan 2.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .inspection-energy,
          .inspection-pulse,
          .inspection-core,
          .inspection-scan {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950/35 px-5 py-5 backdrop-blur-xl">

        {/* Top glass highlight */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              AI Vision Pipeline
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {loading
                ? "Live vehicle analysis in progress"
                : completed
                  ? "Inspection pipeline completed"
                  : "Ready for vehicle analysis"}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.03] px-3 py-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                loading
                  ? "bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                  : completed
                    ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                    : "bg-slate-600"
              }`}
            />

            <span className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
              {loading
                ? "Processing"
                : completed
                  ? "Complete"
                  : "Standby"}
            </span>
          </div>
        </div>

        {/* Pipeline */}
        <div className="relative">

          {/* Connecting line */}
          <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-slate-800 sm:block" />

          {/* Animated energy line */}
          {loading && (
            <div className="absolute left-[12%] right-[12%] top-7 hidden overflow-hidden sm:block">
              <div className="relative h-px">
                <div className="inspection-energy absolute top-[-1px] h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
              </div>
            </div>
          )}

          {/* Completed line */}
          {completed && (
            <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-emerald-400/30 via-cyan-400/40 to-emerald-400/30 sm:block" />
          )}

          <div className="relative grid grid-cols-2 gap-5 sm:grid-cols-4">

            {stages.map((stage, index) => {
              const Icon = stage.icon;

              const active =
                loading || completed;

              const done = completed;

              return (
                <div
                  key={stage.number}
                  className="relative flex flex-col items-center text-center"
                >

                  {/* Node */}
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border backdrop-blur-xl transition-all duration-500 ${
                      done
                        ? "border-emerald-400/30 bg-emerald-400/[0.06] shadow-[0_0_25px_rgba(52,211,153,0.08)]"
                        : active
                          ? "border-cyan-400/30 bg-cyan-400/[0.05] shadow-[0_0_25px_rgba(34,211,238,0.10)]"
                          : "border-white/[0.06] bg-slate-900/40"
                    } ${
                      loading ? "inspection-pulse" : ""
                    }`}
                  >
                    {/* Inner ring */}
                    <div className="pointer-events-none absolute inset-1 rounded-xl border border-white/[0.04]" />

                    <Icon
                      className={`relative z-10 h-5 w-5 ${
                        done
                          ? "text-emerald-400"
                          : active
                            ? "text-cyan-300"
                            : "text-slate-600"
                      }`}
                    />

                    {/* Stage number */}
                    <span className="absolute -right-1 -top-1 rounded-md border border-slate-800 bg-slate-950 px-1.5 py-0.5 text-[7px] font-bold text-slate-500">
                      {stage.number}
                    </span>
                  </div>

                  <p
                    className={`mt-3 text-[10px] font-bold tracking-[0.18em] ${
                      done
                        ? "text-emerald-400"
                        : active
                          ? "text-cyan-300"
                          : "text-slate-600"
                    }`}
                  >
                    {stage.title}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-600">
                    {stage.subtitle}
                  </p>

                  {/* Active indicator */}
                  {loading && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="inspection-core h-1 w-1 rounded-full bg-cyan-400" />
                      <span
                        className="inspection-core h-1 w-1 rounded-full bg-cyan-400"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="inspection-core h-1 w-1 rounded-full bg-cyan-400"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  )}

                  {done && (
                    <p className="mt-2 text-[8px] uppercase tracking-wider text-emerald-500/70">
                      Verified
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Moving scan bar */}
        {loading && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px overflow-hidden bg-slate-900">
            <div className="inspection-scan h-px w-1/3 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          </div>
        )}
      </div>
    </>
  );
}

function AIInspection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "http://127.0.0.1:8000";

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
        `${API_BASE}/api/inspection/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Vehicle analysis failed."
        );
      }

      if (!data.success) {
        throw new Error(
          data.error ||
            "Vehicle analysis failed."
        );
      }

      console.log("Inspection API response:", data);

      // Keep the backend-generated FINAL combined image URL.
      // GREEN = number plate, RED = LED light bar.
      setResult({
        ...(data.result || {}),
        annotated_image_url:
          data.annotated_image_url ||
          data.result?.annotated_image_url ||
          null,
      });
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

  /* ============================================================
     NUMBER PLATE
     ============================================================ */

  const numberPlate = result?.number_plate || {};

  const plateDetections = Array.isArray(
    numberPlate?.detections
  )
    ? numberPlate.detections
    : [];

  const bestPlate =
    numberPlate?.best_detection ||
    (plateDetections.length > 0
      ? plateDetections.reduce((best, current) =>
          Number(current?.confidence || 0) >
          Number(best?.confidence || 0)
            ? current
            : best
        )
      : null);

  const plateStatus =
    numberPlate?.status ||
    (bestPlate ? "Detected" : "Not Detected");

  /* ============================================================
     LED
     ============================================================ */

  const ledRaw = result?.led_light;

  const ledObjects = Array.isArray(ledRaw)
    ? ledRaw
    : ledRaw
      ? [ledRaw]
      : [];

  const ledPredictions = ledObjects.flatMap((item) => {
    if (
      Array.isArray(
        item?.predictions?.predictions
      )
    ) {
      return item.predictions.predictions;
    }

    if (Array.isArray(item?.predictions)) {
      return item.predictions;
    }

    if (Array.isArray(item?.detections)) {
      return item.detections;
    }

    if (
      item?.class ||
      item?.name ||
      item?.label
    ) {
      return [item];
    }

    return [];
  });

  const bestLed =
    ledPredictions.length > 0
      ? ledPredictions.reduce((best, current) =>
          Number(current?.confidence || 0) >
          Number(best?.confidence || 0)
            ? current
            : best
        )
      : null;

  const ledDetectedFromResult =
    typeof ledRaw?.detected === "boolean"
      ? ledRaw.detected
      : typeof ledRaw?.status === "string"
        ? ledRaw.status
            .toLowerCase()
            .includes("detect")
        : null;

  const ledDetected =
    ledDetectedFromResult !== null
      ? ledDetectedFromResult
      : ledPredictions.length > 0;

  const ledClass =
    bestLed?.class ||
    bestLed?.name ||
    bestLed?.label ||
    "LED Light";

  const ledConfidence = Number(
    bestLed?.confidence ||
      bestLed?.score ||
      ledRaw?.confidence ||
      0
  );

  /* ============================================================
     ANNOTATED IMAGE
     ============================================================ */

  /* ============================================================
     FINAL COMBINED ANNOTATED IMAGE

     The backend creates ONE image from the original upload:
       GREEN = Number Plate
       RED   = LED Light Bar

     Do NOT use numberPlate.annotated_image here because that
     is the old number-plate-only annotation.
     ============================================================ */

  const annotatedImageUrl =
    result?.annotated_image_url ||
    null;

  return (
    <div className="space-y-6">

      {/* ====================================================== */}
      {/* HEADER                                                  */}
      {/* ====================================================== */}

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-slate-950/25 px-6 py-5 backdrop-blur-xl">

        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/15 to-transparent" />

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400">
              Computer Vision
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              AI Vehicle Inspection
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Detect number plate regions and vehicle modifications using AI vision.
            </p>
          </div>

          {/* Live AI status */}
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/[0.06] bg-slate-950/40 px-4 py-3 backdrop-blur-xl">

            <div
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl border ${
                loading
                  ? "border-cyan-400/30 bg-cyan-400/[0.06]"
                  : result
                    ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                    : "border-slate-800 bg-slate-900/40"
              }`}
            >
              <Activity
                className={`h-4 w-4 ${
                  loading
                    ? "text-cyan-300"
                    : result
                      ? "text-emerald-400"
                      : "text-slate-600"
                }`}
              />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                Vision Engine
              </p>

              <p
                className={`mt-0.5 text-xs font-medium ${
                  loading
                    ? "text-cyan-300"
                    : result
                      ? "text-emerald-400"
                      : "text-slate-400"
                }`}
              >
                {loading
                  ? "Processing"
                  : result
                    ? "Inspection Complete"
                    : "Ready"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* LIVE PIPELINE                                           */}
      {/* ====================================================== */}

      <InspectionPipeline
        loading={loading}
        completed={!!result && !loading}
      />

      {/* ====================================================== */}
      {/* ERROR                                                   */}
      {/* ====================================================== */}

      {error && (
        <div className="relative overflow-hidden rounded-2xl border border-red-400/15 bg-red-500/[0.035] p-4 backdrop-blur-xl">

          <div className="flex items-start gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-400/15 bg-red-400/[0.05]">
              <Activity className="h-4 w-4 text-red-400" />
            </div>

            <div>
              <p className="text-xs font-semibold text-red-400">
                Inspection Error
              </p>

              <p className="mt-1 text-xs leading-5 text-red-300/70">
                {error}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* MAIN AREA                                               */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">

        {/* ==================================================== */}
        {/* LEFT — VEHICLE IMAGE                                 */}
        {/* ==================================================== */}

        <section className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950/35 p-5 backdrop-blur-xl">

          {/* Glass highlight */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Cursor-like glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.025] blur-3xl transition-opacity duration-500 group-hover:bg-cyan-400/[0.05]" />

          <div className="relative z-10 mb-4">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Vehicle Image
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  JPG, PNG or WEBP
                </p>
              </div>

              <div className="rounded-lg border border-white/[0.05] bg-slate-900/40 px-2.5 py-1.5">
                <span className="text-[8px] uppercase tracking-[0.16em] text-slate-600">
                  Input
                </span>
              </div>

            </div>
          </div>

          {!preview ? (
            <label className="group/upload relative flex min-h-[400px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-800 bg-slate-950/35 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.02]">

              {/* Moving glass sweep */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/upload:opacity-100">
                <div className="absolute inset-y-0 left-[-30%] w-[30%] skew-x-[-15deg] bg-gradient-to-r from-transparent via-white/[0.035] to-transparent transition-transform duration-1000 group-hover/upload:translate-x-[430%]" />
              </div>

              {/* Upload core */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] shadow-[0_0_35px_rgba(34,211,238,0.08)] transition-all duration-300 group-hover/upload:border-cyan-400/35 group-hover/upload:bg-cyan-400/[0.07] group-hover/upload:shadow-[0_0_45px_rgba(34,211,238,0.14)]">

                <div className="absolute inset-1 rounded-[22px] border border-white/[0.04]" />

                <ScanSearch className="relative h-8 w-8 text-cyan-400/80 transition-transform duration-300 group-hover/upload:scale-110 group-hover/upload:text-cyan-300" />
              </div>

              <h3 className="mt-6 text-sm font-semibold text-white">
                Upload Vehicle Image
              </h3>

              <p className="mt-2 text-xs text-slate-600">
                Select a clear image of the vehicle
              </p>

              <span className="mt-5 rounded-xl border border-white/[0.07] bg-slate-900/60 px-4 py-2.5 text-xs font-medium text-slate-400 backdrop-blur-xl transition-all duration-300 group-hover/upload:border-cyan-400/25 group-hover/upload:text-cyan-300">
                Choose Image
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="absolute bottom-4 text-[8px] uppercase tracking-[0.2em] text-slate-800">
                AI Vision Input
              </div>
            </label>
          ) : (
            <div>

              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black">

                <img
                  src={preview}
                  alt="Vehicle preview"
                  className="max-h-[500px] w-full object-contain"
                />

                {/* Image glass overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[0.02]" />

                {/* Scanning effect during analysis */}
                {loading && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 right-0 top-0 h-px bg-cyan-300/80 shadow-[0_0_15px_rgba(34,211,238,0.9)] animate-[scan_2s_linear_infinite]" />
                  </div>
                )}

                {/* Status */}
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-slate-950/70 px-3 py-2 backdrop-blur-xl">

                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      loading
                        ? "animate-pulse bg-cyan-300"
                        : "bg-emerald-400"
                    }`}
                  />

                  <span className="text-[8px] uppercase tracking-[0.16em] text-slate-300">
                    {loading
                      ? "AI Scanning"
                      : "Image Loaded"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-3">

                <label className="cursor-pointer rounded-xl border border-white/[0.07] bg-slate-900/50 px-4 py-2.5 text-xs font-medium text-slate-400 backdrop-blur-xl transition hover:border-cyan-400/25 hover:text-cyan-300">
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
                  className="group flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/90 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-all duration-300 hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ScanSearch className={`h-4 w-4 ${loading ? "animate-pulse" : ""}`} />

                  {loading
                    ? "AI Analyzing..."
                    : "Analyze Vehicle"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ==================================================== */}
        {/* RIGHT — RESULTS                                      */}
        {/* ==================================================== */}

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950/35 p-5 backdrop-blur-xl">

          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative z-10 mb-5">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Inspection Result
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  AI vehicle detection analysis
                </p>
              </div>

              {result && !loading && (
                <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.035] px-3 py-1.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                  <span className="text-[8px] uppercase tracking-[0.15em] text-emerald-400">
                    Complete
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ================================================= */}
          {/* EMPTY STATE                                       */}
          {/* ================================================= */}

          {!result && !error && !loading && (
            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-800 bg-slate-950/30">

              <div className="absolute h-48 w-48 rounded-full bg-cyan-400/[0.025] blur-3xl" />

              <div className="relative text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025]">
                  <ShieldCheck className="h-8 w-8 text-cyan-400/35" />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-400">
                  Waiting for inspection
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-700">
                  Upload a vehicle image and start the AI analysis.
                </p>

                <div className="mt-5 flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-slate-800" />
                  <span className="text-[8px] uppercase tracking-[0.2em] text-slate-700">
                    Vision Ready
                  </span>
                  <span className="h-px w-8 bg-slate-800" />
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* LOADING STATE                                     */}
          {/* ================================================= */}

          {loading && (
            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.015]">

              <div className="absolute h-52 w-52 rounded-full bg-cyan-400/[0.035] blur-3xl" />

              <div className="relative text-center">

                {/* AI scanning core */}
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-slate-950/70 shadow-[0_0_45px_rgba(34,211,238,0.12)]">

                  <div className="absolute inset-1 rounded-[22px] border border-white/[0.04]" />

                  <div className="absolute inset-3 rounded-2xl border border-cyan-400/10 animate-ping" />

                  <Bot className="relative z-10 h-9 w-9 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                </div>

                <p className="mt-5 text-sm font-semibold text-cyan-300">
                  AI is analyzing the vehicle
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Detecting number plate regions and LED lights
                </p>

                <div className="mx-auto mt-5 flex items-center justify-center gap-1.5">

                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />

                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"
                    style={{ animationDelay: "120ms" }}
                  />

                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"
                    style={{ animationDelay: "240ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* RESULT                                            */}
          {/* ================================================= */}

          {result && !loading && (
            <div className="space-y-4">

              {/* AI annotated image */}
              {annotatedImageUrl && (
                <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-black">

                  <div className="flex items-center justify-between border-b border-white/[0.06] bg-slate-950/70 px-4 py-3 backdrop-blur-xl">

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                        AI Detection View
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Detected vehicle regions
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[8px] uppercase tracking-wider text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      AI Processed
                    </div>
                  </div>

                  <img
                    src={annotatedImageUrl}
                    alt="AI detected vehicle regions"
                    className="max-h-[420px] w-full object-contain"
                  />
                </div>
              )}

              {/* Number plate */}
              <div
                className={`rounded-2xl border p-4 backdrop-blur-xl ${
                  plateStatus === "Detected"
                    ? "border-emerald-400/15 bg-emerald-400/[0.025]"
                    : "border-orange-400/15 bg-orange-400/[0.025]"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                      Number Plate
                    </p>

                    <p
                      className={`mt-1 text-lg font-bold ${
                        plateStatus === "Detected"
                          ? "text-emerald-400"
                          : "text-orange-400"
                      }`}
                    >
                      {plateStatus}
                    </p>
                  </div>

                  {plateStatus === "Detected" ? (
                    <ShieldCheck className="h-7 w-7 text-emerald-400/80" />
                  ) : (
                    <Activity className="h-7 w-7 text-orange-400/80" />
                  )}
                </div>

                {bestPlate && (
                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-xl border border-white/[0.05] bg-slate-950/40 p-3">
                      <p className="text-[9px] uppercase tracking-wider text-slate-700">
                        Detection Class
                      </p>

                      <p className="mt-1 text-xs font-semibold text-white">
                        {bestPlate.class || "number_plate"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.05] bg-slate-950/40 p-3">
                      <p className="text-[9px] uppercase tracking-wider text-slate-700">
                        AI Confidence
                      </p>

                      <p className="mt-1 text-xs font-semibold text-cyan-400">
                        {(Number(bestPlate.confidence || 0) * 100).toFixed(1)}%
                      </p>
                    </div>

                  </div>
                )}
              </div>

              {/* LED */}
              <div
                className={`rounded-2xl border p-4 backdrop-blur-xl ${
                  ledDetected
                    ? "border-orange-400/15 bg-orange-400/[0.025]"
                    : "border-emerald-400/15 bg-emerald-400/[0.025]"
                }`}
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                      LED Bar Light Detection
                    </p>

                    <p
                      className={`mt-1 text-lg font-bold ${
                        ledDetected
                          ? "text-orange-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {ledDetected
                        ? "LED Bar Light Detected"
                        : "No LED Light Bar Detected"}
                    </p>

                    {ledDetected && (
                      <p className="mt-1 text-xs text-slate-600">
                        Class: {ledClass}
                      </p>
                    )}
                  </div>

                  {ledDetected ? (
                    <Activity className="h-7 w-7 shrink-0 text-orange-400/80" />
                  ) : (
                    <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-400/80" />
                  )}
                </div>

                {ledDetected && (
                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-xl border border-white/[0.05] bg-slate-950/40 p-3">

                      <p className="text-[9px] uppercase tracking-wider text-slate-700">
                        Confidence
                      </p>

                      <p className="mt-1 text-xs font-semibold text-orange-400">
                        {(ledConfidence * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.05] bg-slate-950/40 p-3">

                      <p className="text-[9px] uppercase tracking-wider text-slate-700">
                        Detected Class
                      </p>

                      <p className="mt-1 text-xs font-semibold text-white">
                        {ledClass}
                      </p>
                    </div>

                  </div>
                )}
              </div>

              {/* API message */}
              {(numberPlate?.message || result?.message) && (
                <div className="rounded-xl border border-white/[0.05] bg-slate-950/30 p-4">
                  <p className="text-xs leading-5 text-slate-500">
                    {numberPlate?.message || result?.message}
                  </p>
                </div>
              )}

              {/* Completion */}
              <div className="flex items-center justify-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.02] py-3">

                <ShieldCheck className="h-4 w-4 text-emerald-400" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
                  AI Inspection Completed
                </p>

              </div>
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
  const [selectedInspection, setSelectedInspection] = useState(null);

  const API_BASE = "http://127.0.0.1:8000";

  useEffect(() => {
    const loadInspections = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/inspections`
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
  // Image URLs
  // -------------------------------------------------------

  const getOriginalImageUrl = (inspection) => {
    if (!inspection?.filename) return null;

    return `${API_BASE}/api/inspection/original/${encodeURIComponent(
      inspection.filename
    )}`;
  };

  const getAnnotatedImageUrl = (inspection) => {
    if (!inspection?.annotated_image) return null;

    return `${API_BASE}/inspection-results/${encodeURIComponent(
      inspection.annotated_image
    )}`;
  };

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
  // Selected inspection
  // -------------------------------------------------------

  const selectedOriginalUrl =
    selectedInspection
      ? getOriginalImageUrl(selectedInspection)
      : null;

  const selectedAnnotatedUrl =
    selectedInspection
      ? getAnnotatedImageUrl(selectedInspection)
      : null;

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
          Click any inspection to view the vehicle before and after AI analysis.
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
                    onClick={() =>
                      setSelectedInspection(
                        inspection
                      )
                    }
                    className="cursor-pointer border-b border-slate-900 transition hover:bg-cyan-400/[0.035]"
                    title="Click to view before and after images"
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

      {/* =====================================================
          INSPECTION IMAGE MODAL
          ===================================================== */}

      {selectedInspection && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          onClick={() =>
            setSelectedInspection(null)
          }
        >
          <div
            className="relative max-h-[94vh] w-full max-w-7xl overflow-y-auto rounded-3xl border border-cyan-400/15 bg-[#07101d]/95 p-5 shadow-[0_0_80px_rgba(34,211,238,0.08)] backdrop-blur-2xl sm:p-7"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Top gloss */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400">
                  Vehicle Inspection
                </p>

                <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  INS-
                  {String(
                    selectedInspection.id
                  ).padStart(5, "0")}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedInspection.created_at
                    ? new Date(
                        selectedInspection.created_at
                      ).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Inspection date unavailable"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedInspection(null)
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-xl text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-white"
                aria-label="Close inspection"
              >
                ×
              </button>
            </div>

            {/* Before / After */}
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* BEFORE */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-black/30">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Before AI Analysis
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      Original Vehicle Image
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[9px] uppercase tracking-wider text-slate-500">
                    INPUT
                  </span>
                </div>

                <div className="flex min-h-[280px] items-center justify-center bg-black p-3 sm:min-h-[380px]">
                  {selectedOriginalUrl ? (
                    <img
                      src={selectedOriginalUrl}
                      alt="Original vehicle before AI analysis"
                      className="max-h-[520px] w-full object-contain"
                    />
                  ) : (
                    <p className="text-xs text-slate-600">
                      Original image unavailable
                    </p>
                  )}
                </div>
              </div>

              {/* AFTER */}
              <div className="overflow-hidden rounded-2xl border border-cyan-400/10 bg-black/30">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                      After AI Analysis
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      Detected Vehicle Regions
                    </p>
                  </div>

                  <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-2.5 py-1 text-[9px] uppercase tracking-wider text-cyan-400">
                    AI RESULT
                  </span>
                </div>

                <div className="flex min-h-[280px] items-center justify-center bg-black p-3 sm:min-h-[380px]">
                  {selectedAnnotatedUrl ? (
                    <img
                      src={selectedAnnotatedUrl}
                      alt="Vehicle after AI analysis with detection bounding boxes"
                      className="max-h-[520px] w-full object-contain"
                    />
                  ) : (
                    <p className="text-xs text-slate-600">
                      Annotated image unavailable
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Detection summary */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Number Plate
                </p>

                <p
                  className={`mt-1 text-base font-bold ${
                    selectedInspection.number_plate_detected
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }`}
                >
                  {selectedInspection.number_plate_detected
                    ? "Detected"
                    : "Not Detected"}
                </p>

                {selectedInspection.number_plate_detected && (
                  <p className="mt-1 text-xs text-cyan-400">
                    Confidence:{" "}
                    {(
                      Number(
                        selectedInspection.number_plate_confidence || 0
                      ) * 100
                    ).toFixed(1)}
                    %
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.025] p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  LED Light Bar
                </p>

                <p
                  className={`mt-1 text-base font-bold ${
                    selectedInspection.led_detected
                      ? "text-orange-400"
                      : "text-slate-500"
                  }`}
                >
                  {selectedInspection.led_detected
                    ? "Detected"
                    : "Not Detected"}
                </p>

                {selectedInspection.led_detected && (
                  <p className="mt-1 text-xs text-orange-400">
                    Confidence:{" "}
                    {(
                      Number(
                        selectedInspection.led_confidence || 0
                      ) * 100
                    ).toFixed(1)}
                    %
                  </p>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
              <span className="text-[9px] uppercase tracking-[0.16em] text-slate-600">
                Detection Legend
              </span>

              <span className="inline-flex items-center gap-2 text-[10px] text-slate-400">
                <span className="h-2 w-2 rounded-sm bg-emerald-400" />
                Number Plate
              </span>

              <span className="inline-flex items-center gap-2 text-[10px] text-slate-400">
                <span className="h-2 w-2 rounded-sm bg-red-500" />
                LED Light Bar
              </span>
            </div>
          </div>
        </div>
      )}
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
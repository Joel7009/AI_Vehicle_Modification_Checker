import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CarFront,
  CheckCircle2,
  Cpu,
  Crosshair,
  Gauge,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

function HowItWorksSection() {
    const [activeStep, setActiveStep] = useState(0);
  
    const steps = [
      {
        number: "01",
        title: "CAPTURE",
        subtitle: "IMAGE INPUT",
        description:
          "Vehicle image received by the AI inspection system.",
        icon: ScanLine,
      },
      {
        number: "02",
        title: "DETECT",
        subtitle: "COMPUTER VISION",
        description:
          "AI identifies the vehicle and visible components.",
        icon: Crosshair,
      },
      {
        number: "03",
        title: "ANALYZE",
        subtitle: "AI PROCESSING",
        description:
          "Detected components are analyzed for modifications.",
        icon: Sparkles,
      },
      {
        number: "04",
        title: "INSPECT",
        subtitle: "INSPECTION RESULT",
        description:
          "Inspection information is prepared for review.",
        icon: ShieldCheck,
      },
    ];
  
    useEffect(() => {
      const timer = setInterval(() => {
        setActiveStep((current) => (current + 1) % steps.length);
      }, 2600);
  
      return () => clearInterval(timer);
    }, []);
  
    return (
      <section
        id="how-it-works"
        className="relative overflow-hidden border-t border-white/[0.04] bg-[#02050b] px-5 py-28 sm:px-8 lg:px-16"
      >
        {/* Background */}
  
        <div className="pointer-events-none absolute inset-0">
  
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.7) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
  
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.035] blur-[150px]" />
  
        </div>
  
  
        <div className="relative z-10 mx-auto max-w-7xl">
  
          {/* Heading */}
  
          <div className="mx-auto max-w-3xl text-center">
  
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.035] px-3 py-1.5 backdrop-blur-xl">
  
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
  
              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                AI Inspection Pipeline
              </span>
  
            </div>
  
  
            <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
  
              HOW{" "}
  
              <span className="pipeline-gradient">
                AI-VISION
              </span>{" "}
  
              SEES
  
              <br />
  
              YOUR VEHICLE
  
            </h2>
  
  
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-500">
              From image capture to intelligent inspection, every stage
              moves through the AI-VISION processing pipeline.
            </p>
  
          </div>
  
  
          {/* Pipeline */}
  
          <div className="relative mt-20">
  
            {/* Desktop line */}
  
            <div className="absolute left-[12.5%] right-[12.5%] top-[62px] hidden h-px bg-white/[0.07] lg:block" />
  
  
            {/* Animated energy line */}
  
            <div
              className="absolute left-[12.5%] top-[62px] hidden h-px w-[75%] bg-gradient-to-r from-transparent via-cyan-400 to-transparent lg:block"
              style={{
                animation: "pipelineEnergy 3s linear infinite",
              }}
            />
  
  
            {/* Moving particle */}
  
            <div
              className="absolute top-[58px] hidden h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_5px_rgba(34,211,238,0.4)] lg:block"
              style={{
                animation: "pipelineParticle 4s linear infinite",
              }}
            />
  
  
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
  
              {steps.map((step, index) => {
                const Icon = step.icon;
                const active = activeStep === index;
                const completed = index < activeStep;
  
                return (
                  <div key={step.number} className="relative">
  
                    {/* Connector */}
  
                    <div
                      className={`absolute left-1/2 top-[47px] z-20 hidden h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border lg:flex ${
                        active
                          ? "border-cyan-300/50 bg-[#02050b] shadow-[0_0_30px_rgba(34,211,238,0.25)]"
                          : "border-white/[0.08] bg-[#050914]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full transition-all duration-500 ${
                          active
                            ? "bg-cyan-300 shadow-[0_0_14px_4px_rgba(34,211,238,0.45)]"
                            : "bg-slate-700"
                        }`}
                      />
                    </div>
  
  
                    {/* Card */}
  
                    <div
                      className={`relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-700 ${
                        active
                          ? "border-cyan-400/30 bg-cyan-400/[0.045] shadow-[0_0_55px_rgba(34,211,238,0.08)] -translate-y-1"
                          : "border-white/[0.06] bg-white/[0.018]"
                      }`}
                    >
  
                      {/* Light sweep */}
  
                      {active && (
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(110deg, transparent 20%, rgba(34,211,238,0.09) 50%, transparent 80%)",
                            backgroundSize: "200% 100%",
                            animation: "pipelineSweep 2s linear infinite",
                          }}
                        />
                      )}
  
  
                      <div className="relative flex items-start justify-between">
  
                        <span
                          className={`font-mono text-[11px] font-bold tracking-[0.2em] ${
                            active
                              ? "text-cyan-300"
                              : completed
                              ? "text-cyan-400/40"
                              : "text-slate-700"
                          }`}
                        >
                          {step.number}
                        </span>
  
  
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-700 ${
                            active
                              ? "border-cyan-400/30 bg-cyan-400/[0.08] shadow-[0_0_25px_rgba(34,211,238,0.15)]"
                              : "border-white/[0.06] bg-white/[0.02]"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              active
                                ? "text-cyan-300"
                                : "text-slate-700"
                            }`}
                          />
                        </div>
  
                      </div>
  
  
                      <div className="relative mt-8">
  
                        <h3
                          className={`text-lg font-black tracking-[0.1em] ${
                            active
                              ? "text-white"
                              : "text-slate-500"
                          }`}
                        >
                          {step.title}
                        </h3>
  
                        <p
                          className={`mt-1 text-[8px] font-bold tracking-[0.2em] ${
                            active
                              ? "text-cyan-400"
                              : "text-slate-700"
                          }`}
                        >
                          {step.subtitle}
                        </p>
  
                      </div>
  
  
                      <p
                        className={`relative mt-5 min-h-[45px] text-[11px] leading-5 ${
                          active
                            ? "text-slate-400"
                            : "text-slate-700"
                        }`}
                      >
                        {step.description}
                      </p>
  
  
                      {/* Progress */}
  
                      <div className="relative mt-6 h-[2px] overflow-hidden rounded-full bg-white/[0.05]">
  
                        <div
                          className={`h-full transition-all duration-700 ${
                            active
                              ? "w-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                              : completed
                              ? "w-full bg-cyan-400/20"
                              : "w-0"
                          }`}
                        />
  
                      </div>
  
  
                      <div className="relative mt-4 flex items-center justify-between">
  
                        <span
                          className={`text-[7px] font-bold uppercase tracking-[0.18em] ${
                            active
                              ? "text-cyan-400"
                              : completed
                              ? "text-slate-600"
                              : "text-slate-800"
                          }`}
                        >
                          {active
                            ? "PROCESSING"
                            : completed
                            ? "COMPLETE"
                            : "STANDBY"}
                        </span>
  
  
                        <div className="flex gap-1">
  
                          {[0, 1, 2].map((dot) => (
                            <span
                              key={dot}
                              className={`h-1 w-1 rounded-full ${
                                active
                                  ? "bg-cyan-400"
                                  : "bg-slate-800"
                              }`}
                              style={
                                active
                                  ? {
                                      animation:
                                        `pipelineDot 1.2s ease-in-out ${
                                          dot * 0.15
                                        }s infinite`,
                                    }
                                  : undefined
                              }
                            />
                          ))}
  
                        </div>
  
                      </div>
  
                    </div>
  
                  </div>
                );
              })}
  
            </div>
  
          </div>
  
  
          {/* Live engine bar */}
  
          <div className="mx-auto mt-12 max-w-4xl">
  
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4 backdrop-blur-xl">
  
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  
                <div className="flex items-center gap-3">
  
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05]">
  
                    <Activity className="h-4 w-4 text-cyan-400" />
  
                    <span className="absolute inset-0 animate-ping rounded-xl border border-cyan-400/10" />
  
                  </div>
  
                  <div>
  
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white">
                      AI-VISION ENGINE
                    </p>
  
                    <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-slate-700">
                      {steps[activeStep].title} MODULE ACTIVE
                    </p>
  
                  </div>
  
                </div>
  
  
                {/* Waveform */}
  
                <div className="flex h-6 items-center gap-1">
  
                  {Array.from({ length: 22 }).map((_, index) => (
                    <span
                      key={index}
                      className="w-[2px] rounded-full bg-cyan-400/50"
                      style={{
                        height: `${5 + ((index * 7) % 18)}px`,
                        animation:
                          `pipelineWave 1s ease-in-out ${
                            index * 0.04
                          }s infinite alternate`,
                      }}
                    />
                  ))}
  
                </div>
  
  
                <div className="flex items-center gap-2">
  
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
  
                  <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                    SYSTEM ACTIVE
                  </span>
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
  
        <style>{`
  
          .pipeline-gradient {
            color: transparent;
            background: linear-gradient(
              110deg,
              #67e8f9,
              #22d3ee,
              #60a5fa,
              #a78bfa,
              #22d3ee,
              #67e8f9
            );
            background-size: 300% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: pipelineGradient 6s linear infinite;
            filter: drop-shadow(0 0 10px rgba(34,211,238,0.16));
          }
  
          @keyframes pipelineGradient {
            0% {
              background-position: 0% 50%;
            }
  
            50% {
              background-position: 100% 50%;
            }
  
            100% {
              background-position: 0% 50%;
            }
          }
  
          @keyframes pipelineEnergy {
            0% {
              transform: scaleX(0);
              transform-origin: left;
              opacity: 0;
            }
  
            15% {
              opacity: 1;
            }
  
            50% {
              transform: scaleX(1);
              opacity: 1;
            }
  
            85% {
              opacity: 1;
            }
  
            100% {
              transform: scaleX(0);
              transform-origin: right;
              opacity: 0;
            }
          }
  
          @keyframes pipelineParticle {
            0% {
              left: 12.5%;
              opacity: 0;
            }
  
            10% {
              opacity: 1;
            }
  
            90% {
              opacity: 1;
            }
  
            100% {
              left: 87.5%;
              opacity: 0;
            }
          }
  
          @keyframes pipelineSweep {
            0% {
              background-position: 200% 0;
            }
  
            100% {
              background-position: -50% 0;
            }
          }
  
          @keyframes pipelineDot {
            0%,
            100% {
              opacity: 0.25;
              transform: scale(0.8);
            }
  
            50% {
              opacity: 1;
              transform: scale(1.4);
            }
          }
  
          @keyframes pipelineWave {
            from {
              transform: scaleY(0.35);
              opacity: 0.3;
            }
  
            to {
              transform: scaleY(1);
              opacity: 0.9;
            }
          }
  
          @media (prefers-reduced-motion: reduce) {
            .pipeline-gradient {
              animation: none;
            }
          }
  
        `}</style>
      </section>
    );
  }

function LandingPage({ onInspect }) {
  const [stage, setStage] = useState(0);
  const [lights, setLights] = useState(true);

  // ---------------------------------------------------------
  // Inspection animation
  // ---------------------------------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((current) => (current + 1) % 4);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  // ---------------------------------------------------------
  // Police light animation
  // ---------------------------------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setLights((current) => !current);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const stages = [
    {
      title: "VEHICLE DETECTED",
      subtitle: "AI vision system initialized",
      icon: CarFront,
    },
    {
      title: "NUMBER PLATE SCAN",
      subtitle: "Vehicle identification region detected",
      icon: ScanLine,
    },
    {
      title: "LED LIGHT ANALYSIS",
      subtitle: "Checking exterior modifications",
      icon: Activity,
    },
    {
      title: "COMPLIANCE ANALYSIS",
      subtitle: "Preparing inspection results",
      icon: ShieldCheck,
    },
  ];

  const CurrentIcon = stages[stage].icon;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02050b] text-slate-200">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Background grid */}

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        {/* Cyan ambient glow */}

        <div className="absolute left-[8%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.055] blur-[120px]" />

        {/* Blue ambient glow */}

        <div className="absolute right-[5%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.045] blur-[130px]" />

        {/* Bottom violet ambience */}

        <div className="absolute bottom-[-200px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/[0.025] blur-[120px]" />
      </div>


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="relative z-30 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">

        {/* Brand */}

        <div className="flex items-center gap-3">

          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] shadow-[0_0_30px_rgba(34,211,238,0.08)]">

            <Cpu className="h-5 w-5 text-cyan-400" />

            <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

          </div>

          <div>

            <p className="brand-glass-text text-sm font-bold tracking-[0.12em]">
              AI-VISION
            </p>

            <p className="text-[9px] uppercase tracking-[0.22em] text-slate-600">
              Vehicle Compliance
            </p>

          </div>

        </div>


        {/* Navigation */}

        <div className="hidden items-center gap-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 md:flex">

          <span className="transition hover:text-cyan-400">
            AI Inspection
          </span>

          <span className="transition hover:text-cyan-400">
            Computer Vision
          </span>

          <span className="transition hover:text-cyan-400">
            Compliance
          </span>

        </div>


        {/* System status */}

        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-1.5 sm:flex">

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
            System Online
          </span>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-90px)] max-w-7xl flex-col items-center justify-center gap-10 px-6 pb-12 pt-4 lg:flex-row lg:gap-16 lg:px-12">


        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <section className="w-full max-w-2xl lg:w-[48%]">

          {/* Online badge */}

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-1.5 backdrop-blur-xl">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />

              <span className="relative h-2 w-2 rounded-full bg-cyan-400" />

            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              AI Inspection System Online
            </span>

          </div>


          {/* =================================================
              MAIN HEADING
          ================================================= */}

<motion.h1
  className="hero-title text-center text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-left lg:text-7xl xl:text-[82px]"
  initial={{ opacity: 0, y: 45, scale: 0.97 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
    duration: 1.1,
    delay: 0.25,
    ease: [0.22, 1, 0.36, 1],
  }}
>
  <span className="hero-glow-white block">
    VEHICLE
  </span>

  <span className="hero-glow-gradient block">
    INTELLIGENCE
  </span>

  <span className="hero-glow-gradient block">
    REDEFINED
  </span>
</motion.h1>


          {/* Description */}

          <p className="mx-auto mt-7 max-w-xl text-center text-sm leading-7 text-slate-500 sm:text-base lg:mx-0 lg:text-left">

            Advanced computer vision for intelligent vehicle
            inspection. Detect number plates, identify exterior
            modifications and analyze vehicle compliance in seconds.

          </p>


          {/* =================================================
              CTA
          ================================================= */}

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">

            <button
              onClick={onInspect}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border border-cyan-300/40 bg-cyan-400 px-7 py-4 text-sm font-black tracking-wide text-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.18)] transition-all duration-300 hover:scale-[1.03] hover:bg-cyan-300 hover:shadow-[0_0_70px_rgba(34,211,238,0.3)]"
            >

              {/* Shine */}

              <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-700 group-hover:translate-x-full" />

              <ScanLine className="relative h-4 w-4" />

              <span className="relative">
                INSPECT VEHICLE
              </span>

              <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

            </button>


            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-slate-600">

              <ShieldCheck className="h-4 w-4 text-emerald-400" />

              AI-powered inspection

            </div>

          </div>


          {/* =================================================
              FEATURES
          ================================================= */}

          <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">

            {[
              {
                icon: ScanLine,
                title: "PLATE",
                value: "DETECTION",
              },
              {
                icon: Zap,
                title: "LED",
                value: "ANALYSIS",
              },
              {
                icon: ShieldCheck,
                title: "AI",
                value: "COMPLIANCE",
              },
            ].map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 backdrop-blur-xl transition duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]"
                >

                  <Icon className="h-4 w-4 text-cyan-400" />

                  <p className="mt-3 text-[9px] font-bold tracking-wider text-slate-400">
                    {item.title}
                  </p>

                  <p className="mt-0.5 text-[8px] tracking-wider text-slate-700">
                    {item.value}
                  </p>

                </div>
              );
            })}

          </div>

        </section>


        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <section className="w-full max-w-xl lg:w-[52%]">

          <div className="relative mx-auto aspect-[4/3] w-full">

            {/* Outer glass shell */}

            <div className="absolute inset-0 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl" />


            {/* Scanner panel */}

            <div className="absolute inset-3 overflow-hidden rounded-[1.6rem] border border-cyan-400/[0.12] bg-[#030812]">

              {/* Grid */}

              <div
                className="absolute inset-0 opacity-[0.09]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />


              {/* Police ambient glow */}

              <div
                className={`absolute left-1/2 top-[25%] h-20 w-64 -translate-x-1/2 rounded-full blur-3xl transition-all duration-300 ${
                  lights
                    ? "bg-red-500/10"
                    : "bg-blue-500/10"
                }`}
              />


              {/* =================================================
                  VEHICLE
              ================================================= */}

              <div
                className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  animation:
                    "vehicleFloat 4s ease-in-out infinite",
                }}
              >

                {/* Vehicle glow */}

                <div className="absolute left-1/2 top-[58%] h-20 w-[330px] -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-3xl" />


                {/* Vehicle */}

                <div className="relative h-[170px] w-[310px] sm:h-[195px] sm:w-[360px]">

                  {/* Main SUV */}

                  <div className="absolute bottom-8 left-1/2 h-[100px] w-[290px] -translate-x-1/2 rounded-[45%_45%_18%_18%] border border-slate-500/40 bg-gradient-to-b from-slate-300 via-slate-500 to-slate-900 shadow-[0_20px_45px_rgba(0,0,0,0.7)]" />


                  {/* Roof */}

                  <div className="absolute left-1/2 top-[32px] h-[72px] w-[190px] -translate-x-1/2 rounded-[55px_55px_18px_18px] border border-slate-400/40 bg-gradient-to-b from-slate-400/70 to-slate-800/80" />


                  {/* Windshield */}

                  <div className="absolute left-1/2 top-[45px] h-[50px] w-[170px] -translate-x-1/2 rounded-[45px_45px_8px_8px] border border-cyan-200/20 bg-gradient-to-br from-slate-700/80 via-slate-900/90 to-cyan-950/70" />


                  {/* Reflection */}

                  <div className="absolute left-[30%] top-[48px] h-[42px] w-[28px] rotate-[18deg] rounded-full bg-white/10 blur-sm" />


                  {/* Headlights */}

                  <div className="absolute bottom-[65px] left-[28px] h-6 w-12 rounded-full bg-cyan-200 shadow-[0_0_30px_10px_rgba(103,232,249,0.28)]" />

                  <div className="absolute bottom-[65px] right-[28px] h-6 w-12 rounded-full bg-cyan-200 shadow-[0_0_30px_10px_rgba(103,232,249,0.28)]" />


                  {/* Front grille */}

                  <div className="absolute bottom-[53px] left-1/2 h-9 w-24 -translate-x-1/2 rounded-lg border border-slate-300/20 bg-black/50" />


                  {/* LED bar */}

                  <div className="absolute left-1/2 top-[25px] h-2.5 w-[125px] -translate-x-1/2 rounded-full bg-slate-800 shadow-[0_0_12px_rgba(34,211,238,0.3)]">

                    <span className="absolute inset-y-0 left-2 right-2 rounded-full bg-gradient-to-r from-blue-400 via-white to-red-400 opacity-80" />

                  </div>


                  {/* Wheels */}

                  <div className="absolute bottom-0 left-[43px] h-12 w-12 rounded-full border-[7px] border-slate-800 bg-black shadow-inner" />

                  <div className="absolute bottom-0 right-[43px] h-12 w-12 rounded-full border-[7px] border-slate-800 bg-black shadow-inner" />


                  {/* Wheel hubs */}

                  <div className="absolute bottom-[14px] left-[59px] h-4 w-4 rounded-full bg-slate-500" />

                  <div className="absolute bottom-[14px] right-[59px] h-4 w-4 rounded-full bg-slate-500" />

                </div>

              </div>


              {/* =================================================
                  AI DETECTION BOX
              ================================================= */}

              <div
                className="absolute left-[28%] top-[40%] h-[29%] w-[44%] rounded-lg border border-cyan-400/50"
                style={{
                  animation:
                    "boxPulse 1.8s ease-in-out infinite",
                }}
              >

                {/* Corners */}

                <span className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-cyan-300" />

                <span className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-cyan-300" />

                <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-cyan-300" />

                <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-cyan-300" />


                {/* Detection label */}

                <div className="absolute -top-7 left-0 flex items-center gap-1 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[8px] font-black tracking-wider text-cyan-300 backdrop-blur-xl">

                  <Crosshair className="h-2.5 w-2.5" />

                  {stage === 1
                    ? "NUMBER PLATE"
                    : stage === 2
                    ? "LED LIGHT"
                    : "AI DETECTION"}

                </div>

              </div>


              {/* =================================================
                  SCAN BEAM
              ================================================= */}

              <div
                className="absolute left-0 right-0 h-px bg-cyan-300 shadow-[0_0_25px_6px_rgba(34,211,238,0.3)]"
                style={{
                  animation:
                    "scanBeam 2.5s ease-in-out infinite",
                }}
              />


              {/* =================================================
                  LIVE HUD
              ================================================= */}

              <div className="absolute left-5 top-5 rounded-lg border border-white/[0.07] bg-black/30 px-3 py-2 backdrop-blur-xl">

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                  <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                    LIVE ANALYSIS
                  </span>

                </div>

                <p className="mt-1 text-[8px] text-slate-600">
                  CAMERA 01 / AI-VISION
                </p>

              </div>


              {/* AI score */}

              <div className="absolute right-5 top-5 rounded-lg border border-white/[0.07] bg-black/30 px-3 py-2 text-right backdrop-blur-xl">

                <p className="text-[8px] uppercase tracking-wider text-slate-600">
                  AI SCORE
                </p>

                <p className="mt-1 text-sm font-black text-cyan-400">
                  98.4%
                </p>

              </div>


              {/* =================================================
                  STATUS PANEL
              ================================================= */}

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#030812]/90 px-4 py-3 shadow-2xl backdrop-blur-xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.07]">

                    <CurrentIcon className="h-4 w-4 text-cyan-400" />

                  </div>

                  <div>

                    <p className="text-[9px] font-black uppercase tracking-wider text-cyan-400">
                      {stages[stage].title}
                    </p>

                    <p className="mt-0.5 text-[8px] text-slate-600">
                      {stages[stage].subtitle}
                    </p>

                  </div>

                </div>


                {/* Progress */}

                <div className="hidden items-center gap-1.5 sm:flex">

                  {[0, 1, 2, 3].map((item) => (

                    <span
                      key={item}
                      className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                        item === stage
                          ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                          : item < stage
                          ? "bg-cyan-400/30"
                          : "bg-slate-800"
                      }`}
                    />

                  ))}

                </div>

              </div>

            </div>


            {/* Corner markers */}

            <span className="absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-cyan-400/60" />

            <span className="absolute right-0 top-0 h-10 w-10 border-r-2 border-t-2 border-cyan-400/60" />

            <span className="absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-cyan-400/60" />

            <span className="absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-cyan-400/60" />

          </div>


          {/* =================================================
              BOTTOM METRICS
          ================================================= */}

          <div className="mt-5 grid grid-cols-3 gap-2">

            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 backdrop-blur-xl">

              <div className="flex items-center gap-2">

                <Gauge className="h-3.5 w-3.5 text-cyan-400" />

                <span className="text-[8px] uppercase tracking-wider text-slate-600">
                  Processing
                </span>

              </div>

              <p className="mt-1 text-xs font-bold text-white">
                REAL-TIME
              </p>

            </div>


            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 backdrop-blur-xl">

              <div className="flex items-center gap-2">

                <Sparkles className="h-3.5 w-3.5 text-violet-400" />

                <span className="text-[8px] uppercase tracking-wider text-slate-600">
                  Intelligence
                </span>

              </div>

              <p className="mt-1 text-xs font-bold text-white">
                AI VISION
              </p>

            </div>


            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 backdrop-blur-xl">

              <div className="flex items-center gap-2">

                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />

                <span className="text-[8px] uppercase tracking-wider text-slate-600">
                  Security
                </span>

              </div>

              <p className="mt-1 text-xs font-bold text-white">
                VERIFIED
              </p>

            </div>

          </div>

        </section>

      </main>
      <HowItWorksSection />


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-5 text-[8px] uppercase tracking-[0.2em] text-slate-700 sm:flex">

        <span>Computer Vision</span>

        <span className="h-1 w-1 rounded-full bg-slate-800" />

        <span>AI Analysis</span>

        <span className="h-1 w-1 rounded-full bg-slate-800" />

        <span>Vehicle Safety</span>

      </div>


      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`

        /* =====================================================
           MAIN HEADING GLOW
        ===================================================== */

        .hero-title {
          animation:
            heroTitleBreathing 4.5s ease-in-out infinite;
        }


        /*
         * White glass-like text
         *
         * VEHICLE
         */

        .hero-glow-white {
          position: relative;

          color: transparent;

          background:
            linear-gradient(
              110deg,
              #ffffff 0%,
              #dffcff 18%,
              #ffffff 35%,
              #a5f3fc 52%,
              #ffffff 70%,
              #dbeafe 86%,
              #ffffff 100%
            );

          background-size: 300% 100%;

          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          animation:
            headingGradient 7s ease-in-out infinite,
            whiteTextGlow 3.8s ease-in-out infinite;
        }


        /*
         * Cyan / blue glass gradient
         *
         * INTELLIGENCE
         * REDEFINED
         */

        .hero-glow-gradient {
          position: relative;

          color: transparent;

          background:
            linear-gradient(
              110deg,
              #67e8f9 0%,
              #22d3ee 16%,
              #38bdf8 32%,
              #60a5fa 48%,
              #a78bfa 60%,
              #38bdf8 72%,
              #22d3ee 86%,
              #67e8f9 100%
            );

          background-size: 320% 100%;

          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          animation:
            headingGradient 7s ease-in-out infinite,
            cyanTextGlow 3.5s ease-in-out infinite;
        }


        /*
         * Slow moving gradient
         */

        @keyframes headingGradient {

          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }

        }


        /*
         * Whole heading breathing
         */

        @keyframes heroTitleBreathing {

          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-1px);
          }

        }


        /*
         * White glow
         */

        @keyframes whiteTextGlow {

          0%,
          100% {

            filter:
              drop-shadow(
                0 0 4px
                rgba(255,255,255,0.08)
              )
              drop-shadow(
                0 0 14px
                rgba(34,211,238,0.06)
              );

          }

          50% {

            filter:
              drop-shadow(
                0 0 8px
                rgba(255,255,255,0.22)
              )
              drop-shadow(
                0 0 24px
                rgba(34,211,238,0.16)
              )
              drop-shadow(
                0 0 42px
                rgba(59,130,246,0.08)
              );

          }

        }


        /*
         * Cyan / blue glow
         */

        @keyframes cyanTextGlow {

          0%,
          100% {

            filter:
              drop-shadow(
                0 0 5px
                rgba(34,211,238,0.16)
              )
              drop-shadow(
                0 0 15px
                rgba(59,130,246,0.08)
              );

          }

          50% {

            filter:
              drop-shadow(
                0 0 9px
                rgba(34,211,238,0.42)
              )
              drop-shadow(
                0 0 25px
                rgba(34,211,238,0.22)
              )
              drop-shadow(
                0 0 45px
                rgba(59,130,246,0.13)
              );

          }

        }


        /* =====================================================
           BRAND GLASS GRADIENT
        ===================================================== */

        .brand-glass-text {

          color: transparent;

          background:
            linear-gradient(
              110deg,
              #ffffff,
              #67e8f9,
              #60a5fa,
              #a78bfa,
              #ffffff,
              #22d3ee,
              #ffffff
            );

          background-size: 280% 100%;

          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          animation:
            brandGradient 5s linear infinite,
            brandGlow 3s ease-in-out infinite;

        }


        @keyframes brandGradient {

          0% {
            background-position: 200% 50%;
          }

          100% {
            background-position: -20% 50%;
          }

        }


        @keyframes brandGlow {

          0%,
          100% {

            filter:
              drop-shadow(
                0 0 5px
                rgba(34,211,238,0.10)
              );

          }

          50% {

            filter:
              drop-shadow(
                0 0 12px
                rgba(34,211,238,0.30)
              );

          }

        }


        /* =====================================================
           SCAN BEAM
        ===================================================== */

        @keyframes scanBeam {

          0% {
            top: 12%;
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          50% {
            opacity: 1;
          }

          85% {
            opacity: 1;
          }

          100% {
            top: 88%;
            opacity: 0;
          }

        }


        /* =====================================================
           VEHICLE FLOAT
        ===================================================== */

        @keyframes vehicleFloat {

          0%,
          100% {
            transform:
              translate(-50%, -50%)
              translateY(0);
          }

          50% {
            transform:
              translate(-50%, -50%)
              translateY(-7px);
          }

        }


        /* =====================================================
           DETECTION BOX
        ===================================================== */

        @keyframes boxPulse {

          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.98);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }

        }


        /* =====================================================
           ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .hero-title,
          .hero-glow-white,
          .hero-glow-gradient,
          .brand-glass-text {
            animation: none !important;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 640px) {

          .hero-title {
            line-height: 0.95;
          }

        }

      `}</style>

    </div>
  );
}

export default LandingPage;
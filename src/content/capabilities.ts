import type { Capability } from "./types";

export const capabilities: Capability[] = [
  {
    slug: "operating-systems",
    title: "Operating Systems & Platforms",
    short: "Enterprise operating systems for x86 and IBM z.",
    summary:
      "We build and maintain enterprise-grade operating systems for x86 and z architectures — and the language ecosystems that run on them. DevOps and R&D practice are wired into every stage of the lifecycle.",
    builds: [
      { title: "Kernel & system services", body: "Ports, drivers, schedulers and system services for mission-critical enterprise operating systems." },
      { title: "Language runtimes", body: "C, C++, Java, JavaScript and Python ecosystems kept current on long-lived platforms." },
      { title: "Release engineering", body: "Build farms, CI and test automation for OS releases that customers run for decades." },
    ],
    stack: ["x86-64", "IBM z", "C", "C++", "Java", "Python", "JavaScript", "CI/CD"],
    offices: ["copenhagen", "malmo", "stuttgart", "boston"],
    work: ["enterprise-os-x86"],
  },
  {
    slug: "developer-tools",
    title: "Developer Tools & Compilers",
    short: "Compilers, debuggers and IDEs for enterprise platforms.",
    summary:
      "Our operating systems ship with a complete toolchain. We develop compilers and interpreters for C, C++, BASIC, COBOL, FORTRAN, Java and Python, plus an IDE, a debugger and standard build tools.",
    builds: [
      { title: "Compilers & interpreters", body: "Front ends and back ends for modern and legacy languages — from C++ to COBOL and FORTRAN." },
      { title: "Debuggers & IDE", body: "Developer tooling that makes long-lived platforms productive for today's engineers." },
      { title: "Build tooling", body: "Industry-standard make and CMake support so existing code builds without rewrites." },
    ],
    stack: ["LLVM", "C", "C++", "COBOL", "FORTRAN", "BASIC", "Java", "Python", "CMake"],
    offices: ["copenhagen", "stuttgart", "yerevan", "boston"],
    work: ["enterprise-os-x86"],
  },
  {
    slug: "mainframe",
    title: "Mainframe & Enterprise Software",
    short: "Capacity planning and resiliency for IBM mainframes.",
    summary:
      "We develop software that helps enterprises run IBM mainframes with confidence: capacity planning with forecasting and modelling, and resiliency management that maps dependencies and vulnerabilities in application data.",
    builds: [
      { title: "Capacity planning", body: "Enterprise-wide utilization data turned into forecasts and models for infrastructure and application decisions." },
      { title: "Resiliency management", body: "Analytics that expose inter-dependencies and weak points in non-database data and applications." },
      { title: "Integrations", body: "Connectors for major schedulers, tape management and backup tools." },
    ],
    stack: ["IBM z/OS", "Mainframe", "Analytics", "Forecasting", "Reporting"],
    offices: ["malmo", "athens", "perth", "boston"],
    work: ["mainframe-capacity"],
  },
  {
    slug: "cloud-migration",
    title: "Cloud Migration & Replatforming",
    short: "Move critical applications to modern platforms.",
    summary:
      "We give customers the tools and support to move applications to new platforms — adding modern CPU architectures and enabling containerized, virtual and cloud environments.",
    builds: [
      { title: "Architecture porting", body: "Support for modern CPU architectures so proven applications keep running." },
      { title: "Virtualization", body: "Enablement for VMware, KVM and other hypervisors." },
      { title: "Cloud enablement", body: "Deployments on AWS, Google Cloud and Oracle Cloud, with containers where they fit." },
    ],
    stack: ["VMware", "KVM", "AWS", "GCP", "Oracle Cloud", "Containers"],
    offices: ["copenhagen", "athens"],
    work: ["enterprise-os-x86"],
  },
  {
    slug: "data-platforms",
    title: "Data & Real-time Platforms",
    short: "Streaming analytics, low-latency video and live data.",
    summary:
      "We build platforms that move and make sense of data in real time — from streaming analytics with built-in machine learning, to a low-latency video CDN, to live gaming statistics.",
    builds: [
      { title: "Streaming analytics", body: "Ingest, analyze and correlate real-time data from any source, with a visual IDE and built-in domain analytics." },
      { title: "Video distribution", body: "A low-latency CDN built on the SRT protocol, running on Kubernetes and AWS." },
      { title: "Live data products", body: "Real-time and archived statistics, betting and communication features for gaming." },
    ],
    stack: ["Go", "C++", "Erlang", "JavaScript", "Hadoop", "Spark", "SRT", "Kubernetes", "AWS", "ML/NLP"],
    offices: ["yerevan", "athens", "boston"],
    work: ["streams-analytics", "srt-video-cdn", "gaming-portal"],
  },
  {
    slug: "industrial-energy",
    title: "Industrial & Energy Software",
    short: "SCADA, simulation and building energy tools.",
    summary:
      "We engineer software for energy systems and industry: cloud SCADA that monitors and optimizes buildings, an industrial simulation engine, and tools for planning building energy and heat-pump solutions.",
    builds: [
      { title: "Cloud SCADA", body: "Data collection, analytics and dashboards to optimize climate control and energy use — with bank-grade encryption." },
      { title: "Industrial simulation", body: "A modelling engine with Python gRPC APIs, a React front end and an LLVM-based compilation pipeline." },
      { title: "Energy planning", body: "Tools to design building energy systems — HVAC and renewables — and compare industrial heat pumps." },
    ],
    stack: ["Python", "gRPC", "React", "LLVM", "Docker", "Kubernetes", "Terraform", "SCADA"],
    offices: ["copenhagen", "malmo", "yerevan", "cairo"],
    work: ["energy-scada", "simulation-platform"],
  },
];

export const crossCutting = [
  {
    title: "Quality assurance",
    body: "Automation, performance, scalability, regression, integration, globalization and functional testing — across web, desktop, mobile, server and API.",
  },
  {
    title: "Support & professional services",
    body: "Technical support at every level, and services that help customers get the full value of their software.",
  },
] as const;

export const getCapability = (slug: string) => capabilities.find((c) => c.slug === slug);

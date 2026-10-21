import type { CaseStudy } from "./types";

// Client names are anonymized pending NDA review. Outcomes are qualitative
// until metrics are confirmed by project leads.
export const work: CaseStudy[] = [
  {
    slug: "enterprise-os-x86",
    title: "Taking an enterprise operating system to x86",
    client: "Enterprise OS vendor",
    capability: "operating-systems",
    summary: "Porting a decades-proven enterprise operating system and its toolchain to modern x86 hardware and virtual environments.",
    challenge:
      "Customers relied on a mission-critical operating system tied to ageing hardware. They needed the same reliability on modern x86 servers, hypervisors and cloud — without rewriting their applications.",
    approach: [
      "Ported kernel and system services to x86-64 with a shared CI and test farm.",
      "Brought the compiler suite — C, C++, COBOL, FORTRAN, BASIC — to the new architecture.",
      "Enabled VMware, KVM and public-cloud deployments.",
    ],
    stack: ["x86-64", "C", "C++", "LLVM", "COBOL", "FORTRAN", "VMware", "KVM", "AWS"],
    outcome:
      "Customers can run existing applications on current hardware and in virtual and cloud environments, extending the life of systems they depend on.",
    offices: ["copenhagen", "stuttgart", "boston", "malmo"],
    visual: "kernel",
    art: 1,
  },
  {
    slug: "mainframe-capacity",
    title: "Capacity and resiliency intelligence for IBM mainframes",
    client: "Mainframe software company",
    capability: "mainframe",
    summary: "Software that forecasts mainframe capacity and exposes hidden dependencies in application data.",
    challenge:
      "Enterprises running IBM mainframes needed reliable forecasts of capacity and a clear picture of which applications and datasets depend on each other.",
    approach: [
      "Built pipelines that curate enterprise-wide utilization data.",
      "Added forecasting and modelling to the reporting layer.",
      "Integrated with leading schedulers, tape management and backup tools.",
    ],
    stack: ["IBM z/OS", "Analytics", "Forecasting", "Reporting"],
    outcome:
      "Operations teams make infrastructure and application decisions from data, and spot resiliency risks before they turn into incidents.",
    offices: ["athens", "perth", "boston", "malmo"],
    visual: "mainframe",
    art: 2,
  },
  {
    slug: "energy-scada",
    title: "Cloud SCADA for integrated building energy systems",
    client: "Building energy technology company",
    capability: "industrial-energy",
    summary: "A secure cloud platform that collects building data and turns it into dashboards for climate and energy control.",
    challenge:
      "Integrated energy systems in buildings generate continuous data. Operators needed one secure place to see it, analyse it and act on it.",
    approach: [
      "Designed a cloud SCADA platform for data collection and analysis.",
      "Built visual dashboards for climate control and energy consumption.",
      "Encrypted all data traffic using the standards banks rely on.",
    ],
    stack: ["Python", "TypeScript", "React", "Time-series", "Kubernetes"],
    outcome: "Building operators get actionable insight to tune climate control and reduce energy use.",
    offices: ["copenhagen", "malmo", "yerevan"],
    visual: "scada",
    art: 3,
  },
  {
    slug: "streams-analytics",
    title: "Streams: real-time analytics with a visual IDE",
    client: "Analytics platform",
    capability: "data-platforms",
    summary: "A platform for ingesting and correlating live data from any source, with machine learning built in.",
    challenge:
      "Teams wanted to build adaptive streaming applications without stitching together a dozen tools.",
    approach: [
      "Built connectors for virtually any data source, plus Hadoop and Spark integration.",
      "Developed a feature-rich visual IDE for stream applications.",
      "Shipped domain analytics: ML, NLP, spatial-temporal, text and acoustics.",
    ],
    stack: ["Hadoop", "Spark", "ML", "NLP", "Java", "Python"],
    outcome: "Users design and run real-time analytics applications far faster than with hand-built pipelines.",
    offices: ["athens", "boston"],
    visual: "streams",
    art: 4,
  },
  {
    slug: "srt-video-cdn",
    title: "A low-latency video CDN on SRT",
    client: "Streaming media platform",
    capability: "data-platforms",
    summary: "Content delivery built on the Secure Reliable Transport protocol and Kubernetes.",
    challenge: "Live video needs to travel the open internet with minimal delay and without dropping quality.",
    approach: [
      "Built the delivery network on SRT in Go and C++.",
      "Ran it on Kubernetes with extensive use of AWS services.",
      "Applied DevOps practice end to end — automation, observability, repeatable releases.",
    ],
    stack: ["Go", "C++", "SRT", "JavaScript", "Kubernetes", "AWS"],
    outcome: "Reliable low-latency distribution of live streams at scale.",
    offices: ["yerevan"],
    visual: "video",
    art: 5,
  },
  {
    slug: "simulation-platform",
    title: "Industrial simulation in the cloud",
    client: "Industrial technology company",
    capability: "industrial-energy",
    summary: "A modelling engine with an LLVM compilation pipeline, Python APIs and a React front end.",
    challenge: "Engineers needed industrial simulations that are fast, extensible and available from anywhere.",
    approach: [
      "Wrote a custom modelling engine in Python with an LLVM-based assembly and compilation pipeline.",
      "Exposed it through Python gRPC APIs and a React web front end.",
      "Made it extensible with Docker images, deployed via Kubernetes and Terraform.",
    ],
    stack: ["Python", "gRPC", "LLVM", "React", "Docker", "Kubernetes", "Terraform"],
    outcome: "Simulation as a service that teams extend with their own models.",
    offices: ["copenhagen"],
    visual: "simulation",
    art: 6,
  },
  {
    slug: "gaming-portal",
    title: "A real-time gaming statistics portal",
    client: "E-sports & gaming company",
    capability: "data-platforms",
    summary: "Live and archived game statistics, betting and communication in one portal.",
    challenge: "Fans and bettors expect live numbers, deep history and community features to keep up with the game.",
    approach: [
      "Built a full-stack JavaScript application backed by Erlang services.",
      "Combined real-time feeds with archived statistics.",
      "Added betting and communication features.",
    ],
    stack: ["JavaScript", "Erlang", "Real-time"],
    outcome: "A single fast destination for live and historical game data.",
    offices: ["yerevan"],
    visual: "gaming",
    art: 7,
  },
];

export const getWork = (slug: string) => work.find((w) => w.slug === slug);

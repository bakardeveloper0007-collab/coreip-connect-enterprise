export const NAV_SECTIONS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Partners", href: "#partners" },
  { label: "Company", href: "#company" },
  { label: "Contact", href: "#contact" },
];

export const SOLUTIONS = [
  {
    title: "Unified Communication",
    icon: "phone",
    description:
      "IPPBX, VoIP, video conferencing and collaboration built on CoreIP's UCX platform — on premise or on cloud.",
    points: ["IPPBX / VoIP", "Video conferencing", "UCX on Cloud"],
  },
  {
    title: "Security Solutions",
    icon: "shield",
    description:
      "Surveillance, access and video management deployments that protect people, premises and information.",
    points: ["Video management (UVMS)", "Access & surveillance", "Helpline platforms"],
  },
  {
    title: "Networking Solutions",
    icon: "network",
    description:
      "Structured, resilient enterprise networks with centralised monitoring through CoreIP NMS.",
    points: ["LAN / WAN design", "Network monitoring", "Device management"],
  },
  {
    title: "Telecom Solutions",
    icon: "radio",
    description:
      "Media gateways, trunking and call management that connect legacy telecom with modern IP infrastructure.",
    points: ["Media gateways", "Call billing", "Trunk integration"],
  },
  {
    title: "Hosting Solutions",
    icon: "cloud",
    description:
      "Servers, storage and hosted communication infrastructure sized for enterprise and government workloads.",
    points: ["COTS servers", "UNAS storage", "Hosted UCX"],
  },
];

export const PRODUCT_GROUPS = [
  {
    group: "Software",
    items: [
      {
        name: "Call Billing Software",
        value: "Accurate call accounting and cost control across every extension and trunk.",
        caps: ["Call detail records", "Department-wise billing", "Usage reports"],
      },
      {
        name: "Complaint Management System",
        value: "Structured complaint logging, assignment and closure for service-driven teams.",
        caps: ["Ticket lifecycle", "Escalation flow", "ISO-aligned records"],
      },
    ],
  },
  {
    group: "Communication",
    items: [
      {
        name: "Unified Communication Server",
        value: "The core of enterprise voice, video and messaging on a single platform.",
        caps: ["IPPBX telephony", "Conferencing", "Scales to 5000+ lines"],
      },
      {
        name: "UCX on Cloud",
        value: "Hosted unified communication for distributed and multi-site organisations.",
        caps: ["Cloud delivered", "Site-to-site dialling", "Elastic capacity"],
      },
      {
        name: "IP Phones",
        value: "CoreIP Vaani IP phone range for desks, reception and enterprise deployments.",
        caps: ["HD voice", "PoE support", "Provisioning at scale"],
      },
      {
        name: "Media Gateways",
        value: "Bridge PRI, FXO and FXS telecom lines into an IP communication core.",
        caps: ["Analog & digital ports", "Trunk failover", "SIP interworking"],
      },
    ],
  },
  {
    group: "Networking & Security",
    items: [
      {
        name: "NMS",
        value: "Network management with complete visibility of devices, links and performance.",
        caps: ["Topology view", "Performance graphs", "Alerting"],
      },
      {
        name: "UVMS",
        value: "Unified video management for centralised surveillance operations.",
        caps: ["Multi-site video", "Recording", "Central console"],
      },
    ],
  },
  {
    group: "Hardware",
    items: [
      {
        name: "COTS Servers",
        value: "Commercial off-the-shelf server platforms configured for communication workloads.",
        caps: ["Rack form factors", "Workload sizing", "On-site support"],
      },
      {
        name: "Server Hardware",
        value: "Enterprise server builds for voice, video and application hosting.",
        caps: ["Redundant power", "Scalable storage", "Warranty support"],
      },
      {
        name: "UNAS",
        value: "Network attached storage for recordings, archives and enterprise data.",
        caps: ["Expandable capacity", "RAID protection", "Network shares"],
      },
    ],
  },
];

export const DEPLOYMENTS = [
  { customer: "Railway Board", solution: "Unified Communication", impact: "5000-line unified communication deployment." },
  { customer: "NBCC", solution: "Unified Communication", impact: "5000-line communication infrastructure rollout." },
  { customer: "IIM", solution: "Unified Communication", impact: "2000-line campus communication platform." },
  { customer: "NTPC", solution: "Unified Communication", impact: "1000-line enterprise voice deployment." },
  { customer: "182 Security Helpline", solution: "Helpline Communication", impact: "Mission-critical public helpline infrastructure." },
  { customer: "Voter Helpline", solution: "Helpline Communication", impact: "High-volume citizen helpline platform." },
  { customer: "Central Secretariat", solution: "Unified Communication", impact: "Government communication infrastructure." },
  { customer: "Subharti University", solution: "Campus Communication", impact: "Campus-wide voice and collaboration setup." },
  { customer: "TUV", solution: "Enterprise Communication", impact: "Enterprise communication implementation." },
];

export const CONTACT = {
  phone: "+91-120-6618000",
  altPhone: "+91-120-6618005",
  email: "info@coreip.co.in",
  address: "C-421, The iThum, A-40, Sector-62, Noida 201309, Uttar Pradesh, India",
};
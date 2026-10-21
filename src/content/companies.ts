// Site content: edit it here (see README → Editing content). Pages read it
// through src/lib/content.ts.
import type { Company } from "./types";

// Logos for partners are taken from the current site (public/logos).
export const sisterCompanies: Company[] = [
  {
    name: "21CS",
    url: "https://21cs.com/",
    logo: "/logos/21cs.png",
    description: "Software for IBM mainframes — JCL checking, performance and capacity planning, data protection and storage modernization.",
    relation: "sister",
  },
  {
    name: "VMS Software",
    url: "https://vmssoftware.com/",
    logo: "/logos/vms.png",
    description: "The home of OpenVMS — development, x86 and virtualization support, modernization and services.",
    relation: "sister",
  },
  {
    name: "Energy Machines",
    url: "https://www.energymachines.com/",
    logo: "/logos/energy_machines.png",
    description: "Integrated energy systems for buildings that combine heating, cooling, ventilation and renewables.",
    relation: "sister",
  },
];

export const partners: Company[] = [
  { name: "IBM", url: "https://www.ibm.com/", logo: "/logos/ibm.png", description: "", relation: "partner" },
  { name: "Hewlett Packard Enterprise", url: "https://www.hpe.com/", logo: "/logos/hpe.png", description: "", relation: "partner" },
  { name: "Oracle", url: "https://www.oracle.com/", logo: "/logos/oracle.png", description: "", relation: "partner" },
  { name: "DXC Technology", url: "https://dxc.com/", logo: "/logos/dxc.png", description: "", relation: "partner" },
  { name: "Applied Materials", url: "https://www.appliedmaterials.com/", logo: "/logos/applied.png", description: "", relation: "partner" },
  { name: "Blast", url: "https://blast.tv/", logo: "/logos/blast.png", description: "", relation: "partner" },
];

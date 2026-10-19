import Image from "next/image";
import { getCompanies } from "@/lib/content";

export async function LogoWall({ label = "Trusted by and working with" }: { label?: string }) {
  // Sister companies first, then partners, each in site order.
  const all = (await getCompanies()).toSorted((a, b) => (a.relation === b.relation ? 0 : a.relation === "sister" ? -1 : 1));
  return (
    <div>
      <p className="t-label text-center text-gray">{label}</p>
      <ul className="mt-8 grid grid-cols-3 items-center gap-x-8 gap-y-10 sm:grid-cols-5 lg:grid-cols-9">
        {all.map((c) => (
          <li key={c.name} className="flex justify-center">
            <Image
              src={c.logo}
              alt={c.name}
              width={160}
              height={48}
              className="h-7 w-auto max-w-[120px] object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-8"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

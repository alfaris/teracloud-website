import { CountUp } from "@/components/ui/CountUp";
import { getSiteSettings } from "@/lib/content";

export async function Stats() {
  const { stats } = await getSiteSettings();
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse bg-white p-6 sm:p-8">
          <dt className="mt-2 text-gray">{s.label}</dt>
          <dd className="text-5xl font-extrabold tracking-tight text-blue sm:text-6xl">
            <CountUp value={s.value} suffix={s.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

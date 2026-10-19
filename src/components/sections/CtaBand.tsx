import { Button } from "@/components/ui/Button";

export function CtaBand({
  title = "Let's build what runs underneath.",
  body = "Tell us about the system you need engineered — or the team you want to join.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-blue text-white on-dark">
      <div className="container-tc flex flex-col gap-8 py-20 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="t-h1 text-balance">{title}</h2>
          <p className="t-lead mt-5 text-white/80">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/contact?intent=partnership" variant="light">Partner with us</Button>
          <Button href="/careers" variant="secondary" className="border-white/40 text-white hover:border-white hover:text-white">
            See open roles
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useId, useMemo, useState } from "react";
import type { Job } from "@/content/types";
import { JobList } from "./JobList";

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const id = useId();
  const [loc, setLoc] = useState("all");
  const locations = useMemo(() => [...new Set(jobs.map((j) => j.location))].sort(), [jobs]);
  const shown = loc === "all" ? jobs : jobs.filter((j) => j.location === loc);
  return (
    <div>
      {locations.length > 1 && (
        <div className="mb-6 flex items-center gap-3">
          <label htmlFor={id} className="font-medium">Location</label>
          <select
            id={id}
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            className="min-h-11 rounded-full border border-line bg-white px-4 pr-8"
          >
            <option value="all">All locations ({jobs.length})</option>
            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      )}
      <p className="sr-only" role="status">{shown.length} open roles shown</p>
      <JobList jobs={shown} />
    </div>
  );
}

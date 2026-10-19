import { defineCliConfig } from "sanity/cli";

// For `npx sanity <command>` (schema deploy, dataset import, CORS). Studio
// itself runs inside the Next app at /studio.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || "production",
  },
});

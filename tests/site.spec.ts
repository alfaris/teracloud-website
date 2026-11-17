import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "/",
  "/capabilities",
  "/capabilities/operating-systems",
  "/work",
  "/work/energy-scada",
  "/ecosystem",
  "/locations",
  "/locations/yerevan",
  "/careers",
  "/hackathon",
  "/news",
  "/about",
  "/contact",
  "/privacy",
  "/cookies",
];

// The 3D hero and map skip devices with 4 or fewer cores, which includes
// GitHub's runners. Report 8 so the tests check the width, motion and
// per-page rules the same way on every machine.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 }));
});

for (const path of pages) {
  test(`a11y + basics: ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(title).toContain("Teracloud");
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(scrollW).toBeLessThanOrEqual(0);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`)).toEqual([]);
  });
}

test("titles are unique", async ({ page }) => {
  const titles = new Set<string>();
  for (const path of pages) {
    await page.goto(path);
    titles.add(await page.title());
  }
  expect(titles.size).toBe(pages.length);
});

test("legacy URLs redirect", async ({ request }) => {
  const r = await request.get("/projects", { maxRedirects: 0 });
  expect(r.status()).toBe(308);
  expect(r.headers()["location"]).toBe("/work");
});

test("job page has JobPosting JSON-LD and apply link", async ({ page }) => {
  await page.goto("/careers");
  const first = page.locator("#roles a[href^='/careers/']").first();
  test.skip((await first.count()) === 0, "no open roles");
  await first.click();
  // Client-side navigation: wait for it rather than reading the old page.
  await expect(page).toHaveURL(/\/careers\/[^/]+$/);
  await expect
    .poll(async () => (await page.locator('script[type="application/ld+json"]').allTextContents()).some((t) => t.includes('"JobPosting"')))
    .toBe(true);
  await expect(page.getByRole("link", { name: /Apply/ }).first()).toHaveAttribute("href", /recruiting\.ultipro\.com/);
});

test("contact form validates and submits", async ({ page }) => {
  await page.goto("/contact?intent=partnership");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/fields need attention/)).toBeVisible();
  // Focus moves to the first field that needs attention.
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Test Person");
  await page.getByLabel("Work email").fill("test@example.com");
  await page.getByLabel("Tell us about your project").fill("We need help porting an OS to a new architecture.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send message" }).click();
  // Without RESEND_API_KEY in production the action reports the fallback error; either outcome is a handled state.
  await expect(page.getByText(/Message sent|can't send messages from this form/)).toBeVisible();
});

test("contact form keeps what was typed after an error", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Test Person");
  await page.getByLabel("Tell us about your project").fill("short");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/fields need attention/)).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveValue("Test Person");
  await expect(page.getByLabel("Tell us about your project")).toHaveValue("short");
  await expect(page.getByLabel("Work email")).toBeFocused();
});

test("hero falls back to static poster under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(1500);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("revealed content is visible under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/capabilities");
  const cards = page.locator("[data-reveal]");
  await expect(cards.first()).toBeVisible();
  for (const opacity of await cards.evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))) {
    expect(opacity).toBe("1");
  }
});

test("each case study has its own cover illustration", async ({ page }) => {
  await page.goto("/work");
  const covers = await page.locator("article svg[aria-hidden]").evaluateAll((els) => els.map((el) => el.innerHTML));
  expect(covers.length).toBeGreaterThan(1);
  expect(new Set(covers).size).toBe(covers.length);
});

test("hero renders WebGL canvas with motion allowed", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/");
  const hero = page.locator("section").filter({ has: page.locator("h1") });
  await expect(hero.locator("canvas")).toHaveCount(1, { timeout: 10_000 });
});

test("mobile menu opens, traps scroll, closes on Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const btn = page.getByRole("button", { name: "Open menu" });
  await btn.click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("unknown URLs get the 404 page with site chrome", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText(/isn.t in our stack/);
  await expect(page.locator("footer")).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("news cards link out to the original posts", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", { has: page.getByRole("heading", { name: "Latest from Teracloud." }) });
  // The section is left out while src/content/news.ts has no posts.
  test.skip((await section.count()) === 0, "no news posts");
  const links = section.locator("article").getByRole("link");
  expect(await links.count()).toBeLessThanOrEqual(3);
  await expect(section.getByRole("link", { name: "All news" })).toHaveAttribute("href", "/news");
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
});

test("locations map upgrades to 3D on desktop, stays SVG on phones", async ({ page, isMobile }) => {
  await page.goto("/locations");
  const map = page.locator("[data-hubs-map]");
  await expect(map.locator("svg").first()).toBeVisible();
  if (isMobile) {
    await page.waitForTimeout(2000);
    await expect(map.locator("canvas")).toHaveCount(0);
  } else {
    await expect(map.locator("canvas")).toHaveCount(1, { timeout: 10_000 });
    // Hovering a hub in the list highlights it.
    await map.locator('a[data-hub="athens"]').hover();
    await expect(map.locator('a[data-hub="athens"]')).toHaveAttribute("data-active", "true");
  }
});

test("home hubs map highlights a hub from the list and opens it from the map", async ({ page, isMobile }) => {
  test.skip(isMobile, "needs a pointer");
  // The 2D map, as reduced-motion visitors, phones and low-core machines get it;
  // on desktop it is otherwise covered by the 3D map once that loads.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const map = page.locator("[data-hubs-map]");
  await map.scrollIntoViewIfNeeded();
  // Pointing at a hub in the list lights its dot, route and label on the map.
  await map.locator('a[data-hub="athens"]').hover();
  await expect(map).toHaveAttribute("data-hovering", "true");
  for (const part of ['svg g[data-hub="athens"]', 'svg path[data-hub="athens"]', 'svg [data-hubs~="athens"]']) {
    await expect(map.locator(part).first()).toHaveAttribute("data-active", "true");
  }
  await expect(map.locator('svg g[data-hub="perth"]').first()).toHaveAttribute("data-active", "false");
  // Clicking the hub on the map opens its page.
  await map.locator('svg g[data-hub="perth"] circle').last().click();
  await expect(page).toHaveURL(/\/locations\/perth$/);
});

test("the HQ dot opens Copenhagen, not Malmö drawn beside it", async ({ page, isMobile }) => {
  test.skip(isMobile, "needs a pointer");
  // The 2D map, as reduced-motion visitors, phones and low-core machines get it;
  // on desktop it is otherwise covered by the 3D map once that loads.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const map = page.locator("[data-hubs-map]");
  await map.scrollIntoViewIfNeeded();
  await map.locator('svg g[data-hub="copenhagen"] circle').last().click();
  await expect(page).toHaveURL(/\/locations\/copenhagen$/);
});

test("a hub focused from the keyboard stays lit when the pointer passes", async ({ page, isMobile }) => {
  test.skip(isMobile, "needs a pointer");
  // The 2D map, as reduced-motion visitors, phones and low-core machines get it;
  // on desktop it is otherwise covered by the 3D map once that loads.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const map = page.locator("[data-hubs-map]");
  await map.locator('a[data-hub="athens"]').focus();
  const dot = map.locator('svg g[data-hub="athens"]').first();
  await expect(dot).toHaveAttribute("data-active", "true");
  const box = (await map.locator("svg").first().boundingBox())!;
  await page.mouse.move(box.x + 5, box.y + box.height - 5);
  await page.mouse.move(0, 0);
  await expect(dot).toHaveAttribute("data-active", "true");
});

test("hubs map stays out of the keyboard order", async ({ page }) => {
  await page.goto("/careers");
  await expect(page.locator("[data-hubs-map] svg [tabindex], [data-hubs-map] svg a")).toHaveCount(0);
});

for (const path of ["/", "/careers"]) {
  test(`${path} hubs map upgrades to 3D on desktop`, async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto(path);
    const map = page.locator("[data-hubs-map]");
    await map.scrollIntoViewIfNeeded();
    await expect(map.locator("[data-map-mode]")).toHaveAttribute("data-map-mode", "3d", { timeout: 15_000 });
    await expect(map.locator("canvas")).toHaveCount(1);
  });
}

test("hubs map falls back to the 2D map when WebGL fails to start", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  // The capability check gets a WebGL context; three.js then gets none, as on
  // a machine whose GPU driver refuses it.
  await page.addInitScript(() => {
    const real = HTMLCanvasElement.prototype.getContext;
    let calls = 0;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      if (type.startsWith("webgl") && ++calls > 1) return null;
      return (real as (...a: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof real;
  });
  await page.goto("/careers");
  const map = page.locator("[data-hubs-map]");
  await map.scrollIntoViewIfNeeded();
  await expect(map.locator("[data-map-mode]")).toHaveAttribute("data-map-mode", "svg-fallback", { timeout: 15_000 });
  await expect(map.locator("canvas")).toHaveCount(0);
  await expect(map.locator("svg").first()).toBeVisible();
  await map.locator('a[data-hub="cairo"]').hover();
  await expect(map.locator('svg g[data-hub="cairo"]').first()).toHaveAttribute("data-active", "true");
});

test("hubs map falls back to the 2D map when the WebGL context is lost", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/careers");
  const map = page.locator("[data-hubs-map]");
  await map.scrollIntoViewIfNeeded();
  await expect(map.locator("[data-map-mode]")).toHaveAttribute("data-map-mode", "3d", { timeout: 15_000 });
  await map.locator("canvas").evaluate((c: HTMLCanvasElement) =>
    (c.getContext("webgl2") ?? c.getContext("webgl"))?.getExtension("WEBGL_lose_context")?.loseContext(),
  );
  await expect(map.locator("[data-map-mode]")).toHaveAttribute("data-map-mode", "svg-fallback");
  await expect(map.locator("canvas")).toHaveCount(0);
  await expect(map.locator("svg").first()).toBeVisible();
});

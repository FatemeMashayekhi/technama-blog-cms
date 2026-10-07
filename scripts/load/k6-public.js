import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

const baseUrl = (__ENV.LOAD_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const allowRemote = __ENV.ALLOW_REMOTE_LOAD_TEST === "true";
const target = new URL(baseUrl);

if (!allowRemote && !["localhost", "127.0.0.1", "::1"].includes(target.hostname)) {
  throw new Error("Remote load tests are disabled. Use a dedicated staging target and set ALLOW_REMOTE_LOAD_TEST=true explicitly.");
}

const articleSlugs = [
  "nextjs-rendering-model-explained",
  "typescript-boundaries-in-large-codebases",
  "react-compiler-practical-guide",
  "small-language-models-on-device",
];
const categorySlugs = ["programming", "ai", "hardware", "product"];
const authorNames = ["maryam", "alirezaei", "sara.design", "nimaf"];
const searchTerms = ["react", "typescript", "هوش مصنوعی", "طراحی"];
const adminCookie = __ENV.LOAD_ADMIN_COOKIE || "";

const failures = new Rate("request_failures");
const http4xx = new Counter("http_4xx");
const http5xx = new Counter("http_5xx");
const timeouts = new Counter("timeouts");
const ttfb = new Trend("ttfb", true);

export const options = {
  vus: Number(__ENV.LOAD_VUS || 50),
  duration: __ENV.LOAD_DURATION || "2m",
  gracefulStop: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    request_failures: ["rate<0.01"],
    http_req_duration: ["p(95)<1500", "p(99)<3000"],
  },
  summaryTrendStats: ["avg", "min", "med", "p(75)", "p(90)", "p(95)", "p(99)", "max"],
};

function pick(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function get(path, extra = {}) {
  const response = http.get(`${baseUrl}${path}`, {
    redirects: 2,
    timeout: "10s",
    tags: { route: path.split("?")[0] },
    ...extra,
  });
  const accepted = check(response, { "status is successful": (result) => result.status >= 200 && result.status < 400 });
  failures.add(!accepted);
  if (response.status >= 400 && response.status < 500) http4xx.add(1);
  if (response.status >= 500) http5xx.add(1);
  if (response.error_code === 1050) timeouts.add(1);
  ttfb.add(response.timings.waiting);
  return response;
}

export default function runJourney() {
  const roll = Math.random();

  if (roll < 0.67) {
    get("/");
    sleep(0.5 + Math.random());
    get(`/categories/${pick(categorySlugs)}`);
    sleep(0.5 + Math.random());
    get(`/articles/${pick(articleSlugs)}`);
  } else if (roll < 0.84) {
    get(`/search?q=${encodeURIComponent(pick(searchTerms))}`);
    sleep(0.5 + Math.random());
    get(`/articles/${pick(articleSlugs)}`);
  } else if (roll < 0.94) {
    get(`/authors/${pick(authorNames)}`);
    sleep(0.5 + Math.random());
    get(`/articles/${pick(articleSlugs)}`);
  } else if (adminCookie) {
    const params = { headers: { Cookie: adminCookie }, tags: { journey: "admin" } };
    get("/admin/dashboard", params);
    sleep(0.5 + Math.random());
    get("/admin/posts", params);
    get("/admin/analytics", params);
  } else {
    get("/articles");
  }

  sleep(0.8 + Math.random() * 1.7);
}

export function handleSummary(data) {
  const output = __ENV.LOAD_RESULT_FILE || `k6-${options.vus}vu.json`;
  return { [output]: JSON.stringify(data, null, 2), stdout: `\nSaved k6 summary to ${output}\n` };
}

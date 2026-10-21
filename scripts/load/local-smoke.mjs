import { performance } from "node:perf_hooks";

const target = new URL(process.env.LOAD_BASE_URL ?? "http://127.0.0.1:3000");
const allowedHosts = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);

if (!allowedHosts.has(target.hostname)) {
  throw new Error("This bounded smoke load test only runs against localhost.");
}

const paths = ["/", "/articles", "/categories", "/tags"];
const requestCount = 100;
const concurrency = 10;
const timings = [];
let failures = 0;
let cursor = 0;
const suiteStartedAt = performance.now();

async function worker() {
  while (cursor < requestCount) {
    const index = cursor++;
    const startedAt = performance.now();
    try {
      const response = await fetch(new URL(paths[index % paths.length], target), {
        headers: { "user-agent": "technama-local-load-smoke/1.0" },
      });
      await response.arrayBuffer();
      if (!response.ok) failures += 1;
    } catch {
      failures += 1;
    } finally {
      timings.push(performance.now() - startedAt);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
const durationMs = performance.now() - suiteStartedAt;

timings.sort((first, second) => first - second);
const percentile = (value) => timings[Math.min(timings.length - 1, Math.ceil(timings.length * value) - 1)];
const average = timings.reduce((total, timing) => total + timing, 0) / timings.length;
const result = {
  target: target.origin,
  requests: requestCount,
  concurrency,
  failures,
  requestsPerSecond: Math.round((requestCount / durationMs) * 1_000),
  averageMs: Math.round(average),
  p50Ms: Math.round(percentile(0.5)),
  p95Ms: Math.round(percentile(0.95)),
  p99Ms: Math.round(percentile(0.99)),
  maxMs: Math.round(timings.at(-1)),
};

console.log(JSON.stringify(result, null, 2));
if (failures > 0) process.exitCode = 1;

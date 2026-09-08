// Temporary test: verify the JS inference in demoEngine matches Python model output.
// Run: node test_model.mjs   (from the project root)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const model = JSON.parse(readFileSync(join(here, "frontend/public/model.json"), "utf8"));
const samples = JSON.parse(readFileSync(join(here, "ai-model/export_samples.json"), "utf8"));
const FEATURES = ["gre", "toefl", "rating", "sop", "lor", "cgpa", "research"];

function predictChance(profile) {
  const x = FEATURES.map((f) => Number(profile[f]));
  const xs = x.map((v, i) => (v - model.scaler.mean[i]) / model.scaler.scale[i]);
  let raw = model.init;
  for (const tree of model.trees) {
    let node = 0;
    while (tree.childrenLeft[node] !== -1) {
      const goLeft = xs[tree.feature[node]] <= tree.threshold[node];
      node = goLeft ? tree.childrenLeft[node] : tree.childrenRight[node];
    }
    raw += model.learningRate * tree.value[node];
  }
  return Math.round(Math.min(Math.max(raw, 0.01), 0.99) * 1000) / 1000;
}

let failures = 0;
for (const s of samples) {
  const got = predictChance(s.input);
  const expected = Math.round(Math.min(Math.max(s.expected, 0.01), 0.99) * 1000) / 1000;
  const ok = Math.abs(got - expected) <= 0.002;
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} expected=${expected} got=${got}`);
}
console.log(failures === 0 ? "ALL SAMPLES PASS" : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);

import { toISODate } from "../lib/dates";
import type { DemoDataset } from "../lib/types";
import { landlord, properties } from "./landlord";
import { buildScenarioData } from "./scenarios";
import { units } from "./units";

export function buildDemoDataset(runDate: Date = new Date()): DemoDataset {
  const scenario = buildScenarioData(runDate);

  return {
    runDate: toISODate(runDate),
    landlords: [landlord],
    properties,
    units,
    ...scenario,
  };
}

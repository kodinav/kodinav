/// <reference lib="webworker" />
import { sampleStage } from "./creatures";

/**
 * Builds the creatures' dots off the main thread, in the order the story needs
 * them, and hands each one over as soon as it is ready.
 */
self.onmessage = (e: MessageEvent<{ count: number; stages: number[] }>) => {
  for (const stage of e.data.stages) {
    const cloud = sampleStage(stage, e.data.count);
    (self as unknown as Worker).postMessage(cloud, [cloud.pos.buffer, cloud.nrm.buffer]);
  }
};

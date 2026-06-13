import { useState } from "react";
import type { PickEvent } from "../types";

export function useRealtime() {
  const [events] = useState<PickEvent[]>([]);
  return events;
}

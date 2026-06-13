import { useEffect, useState } from "react";
import { api } from "aws-blocks";
import type { PickEvent } from "../types";

const MAX_EVENTS = 50;

export function useRealtime() {
  const [events, setEvents] = useState<PickEvent[]>([]);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const channel = await api.getPicksChannel();
        if (cancelled) return;
        const sub = channel.subscribe((msg: PickEvent) => {
          setEvents((prev) => [msg, ...prev].slice(0, MAX_EVENTS));
        });
        unsubscribe = sub.unsubscribe;
        await sub.established;
      } catch (err) {
        console.error("Live feed subscription failed", err);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return events;
}

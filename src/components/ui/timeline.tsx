import type { ReactNode } from "react";

/**
 * A2 timeline — spec/foundations.md § A2. Vertical list of events, newest
 * first, each with an icon, a line of text and a timestamp. Used for
 * request history and reminder history. Caller is responsible for
 * newest-first ordering — this component only renders what it's given.
 */
export interface TimelineEvent {
  id: string;
  icon: ReactNode;
  text: ReactNode;
  timestamp: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <ol className="flex flex-col">
      {events.map((event, index) => (
        <li key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
            >
              {event.icon}
            </span>
            {index < events.length - 1 && (
              <span className="w-px flex-1 bg-line" aria-hidden="true" />
            )}
          </div>
          <div className="pb-4">
            <p className="type-body text-body">{event.text}</p>
            <p className="type-small text-muted">{event.timestamp}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

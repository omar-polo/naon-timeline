import type { TimelineEvent } from './types';
import ChipRail from './ChipRail';
import YearRuler from './YearRuler';

export default function BottomBar({
  years,
  countsByYear,
  selectedYear,
  yearEvents,
  selectedEventId,
  onSelectYear,
  onSelectEvent,
}: {
  years: number[];
  countsByYear: Map<number, number>;
  selectedYear: number;
  yearEvents: TimelineEvent[];
  selectedEventId: number | null;
  onSelectYear: (year: number) => void;
  onSelectEvent: (event: TimelineEvent) => void;
}) {
  return (
    <div className="flex-none bg-white border-t border-border flex flex-col gap-[10px] pt-3 pb-4">
      <ChipRail
        year={selectedYear}
        events={yearEvents}
        selectedEventId={selectedEventId}
        onSelect={onSelectEvent}
      />
      <YearRuler
        years={years}
        countsByYear={countsByYear}
        selectedYear={selectedYear}
        onSelect={onSelectYear}
      />
    </div>
  );
}

"use client";

import { getTimeTables } from "@/app/lib/time-fetcher";
import { TimetableList } from "@/app/lib/timetable";
import { TimetableCreator } from "@/app/ui/TimetableCreator";
import {
  AllSubjectsProvider,
  SelectedSubjectsProvider,
} from "./lib/SubjectsContext";

export default function Page() {
  const timetable = getTimeTables();

  return (
    <div>
      <SelectedSubjectsProvider>
        <AllSubjectsProvider>
          <TimetableCreator
            timetable={new TimetableList(timetable)}
            subjects={[]}
          />
        </AllSubjectsProvider>
      </SelectedSubjectsProvider>
    </div>
  );
}

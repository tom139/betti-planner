"use client";

import { getTimeTables } from "@/app/lib/time-fetcher";
import { TimetableList } from "@/app/lib/timetable";
import { SubjectSelector } from "@/app/ui/create/subject-selector";
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
          <SubjectSelector
            timetable={new TimetableList(timetable)}
            subjects={[]}
          />
        </AllSubjectsProvider>
      </SelectedSubjectsProvider>
    </div>
  );
}

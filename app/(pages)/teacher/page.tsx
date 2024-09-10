"use client";

import { ClassHour, TimetableList } from "@/app/lib/timetable";
import { useAllSubjects } from "@/app/lib/SubjectsContext";
import { useEffect, useState } from "react";
import { SubjectsSelector } from "@/app/ui/SubjectsSelector";
import Timetable from "@/app/ui/Timetable";
import SubjectsStats from "@/app/ui/SubjectStats";
import {
  AllSubjectsProvider,
  SelectedSubjectsProvider,
} from "./lib/SubjectsContext";
import { getTimeTables } from "@/app/lib/time-fetcher";

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

function SubjectSelector({
  timetable,
}: {
  timetable: TimetableList;
  subjects: string[];
}) {
  const { setAllSubjects } = useAllSubjects();
  const [selectedClasses, setSelectedClasses] = useState<ClassHour[]>([]);

  useEffect(() => {
    setAllSubjects(timetable);
  }, [timetable]);

  return (
    <div>
      <h2>Seleziona le tue classi</h2>
      <SubjectsSelector />
      <SubjectsStats selectedClasses={selectedClasses} />
      <Timetable
        selectedClasses={selectedClasses}
        setSelectedClasses={setSelectedClasses}
      />
    </div>
  );
}

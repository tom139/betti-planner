"use client";

import { Lecture, TimetableList } from "@/app/lib/timetable";
import { useAllSubjects } from "@/app/lib/SubjectsContext";
import { useEffect, useState } from "react";
import { ProfSelector } from "@/app/ui/ProfSelector";
import Timetable from "@/app/ui/Timetable";
import SubjectsStats from "@/app/ui/SubjectStats";
import {
  AllSubjectsProvider,
  SelectedSubjectsProvider,
} from "@/app/lib/SubjectsContext";
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
  const [selectedLectures, setSelectedLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    setAllSubjects(timetable);
  }, [timetable]);

  return (
    <div>
      <h2>Seleziona il docente</h2>
      <ProfSelector />
      <SubjectsStats selectedLectures={selectedLectures} />
      <Timetable
        selectedLectures={selectedLectures}
        setSelectedLectures={setSelectedLectures}
      />
    </div>
  );
}

"use client";

import { SubjectHour, TimetableList } from "@/app/lib/timetable";
import { useAllSubjects } from "@/app/lib/SubjectsContext";
import { useEffect, useState } from "react";
import { SubjectsSelector } from "@/app/ui/SubjectsSelector";
import Timetable from "@/app/ui/Timetable";
import SubjectsStats from "@/app/ui/SubjectStats";
import { ProfSelector } from "../ProfSelector";
import { Segmented } from "antd";

export function SubjectSelector({
  timetable,
}: {
  timetable: TimetableList;
  subjects: string[];
}) {
  const { setAllSubjects } = useAllSubjects();
  const [selectedClasses, setSelectedClasses] = useState<SubjectHour[]>([]);
  const [selectProf, setSelectProf] = useState<boolean>(true);

  useEffect(() => {
    setAllSubjects(timetable);
  }, [timetable]);

  return (
    <div>
      <Segmented
        options={["Docente", "Classi"]}
        onChange={(value) => setSelectProf(value == "Docente")}
      />
      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        {selectProf ? <ProfSelector /> : <SubjectsSelector />}
      </div>
      <Timetable
        selectedClasses={selectedClasses}
        setSelectedClasses={setSelectedClasses}
      />
    </div>
  );
}

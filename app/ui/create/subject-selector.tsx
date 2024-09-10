"use client";

import { Lecture, TimetableList } from "@/app/lib/timetable";
import { useAllSubjects, useSelectedSubjects } from "@/app/lib/SubjectsContext";
import { useEffect, useState } from "react";
import { SubjectsSelector } from "@/app/ui/SubjectsSelector";
import Timetable from "@/app/ui/Timetable";
import SubjectsStats from "@/app/ui/SubjectStats";
import { ProfSelector } from "../ProfSelector";
import { Button, Flex, InputNumber, Segmented, Tooltip } from "antd";
import { FireOutlined } from "@ant-design/icons";
import { randomLectures } from "@/app/lib/lecturesSelector";

export function SubjectSelector({
  timetable,
}: {
  timetable: TimetableList;
  subjects: string[];
}) {
  const { setAllSubjects } = useAllSubjects();
  const { selectedSubjects } = useSelectedSubjects();
  const [selectedLectures, setSelectedLectures] = useState<Lecture[]>([]);
  const [selectProf, setSelectProf] = useState<boolean>(true);
  const [targetHours, setTargetHours] = useState<number>(18);

  useEffect(() => {
    setAllSubjects(timetable);
  }, [timetable]);

  const assignSubjects = () => {
    setSelectedLectures(
      randomLectures(selectedSubjects.subjects, { targetHours })
    );
  };

  return (
    <div>
      <Segmented
        options={["Docente", "Classi"]}
        onChange={(value) => {
          setSelectProf(value == "Docente");
          assignSubjects();
        }}
      />
      <Flex gap="small" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        {selectProf ? <ProfSelector /> : <SubjectsSelector />}
        <Tooltip title="Ore totali da assegnare">
          <InputNumber
            min={1}
            max={22}
            value={targetHours}
            onChange={(value) => setTargetHours(value ?? 1)}
          />
        </Tooltip>
        <Tooltip title="Riassegna casualmente le ore">
          <Button
            type="primary"
            icon={<FireOutlined />}
            onClick={assignSubjects}
            disabled={selectedSubjects.subjects.length == 0}
          >
            Assign
          </Button>
        </Tooltip>
      </Flex>
      <SubjectsStats selectedLectures={selectedLectures} />
      <Timetable
        selectedLectures={selectedLectures}
        setSelectedLectures={setSelectedLectures}
      />
    </div>
  );
}

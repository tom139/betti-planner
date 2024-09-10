"use client";

import { Lecture, TimetableList } from "@/app/lib/timetable";
import { useAllSubjects, useSelectedSubjects } from "@/app/lib/SubjectsContext";
import { useEffect, useState } from "react";
import { SubjectsSelector } from "@/app/ui/SubjectsSelector";
import Timetable from "@/app/ui/Timetable";
import SubjectsStats from "@/app/ui/SubjectStats";
import { ProfSelector } from "./ProfSelector";
import { Button, Flex, InputNumber, Segmented, Space, Tooltip } from "antd";
import { FireOutlined, DownloadOutlined } from "@ant-design/icons";
import { randomLectures } from "@/app/lib/lecturesSelector";
import { exportToCsv } from "@/app/lib/csvExport";

export function TimetableCreator({
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
      <TopRow
        selectedLectures={selectedLectures}
        setSelectedLectures={setSelectedLectures}
      />
      <SubjectsStats selectedLectures={selectedLectures} />
      <Timetable
        selectedLectures={selectedLectures}
        setSelectedLectures={setSelectedLectures}
      />
    </div>
  );
}

const TopRow = ({
  selectedLectures,
  setSelectedLectures,
}: {
  selectedLectures: Lecture[];
  setSelectedLectures: (x: Lecture[]) => void;
}) => {
  const { selectedSubjects } = useSelectedSubjects();
  const [selectedProf, setSelectedProf] = useState<string | undefined>("");
  const [targetHours, setTargetHours] = useState<number>(18);

  const assignSubjects = () => {
    setSelectedLectures(
      randomLectures(selectedSubjects.subjects, { targetHours })
    );
  };

  const downloadLectures = () => {
    const csvData = exportToCsv({
      lectures: selectedLectures,
      prof: selectedProf,
    });
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <>
      <Flex justify="space-between">
        <Segmented
          options={["Docente", "Classi"]}
          onChange={(value) => {
            setSelectedProf(value == "Docente" ? "" : undefined);
            setSelectedLectures([]);
          }}
        />
        <Space />
        <Tooltip title="Scarica l'orario in formato CSV">
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={downloadLectures}
            disabled={selectedLectures.length == 0}
          >
            Scarica Orario
          </Button>
        </Tooltip>
      </Flex>
      <Flex gap="small" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        {selectedProf === undefined ? (
          <SubjectsSelector />
        ) : (
          <ProfSelector
            selectedProf={selectedProf}
            setSelectedProf={setSelectedProf}
          />
        )}
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
    </>
  );
};

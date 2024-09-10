import { Cascader } from "antd";
import { useSelectedSubjects, useAllSubjects } from "@/app/lib/SubjectsContext";
import { TimetableList } from "@/app/lib/timetable";
import { professors } from "../lib/prof";

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export function ProfSelector({
  selectedProf,
  setSelectedProf,
}: {
  selectedProf: string | undefined;
  setSelectedProf: (prof: string | undefined) => void;
}) {
  const { setSelectedSubjects } = useSelectedSubjects();
  const { allSubjects } = useAllSubjects();
  const options: Option[] = professors.map((prof) => ({
    value: prof.name,
    label: prof.name,
  }));

  return (
    <Cascader
      options={options}
      value={selectedProf ? [selectedProf] : undefined}
      style={{ width: "100%" }}
      placeholder="Seleziona il docente"
      onChange={(option) => {
        if (option.length == 0) {
          setSelectedProf(undefined);
        } else {
          setSelectedProf(option[0]);
        }
        const profSubjects =
          professors.find((prof) => prof.name == option[0])?.subjects ?? [];
        const selectedSubjects = profSubjects.flatMap(
          (ks) => allSubjects.getSubjectForClassAndSubject(ks) ?? []
        );
        setSelectedSubjects(new TimetableList(selectedSubjects));
      }}
    />
  );
}

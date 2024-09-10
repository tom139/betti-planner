import { Cascader } from "antd";
import { useSelectedSubjects, useAllSubjects } from "@/app/lib/SubjectsContext";
import { TimetableList } from "@/app/lib/timetable";

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export function SubjectsSelector() {
  const { setSelectedSubjects } = useSelectedSubjects();
  const { allSubjects } = useAllSubjects();
  const subjectsByClass = allSubjects.getClassesAndSubjects();
  const options = subjectsByClass.map(({ klass, subjects }) => ({
    value: klass,
    label: klass,
    children: subjects.map((subject) => ({
      value: subject,
      label: `${klass} - ${subject}`,
    })),
  }));
  const optionsByClassYear: Option[] = options.reduce((acc, x) => {
    const year = x.value.slice(0, 1);
    if (acc.find((y) => y.label === year) === undefined) {
      acc.push({ value: year, label: year, children: [x] });
    } else {
      acc.find((y) => y.label === year)?.children?.push(x);
    }
    return acc;
  }, [] as Option[]);
  const { SHOW_CHILD } = Cascader;

  return (
    <Cascader
      options={optionsByClassYear}
      multiple
      showCheckedStrategy={SHOW_CHILD}
      style={{ width: "100%" }}
      onChange={(options, _) => {
        const selected = options
          .map((x) => {
            return { klass: x[1], subject: x[2] };
          })
          .map((x) => allSubjects.getSubjectForClassAndSubject(x))
          .filter((x) => x !== undefined);

        setSelectedSubjects(new TimetableList(selected));
      }}
    />
  );
}

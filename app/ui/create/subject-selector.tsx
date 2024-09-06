"use client";

import {
  // SubjectTimetable,
  Day,
  days,
  TimetableList,
} from "@/app/lib/timetable";
import { useSelectedSubjects, useAllSubjects } from "@/app/lib/SubjectsContext";
import { useEffect, useState } from "react";
import {
  Cascader,
  List,
  Space,
  TableProps,
  Col,
  Checkbox,
  Row,
  Card,
} from "antd";
import ClassStats from "../ClassStats";

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export function SubjectSelector({
  timetable,
}: {
  timetable: TimetableList;
  subjects: string[];
}) {
  const { setAllSubjects } = useAllSubjects();
  const [selectedClasses, setSelectedClasses] = useState<
    {
      klass: string;
      subject: string;
      day: Day;
      hour: number;
    }[]
  >([]);

  useEffect(() => {
    setAllSubjects(timetable);
  }, [timetable]);

  return (
    <div>
      <h2>Seleziona le tue classi</h2>
      <Selector />
      <SubjectList selectedClasses={selectedClasses} />
      <Row>
        <Col flex="5%" key="header-hour">
          <b>Ora</b>
        </Col>
        {days.map((day) => {
          return (
            <Col flex="18%" key={`header-${day}`}>
              <b>{day}</b>
            </Col>
          );
        })}
      </Row>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
        <TimeRow
          key={`header-${hour}`}
          hour={hour}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
        />
      ))}
    </div>
  );
}

function Selector() {
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
  const { SHOW_CHILD } = Cascader;

  return (
    <Cascader
      options={options}
      multiple
      showCheckedStrategy={SHOW_CHILD}
      style={{ width: "100%" }}
      onChange={(options, _) => {
        const selected = options
          .map((x) => {
            return { klass: x[0], subject: x[1] };
          })
          .map((x) => allSubjects.getSubjectForClassAndSubject(x))
          .filter((x) => x !== undefined);

        setSelectedSubjects(new TimetableList(selected));
      }}
    />
  );
}

function SubjectList({
  selectedClasses,
}: {
  selectedClasses: { klass: string; subject: string; day: Day; hour: number }[];
}) {
  const { selectedSubjects } = useSelectedSubjects();
  const ds = selectedSubjects.subjects.map((x) => {
    return {
      name: x.name,
      teacher: x.teacher,
      klass: x.class,
      hours: selectedClasses.filter(
        (s) => s.subject === x.name && s.klass === x.class
      ).length,
    };
  });
  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{ marginBottom: "16px", marginTop: "16px" }}
      >
        <Col span={24}>
          <ClassStats
            title="Totale"
            hours={ds.reduce((acc, x) => acc + x.hours, 0)}
          />
        </Col>
        {ds.map((x) => (
          <Col span={8} key={`${x.klass}-${x.name}`}>
            <ClassStats title={`${x.klass} - ${x.name}`} hours={x.hours} />
          </Col>
        ))}
      </Row>
    </>
  );
}

interface SubjectPlan {
  hour: number;
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
}

const columns: TableProps<SubjectPlan>["columns"] = [
  {
    title: "Ora",
    dataIndex: "hour",
    key: "hour",
  },
  {
    title: "Lunedì",
    dataIndex: "monday",
    key: "monday",
  },
  {
    title: "Martedì",
    dataIndex: "tuesday",
    key: "tuesday",
  },
  {
    title: "Mercoledì",
    dataIndex: "wednesday",
    key: "wednesday",
  },
  {
    title: "Giovedì",
    dataIndex: "thursday",
    key: "thursday",
  },
  {
    title: "Venerdì",
    dataIndex: "friday",
    key: "friday",
  },
];

function TimeRow({
  hour,
  selectedClasses,
  setSelectedClasses,
}: {
  hour: number;
  selectedClasses: { klass: string; subject: string; day: Day; hour: number }[];
  setSelectedClasses: (
    x: { klass: string; subject: string; day: Day; hour: number }[]
  ) => void;
}) {
  const { selectedSubjects } = useSelectedSubjects();
  return (
    <>
      <Row>
        <Col key="hour" flex="5%">
          <b>{hour}</b>
        </Col>
        {days.map((day) => {
          const ss = new TimetableList(
            selectedSubjects.getSubjectsForDayAndHour({ day, hour })
          );
          return (
            <Col key={day} flex="18%">
              <SubjectsCell
                selectedClasses={selectedClasses}
                setSelectedClasses={setSelectedClasses}
                day={day}
                hour={hour}
                key={day}
                subjects={ss}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
}

function SubjectsCell({
  subjects,
  day,
  hour,
  selectedClasses,
  setSelectedClasses,
}: {
  subjects: TimetableList;
  day: Day;
  hour: number;
  selectedClasses: { klass: string; subject: string; day: Day; hour: number }[];
  setSelectedClasses: (
    x: { klass: string; subject: string; day: Day; hour: number }[]
  ) => void;
}) {
  const options = subjects.subjects.map((x) => ({
    value: `${x.class} - ${x.name}`,
    label: `${x.class} - ${x.name}`,
  }));

  const selected = selectedClasses
    .filter((x) => x.day === day && x.hour === hour)
    .map((x) => `${x.klass} - ${x.subject}`);

  const onChange = (value: string[]) => {
    const otherClasses = selectedClasses.filter(
      (x) => x.day !== day || x.hour !== hour
    );

    if (value.length === 0) {
      setSelectedClasses(otherClasses);
    } else {
      const existingValues = selectedClasses
        .filter((x) => x.day === day && x.hour === hour)
        .map((x) => `${x.klass} - ${x.subject}`);
      const newValue = value.find((x) => !existingValues.includes(x));
      if (newValue === undefined) {
        return;
      }
      const [newClass, newSubject] = newValue.split(" - ");
      setSelectedClasses(
        otherClasses.concat({ klass: newClass, subject: newSubject, day, hour })
      );
    }
  };

  return (
    <Card
      size="small"
      style={{
        height: "100%",
        backgroundColor: selected.length > 0 ? "#e6f7ff" : "transparent",
      }}
    >
      <Checkbox.Group
        style={{ display: "block" }}
        key={subjects.subjects.map((x) => x.name).join(",")}
        options={options}
        value={selected || []}
        onChange={onChange}
      />
    </Card>
  );
}

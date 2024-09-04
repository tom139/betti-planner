"use client";

import {
  // SubjectTimetable,
  Day,
  days,
  TimetableList,
} from "@/app/lib/timetable";
import { use, useState } from "react";
import {
  Cascader,
  List,
  Space,
  TableProps,
  Col,
  Checkbox,
  Row,
  Divider,
  Card,
} from "antd";

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
  const [allSubjects, setAllSubjects] = useState<TimetableList>(timetable);
  const [subjects, setSubjects] = useState<TimetableList>(
    new TimetableList([])
  );
  const [selectedClasses, setSelectedClasses] = useState<
    {
      klass: string;
      subject: string;
      day: Day;
      hour: number;
    }[]
  >([]);

  return (
    <div>
      <h2>Seleziona le tue classi</h2>
      <Selector timetable={allSubjects} setSubjects={setSubjects} />
      <SubjectList subjects={subjects} selectedClasses={selectedClasses} />
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
          subjects={subjects}
          hour={hour}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
        />
      ))}
    </div>
  );
}

function Selector({
  timetable,
  setSubjects,
}: {
  timetable: TimetableList;
  setSubjects: (subjects: TimetableList) => void;
}) {
  const subjectsByClass = timetable.getClassesAndSubjects();
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
      onChange={(options, _) => {
        const selected = options
          .map((x) => {
            return { klass: x[0], subject: x[1] };
          })
          .map((x) => timetable.getSubjectForClassAndSubject(x))
          .filter((x) => x !== undefined);

        setSubjects(new TimetableList(selected));
      }}
    />
  );
}

function SubjectList({
  subjects,
  selectedClasses,
}: {
  subjects: TimetableList;
  selectedClasses: { klass: string; subject: string; day: Day; hour: number }[];
}) {
  const ds = subjects.subjects.map((x) => {
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
    <List
      itemLayout="horizontal"
      dataSource={ds}
      renderItem={(x) => (
        <List.Item>
          <List.Item.Meta
            title={`${x.klass} - ${x.name}`}
            description={x.teacher}
          />
          <Space />
          <p>
            hours:
            {x.hours}
          </p>
        </List.Item>
      )}
    />
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
  subjects,
  hour,
  selectedClasses,
  setSelectedClasses,
}: {
  subjects: TimetableList;
  hour: number;
  selectedClasses: { klass: string; subject: string; day: Day; hour: number }[];
  setSelectedClasses: (
    x: { klass: string; subject: string; day: Day; hour: number }[]
  ) => void;
}) {
  return (
    <>
      <Row>
        <Col key="hour" flex="5%">
          <b>{hour}</b>
        </Col>
        {days.map((day) => {
          const ss = new TimetableList(
            subjects.getSubjectsForDayAndHour({ day, hour })
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

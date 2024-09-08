"use client";

import { Day, days, TimetableList } from "@/app/lib/timetable";
import { useSelectedSubjects, useAllSubjects } from "@/app/lib/SubjectsContext";
import { useEffect, useState } from "react";
import { Col, Checkbox, Row, Card } from "antd";
import ClassStats from "@/app/ui/ClassStats";
import { SubjectsSelector } from "@/app/ui/SubjectsSelector";

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
      <SubjectsSelector />
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
        {ds
          .sort((a, b) =>
            `${a.klass} ${a.name}` > `${b.klass} ${b.name}` ? 1 : -1
          )
          .map((x) => (
            <Col span={4} key={`${x.klass}-${x.name}`}>
              <ClassStats title={`${x.klass} - ${x.name}`} hours={x.hours} />
            </Col>
          ))}
      </Row>
    </>
  );
}

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

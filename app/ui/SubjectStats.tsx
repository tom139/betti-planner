"use client";

import React from "react";
import { Card, Col, Row } from "antd";
import { useSelectedSubjects } from "../lib/SubjectsContext";
import { Day } from "../lib/timetable";

interface ClassStatsProps {
  title: string;
  hours: number;
}

const ClassStats: React.FC<ClassStatsProps> = ({ title, hours }) => {
  return (
    <>
      <Card title={title} size="small">
        <p>{hours} ore</p>
      </Card>
    </>
  );
};

const SubjectsStats: React.FC<{
  selectedClasses: { klass: string; subject: string; day: Day; hour: number }[];
}> = ({ selectedClasses }) => {
  const { selectedSubjects } = useSelectedSubjects();
  const ds = selectedSubjects.subjects.map((x) => {
    return {
      name: x.name,
      teacher: x.teacher,
      klass: x.klass,
      hours: selectedClasses.filter(
        (s) => s.subject === x.name && s.klass === x.klass
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
};

export default SubjectsStats;

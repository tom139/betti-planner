"use client";

import React from "react";
import { Card } from "antd";

interface ClassStatsProps {
  title: string;
  hours: number;
}

const colors = [
  "#AEC6CF",
  "#FFB7B2",
  "#FFDAC1",
  "#B39EB5",
  "#C5E1A5",
  "#FFD1DC",
];

const ClassStats: React.FC<ClassStatsProps> = ({ title, hours }) => {
  return (
    <div>
      <Card
        title={title}
        size="small"
        // style={{ marginTop: "1em", marginBottom: "1em" }}
      >
        <p>{hours} ore</p>
      </Card>
    </div>
  );
};

export default ClassStats;

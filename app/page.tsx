"use client";

import { getTimeTables } from "@/app/lib/time-fetcher";
import { TimetableList } from "@/app/lib/timetable";
import { SubjectSelector } from "@/app/ui/create/subject-selector";

export default function Page() {
  // const [timetable] = useState(getTimeTables());
  // const [subjects, setSubjects] = useState([]);
  const timetable = getTimeTables();

  return (
    <div>
      <h1>Page</h1>
      <SubjectSelector timetable={new TimetableList(timetable)} subjects={[]} />
    </div>
  );
}

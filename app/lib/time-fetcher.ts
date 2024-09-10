import { orario } from "./orario";
import { SubjectTimetable, days } from "./timetable";
import { parse } from "csv-parse/sync";

/**
 * This function returns some mock data for the time tables.
 */
export function getTimeTables(): SubjectTimetable[] {
  return getTimeTablesFromCSV(orario);
}

export function getTimeTablesFromCSV(csvContent: string): SubjectTimetable[] {
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  const timetables: SubjectTimetable[] = [];

  for (const record of records) {
    const className = record["class"];
    if (!className || className == "") {
      continue;
    }

    for (let day = 0; day < 5; day++) {
      for (let hour = 1; hour <= 8; hour++) {
        const columnName = `${days[day]}_${hour}`;
        const cellContent = record[columnName];

        if (cellContent) {
          const [subject, teacher] = cellContent.split("\n");

          let timetable = timetables.find(
            (t) =>
              t.name === subject &&
              // t.teacher === teacher &&
              t.klass === className
          );

          if (!timetable) {
            timetable = {
              name: subject,
              teacher: teacher,
              klass: className,
              schedule: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
              },
            };
            timetables.push(timetable);
          }

          timetable.schedule[days[day]].push(hour);
        }
      }
    }
  }

  return timetables;
}

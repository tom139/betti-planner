import { orario } from "./orario";
import { SubjectTimetable, days } from "./timetable";
import { parse } from "csv-parse/sync";

/**
 * This function returns some mock data for the time tables.
 */
export function getTimeTables(): SubjectTimetable[] {
  return getTimeTablesFromCSV(orario);
  return [
    {
      name: "Matematica",
      teacher: "Bianchi",
      class: "1AS",
      schedule: {
        monday: [1, 2, 3],
        tuesday: [],
        wednesday: [4, 5],
        thursday: [],
        friday: [8],
      },
    },
    {
      name: "Biologia",
      teacher: "Rossi",
      class: "1AS",
      schedule: {
        monday: [1, 2, 3],
        tuesday: [3, 4, 5],
        wednesday: [4, 5, 6],
        thursday: [2, 3, 4],
        friday: [6, 7, 8],
      },
    },
    {
      name: "Italiano",
      teacher: "Verdi",
      class: "1BA",
      schedule: {
        monday: [2, 3, 4],
        tuesday: [4, 5, 6],
        wednesday: [4, 5],
        thursday: [3, 4],
        friday: [7, 8],
      },
    },
    {
      name: "Matematica",
      teacher: "Bianchi",
      class: "1BA",
      schedule: {
        monday: [1, 2, 3, 4],
        tuesday: [2, 3],
        wednesday: [1, 4, 5],
        thursday: [3, 4],
        friday: [1, 2, 8],
      },
    },
  ];
}

export function getTimeTablesFromCSV(csvContent: string): SubjectTimetable[] {
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  const timetables: SubjectTimetable[] = [];

  for (const record of records) {
    const className = record["class"];

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
              t.class === className
          );

          if (!timetable) {
            timetable = {
              name: subject,
              teacher: teacher,
              class: className,
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

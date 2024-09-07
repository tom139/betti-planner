import { SubjectTimetable } from "./timetable";

/**
 * This function returns some mock data for the time tables.
 */
export function getTimeTables(): SubjectTimetable[] {
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

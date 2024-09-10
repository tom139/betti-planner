import { Professor } from "./timetable";

export const professors: Professor[] = [
  {
    name: "Bettanin",
    subjects: [
      { klass: "1AS", subject: "ING" },
      { klass: "1AS", subject: "TIC" },
      { klass: "1BM", subject: "LETT" },
      { klass: "4 ART", subject: "LETT" },
      { klass: "2 ARTy", subject: "TDP" },
      { klass: "5 BM", subject: "LETT" },
      { klass: "3 BM", subject: "LETT" },
    ],
  },
  {
    name: "Rossi",
    subjects: [
      { klass: "2AS", subject: "ING" },
      { klass: "2AS", subject: "TIC" },
      { klass: "2BM", subject: "LETT" },
      { klass: "3 ART", subject: "LETT" },
      { klass: "1 ARTy", subject: "TDP" },
      { klass: "4 BM", subject: "ING" },
      { klass: "2 BM", subject: "ING" },
    ],
  },
];

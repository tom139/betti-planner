import { days, dayTrn, Lecture } from "@/app/lib/timetable";

export function exportToCsv({
  lectures,
  prof,
}: {
  lectures: Lecture[];
  prof: string | undefined;
}): string[][] {
  const csvData = [[prof || "Ora", ...days.map((day) => dayTrn[day])]];
  const maxHour = Math.max(...lectures.map((l) => l.hour));

  for (let hour = 1; hour <= maxHour; hour++) {
    let row = [hour.toString()];
    for (let day of days) {
      const lecture = lectures.find((l) => l.hour == hour && l.day == day);
      if (lecture) {
        row.push(`${lecture.klass} - ${lecture.subject}`);
      } else {
        row.push("");
      }
    }
    csvData.push(row);
  }

  return csvData;
}

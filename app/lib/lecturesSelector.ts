import { Day, Lecture, SubjectTimetable } from "./timetable";

export function randomLectures(
  timetable: SubjectTimetable[],
  options: {
    targetHours: number;
  }
): Lecture[] {
  const { targetHours } = options;
  let availableLectures = timetableToLectures(timetable);

  const subjects = Array.from(
    new Set(
      availableLectures.map((lecture) => [lecture.subject, lecture.klass])
    )
  ).reverse();

  let selectedLectures: Lecture[] = [];
  let subjectIndex = 0;
  let iterations = 1000;

  while (selectedLectures.length < targetHours && iterations-- > 0) {
    const [subject, klass] = subjects[subjectIndex++ % subjects.length];
    const lectureIndex = availableLectures.findIndex(
      (candidate) =>
        subject === candidate.subject &&
        klass === candidate.klass &&
        !selectedLectures.some(
          (l) => l.day == candidate.day && l.hour == candidate.hour
        )
    );
    if (lectureIndex === -1) {
      continue;
    }
    selectedLectures.push(availableLectures[lectureIndex]);
    availableLectures.splice(lectureIndex, 1);
  }

  return selectedLectures;
}

function timetableToLectures(timetable: SubjectTimetable[]): Lecture[] {
  return timetable
    .flatMap((subject) =>
      Object.entries(subject.schedule).flatMap(([day, hours]) =>
        hours.map((hour) => ({
          subject: subject.name,
          klass: subject.klass,
          day: day as Day,
          hour,
        }))
      )
    )
    .sort(() => Math.random() - 0.5);
}

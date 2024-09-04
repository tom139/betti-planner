export type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
export const days: Day[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

export interface SubjectTimetable {
  name: string;
  teacher: string;
  class: string;
  schedule: { [day in Day]: number[] };
}

/**
 * This class is a container for multiple SubjectTimetable instances,
 * that exports methods to query specific characteristics of the data.
 */
export class TimetableList {
  subjects: SubjectTimetable[];

  constructor(subjects: SubjectTimetable[]) {
    this.subjects = subjects;
    this.filter.bind(this);
    this.getHoursForClassAndSubject.bind(this);
  }

  /**
   * Returns the list of subjects that are scheduled on a specific day.
   * @param day The day to query.
   */
  getSubjectsForDayAndHour({
    day,
    hour,
  }: {
    day: Day;
    hour: number | undefined;
  }): SubjectTimetable[] {
    let res = this.subjects.filter((x) => x.schedule[day].length > 0);
    if (hour !== undefined) {
      res = res.filter((x) => x.schedule[day].includes(hour));
    }
    return res;
  }

  /**
   * Returns all the classes and subjects.
   */
  getClassesAndSubjects(): { klass: string; subjects: string[] }[] {
    return this.subjects
      .reduce((acc, x) => {
        const index = acc.findIndex((y) => y.klass === x.class);
        if (index === -1) {
          acc.push({ klass: x.class, subjects: [x.name] });
        } else {
          acc[index].subjects.push(x.name);
        }
        return acc;
      }, [] as { klass: string; subjects: string[] }[])
      .sort((a, b) => a.klass.localeCompare(b.klass));
  }

  /**
   *
   * @param { klass, subject }
   * @returns
   */
  getSubjectForClassAndSubject({
    klass,
    subject,
  }: {
    klass: string;
    subject: string;
  }): SubjectTimetable | undefined {
    return this.subjects.find((x) => x.class === klass && x.name === subject);
  }

  filter(x: { klass: string; subject: string }[]): TimetableList {
    const elements = x
      .map(this.getSubjectForClassAndSubject)
      .filter((x) => x !== undefined);
    return new TimetableList(elements);
  }

  /**
   * Return the number of total hours for a class and subject.
   * @param param0 { klass, subject }
   * @returns
   */
  getHoursForClassAndSubject({
    klass,
    subject,
  }: {
    klass: string;
    subject: string;
  }): number {
    return this.filter([{ klass, subject }]).subjects.length;
  }
}

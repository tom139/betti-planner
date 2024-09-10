import { Row, Col, Card, Checkbox } from "antd";
import { useSelectedSubjects } from "@/app/lib/SubjectsContext";
import { Day, days, dayTrn, Lecture, TimetableList } from "@/app/lib/timetable";

export default function Timetable({
  selectedLectures,
  setSelectedLectures,
}: {
  selectedLectures: Lecture[];
  setSelectedLectures: (x: Lecture[]) => void;
}) {
  return (
    <>
      <Row>
        <Col flex="5%" key="header-hour">
          <b>Ora</b>
        </Col>
        {days.map((day) => {
          return (
            <Col flex="18%" key={`header-${day}`}>
              <b>{dayTrn[day]}</b>
            </Col>
          );
        })}
      </Row>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
        <TimeRow
          key={`header-${hour}`}
          hour={hour}
          selectedLectures={selectedLectures}
          setSelectedLectures={setSelectedLectures}
        />
      ))}
    </>
  );
}

function TimeRow({
  hour,
  selectedLectures,
  setSelectedLectures,
}: {
  hour: number;
  selectedLectures: Lecture[];
  setSelectedLectures: (x: Lecture[]) => void;
}) {
  const { selectedSubjects } = useSelectedSubjects();
  return (
    <>
      <Row>
        <Col key="hour" flex="5%">
          <b>{hour}</b>
        </Col>
        {days.map((day) => {
          const ss = new TimetableList(
            selectedSubjects.getSubjectsForDayAndHour({ day, hour })
          );
          return (
            <Col key={day} flex="18%">
              <SubjectsCell
                selectedLectures={selectedLectures}
                setSelectedLectures={setSelectedLectures}
                day={day}
                hour={hour}
                key={day}
                subjects={ss}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
}

function SubjectsCell({
  subjects,
  day,
  hour,
  selectedLectures,
  setSelectedLectures,
}: {
  subjects: TimetableList;
  day: Day;
  hour: number;
  selectedLectures: Lecture[];
  setSelectedLectures: (x: Lecture[]) => void;
}) {
  const options = subjects.subjects.map((x) => ({
    value: `${x.klass} - ${x.name}`,
    label: `${x.klass} - ${x.name}`,
  }));

  const selected = selectedLectures
    .filter((x) => x.day === day && x.hour === hour)
    .map((x) => `${x.klass} - ${x.subject}`);

  const onChange = (value: string[]) => {
    const otherClasses = selectedLectures.filter(
      (x) => x.day !== day || x.hour !== hour
    );

    if (value.length === 0) {
      setSelectedLectures(otherClasses);
    } else {
      const existingValues = selectedLectures
        .filter((x) => x.day === day && x.hour === hour)
        .map((x) => `${x.klass} - ${x.subject}`);
      const newValue = value.find((x) => !existingValues.includes(x));
      if (newValue === undefined) {
        return;
      }
      const [newClass, newSubject] = newValue.split(" - ");
      setSelectedLectures(
        otherClasses.concat({ klass: newClass, subject: newSubject, day, hour })
      );
    }
  };

  return (
    <Card
      size="small"
      style={{
        height: "100%",
        backgroundColor: selected.length > 0 ? "#e6f7ff" : "transparent",
      }}
    >
      <Checkbox.Group
        style={{ display: "block" }}
        key={subjects.subjects.map((x) => x.name).join(",")}
        options={options}
        value={selected || []}
        onChange={onChange}
      />
    </Card>
  );
}

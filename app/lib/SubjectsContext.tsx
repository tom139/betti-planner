import React, { createContext, useContext, useState } from "react";
import { TimetableList } from "@/app/lib/timetable";

interface SelectedSubjectsContextType {
  selectedSubjects: TimetableList;
  setSelectedSubjects: React.Dispatch<React.SetStateAction<TimetableList>>;
}

const SelectedSubjectsContext = createContext<
  SelectedSubjectsContextType | undefined
>(undefined);

export function SelectedSubjectsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedSubjects, setSelectedSubjects] = useState<TimetableList>(
    new TimetableList([])
  );

  return (
    <SelectedSubjectsContext.Provider
      value={{
        selectedSubjects,
        setSelectedSubjects,
      }}
    >
      {children}
    </SelectedSubjectsContext.Provider>
  );
}

export function useSelectedSubjects() {
  const context = useContext(SelectedSubjectsContext);
  if (context === undefined) {
    throw new Error("useSubjects must be used within a SubjectsProvider");
  }
  return context;
}

/* ---- */

interface AllSubjectsContextType {
  allSubjects: TimetableList;
  setAllSubjects: React.Dispatch<React.SetStateAction<TimetableList>>;
}

const AllSubjectsContext = createContext<AllSubjectsContextType | undefined>(
  undefined
);

export function AllSubjectsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allSubjects, setAllSubjects] = useState<TimetableList>(
    new TimetableList([])
  );

  return (
    <AllSubjectsContext.Provider
      value={{
        allSubjects,
        setAllSubjects,
      }}
    >
      {children}
    </AllSubjectsContext.Provider>
  );
}

export function useAllSubjects() {
  const context = useContext(AllSubjectsContext);
  if (context === undefined) {
    throw new Error("useSubjects must be used within a SubjectsProvider");
  }
  return context;
}

export interface DayDate {
  key: string;
  text: string; // TODO be more specific about the string format.
  trailing: boolean;
  isWeekend: boolean;
}

export interface WeekDay {
  long: string;
  short: string;
  narrow: string;
}

export interface Appointment {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
}

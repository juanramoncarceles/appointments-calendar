import { DateTime, Interval } from "luxon";

export interface DayDate {
  key: string; // TODO rename? this is the date in format yyyy-MM-dd
  text: string; // TODO rename? this is the day number 1-31
  trailing: boolean;
  isWeekend: boolean;
}

export interface WeekDay {
  long: string;
  short: string;
  narrow: string;
}

// TODO if startDate or endDate of the appointment is updated the daysInterval should be recalculated, use setters / getters?
export class AppointmentData {
  id: string;
  title: string;
  startDate: DateTime;
  endDate: DateTime;
  daysInterval: Interval;

  constructor(title: string, startDate: DateTime, endDate: DateTime) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.id = this.createId();
    this.daysInterval = this.createDaysInterval();
  }

  /**
   * The id is created this way so two appointments with the same values
   * could be found. Maybe not a good idea if the appointment data is updated it should change.
   * An alternative would be just to use a uuid so all are unique.
   */
  createId() {
    return `${this.title}${this.startDate.toISO()}${this.endDate.toISO()}`;
  }

  /**
   * Creates a time interval starting at the beginning of the first day and
   * ending at the end of the last day.
   */
  createDaysInterval() {
    // The start time of the first day.
    const startOfFirstDay = this.startDate.startOf("day");
    // The end time of the last day.
    const endOfLastDay = this.endDate.endOf("day");
    // The final interval.
    return Interval.fromDateTimes(startOfFirstDay, endOfLastDay);
  }
}

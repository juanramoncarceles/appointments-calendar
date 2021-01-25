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

export interface AppointmentFormData {
  title: string;
  startDateTime: DateTime;
  endDateTime: DateTime;
}

export class AppointmentData {
  id: string;
  title: string;
  startDate: DateTime;
  endDate: DateTime;

  constructor(
    id: string,
    title: string,
    startDate: DateTime,
    endDate: DateTime
  ) {
    this.id = id;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  /**
   * The interval of complete days that the appointment lasts.
   * From the beginning of the first day until the end of the last day.
   */
  get daysInterval() {
    // The start time of the first day.
    const startOfFirstDay = this.startDate.startOf("day");
    // The end time of the last day.
    const endOfLastDay = this.endDate.endOf("day");
    // The final interval.
    return Interval.fromDateTimes(startOfFirstDay, endOfLastDay);
  }
}

/**
 * Type Guard to check if the provided EventTarget is an Element.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element
 */
// export function isDOMElement(x: EventTarget): x is Element {
//   return (x as Element).className !== undefined;
// }

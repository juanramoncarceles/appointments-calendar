import { DateTime, Info, Interval } from "luxon";

const APP_LOCALE = "es-ES";
const DAYS_IN_A_WEEK = 7;
const MONTH_FORMAT = "yyyy-MM";
const DATE_FORMAT = "yyyy-MM-dd";

// The index of the weekend days: Saturday: 6 and Sunday: 7
const weekendNumbers = Object.freeze([6, 7]);

/**
 * Returns long, short, and narrow weekdays descriptions for the current `APP_LOCALE`.
 */
export function getWeekdaysDescriptions() {
  const config = { locale: APP_LOCALE };
  const long = Info.weekdaysFormat("long", config);
  const short = Info.weekdaysFormat("short", config);
  const narrow = Info.weekdaysFormat("narrow", config);

  return Array(DAYS_IN_A_WEEK)
    .fill(null)
    .map((_, weekDayIndex) => {
      return {
        long: long[weekDayIndex],
        short: short[weekDayIndex],
        narrow: narrow[weekDayIndex],
      };
    });
}

/**
 * Returns an array for the passed date's month with trailing dates for next/previous months.
 * The array represents a calendar that starts on Monday and ends on Sunday.
 * @param date The date in format `yyyy-MM`
 */
export function getMonthCalendarGrid(date: string) {
  const month = DateTime.fromFormat(date, MONTH_FORMAT);

  // Get the interval for the provided month
  const monthInterval = Interval.fromDateTimes(
    month.startOf("month"),
    month.endOf("month")
  );

  // Get offsets for trailing months
  const firstWeekOffset = monthInterval.start.weekday - 1;
  const lastWeekOffset = DAYS_IN_A_WEEK - monthInterval.end.weekday;

  // Get calendar with trailing intervals
  const calendarInterval = Interval.fromDateTimes(
    monthInterval.start.minus({
      days: firstWeekOffset > 0 ? firstWeekOffset : 0,
    }),
    monthInterval.end.plus({ days: lastWeekOffset })
  );

  // Map the interval to an ordered dates array that represents a calendars month.
  const totalDays = calendarInterval.count("days");
  const start = calendarInterval.start;
  return Array(totalDays)
    .fill(null)
    .map((_, startOffset) => {
      const date = start.plus({ days: startOffset });
      return {
        key: date.toFormat(DATE_FORMAT),
        text: date.toLocaleString({ locale: APP_LOCALE, day: "numeric" }),
        trailing: !month.hasSame(date, "month"),
        isWeekend: weekendNumbers.includes(date.weekday),
      };
    });
}

/**
 * Returns a localized formatted month and year string.
 * @param month The month to get the key from.
 */
export function getDisplayMonthAndYear(month: string) {
  return DateTime.fromFormat(month, MONTH_FORMAT).toLocaleString({
    locale: APP_LOCALE,
    year: "numeric",
    month: "long",
  });
}

/**
 * Returns a 24 hour string representation of a time of the provided DateTime.
 * Hour value is not padded, for example: 9:00
 */
export function dateTimeToTimeString(dateTime: DateTime) {
  return dateTime.toLocaleString(DateTime.TIME_24_SIMPLE);
}

/**
 * Returns a 24 hour padded string representation of a time of the provided DateTime.
 */
export function dateTimeToPaddedTimeString(dateTime: DateTime) {
  return dateTime.toFormat("HH:mm");
}

/**
 * Returns a boolean indicating if the provided date time is today.
 */
export function isToday(dateTime: DateTime) {
  return dateTime.hasSame(DateTime.local(), "day");
}

/**
 * Returns a string uuid.
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
export function uuidv4() {
  return ((1e7).toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );
}

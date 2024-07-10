import { DateTime } from 'luxon';

/**
 * Converts a time string in the format 'HH:mm:ss' to ISO format.
 * If the input is null, it returns null.
 *
 * @param {string | null} time - The time string to be converted. It should be in the format 'HH:mm:ss'.
 * @returns {string | null} - The ISO formatted time string or null if the input is null.
 *
 * @example
 * // returns '1970-01-01T10:30:00.000Z'
 * formatToISO('10:30:00');
 *
 * @example
 * // returns null
 * formatToISO(null);
 */
const formatToISO = (time: string | null): string | null => {
  return time
    ? DateTime.fromFormat(time, 'HH:mm:ss', { zone: 'utc' }).toISO()
    : null;
};

/**
 * Formats a given date string into a specified format using Luxon's DateTime object.
 *
 * @param {string} date - The date string to format.
 * @param {string} format - The format to apply to the date string.
 * @return {string} The formatted date string.
 */
const formatDate = (date: string, format: string): string => {
  return DateTime.fromISO(date).toFormat(format);
};

/**
 * Retrieves the current date and time as a DateTime object.
 *
 * @return {DateTime} The current date and time as a DateTime object.
 */
const getCurrentDate = (): DateTime => {
  return DateTime.now();
};

/**
 * Retrieves the current time duration. For example, 'PT1H2M3S'.
 *
 * @return {string} The current time duration.
 */
const getCurrentTimeDuration = (): string => {
  const hours = getCurrentDate().hour;
  const minutes = getCurrentDate().minute;
  const seconds = getCurrentDate().second;

  return `PT${hours}H${minutes}M${seconds}S`;
};

/**
 * Determines if a given time is between a start time and an end time.
 *
 * @param {string} time - The time to check in the format 'HH:mm'.
 * @param {string} startTime - The start time in the format 'HH:mm'.
 * @param {string} endTime - The end time in the format 'HH:mm'.
 * @return {boolean} Returns true if the time is between the start and end times, otherwise false.
 */
const isBetweenTime = (
  time: string,
  startTime: string,
  endTime: string,
): boolean => {
  const formattedTime = DateTime.fromISO(time).toFormat('HH:mm');

  const formattedStartTime = DateTime.fromISO(startTime).toFormat('HH:mm');
  const isAfterStartTime = formattedTime >= formattedStartTime;

  const formattedEndTime = DateTime.fromISO(endTime).toFormat('HH:mm');
  const isBeforeEndTime = formattedTime <= formattedEndTime;

  return isAfterStartTime && isBeforeEndTime;
};

export {
  formatDate,
  getCurrentDate,
  getCurrentTimeDuration,
  isBetweenTime,
  formatToISO,
};

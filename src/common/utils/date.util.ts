import moment from 'moment'
import { DateFormat } from '../constants/date-format.enum'

/* Get current date */
export const getCurrentDate = (
  dateFormat: string = DateFormat.DATE,
): string => {
  return moment().format(dateFormat)
}

/* Check if the current date string is a valid date or not by using a given format */
export const isValidDateFormat = (
  date: string,
  dateFormat: string = DateFormat.DATE,
): boolean => {
  return moment(date, dateFormat, true).isValid()
}

/* Convert a given string to date */
export const parseStringToDate = (
  date: string,
  dateFormat: string = DateFormat.DATE,
): Date => {
  return moment(date, dateFormat).toDate()
}

/* Convert date to string */
export const parseDateToString = (
  date: Date,
  dateFormat: string = DateFormat.DATE,
): string => {
  return moment(date).format(dateFormat)
}

/* Check if the given date is between a range of dates */
export const isDateBetween = (
  date: string,
  start: string,
  end: string,
  dateFormat: string = DateFormat.DATE,
): boolean => {
  const startDate = moment(start, dateFormat)
  const endDate = moment(end, dateFormat)
  const testDate = moment(date, dateFormat)
  return testDate.isBetween(startDate, endDate, 'days', '[]')
}

/* Sustract years from current date */
export const sustractDateByYear = (
  year: number = 10,
  dateFormat: string = DateFormat.DATE,
): string => {
  return moment().subtract(year, 'years').format(dateFormat)
}

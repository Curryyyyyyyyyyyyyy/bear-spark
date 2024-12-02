/* date:2024-11-28  hour:03  minute:08  => 2024-11-28T03:08:00Z  */
export const timeFormat = (date, hour, minute) => {
  return date + 'T' + hour + ':' + minute + ':00Z'
}
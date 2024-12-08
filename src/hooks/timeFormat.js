/* date:2024-11-28  hour:3  minute:8  => 2024-11-28T03:08:00Z  */
export const timeFormat = (date, hour, minute) => {
  hour = hour.toString().padStart(2, '0')
  minute = minute.toString().padStart(2, '0')
  console.log(hour,minute)
  return date + 'T' + hour + ':' + minute + ':00Z'
}
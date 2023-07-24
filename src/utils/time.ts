export const getDateFromTimestamp = (timestamp: number) => {
  const time = new Date(timestamp * 1000)
  //Add 1 month cause JS is weird (js months start counting at base 0)
  time.setMonth(time.getMonth() + 1)
  //Add trailing 0 cause JS is weird
  const minutes = time.getMinutes().toString().length === 1 ? `0${time.getMinutes().toString()}` : time.getMinutes().toString()
  //Add trailing 0 cause JS is weird
  const hours = time.getHours().toString().length === 1 ? `0${time.getHours().toString()}` : time.getHours().toString()
  let isToday = false
  if (time.getDate() === new Date().getDate()) {
    isToday = true
  }
  return isToday ? 
  `Today at ${hours}:${minutes} ${+hours > 12 ? 'PM' : 'AM'}`
  : `${time.getDate().toString()}/${time.getMonth().toString()}/${time.getFullYear().toString()} ${hours}:${minutes} ${+hours > 12 ? 'PM' : 'AM'}`
}

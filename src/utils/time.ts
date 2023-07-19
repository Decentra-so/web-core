export const getDateFromTimestamp = (timestamp: number) => {
  const time = new Date(timestamp *1000 )
  let isToday = false
  if (time.getDate() === new Date().getDate()) {
    isToday = true
  }
  return isToday ? `Today - ${time.getHours().toString()}:${time.getMinutes().toString()} ${time.getHours() > 12 ? 'PM' : 'AM'}` : `${time.getDate().toString()}/${time.getMonth().toString()}/${time.getFullYear().toString()} - ${time.getHours().toString()}:${time.getMinutes().toString()} ${time.getHours() > 12 ? 'PM' : 'AM'}`
}
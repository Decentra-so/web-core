export const subscribe = (eventName: string, listener: any) => {
  document.addEventListener(eventName, listener)
}

export const unsubscribe = (eventName: string, listener: any) => {
  document.removeEventListener(eventName, listener)
}

export const publish = (eventName: string, data: any) => {
  document.dispatchEvent(new CustomEvent(eventName, { detail: data }))
}
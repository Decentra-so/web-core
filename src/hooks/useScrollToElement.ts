import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

export const useScrollToElement = <T extends HTMLElement>(messages: string[]): RefObject<T> => {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return ref
}

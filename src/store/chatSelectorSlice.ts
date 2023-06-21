import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

export type ChatMessages = {
  messages: any[]
}

export type ChatState = {
  [safeAddress: string]: ChatMessages
}

const initialState: ChatState = {}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChat: (state, { payload }: PayloadAction<{ safeAddress: string; messages: any[] }>) => {
      console.log('in here', payload)
      const { safeAddress, messages } = payload
      state[safeAddress].messages = messages
      console.log(state[safeAddress].messages, 'popa')
    }
  },
})

export const selectChats = (state: RootState): ChatState => {
  return state[chatSlice.name]
}

export const { setChat } = chatSlice.actions

export const selectChat = createSelector(
  [selectChats, (_: RootState, safeAddress: string) => safeAddress],
  (chats, safeAddress): any[] => {
    const chat = chats[safeAddress]
    return chat?.messages || []
  }
)

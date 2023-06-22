import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

export type ChatMessages = {
  [safeAddress: string]: any[],
}

export type ChatState = {
  chats: ChatMessages,
  user: any,
}

const initialState: ChatState = {
  user: {},
  chats: {},
}

export const chatServiceSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChat: (state, { payload }: PayloadAction<{ safeAddress: string; messages: any }>) => {
      const { safeAddress, messages } = payload
      state.chats[safeAddress] = messages
    },
    setUser: (state, { payload }: PayloadAction<{ user: any }>) => {
      const { user } = payload
      state.user = user
    }
  },
})

export const selectChats = (state: RootState): ChatMessages => {
  console.log(state.chat.chats)
  return state.chat.chats
}

export const selectUser = (state: RootState): any => {
  return state.chat?.user || ''
}

export const { setChat, setUser } = chatServiceSlice.actions

export const selectChat = createSelector(selectChats, (state) => state)
  /* [selectChats, (_: RootState, safeAddress: string) => safeAddress],
  (chats, safeAddress): any[] => {
    const chat = chats[safeAddress]
    return chat || []
  } */

export const selectUserItem = createSelector(selectUser, (state) => state)
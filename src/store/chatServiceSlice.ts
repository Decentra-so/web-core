import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

export type ChatState = {
  chats: {
    [safeAddress: string]: any[],
  },
  user: any,
  group: any,
}

const initialState: ChatState = {
  user: undefined,
  chats: {},
  group: undefined,
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
    },
    setGroup: (state, { payload }: PayloadAction<{ group: any }>) => {
      const { group } = payload
      state.group = group
    }
  },
})

export const selectChats = (state: RootState): { [safeAddress: string]: any[] } => {
  return state.chat.chats
}

export const selectUser = (state: RootState): any => {
  return state.chat?.user || ''
}

export const selectSafeGroup = (state: RootState): any => {
  return state.chat?.group || ''
}

export const { setChat, setUser, setGroup } = chatServiceSlice.actions

export const selectChat = createSelector(selectChats, (state) => state)

export const selectUserItem = createSelector(selectUser, (state) => state)

export const selectGroup = createSelector(selectSafeGroup, (state) => state)
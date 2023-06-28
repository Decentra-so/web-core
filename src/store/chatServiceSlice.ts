import type { RootState } from '@/store'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

export type CometChatUser = {
  authToken: string
  blockedByMe: boolean
  deactivatedAt: number
  hasBlockedMe: boolean
  lastActiveAt: number
  name: string
  role: string
  status: string
  uid: string
}

export type CometChatGroup = {
  conversationId: string
  createdAt: number
  guid: string
  hasJoined: boolean
  joinedAt: number
  membersCount: number
  name: string
  onlineMembersCount: number
  owner: string
  scope: string
  type: string
}

export type ChatState = {
  chats: {
    [safeAddress: string]: any[]
  }
  user: undefined | CometChatUser
  group: undefined | CometChatGroup
  selectedSafe: string
}

const initialState: ChatState = {
  user: undefined,
  chats: {},
  group: undefined,
  selectedSafe: '',
}

export const chatServiceSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedSafe: (state, { payload }: PayloadAction<{ selectedSafe: string }>) => {
      const { selectedSafe } = payload
      state.selectedSafe = selectedSafe
    },
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
    },
  },
})

export const selectChats = (state: RootState): { [safeAddress: string]: any[] } => {
  return state.chat.chats
}

export const selectUser = (state: RootState): CometChatUser | undefined => {
  return state.chat.user
}

export const selectSafeGroup = (state: RootState): CometChatGroup | undefined => {
  return state.chat.group
}

export const selectSafe = (state: RootState): string | undefined => {
  return state.chat.selectedSafe
}

export const { setChat, setUser, setGroup, setSelectedSafe } = chatServiceSlice.actions

export const selectChat = createSelector(selectChats, (chats: { [safeAddress: string]: any[] }) => chats)

export const selectedSafe = createSelector(selectSafe, (selectedSafe: string | undefined) => selectedSafe)

export const selectUserItem = createSelector(selectUser, (user: CometChatUser | undefined) => user)

export const selectGroup = createSelector(selectSafeGroup, (group: CometChatGroup | undefined) => group)

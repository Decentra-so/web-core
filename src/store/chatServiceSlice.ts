// @ts-ignore
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

export type CometChatUser = {
  authToken: string,
  blockedByMe: boolean,
  deactivatedAt: number,
  hasBlockedMe: boolean,
  lastActiveAt: number,
  name: string,
  role: string,
  status: string,
  uid: string,
}

export type CometChatGroup = {
  conversationId: string,
  createdAt: number,
  guid: string,
  hasJoined: boolean,
  joinedAt: number
  membersCount: number,
  name: string,
  onlineMembersCount: number,
  owner: string,
  scope: string,
  type: string,
}


export type ChatState = {
  chats: {
    //@ts-nocheck
    [safeAddress: string]: any[],
  },
  user: undefined | CometChatUser,
  group: undefined | CometChatGroup,
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
  return state.chat.chats;
};

export const selectUser = (state: RootState): CometChatUser | undefined => {
  return state.chat.user;
};

export const selectSafeGroup = (state: RootState): CometChatGroup | undefined => {
  return state.chat.group;
};

export const { setChat, setUser, setGroup } = chatServiceSlice.actions;

export const selectChat = createSelector(
  selectChats,
  (chats) => chats
) as (state: RootState) => { [safeAddress: string]: any[] };

export const selectUserItem = createSelector(
  selectUser,
  (user) => user
) as (state: RootState) => CometChatUser | undefined;

export const selectGroup = createSelector(
  selectSafeGroup,
  (group) => group
) as (state: RootState) => CometChatGroup | undefined;
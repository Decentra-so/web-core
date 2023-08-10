import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from '@/store'

export interface MoneriumState {
  authCode: string;

}

const initialState: MoneriumState = {
  authCode: '',
};

export const moneriumSlice = createSlice({
  name: 'monerium',
  initialState,
  reducers: {
    addAuthCode: (state, { payload }: PayloadAction<{ authCode: string }>) => {
      state.authCode = payload.authCode;
    },
  },
})

export const { addAuthCode } = moneriumSlice.actions

export const selectAuthCode = (state: RootState): string => {
  return state.monerium.authCode
}

export const selectMoneriumState = createSelector(
  selectAuthCode,
  (authCode: string) => ({ authCode })
)

export default moneriumSlice.reducer

import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from '@/store'

export interface ModalState {
  activeModal: string;
  modalProps: any;
}

const initialState: ModalState = {
  activeModal: '',
  modalProps: {},
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload }: PayloadAction<{ modalName: string; modalProps: any }>) => {
      state.activeModal = payload.modalName;
      state.modalProps = payload.modalProps;
    },
    closeModal: (state) => {
      state.activeModal = '';
      state.modalProps = {};
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions

export const selectActiveModal = (state: RootState): string => {
  return state.modal.activeModal
}

export const selectModalProps = (state: RootState): any => {
  return state.modal.modalProps
}

export const selectModalState = createSelector(
  selectActiveModal,
  selectModalProps,
  (activeModal: string, modalProps: any) => ({ activeModal, modalProps })
)

export default modalSlice.reducer

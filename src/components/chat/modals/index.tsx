import { useAppDispatch, useAppSelector } from "@/store";
import { selectModalState } from "@/store/modalServiceSlice";
import { closeModal } from "@/store/modalServiceSlice";
import { ViewSingleTransactionModal } from "./ViewSingleTransaction";
import ViewTransactionsModal from "./ViewTransactionsModal";
import React from 'react'
import { AuthModal } from "./AuthModal";
import ViewCreateSafe from "./CreateSafe";
import { AddFolderModal } from "./AddFolderModal";
import ViewAppModal from "./ViewAppModal";
import ViewAppsModal from "./ViewAppsModal";
import ViewAssetsModal from "./ViewAssetsModal";
import ViewSettings from "./ViewSettingsModal";

export const modalTypes = {
  viewSingleTransaction: 'viewSingleTransactionModal',
  viewTransactions: 'viewTransactionsModal',
  auth: 'auth',
  createSafe: 'createSafe',
  addFolderModal: 'addFolderModal',
  appModal: 'appModal',
  appsModal: 'appsModal',
  assetsModals: 'assetsModals',
  settingsModal: 'settingsModal',
}

export const Modals = () => {
  const dispatch = useAppDispatch();
  const activeModalState = useAppSelector((state) => selectModalState(state));

  return (
    <>
      {activeModalState?.activeModal === modalTypes.viewSingleTransaction && (
        <ViewSingleTransactionModal
          open={activeModalState?.activeModal === modalTypes.viewSingleTransaction}
          onClose={() => dispatch(closeModal())}
        />
      )}
      {activeModalState?.activeModal === modalTypes.viewTransactions && (
        <ViewTransactionsModal
          open={activeModalState?.activeModal === modalTypes.viewTransactions}
          onClose={() => dispatch(closeModal())}
        />
      )}
      {activeModalState?.activeModal === modalTypes.auth && (
        <AuthModal
          open={activeModalState?.activeModal === modalTypes.auth}
          onClose={() => dispatch(closeModal())}
          setAuthToken={activeModalState?.modalProps?.setAuthToken}
        />
      )}
      {activeModalState?.activeModal === modalTypes.createSafe && (
        <ViewCreateSafe
          open={activeModalState?.activeModal === modalTypes.createSafe}
          onClose={() => dispatch(closeModal())}
        />
      )}
      {activeModalState?.activeModal === modalTypes.addFolderModal && (
        <AddFolderModal
          open={activeModalState?.activeModal === modalTypes.addFolderModal}
          onClose={() => dispatch(closeModal())}
        />
      )}
      {activeModalState?.activeModal === modalTypes.appModal && (
        <ViewAppModal
          open={activeModalState?.activeModal === modalTypes.appModal}
          onClose={() => dispatch(closeModal())}
        />
      )}
      {activeModalState?.activeModal === modalTypes.appsModal && (
        <ViewAppsModal
          open={activeModalState?.activeModal === modalTypes.appsModal}
          onClose={() => dispatch(closeModal())}
        />
      )}
      {activeModalState?.activeModal === modalTypes.assetsModals && (
        <ViewAssetsModal
          open={activeModalState?.activeModal === modalTypes.assetsModals}
          onClose={() => dispatch(closeModal())}
          nfts={activeModalState?.modalProps?.nfts}
        />
      )}
      {activeModalState?.activeModal === modalTypes.settingsModal && (
        <ViewSettings
          open={activeModalState?.activeModal === modalTypes.settingsModal}
          onClose={() => dispatch(closeModal())}
        />
      )}
    </>
  )
}


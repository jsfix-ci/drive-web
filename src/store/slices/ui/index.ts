import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';

interface UISliceState {
  isSidenavCollapsed: boolean;
  showCreateFolderModal: boolean;
  showDeleteModal: boolean;
  showFileLogger: boolean;
  showReachedLimitModal: boolean;
  showShareModal: boolean
}

const initialState: UISliceState = {
  isSidenavCollapsed: false,
  showCreateFolderModal: false,
  showDeleteModal: false,
  showFileLogger: false,
  showReachedLimitModal: false,
  showShareModal: false
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsSidenavCollapsed: (state: UISliceState, action: PayloadAction<boolean>) => {
      state.isSidenavCollapsed = action.payload;
    },
    setShowCreateFolderModal: (state: UISliceState, action: PayloadAction<boolean>) => {
      state.showCreateFolderModal = action.payload;
    },
    setShowDeleteModal: (state: UISliceState, action: PayloadAction<boolean>) => {
      state.showDeleteModal = action.payload;
    },
    setShowFileLogger: (state: UISliceState, action: PayloadAction<boolean>) => {
      state.showFileLogger = action.payload;
    },
    setShowReachedPlanLimit: (state: UISliceState, action: PayloadAction<boolean>) => {
      state.showReachedLimitModal = action.payload;
    },
    setShowShareModal: (state: UISliceState, action: PayloadAction<boolean>) => {
      state.showShareModal = action.payload;
    }
  }
});

export const {
  setShowCreateFolderModal,
  setShowDeleteModal,
  setShowFileLogger,
  setShowReachedPlanLimit,
  setShowShareModal
} = uiSlice.actions;

export const uiActions = uiSlice.actions;
export const selectShowCreateFolderModal = (state: RootState): boolean => state.ui.showCreateFolderModal;
export const selectShowDeleteModal = (state: RootState): boolean => state.ui.showDeleteModal;
export const selectShowReachedLimitModal = (state: RootState): boolean => state.ui.showReachedLimitModal;
export const selectShowShareModal = (state: RootState): boolean => state.ui.showShareModal;
export const selectIsAnyModalOpen = (state: RootState): boolean => {
  let areOpen = false;

  if (state.ui.showCreateFolderModal || state.ui.showDeleteModal || state.ui.showShareModal || state.ui.showReachedLimitModal) {
    areOpen = true;
  }
  return areOpen;
};
export default uiSlice.reducer;
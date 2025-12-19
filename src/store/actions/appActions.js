import actionTypes from "./actionTypes";

export const appStartUpComplete = () => ({
  type: actionTypes.APP_START_UP_COMPLETE,
});
export const appChangeToEnglish = () => ({
  type: actionTypes.APP_CHANGE_TO_ENGLISH,
});
export const appChangeToVietnamese = () => ({
  type: actionTypes.APP_CHANGE_TO_VIETNAMESE,
});
export const appChooseCinema = (cinemaKey, cityKey) => ({
  type: actionTypes.APP_CHOOSE_CINEMA,
  cinemaKey: cinemaKey,
  cityKey: cityKey,
});
export const setContentOfConfirmModal = (contentOfConfirmModal) => ({
  type: actionTypes.SET_CONTENT_OF_CONFIRM_MODAL,
  contentOfConfirmModal: contentOfConfirmModal,
});

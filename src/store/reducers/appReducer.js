import actionTypes from "../actions/actionTypes";

// const initContentOfConfirmModal = {
//   isOpen: false,
//   messageId: "",
//   handleFunc: null,
//   dataFunc: null,
// };

const initialState = {
  started: true,
  language: "vi",
  // contentOfConfirmModal: {
  //   ...initContentOfConfirmModal,
  // },
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.APP_START_UP_COMPLETE:
      return {
        ...state,
        started: true,
      };
    case actionTypes.APP_CHANGE_TO_ENGLISH:
      return {
        ...state,
        language: "en",
      };
    case actionTypes.APP_CHANGE_TO_VIETNAMESE:
      return {
        ...state,
        language: "vi",
      };
    case actionTypes.SET_CONTENT_OF_CONFIRM_MODAL:
      return {
        ...state,
        contentOfConfirmModal: {
          ...state.contentOfConfirmModal,
          ...action.contentOfConfirmModal,
        },
      };
    case actionTypes.APP_CHOOSE_CINEMA:
      return {
        ...state,
        cityKey: action.cityKey,
        cinemaKey: action.cinemaKey,
      };

    default:
      return state;
  }
};

export default appReducer;

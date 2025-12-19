let dispatchs = {};

export const setDispatch = (dispatchName, dispatch) => {
  dispatchs[dispatchName] = dispatch;
};

export const getDispatchs = () => dispatchs;

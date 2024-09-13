import React, { useCallback } from 'react';

export interface State {
  listActive: boolean;
  displayModal: boolean;
  displayLanguage: boolean;
  displayDirection: boolean;
  displayBlock: boolean;
  displayLoading: string;
  directionLoading: string;
  displayLoadingSearch: boolean;
  displayLoadingLogin: boolean;
  displayLoadingConfirm: boolean;
  displayLoadingPassengerInfo: boolean;
  displayLoadingModal: boolean;
  displayLoadingRegister: boolean;
}

const initialState = {
  listActive: false,
  displayModal: false,
  displayLanguage: true,
  displayDirection: true,
  displayBlock: false,
  displayLoading: '',
  directionLoading: '',
  displayLoadingSearch: false,
  displayLoadingLogin: false,
  displayLoadingConfirm: false,
  displayLoadingPassengerInfo: false,
  displayLoadingRegister: false,
  displayLoadingModal: false,
};

export const UIContext = React.createContext<State | any>(initialState);

UIContext.displayName = 'UIContext';

function uiReducer(state: State, action) {
  switch (action.type) {
    case 'OPEN_LIST_ACTIVE': {
      return {
        ...state,
        listActive: true,
      };
    }
    case 'CLOSE_LIST_ACTIVE': {
      return {
        ...state,
        listActive: false,
      };
    }
    case 'OPEN_MODAL': {
      return {
        ...state,
        displayModal: true,
      };
    }
    case 'CLOSE_MODAL': {
      return {
        ...state,
        displayModal: false,
      };
    }

    case 'OPEN_LANGUAGE': {
      return {
        ...state,
        displayLanguage: true,
      };
    }
    case 'CLOSE_LANGUAGE': {
      return {
        ...state,
        displayLanguage: false,
      };
    }
    case 'OPEN_DIRECTION': {
      return {
        ...state,
        displayDirection: true,
      };
    }
    case 'CLOSE_DIRECTION': {
      return {
        ...state,
        displayDirection: false,
      };
    }
    case 'SET_DISPLAY_BLOCK': {
      return {
        ...state,
        displayBlock: true,
      };
    }
    case 'SET_DISPLAY_NONE': {
      return {
        ...state,
        displayBlock: false,
      };
    }
    case 'SET_DISPLAY_LOADING': {
      return {
        ...state,
        displayLoading: action.value,
      };
    }

    case 'SET_DIRECTION_LOADING': {
      return {
        ...state,
        directionLoading: action.value,
      };
    }

    case 'OPEN_LOADING_SEARCH': {
      return {
        ...state,
        displayLoadingSearch: true,
      };
    }
    case 'CLOSE_LOADING_SEARCH': {
      return {
        ...state,
        displayLoadingSearch: false,
      };
    }
    case 'OPEN_LOADING_LOGIN': {
      return {
        ...state,
        displayLoadingLogin: true,
      };
    }
    case 'CLOSE_LOADING_LOGIN': {
      return {
        ...state,
        displayLoadingLogin: false,
      };
    }
    case 'OPEN_LOADING_CONFIRM': {
      return {
        ...state,
        displayLoadingConfirm: true,
      };
    }
    case 'CLOSE_LOADING_CONFIRM': {
      return {
        ...state,
        displayLoadingConfirm: false,
      };
    }
    case 'OPEN_LOADING_INFO': {
      return {
        ...state,
        displayLoadingPassengerInfo: true,
      };
    }
    case 'CLOSE_LOADING_INFO': {
      return {
        ...state,
        displayLoadingPassengerInfo: false,
      };
    }
    case 'OPEN_LOADING_MODAL': {
      return {
        ...state,
        displayLoadingModal: true,
      };
    }
    case 'CLOSE_LOADING_MODAL': {
      return {
        ...state,
        displayLoadingModal: false,
      };
    }
    case 'OPEN_LOADING_REGISTER': {
      return {
        ...state,
        displayLoadingRegister: true,
      };
    }
    case 'CLOSE_LOADING_REGISTER': {
      return {
        ...state,
        displayLoadingRegister: false,
      };
    }
  }
}
export const UIProvider = props => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);
  const openListActive = () => dispatch({ type: 'OPEN_LIST_ACTIVE' });
  const closeListActive = () => dispatch({ type: 'CLOSE_LIST_ACTIVE' });
  const openModal = () => dispatch({ type: 'OPEN_MODAL' });
  const closeModal = () => dispatch({ type: 'CLOSE_MODAL' });
  const openLanguage = () => dispatch({ type: 'OPEN_LANGUAGE' });
  const closeLanguage = () => dispatch({ type: 'CLOSE_LANGUAGE' });
  const openDirection = () => dispatch({ type: 'OPEN_DIRECTION' });
  const closeDirection = () => dispatch({ type: 'CLOSE_DIRECTION' });
  const setDisplayBlock = () => dispatch({ type: 'SET_DISPLAY_BLOCK' });
  const setDisplayNone = () => dispatch({ type: 'SET_DISPLAY_NONE' });
  const setDisplayLoading = useCallback(
    (value: any) => dispatch({ type: 'SET_DISPLAY_LOADING', value }),
    [dispatch]
  );
  const setDirectionLoading = useCallback(
    (value: any) => dispatch({ type: 'SET_DIRECTION_LOADING', value }),
    [dispatch]
  );
  const openLoadingSearch = () => dispatch({ type: 'OPEN_LOADING_SEARCH' });
  const closeLoadingSearch = () => dispatch({ type: 'CLOSE_LOADING_SEARCH' });
  const openLoadingLogin = () => dispatch({ type: 'OPEN_LOADING_LOGIN' });
  const closeLoadingLogin = () => dispatch({ type: 'CLOSE_LOADING_LOGIN' });
  const openLoadingConfirm = () => dispatch({ type: 'OPEN_LOADING_CONFIRM' });
  const closeLoadingConfirm = () => dispatch({ type: 'CLOSE_LOADING_CONFIRM' });
  const openLoadingPassengerInfo = () =>
    dispatch({ type: 'OPEN_LOADING_INFO' });
  const closeLoadingPassengerInfo = () =>
    dispatch({ type: 'CLOSE_LOADING_INFO' });
  const openLoadingModal = () => dispatch({ type: 'OPEN_LOADING_MODAL' });
  const closeLoadingModal = () => dispatch({ type: 'CLOSE_LOADING_MODAL' });
  const openLoadingRegister = () => dispatch({ type: 'OPEN_LOADING_REGISTER' });
  const closeLoadingRegister = () =>
    dispatch({ type: 'CLOSE_LOADING_REGISTER' });
  const value = React.useMemo(
    () => ({
      ...state,
      openListActive,
      closeListActive,
      openModal,
      closeModal,
      openLanguage,
      closeLanguage,
      openDirection,
      closeDirection,
      setDisplayLoading,
      setDisplayBlock,
      setDisplayNone,
      openLoadingSearch,
      closeLoadingSearch,
      openLoadingLogin,
      closeLoadingLogin,
      openLoadingConfirm,
      closeLoadingConfirm,
      openLoadingPassengerInfo,
      closeLoadingPassengerInfo,
      openLoadingModal,
      closeLoadingModal,
      openLoadingRegister,
      closeLoadingRegister,
      setDirectionLoading,
    }),
    [state]
  );

  return <UIContext.Provider value={value} {...props} />;
};

export const useUI = () => {
  const context = React.useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
};

export const ManagedUIContext = ({ children }) => (
  <UIProvider>{children}</UIProvider>
);

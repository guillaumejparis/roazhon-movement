import React from 'react';
import { createStore } from 'store/createStore';
import { i18n } from 'services/i18n';

const storeContext = React.createContext(null);

export const StoreProvider = ({ children }) => {
  const store = createStore();

  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error(i18n.t('error.generic'));
  }
  return store;
};

import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

export default function useAppState({ onForeground }) {
  const [appState, setAppState] = useState(AppState.currentState);

  function handleAppStateChange(nextAppState) {
    nextAppState === 'active' && onForeground();
    setAppState(nextAppState);
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  return { appState };
}

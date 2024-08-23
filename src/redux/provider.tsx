'use client';

import { Provider } from 'react-redux';
import { makeStore } from './store';
import { ReactNode } from 'react';

export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={makeStore()}>{children}</Provider>;
}
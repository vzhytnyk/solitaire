'use client';
import React from 'react';

import { ExplicitAny } from '@/global';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DndProvider backend={HTML5Backend as ExplicitAny}>{children}</DndProvider>
  );
};

export default Provider;

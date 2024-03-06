import { GridItemTypes } from '/app/models/GridItemType';
import { Home } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const HomeButton: FloatingButtonItem = {
  layout: {
    i: 'HomeButton',
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    resizeHandles: [],
    isDraggable: true,
    isResizable: false,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'HomeButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'Home',
    icon: <Home />,
    navigateTo: '/',
  },
};

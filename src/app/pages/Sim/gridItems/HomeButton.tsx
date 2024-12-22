import { GridItemTypes } from '/app/models/GridItemType';
import { Home } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const HomeButton: FloatingButtonItem = {
  itemState: {
    i: 'HomeButton',
    x: 0,
    y: 0,
    w: 24,
    h: 24,
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

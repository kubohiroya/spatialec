import { GridItemTypes } from '/app/models/GridItemType';
import { FitScreen } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const FitScreenButton: FloatingButtonItem = {
  itemState: {
    i: 'FitScreenButton',
    x: 0,
    y: -24,
    w: 24,
    h: 24,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'FitScreenButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'fit to screen',
    icon: <FitScreen />,
  },
};

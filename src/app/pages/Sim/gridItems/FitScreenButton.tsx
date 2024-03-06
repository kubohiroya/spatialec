import { GridItemTypes } from '/app/models/GridItemType';
import { FitScreen } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const FitScreenButton: FloatingButtonItem = {
  layout: {
    i: 'FitScreenButton',
    x: 0,
    y: -1,
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
    id: 'FitScreenButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'fit to screen',
    icon: <FitScreen />,
  },
};

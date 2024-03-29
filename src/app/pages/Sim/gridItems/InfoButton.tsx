import { GridItemTypes } from '/app/models/GridItemType';
import { Info } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const InfoButton: FloatingButtonItem = {
  layout: {
    i: 'InfoButton',
    x: 0,
    y: 10,
    w: 1,
    h: 1,
    resizeHandles: [],
    isDraggable: true,
    isResizable: false,
    shown: true,
    enabled: false,
    maximized: false,
  },
  resource: {
    id: 'InfoButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'Info',
    icon: <Info />,
    bindToPanelId: 'InfoPanel',
  },
};

import { GridItemTypes } from '/app/models/GridItemType';
import React from 'react';
import { Redo } from '@mui/icons-material';

import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const RedoButton: FloatingButtonItem = {
  layout: {
    i: 'RedoButton',
    x: 0,
    y: -5,
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
    id: 'RedoButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'redo',
    icon: <Redo />,
  },
};

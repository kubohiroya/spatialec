import { GridItemTypes } from '/app/models/GridItemType';
import { Undo } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const UndoButton: FloatingButtonItem = {
  layout: {
    i: 'UndoButton',
    x: 0,
    y: -6,
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
    id: 'UndoButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'undo',
    icon: <Undo />,
  },
};

import { GridItemTypes } from '/app/models/GridItemType';
import { Undo } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';
import { LayoutDefault } from '/app/pages/Sim/LayoutDefault';

export function UndoButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'UndoButton',
      x: 0,
      y: props?.y ?? 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      maximized: false,
    },
    resource: {
      id: 'UndoButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'undo',
      icon: <Undo />,
    },
  };
}

import { GridItemTypes } from '/app/models/GridItemType';
import { Undo } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const UndoButton: FloatingButtonItem = {
  itemState: {
    i: 'UndoButton',
    x: 0,
    y: -144,
    w: 24,
    h: 24,
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

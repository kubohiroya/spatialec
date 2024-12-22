import { GridItemTypes } from '/app/models/GridItemType';
import React from 'react';
import { Redo } from '@mui/icons-material';

import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const RedoButton: FloatingButtonItem = {
  itemState: {
    i: 'RedoButton',
    x: 0,
    y: -120,
    w: 24,
    h: 24,
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

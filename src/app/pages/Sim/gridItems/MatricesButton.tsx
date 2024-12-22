import { GridItemTypes } from '/app/models/GridItemType';
import { GridOn } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const MatricesButton: FloatingButtonItem = {
  itemState: {
    i: 'MatricesButton',
    x: 0,
    y: 120,
    w: 24,
    h: 24,
    shown: true,
    enabled: false,
    maximized: false,
  },
  resource: {
    id: 'MatricesButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'MatricesPanel',
    tooltip: 'Open Matrices Panel',
    icon: <GridOn />,
  },
};

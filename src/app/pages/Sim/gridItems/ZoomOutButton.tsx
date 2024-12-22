import { GridItemTypes } from '/app/models/GridItemType';
import { ZoomOut } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const ZoomOutButton: FloatingButtonItem = {
  itemState: {
    i: 'ZoomOutButton',
    x: 0,
    y: -48,
    w: 24,
    h: 24,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'ZoomOutButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'zoom out',
    icon: <ZoomOut />,
  },
};

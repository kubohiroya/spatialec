import { GridItemTypes } from '/app/models/GridItemType';
import { ZoomIn } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const ZoomInButton: FloatingButtonItem = {
  itemState: {
    i: 'ZoomInButton',
    x: 0,
    y: -72,
    w: 24,
    h: 24,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'ZoomInButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'zoom in',
    icon: <ZoomIn />,
  },
};

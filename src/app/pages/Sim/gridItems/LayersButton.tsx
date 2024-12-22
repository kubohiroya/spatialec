import { GridItemTypes } from '/app/models/GridItemType';
import { Layers } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const LayersButton: FloatingButtonItem = {
  itemState: {
    i: 'LayersButton',
    x: 0,
    y: 168,
    w: 24,
    h: 24,
    shown: true,
    enabled: false,
    maximized: false,
  },
  resource: {
    id: 'LayersButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'LayersPanel',
    tooltip: 'Open Layers Panel',
    icon: <Layers />,
  },
};

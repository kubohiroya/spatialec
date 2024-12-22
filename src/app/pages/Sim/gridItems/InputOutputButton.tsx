import { GridItemTypes } from '/app/models/GridItemType';
import { FolderOpen } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const InputOutputButton: FloatingButtonItem = {
  itemState: {
    i: 'InputOutputButton',
    x: 0,
    y: 24,
    w: 24,
    h: 24,
    shown: true,
    enabled: false,
    maximized: false,
  },
  resource: {
    id: 'InputOutputButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'InputOutputPanel',
    tooltip: 'Open Input/Output Panel',
    icon: <FolderOpen />,
  },
};

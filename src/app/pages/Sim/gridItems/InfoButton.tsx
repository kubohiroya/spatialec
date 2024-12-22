import { GridItemTypes } from '/app/models/GridItemType';
import { Info } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const InfoButton: FloatingButtonItem = {
  itemState: {
    i: 'InfoButton',
    x: 0,
    y: 240,
    w: 24,
    h: 24,
    shown: true,
    enabled: false,
    maximized: false,
  },
  resource: {
    id: 'InfoButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'Info',
    icon: <Info />,
    bindToPanelId: 'InfoPanel',
  },
};

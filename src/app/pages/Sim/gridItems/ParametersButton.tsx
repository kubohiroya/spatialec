import { GridItemTypes } from '/app/models/GridItemType';
import { Tune } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const ParametersButton: FloatingButtonItem = {
  itemState: {
    i: 'ParametersButton',
    x: 0,
    y: 72,
    w: 24,
    h: 24,
    shown: true,
    enabled: false,
    maximized: false,
  },
  resource: {
    id: 'ParametersButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'ParametersPanel',
    tooltip: 'Open Parameters Panel',
    icon: <Tune />,
  },
};

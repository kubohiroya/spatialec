import { GridItemTypes } from '/app/models/GridItemType';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';
import { BarChart } from '@mui/icons-material';

export const ChartButton: FloatingButtonItem = {
  itemState: {
    i: 'ChartButton',
    x: 0,
    y: 144,
    w: 24,
    h: 24,
    enabled: false,
    shown: true,
    maximized: false,
  },
  resource: {
    id: 'ChartButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'ChartPanel',
    tooltip: 'Open Chart Panel',
    icon: <BarChart />,
  },
};

import { GridItemTypes } from '/app/models/GridItemType';

import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
// @ts-ignore
import BarChart from '~icons/mdi/bar-chart.svg?raw';

export const ChartPanel: FloatingPanelItem = {
  itemState: {
    i: 'ChartPanel',
    x: 420,
    y: 0,
    w: 380,
    h: 300,
    enabled: true,
    shown: true,
    maximized: false,
  },
  resource: {
    id: 'ChartPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Chart',
    icon: BarChart,
    bindToButtonId: 'ChartButton',
  },
};

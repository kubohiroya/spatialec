import { GridItemTypes } from '/app/models/GridItemType';
//import { GridOn } from '@mui/icons-material';
import GridOn from '~icons/mdi/grid-on?raw';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';

export const MatricesPanel: FloatingPanelItem = {
  itemState: {
    i: 'MatricesPanel',
    x: 240,
    y: 300,
    w: 1200,
    h: 365,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'MatricesPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Matrices',
    icon: GridOn,
    bindToButtonId: 'MatricesButton',
  },
};

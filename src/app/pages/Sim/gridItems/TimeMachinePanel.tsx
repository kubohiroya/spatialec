import { GridItemTypes } from '/app/models/GridItemType';
//import { History } from '@mui/icons-material';
import History from '~icons/mdi/history?raw';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';

export const TimeMachinePanel: FloatingPanelItem = {
  itemState: {
    i: 'TimeMachinePanel',
    x: -350,
    y: -130,
    w: 350,
    h: 130,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'TimeMachinePanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Time Machine',
    icon: History,
    bindToButtonId: 'TimeMachineButton',
  },
};

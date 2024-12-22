import { GridItemTypes } from '/app/models/GridItemType';
//import { Timer } from '@mui/icons-material';
// @ts-ignore
import Timer from '~icons/mdi/timer?raw';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';

export const TimerControlPanel: FloatingPanelItem = {
  itemState: {
    i: 'TimerControlPanel',
    x: 24,
    y: 216,
    w: 360,
    h: 140,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'TimerControlPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Timer Control',
    icon: Timer,
    bindToButtonId: 'TimerControlButton',
  },
};

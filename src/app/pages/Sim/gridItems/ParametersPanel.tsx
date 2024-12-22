import { GridItemTypes } from '/app/models/GridItemType';
//import { Tune } from '@mui/icons-material';
import Tune from '~icons/mdi/tune?raw';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';

export const ParametersPanel: FloatingPanelItem = {
  itemState: {
    i: 'ParametersPanel',
    x: 24,
    y: 0,
    w: 317,
    h: 337,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'ParametersPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Parameters',
    icon: Tune,
    bindToButtonId: 'ParametersButton',
  },
};

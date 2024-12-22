import { GridItemType } from './GridItemType';
import { ReactNode } from 'react';

export type FloatingItemResource = {
  id: string;
  type: GridItemType;
  title?: string;
  icon?: string | ReactNode;
  tooltip?: string;
};

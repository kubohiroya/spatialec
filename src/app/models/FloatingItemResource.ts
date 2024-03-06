import React from 'react';

import { GridItemType } from './GridItemType';

export type FloatingItemResource = {
  id: string;
  type: GridItemType;
  title?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  titleBarMode?: 'win' | 'mac';
  rowHeight?: number;
};

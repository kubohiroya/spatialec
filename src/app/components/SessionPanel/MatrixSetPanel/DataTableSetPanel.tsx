import { forwardRef, useRef, useState } from 'react';
import { City } from '/app/models/City';
import { atom, useAtom } from 'jotai/index';
import { uiStateAtom } from '/app/pages/Sim/SimLoader';

export type UIState = {
  selectedIndices: number[];
  focusedIndices: number[];
};

const initialUIState: UIState = {
  selectedIndices: [],
  focusedIndices: [],
};

const UIStateAtom = atom(initialUIState);

export interface DataTableSetPanelProps {
  locations: City[];
  adjacencyMatrix: number[][] | null;
  distanceMatrix: number[][] | null;
  transportationCostMatrix: number[][] | null;

  maxRowColLength: number;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
}

export interface DataTableSetPanelHandle {
  onFocus: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
  onSelect: (prevIndices: number[], indices: number[]) => void;
  onUnselect: (indices: number[]) => void;
}

export const MatrixSetPanel = forwardRef<
  DataTableSetPanelHandle,
  DataTableSetPanelProps
>((props: DataTableSetPanelProps, ref) => {
  const [focusedTableId, setFocusedTableId] = useState<string | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const [uiState, setUIState] = useAtom(uiStateAtom);

  const refs = [
    useRef<HTMLTableElement | null>(null),
    useRef<HTMLTableElement | null>(null),
    useRef<HTMLTableElement | null>(null),
  ];

  // TODO

  return <></>;
});

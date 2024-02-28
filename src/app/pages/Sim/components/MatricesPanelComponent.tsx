import { SessionState } from "/app/models/SessionState";
import { AppMatrices } from "/app/models/AppMatrices";
import { UIState } from "/app/models/UIState";
import { AppPreference } from "/app/models/AppPreference";
import MatrixSetPane from "/app/components/SessionPanel/MatrixSetPanel/MatrixSetPanel";
import React from "react";

export const MatricesPanelComponent = ({
  sessionState,
  matrices,
  uiState,
  preferences,
  onSelect,
  onFocus,
  onUnfocus,
}: {
  sessionState: SessionState;
  matrices: AppMatrices;
  uiState: UIState;
  preferences: AppPreference;
  onSelect: (prev: number[], indices: number[]) => void;
  onFocus: (indices: number[]) => void;
  onUnfocus: (prev: number[]) => void;
}) => (
  <MatrixSetPane
    // ref={diagonalMatrixSetPanelRef}
    locations={sessionState?.locations}
    maxRowColLength={preferences?.maxRowColLength}
    adjacencyMatrix={matrices?.adjacencyMatrix}
    distanceMatrix={matrices?.distanceMatrix}
    transportationCostMatrix={matrices?.transportationCostMatrix}
    rgb={{ r: 23, g: 111, b: 203 }}
    selectedIndices={uiState?.selectedIndices}
    focusedIndices={uiState?.focusedIndices}
    onSelected={onSelect}
    onFocus={onFocus}
    onUnfocus={onUnfocus}
  />
);

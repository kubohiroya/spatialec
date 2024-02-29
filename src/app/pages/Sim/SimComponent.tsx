import React, { ComponentState, ReactNode, useEffect, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { City, resetCity } from '/app/models/City';
import { Edge } from '/app/models/Graph';
import { SessionState } from '/app/models/SessionState';
import { enablePatches } from 'immer';
import { useUndoRedo } from '/app/hooks/useUndoRedo';
import { AppMatrices } from '/app/models/AppMatrices';
import { useImmerAtom } from 'jotai-immer';
import { useAtom, useAtomValue } from 'jotai';
import { preferencesAtom } from '/app/models/AppPreference';
import { tickSimulator } from '/app/models/Simulator';
import { useMatrixEngine } from './useMatrixEngine';
import { SimDesktopComponent } from './SimDesktopComponent';
import { useSimulator } from './useSimulator';
import { UIState } from '/app/models/UIState';
import { ProjectTypes } from '/app/models/ProjectType';
import { useSnackBar } from './useSnackBar';
import { useUndoRedoActions } from './useUndoRedoActions';
import { DEFAULT_PARAMS_BY_CASE } from '/app/models/DefaultParamByCase';
import { ParameterSet } from '/app/models/ParameterSet';
import { matricesAtom, sessionStateAtom, uiStateAtom } from './SimLoader';
import { DOCUMENT_TITLE } from '/app/Constants';
import { APP_TITLE } from '/app/pages/Home/Constants';

enablePatches();

type SimComponentProps = {
  type: ProjectTypes;
  uuid: string;
  viewportCenter: [number, number, number];
  backgroundColor: string;
  backgroundPanel: (params: {
    width: number;
    height: number;
    sessionState: SessionState;
    uiState: UIState;
    matrices: AppMatrices;
    onDragStart: (x: number, y: number, index: number) => void;
    onDragEnd: (diffX: number, diffY: number, index: number) => void;
    onDrag: (diffX: number, diffY: number, index: number) => void;
    onFocus: (focusIndices: number[]) => void;
    onUnfocus: (unfocusIndices: number[]) => void;
    onPointerUp: (x: number, y: number, index: number) => void;
    onClearSelection: () => void;
    onMoved: ({ zoom, y, x }: { zoom: number; y: number; x: number }) => void;
    onMovedEnd: ({
      zoom,
      y,
      x,
    }: {
      zoom: number;
      y: number;
      x: number;
    }) => void;
    overrideViewportCenter: (viewportCenter: [number, number, number]) => void;
  }) => ReactNode;
};

export const SimComponent = (props: SimComponentProps) => {
  const { type, uuid, backgroundPanel, backgroundColor, viewportCenter } =
    props;

  const { set: setSessionState, current: sessionState } =
    useUndoRedo<SessionState>(sessionStateAtom);
  const [uiState, setUIState] = useImmerAtom(uiStateAtom);

  const { openSnackBar, closeSnackBar } = useSnackBar();

  useUndoRedoActions({
    uiState,
    setUIState,
    openSnackBar,
    closeSnackBar,
    sessionStateAtom,
  });
  const preferences = useAtomValue(preferencesAtom);
  const [matrices, setMatrices] = useAtom(matricesAtom);

  useEffect(() => {
    setUIState((draft) => {
      draft.viewportCenter = viewportCenter;
      return draft;
    });
  }, [setUIState, viewportCenter]);

  //const diagonalMatrixSetPanelRef = useRef<DiagonalMatrixSetPanelHandle>(null);

  const resetToCaseDefault = () => {
    const caseDefault = DEFAULT_PARAMS_BY_CASE[type].find(
      (c: ParameterSet) => sessionState.parameterSet.caseId === c.caseId
    );
    caseDefault &&
      setSessionState((draft) => {
        draft.parameterSet.numLocations = caseDefault.numLocations;
        draft.parameterSet.manufactureShare = caseDefault.manufactureShare;
        draft.parameterSet.transportationCost = caseDefault.transportationCost;
        draft.parameterSet.elasticitySubstitution =
          caseDefault!.elasticitySubstitution;
      });
  };

  function startSimulation() {
    setSessionState(
      (draft) => {
        // TODO
      },
      true,
      'simulationStart'
    );
  }

  function stopSimulation() {
    setSessionState(
      (draft) => {
        // TODO
      },
      true,
      'simulationStop'
    );
  }

  function resetSimulation() {
    setSessionState(
      (draft) => {
        draft.locations.forEach((city) =>
          resetCity(city, draft.locations.length)
        );
        resetToCaseDefault();
      },
      true,
      'resetSimulation'
    );
  }

  function tickSimulation() {
    setSessionState(
      (draft) => {
        tickSimulator(draft, matrices.transportationCostMatrix!);
      },
      false,
      'tick'
    );
  }

  const simulation = useSimulator({
    startSimulation,
    stopSimulation,
    resetSimulation,
    tickSimulation,
  });

  const matrixEngine = useMatrixEngine(
    sessionState?.locations?.length,
    sessionState?.edges?.length
  );

  const updateMatrices = (
    locations: City[],
    edges: Edge[],
    transportationCost: number
  ): Promise<AppMatrices> => {
    if (!matrixEngine) throw new Error();
    return matrixEngine.updateAdjacencyMatrix(
      locations,
      edges,
      transportationCost
    );
  };

  const updateAndSetMatrices = (locations: City[], edges: Edge[]) => {
    updateMatrices(
      locations,
      edges,
      sessionState.parameterSet.transportationCost
    ).then((newMatrices) => {
      setMatrices({
        adjacencyMatrix: newMatrices.adjacencyMatrix,
        distanceMatrix: newMatrices.distanceMatrix,
        predecessorMatrix: newMatrices.predecessorMatrix,
        transportationCostMatrix: newMatrices.transportationCostMatrix,
      });
    });
  };

  useEffect(() => {
    updateAndSetMatrices(sessionState?.locations, sessionState?.edges);
  }, [
    sessionState?.locations,
    sessionState?.edges,
    sessionState?.parameterSet?.transportationCost,
  ]);

  useEffect(() => {
    if (sessionState?.parameterSet?.title) {
      document.title = `${DOCUMENT_TITLE} - ${sessionState?.parameterSet?.title}`;
    } else {
      document.title = `${DOCUMENT_TITLE} - ${APP_TITLE}`;
    }
  }, [sessionState?.parameterSet?.title]);

  return (
    <SimDesktopComponent
      {...{
        backgroundColor,
        type,
        uuid,
        simulation,
        matrices,
        setMatrices,
        uiState,
        setUIState,
        preferences,
        updateMatrices,
        updateAndSetMatrices,
        backgroundPanel,
      }}
    />
  );
};

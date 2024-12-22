import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SessionState } from '/app/models/SessionState';
import { DesktopComponent } from './DesktopComponent';
import { AppMatrices } from '/app/models/AppMatrices';
import { AppPreference } from '/app/models/AppPreference';
import { UIState } from '/app/models/UIState';
import { AppSimulation } from '/app/models/AppSimulation';
import { useWindowDimensions } from '/app/hooks/useWindowDimenstions';
import { useGraphEditActions } from './useGraphEditActions';
import { useChartActions } from './useChartActions';
import { City } from '/app/models/City';
import { Edge } from '/app/models/Graph';
import { useViewportActions } from './useViewportActions';
import { useParameterActions } from './useParameterActions';
import { ProjectTypes } from '/app/models/ProjectType';
import { sessionStateAtom } from './SimLoader';
import { useUndoRedo } from '/app/hooks/useUndoRedo';
import { AsyncFunctionManager } from '/app/utils/AsyncFunctionManager';
import { ProjectTable } from '/app/services/database/ProjectTable';
import { CircularProgress } from '@mui/material';
import { FullScreenBox } from '/components/FullScreenBox/FullScreenBox';
import { useNavigate } from 'react-router-dom';
import { TimerControlPanelComponent } from './components/TimerControlPanelComponent';
import { TimeMachinePanelComponent } from './components/TimeMachinePanelComponent';
import { MatricesPanelComponent } from './components/MatricesPanelComponent';
import { InfoPanelComponent } from '/app/pages/Sim/components/InfoPanelComponent';
import { LayersPanelComponent } from './components/LayerPanelComponent';
import { InputOutputPanelComponent } from './components/InputOutputPanelComponent';
import { EditPanelComponent } from './components/EditPanelComponent';
import { ParametersPanelComponent } from './components/ParameterPanelComponent';
import { ChartPanelComponent } from '/app/pages/Sim/components/ChartPanelComponent';
import { InputOutputButton } from '/app/pages/Sim/gridItems/InputOutputButton';
import { HomeButton } from '/app/pages/Sim/gridItems/HomeButton';
import { InputOutputPanel } from '/app/pages/Sim/gridItems/InputOutputPanel';
import { FitScreenButton } from '/app/pages/Sim/gridItems/FitScreenButton';
import { ZoomOutButton } from '/app/pages/Sim/gridItems/ZoomOutButton';
import { ChartButton } from '/app/pages/Sim/gridItems/ChartButton';
import { ChartPanel } from '/app/pages/Sim/gridItems/ChartPanel';
import { EditButton } from '/app/pages/Sim/gridItems/EditButton';
import { EditPanel } from '/app/pages/Sim/gridItems/EditPanel';
import { ParametersButton } from '/app/pages/Sim/gridItems/ParametersButton';
import { ParametersPanel } from '/app/pages/Sim/gridItems/ParametersPanel';
import { TimerControlButton } from '/app/pages/Sim/gridItems/TimerControlButton';
import { TimerControlPanel } from '/app/pages/Sim/gridItems/TimerControlPanel';
import { TimeMachineButton } from '/app/pages/Sim/gridItems/TimeMachineButton';
import { TimeMachinePanel } from '/app/pages/Sim/gridItems/TimeMachinePanel';
import { MatricesButton } from '/app/pages/Sim/gridItems/MatricesButton';
import { MatricesPanel } from '/app/pages/Sim/gridItems/MatricesPanel';
import { LayersButton } from '/app/pages/Sim/gridItems/LayersButton';
import { LayersPanel } from '/app/pages/Sim/gridItems/LayersPanel';
import { InfoButton } from '/app/pages/Sim/gridItems/InfoButton';
import { InfoPanel } from '/app/pages/Sim/gridItems/InfoPanel';
import { UndoButton } from '/app/pages/Sim/gridItems/UndoButton';
import { RedoButton } from '/app/pages/Sim/gridItems/RedoButton';
import { ZoomInButton } from '/app/pages/Sim/gridItems/ZoomInButton';
import { mergeDeep } from '/app/utils/marge';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';
import { FloatingButtonResource } from '/app/models/FloatingButtonResource';

type SimDesktopComponentProps = {
  type: ProjectTypes;
  backgroundColor: string;
  uuid: string;
  simulation: AppSimulation;
  matrices: AppMatrices;
  setMatrices: (matrices: AppMatrices) => void;
  uiState: UIState;
  setUIState: (func: (draft: UIState) => void) => void;
  preferences: AppPreference;
  updateAndSetMatrices: (locations: City[], edges: Edge[]) => void;
  backgroundPanel: (props: {
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

const asyncFunctionManager = new AsyncFunctionManager();

export const SimDesktopComponent = (props: SimDesktopComponentProps) => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();

  const {
    backgroundColor,
    type,
    uuid,
    uiState,
    setUIState,
    matrices,
    preferences,
    updateAndSetMatrices,
  } = props;

  const {
    set: setSessionState,
    current: sessionState,
    undo: undoSessionState,
    redo: redoSessionState,
    history,
    future,
  } = useUndoRedo<SessionState>(sessionStateAtom);

  const { setSessionChartScale, setSessionChartType } = useChartActions({
    setUIState,
  });

  const [layoutResourceMap, setLayoutResourceMap] = useState<Record<
    string,
    FloatingButtonItem | FloatingPanelItem
  > | null>(null);

  const [gridItemChildrenMap, setGridItemChildrenMap] = useState<
    Record<string, ReactElement>
  >({});

  const { onFit } = useViewportActions({
    width,
    height,
    locations: sessionState?.locations,
    uiState,
    setUIState,
  });

  const {
    // onAddLocation,
    onAddBulkLocations,
    // onRemoveLocation,
    onRemoveBulkLocations,
    // onAddEdge,
    // onRemoveEdge,
    onDragStart,
    onDrag,
    onDragEnd,
    onFocus,
    onUnfocus,
    onSelect,
    onUnselect,
    onPointerUp,
    onClearSelection,
  } = useGraphEditActions({
    sessionState,
    setSessionState,
    uiState,
    setUIState,
    matrices,
    updateAndSetMatrices,
  });

  const {
    onParameterSetChange,
    setManufactureShare,
    setTransportationCost,
    setElasticitySubstitution,
    setNumLocations,
  } = useParameterActions({
    type,
    sessionState,
    setSessionState,
    onAddBulkLocations,
    onRemoveBulkLocations,
  });

  const replaceURL = useCallback(
    (viewportCenter: [number, number, number]) => {
      const updatedViewportCenter = viewportCenter.map((value) =>
        parseFloat(value.toFixed(4))
      ) as [number, number, number];
      const url = `/${type}/${uuid}/${updatedViewportCenter[0]}/${updatedViewportCenter[1]}/${updatedViewportCenter[2]}/`;
      asyncFunctionManager.runAsyncFunction(() => {
        navigate(url, { replace: true });
      });
    },
    [navigate, type, uuid]
  );

  const overrideViewportCenter = useCallback(
    (viewportCenter: [number, number, number]) => {
      setUIState((draft) => {
        draft.viewportCenter = viewportCenter;
        replaceURL(draft.viewportCenter);
        return draft;
      });
    },
    [replaceURL, setUIState]
  );

  const onMoved = useCallback(
    ({ zoom, y, x }: { x: number; y: number; zoom: number }) => {
      // do nothing
    },
    []
  );

  const onMovedEnd = useCallback(
    ({ zoom, y, x }: { x: number; y: number; zoom: number }) => {
      setUIState((draft) => {
        draft.viewportCenter = [zoom, y, x];
        replaceURL(draft.viewportCenter);
        return draft;
      });
    },
    [replaceURL, setUIState]
  );

  const onZoom = useCallback(
    (value: number) => {
      setUIState((draft) => {
        draft.viewportCenter[0] += value;
        replaceURL(draft.viewportCenter);
        return draft;
      });
    },
    [replaceURL, setUIState]
  );

  const onZoomIn = useCallback(() => onZoom(0.25), [onZoom]);
  const onZoomOut = useCallback(() => onZoom(-0.25), [onZoom]);

  const onFitScreen = useCallback(() => {
    const viewportCenter = onFit();
    setUIState((draft) => {
      draft.viewportCenter = viewportCenter;
      replaceURL(viewportCenter);
      return draft;
    });
  }, [onFit, replaceURL, setUIState]);

  useEffect(() => {
    return () => {
      asyncFunctionManager.cancelAll();
      ProjectTable.updateViewportCenter(uuid, uiState.viewportCenter);
    };
  }, [uiState.viewportCenter, uuid]);

  useEffect(() => {
    if (width === 0 || height === 0) {
      return;
    }

    let layoutResourceMap: Record<
      string,
      FloatingButtonItem | FloatingPanelItem
    > = {
      HomeButton: HomeButton,
      InputOutputButton: InputOutputButton,
      InputOutputPanel: InputOutputPanel,
      ChartButton: ChartButton,
      ChartPanel: ChartPanel,
      EditButton: EditButton,
      EditPanel: EditPanel,
      ParametersButton: ParametersButton,
      ParametersPanel: ParametersPanel,
      TimerControlButton: TimerControlButton,
      TimerControlPanel: TimerControlPanel,
      TimeMachineButton: TimeMachineButton,
      TimeMachinePanel: TimeMachinePanel,
      MatricesButton: MatricesButton,
      MatricesPanel: MatricesPanel,
      LayersButton: LayersButton,
      LayersPanel: LayersPanel,
      InfoButton: InfoButton,
      InfoPanel: InfoPanel,
      UndoButton: UndoButton,
      RedoButton: RedoButton,
      ZoomInButton: ZoomInButton,
      ZoomOutButton: ZoomOutButton,
      FitScreenButton: FitScreenButton,
    };

    if (type === ProjectTypes.Graph) {
      layoutResourceMap = mergeDeep(layoutResourceMap, {
        ParametersPanel: {
          resource: { x: 24, y: 0, w: 192, h: 96, shown: true },
        },
        InputOutputPanel: { resource: { x: 24, y: 312, shown: true } },
        EditPanel: { resource: { x: 240, y: 0, shown: true } },
      });
    } else if (type === ProjectTypes.RealWorld) {
      layoutResourceMap = mergeDeep(layoutResourceMap, {
        ParametersPanel: {
          resource: { x: 24, y: 0, w: 144, h: 96, shown: true },
        },
        InputOutputPanel: { resource: { x: 24, y: 312, shown: true } },
        EditPanel: { resource: { x: 240, y: 0, shown: true } },
        LayersPanel: { resource: { x: -24, y: 240, shown: true } },
        MatricesButton: { resource: { enabled: true } },
        MatricesPanel: {
          resource: { clientHeight: height, y: -216, shown: false },
        },
      });
    }

    Object.keys(layoutResourceMap).forEach((key, index) => {
      const item = layoutResourceMap[key];
      if (item) {
        //item.layout.x = getX(item.layout.x, width);
        //item.layout.y = getY(item.layout.y, height);

        //console.log(item.layout.i, item.layout.y, height);

        item.itemState.zIndex = key.endsWith('Button') ? index * -1 : index;
        const resource = item.resource as unknown as FloatingButtonResource;
        switch (item.itemState.i) {
          case 'ZoomInButton':
            resource.onClick = onZoomIn;
            break;
          case 'ZoomOutButton':
            resource.onClick = onZoomOut;
            break;
          case 'FitScreenButton':
            resource.onClick = onFitScreen;
            break;
        }
      }
    });

    setLayoutResourceMap(layoutResourceMap);

    setGridItemChildrenMap((draft) => ({
      ChartPanel: (
        <ChartPanelComponent
          {...{
            sessionState,
            uiState,
            setSessionChartType,
            setSessionChartScale,
            onSelect,
            onUnselect,
            onFocus,
            onUnfocus,
          }}
        />
      ),
      ParametersPanel: (
        <ParametersPanelComponent
          {...{
            type: props.type,
            parameterSet: sessionState.parameterSet,
            sessionStateAtom,
            onParameterSetChange,
            setNumLocations,
          }}
        />
      ),
      InputOutputPanel: <InputOutputPanelComponent />,
      EditPanel: (
        <EditPanelComponent
          state={{
            addLocation: false,
            removeLocation: false,
            addEdge: false,
            removeEdge: false,
            autoGraphLayout: false,
            undo: false,
            redo: false,
          }}
          onAddLocation={function (): void {
            throw new Error('Function not implemented.');
          }}
          onRemoveLocation={function (): void {
            throw new Error('Function not implemented.');
          }}
          onAddEdge={function (): void {
            throw new Error('Function not implemented.');
          }}
          onRemoveEdge={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      InfoPanel: <InfoPanelComponent />,
      LayersPanel: <LayersPanelComponent uuid={uuid} />,
      MatricesPanel: (
        <MatricesPanelComponent
          {...{
            sessionState,
            matrices,
            uiState,
            preferences,
            onSelect,
            onFocus,
            onUnfocus,
          }}
        />
      ),
      TimeMachinePanel: <TimeMachinePanelComponent />,
      TimerControlPanel: (
        <TimerControlPanelComponent simulation={props.simulation} />
      ),
    }));
  }, [
    height,
    onFitScreen,
    onZoomIn,
    onZoomOut,
    props.simulation,
    props.type,
    sessionState,
    setSessionChartScale,
    setSessionChartType,
    uiState,
    uuid,
    matrices,
    preferences,
    width,
    type,
    onSelect,
    onUnselect,
    onFocus,
    onUnfocus,
    // onParameterSetChange,
    setNumLocations,
  ]);
  if (layoutResourceMap === null || gridItemChildrenMap === null) {
    return (
      <FullScreenBox>
        <CircularProgress variant={'indeterminate'} />
      </FullScreenBox>
    );
  }

  return (
    <DesktopComponent
      uuid={uuid}
      resourceMap={layoutResourceMap}
      itemMap={gridItemChildrenMap}
      backgroundColor={backgroundColor}
    >
      {props.backgroundPanel({
        width,
        height,
        sessionState,
        uiState,
        matrices,
        onDragStart,
        onDragEnd,
        onDrag,
        onFocus,
        onUnfocus,
        onPointerUp,
        onClearSelection,
        onMoved,
        onMovedEnd,
        overrideViewportCenter,
      })}
    </DesktopComponent>
  );
};

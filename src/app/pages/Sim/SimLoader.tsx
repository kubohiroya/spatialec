import { atom, WritableAtom } from 'jotai/index';
import { UIState } from '/app/models/UIState';
import { SessionState } from '/app/models/SessionState';
import { AppMatrices } from '/app/models/AppMatrices';
import {
  createInitialUndoRedoState,
  UndoRedoState,
} from '/app/hooks/useUndoRedo';
import { ChartTypes } from '/app/models/ChartType';
import { atomWithImmer } from 'jotai-immer';
import { Draft } from 'immer';
import { updateAddedSubGraph } from '/app/components/SessionPanel/MapPanel/GraphHandlers';
import { LoaderFunctionArgs } from 'react-router-dom';
import { PrimitiveAtom } from 'jotai';
import { parameterSet } from './TypeToCategory';
import { Projects } from '/app/services/database/Projects';

export type SessionStateAtom = WritableAtom<
  UndoRedoState<SessionState>,
  [
    | UndoRedoState<SessionState>
    | ((draft: Draft<UndoRedoState<SessionState>>) => void)
  ],
  void
>;
export type UIStateAtom = PrimitiveAtom<UIState>;
export type MatricesAtom = PrimitiveAtom<AppMatrices>;

export type SimLoaderResult = {
  type: string;
  uuid: string;
  project: Projects;
  x: number;
  y: number;
  zoom: number;
};

const graph = updateAddedSubGraph(
  {
    parameterSet,
    locations: [],
    edges: [],
    locationSerialNumber: 0,
  },
  [],
  parameterSet.numLocations
);

const initialSessionState: SessionState = {
  parameterSet,
  locations: graph.locations,
  edges: graph.edges,
  locationSerialNumber: graph.locationSerialNumber,
};

const initialUndoRedoSessionState =
  createInitialUndoRedoState(initialSessionState);

export const sessionStateAtom = atomWithImmer(initialUndoRedoSessionState);

export const matricesAtom = atom<AppMatrices>({
  adjacencyMatrix: [],
  distanceMatrix: [],
  predecessorMatrix: [],
  transportationCostMatrix: [],
});

export const uiStateAtom = atom<UIState>({
  viewportCenter: [3, 0, 0],
  focusedIndices: [],
  selectedIndices: [],
  draggingIndex: null,
  chartScale: 1,
  chartType: ChartTypes.ManufactureShare,
  autoLayoutFinished: true,
});

export const SimLoader = async function (
  request: LoaderFunctionArgs<{
    params: {
      projectType: string;
      uuid: string;
      zoom: string;
      y: string;
      x: string;
    };
  }>
): Promise<SimLoaderResult> {
  const type = request.params.projectType!;
  const uuid = request.params.uuid!;
  const project = await Projects.openProject(uuid);
  const zoom = parseFloat(request.params.zoom!);
  const y = parseFloat(request.params.y!);
  const x = parseFloat(request.params.x!);

  return {
    uuid,
    project,
    type,
    y,
    x,
    zoom,
  };
};

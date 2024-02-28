import React, { useEffect } from "react";
import { sessionStateAtom, SimLoaderResult } from "./SimLoader";
import { useLoaderData } from "react-router-dom";
import { SimComponent } from "./SimComponent";
import { BackgroundCanvas } from "./BackgroundCanvas";
import { SessionState } from "/app/models/SessionState";
import { UIState } from "/app/models/UIState";
import { AppMatrices } from "/app/models/AppMatrices";
import { ProjectTypes} from "../../models/ProjectType";
import { useAtom } from "jotai";
import { DEFAULT_PARAMS_BY_CASE } from "/app/models/DefaultParamByCase";
import { updateAddedSubGraph } from "/app/components/SessionPanel/MapPanel/GraphHandlers";

export const GraphSimPage = () => {
  const { uuid, x, y, zoom, type } = useLoaderData() as SimLoaderResult;

  const [sessionState, setSessionState] = useAtom(sessionStateAtom);

  useEffect(() => {
    setSessionState((draft) => {
      const parameterSet = DEFAULT_PARAMS_BY_CASE[ProjectTypes.Graph][0];
      const newSessionState = updateAddedSubGraph(
        {
          parameterSet,
          locations: [],
          edges: [],
          locationSerialNumber: 0,
        },
        [],
        4,
      );
      console.log(newSessionState);
      return { ...draft, ...newSessionState };
    });
  }, []);

  return (
    <SimComponent
      {...{
        uuid,
        type: type as ProjectTypes,
        viewportCenter: [zoom, y, x],
      }}
      backgroundColor="rgba(230,255,230,0.6)"
      backgroundPanel={(params: {
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
        overrideViewportCenter: (
          viewportCenter: [number, number, number],
        ) => void;
        onMoved: ({
          zoom,
          y,
          x,
        }: {
          x: number;
          y: number;
          zoom: number;
        }) => void;
        onMovedEnd: ({
          zoom,
          y,
          x,
        }: {
          x: number;
          y: number;
          zoom: number;
        }) => void;
      }) => <BackgroundCanvas {...params} />}
    />
  );
};

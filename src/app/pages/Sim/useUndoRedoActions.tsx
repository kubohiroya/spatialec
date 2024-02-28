import { SessionState } from '/app/models/SessionState';
import { UIState } from '/app/models/UIState';
import { useUndoRedo } from '/app/hooks/useUndoRedo';
import { useCallback } from 'react';
import useHotkeys from '@reecelucas/react-use-hotkeys';
import { SessionStateAtom } from './SimLoader';

export const useUndoRedoActions = ({
  sessionStateAtom,
  openSnackBar,
  closeSnackBar,
  uiState,
  setUIState,
}: {
  sessionStateAtom: SessionStateAtom;
  openSnackBar: (message: string) => void;
  closeSnackBar: () => void;
  uiState: UIState;
  setUIState: (func: (draft: UIState) => void) => void;
}) => {
  const {
    undo: undoSessionState,
    redo: redoSessionState,
    current: sessionState,
    history,
    future,
    staging,
  } = useUndoRedo<SessionState>(sessionStateAtom);

  const undo = useCallback(() => {
    requestAnimationFrame(() => {
      setUIState((draft) => {
        draft.focusedIndices = [];
        draft.selectedIndices = [];
      });
      undoSessionState();
    });
  }, [undoSessionState, setUIState]);
  const redo = useCallback(() => {
    requestAnimationFrame(() => {
      setUIState((draft) => {
        draft.focusedIndices = [];
        draft.selectedIndices = [];
      });
      redoSessionState();
    });
  }, [redoSessionState, setUIState]);

  useHotkeys(['Meta+z', 'Control+z'], () => {
    if (history.length === 0) {
      openSnackBar('No more undo!');
      return;
    }
    undo();
  });
  useHotkeys(['Shift+Meta+z', 'Shift+Control+z'], () => {
    if (future.length === 0) {
      openSnackBar('No more redo!');
      return;
    }
    redo();
  });

  useHotkeys(['h'], () => {
    console.log({
      numLocations: sessionState.locations.length,
      locations: sessionState.locations,
      selectedIndices: uiState.selectedIndices,
    });
    console.log({ sessionState, history, staging, future });
    //console.log({ uiState });
  });
  useHotkeys(['e'], () => {
    console.log(JSON.stringify(sessionState.edges, null, ' '));
  });
};

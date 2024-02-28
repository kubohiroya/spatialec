import React from 'react';
import { Container, Graphics, Text } from '@pixi/react';
import { StyleSize11 } from './FontStyles';
import { Edge, Vertex } from '../../../../models/Graph';
import { convertIdToIndex } from '../../../../utils/arrayUtil';

type EdgesProps = {
  edges: Edge[];
  locations: Vertex[];
  selectedIndices: number[];
  focusedIndices: number[];
};

export const Edges = (props: EdgesProps) => {
  return (
    <Container>
      {props.edges.map((edge, index) => (
        <EdgeItem edge={edge} index={index} key={index} {...props} />
      ))}
    </Container>
  );
};

const EdgeItem = (props: EdgesProps & { edge: Edge; index: number }) => {
  const sourceIndex = convertIdToIndex(props.locations, props.edge.source);
  const targetIndex = convertIdToIndex(props.locations, props.edge.target);
  const source = props.locations[sourceIndex];
  const target = props.locations[targetIndex];
  if (!source || !target) {
    return;
  }
  const { x: midx, y: midy } = {
    x: (source.point[0] + target.point[0]) / 2,
    y: (source.point[1] + target.point[1]) / 2,
  };

  const draw = React.useCallback(
    (g: any) => {
      g.clear();
      g.lineStyle({
        width: 1,
        color: 0x000000,
        alpha: 0.1,
        alignment: 0.5,
      });
      g.moveTo(source.point[0], source.point[1]);
      g.lineTo(target.point[0], target.point[1]);
    },
    [source.point[0], target.point[0], source.point[1], target.point[1]],
  );

  return (
    <Container key={props.index}>
      <Graphics draw={draw} />
      {!(
        props.focusedIndices.length === 2 &&
        sourceIndex === props.focusedIndices[0] &&
        targetIndex === props.focusedIndices[1]
      ) &&
        !(
          props.selectedIndices.length === 2 &&
          sourceIndex === props.selectedIndices[0] &&
          targetIndex === props.selectedIndices[1]
        ) && (
          <Text
            text={props.edge.distance!.toFixed(2)}
            position={{ x: midx, y: midy }}
            anchor={{ x: 0.5, y: 0.5 }}
            style={StyleSize11}
          />
        )}
    </Container>
  );
};

import { useNavigate } from 'react-router-dom';
import { ProjectTypes } from '/app/models/ProjectType';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import React from 'react';
import { TypeIcons } from '/app/pages/Home/resource/TypeIcons';

export function ProjectTypeSpeedDial() {
  const navigate = useNavigate();
  const speedDialActions = [
    {
      icon: TypeIcons[ProjectTypes.Racetrack],
      name: ProjectTypes.Racetrack,
      onClick: () => {
        return navigate(`/projects/create/${ProjectTypes.Racetrack}`);
      },
    },
    {
      icon: TypeIcons[ProjectTypes.Graph],
      name: ProjectTypes.Graph,
      onClick: () => {
        return navigate(`/projects/create/${ProjectTypes.Graph}`);
      },
    },
    {
      icon: TypeIcons[ProjectTypes.RealWorld],
      name: ProjectTypes.RealWorld,
      onClick: () => {
        return navigate(`/projects/create/${ProjectTypes.RealWorld}`);
      },
    },
  ];

  return (
    <SpeedDial
      style={{ position: 'fixed', bottom: '20px', right: '20px' }}
      direction="up"
      ariaLabel="Create new project"
      icon={<SpeedDialIcon />}
    >
      {speedDialActions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
}

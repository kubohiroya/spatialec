import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  SvgIconProps,
  Typography,
} from '@mui/material';
import { TreeItem, treeItemClasses, TreeItemProps } from '@mui/x-tree-view';
import React, { ReactElement, ReactNode, useCallback, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  bgColorForDarkMode?: string;
  color?: string;
  colorForDarkMode?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  level: number;
  value?: string;
  control?: ReactElement<any, any>;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(1),
    },
  },
})) as unknown as typeof TreeItem;

export const StyledTreeItem = (
  props: StyledTreeItemProps) =>{
  const theme = useTheme();
  const {
    bgColor,
    color,
    level,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    value,
    colorForDarkMode,
    bgColorForDarkMode,
    control,
    ...other
  } = props;

  const styleProps = {
    '--tree-view-color':
      theme.palette.mode !== 'dark' ? color : colorForDarkMode,
    '--tree-view-bg-color':
      theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
  };


  const handleExpandClick = useCallback((event: any)=> {
    // prevent the click event from propagating to the checkbox
    event.stopPropagation();
  }, []);

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.1,
            marginLeft: (props.level - 1) * 2,
            pr: 0,
          }}
        >
          {control &&
            <FormControlLabel
              value={value}
              control={control}
              label={
                <Box style={{ display: 'flex', flexDirection: 'row' }}>
                  <Box component={LabelIcon} color="inherit" sx={{ mr: 0.1 }} />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'inherit', flexGrow: 1 }}
                  >
                    {labelText}
                  </Typography>
                  <Typography variant="caption" color="inherit">
                    {labelInfo}
                  </Typography>
                </Box>
              }
            />
          }
          {!control && (
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box component={LabelIcon} color="inherit" sx={{ mr: 0.1 }} />
              <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                {labelText}
              </Typography>
              <Typography variant="caption" color="inherit">
                {labelInfo}
              </Typography>
            </Box>
          )}
        </Box>
      }
      style={styleProps}
      {...other}
      onClick={handleExpandClick}
    />
  )
}

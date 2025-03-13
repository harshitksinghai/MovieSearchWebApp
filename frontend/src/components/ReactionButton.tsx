import { IconButton, Tooltip } from '@mui/material';
import { Theme } from '@mui/system';
import { JSX } from 'react';

interface ReactionButtonProps {
  title: string;
  state: boolean;
  onClick: () => void;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
  themeVariant: 'customPrimary' | 'customSecondary';  // New prop for switching themes
}

const ReactionButton = ({ 
  title, 
  state, 
  onClick, 
  activeIcon, 
  inactiveIcon, 
  themeVariant,   // Default to customSecondary
}: ReactionButtonProps) => {
  return (
    <Tooltip title={title} placement="top" arrow>
      <IconButton
        onClick={onClick}
        sx={(theme: Theme) => ({
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: theme.palette[themeVariant].bg,  
          border: state 
            ? `2px solid ${theme.palette[themeVariant].activeBorder}` 
            : `2px solid ${theme.palette[themeVariant].border}`,
          '&:hover': {
            borderColor: theme.palette[themeVariant].hoverBorder,
            transform: 'scale(1.1)',
          },
          ...(state && {
            bgcolor: theme.palette[themeVariant].activeBg,
            '& svg': { color: theme.palette[themeVariant].activeIcon },
            '&:hover': { bgcolor: theme.palette[themeVariant].activeBg },
          }),
          padding: 0,
        })}
      >
        {state ? activeIcon : inactiveIcon}
      </IconButton>
    </Tooltip>
  );
};

export default ReactionButton;

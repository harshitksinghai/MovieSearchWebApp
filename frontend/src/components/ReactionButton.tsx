import { themePalettes, useCustomTheme } from '@/context/CustomThemeProvider';
import { IconButton, Tooltip } from '@mui/material';
import { JSX } from 'react';

interface ReactionButtonProps {
  title: string;
  state: boolean;
  onClick: () => void;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
}

const ReactionButton = ({ 
  title, 
  state, 
  onClick, 
  activeIcon, 
  inactiveIcon, 
}: ReactionButtonProps) => {

          const { currentTheme, darkMode } = useCustomTheme();
          const getCurrentPalette = () => {
            const palette = themePalettes[currentTheme];
            return darkMode ? palette.dark : palette.light;
          };
        
          const currentPalette = getCurrentPalette();

  return (
    <Tooltip title={title} placement="top" arrow>
      <IconButton
  onClick={onClick}
  sx={{
    width: '2rem', // Changed from 32px
    height: '2rem', // Changed from 32px
    borderRadius: '50%',
    bgcolor: currentPalette.background,
    '& svg': {
                  color: currentPalette.primary,
                },
              border: state
                ? `0.125rem solid ${currentPalette.secondary}`
                : `0.125rem solid ${currentPalette.primary}`,
              '&:hover': {
                borderColor: currentPalette.primary,
                transform: 'scale(1.1)',
              },
              ...(state && {
                bgcolor: currentPalette.primary,
                '& svg': {
                  color: currentPalette.background,
                },
                '&:hover': {
                  bgcolor: currentPalette.primary,
                  transform: 'scale(1.1)',
                },
    }),
    padding: 0,
  }}
>
  {state ? activeIcon : inactiveIcon}
</IconButton>
    </Tooltip>
  );
};

export default ReactionButton;

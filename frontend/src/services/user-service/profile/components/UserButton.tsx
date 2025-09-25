import { Link, useNavigate } from "react-router-dom";
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Typography, 
  Tooltip,
  Divider
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';
import { logout } from "@/redux/auth/authSlice";
import { useAppDispatch } from "@/app/reduxHooks";
import { themePalettes, useCustomTheme } from "@/context/CustomThemeProvider";
import { authApi } from "@/services/auth-service/api/authApi";
import { toast } from "sonner";

interface UserButtonProps {
  openProfilePopup: () => void;
}

const UserButton: React.FC<UserButtonProps> = ({ openProfilePopup }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

    const { currentTheme, darkMode } = useCustomTheme();
    const getCurrentPalette = () => {
      const palette = themePalettes[currentTheme];
      return darkMode ? palette.dark : palette.light;
    };
  
    const currentPalette = getCurrentPalette();

  const signOutRedirect = async () => {
    try{
      await authApi.logout();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log("Unable to logout user.");
      toast.error(t('auth.logoutError'))
    }
  };

  return (
    <FormControl size="small" sx={{ width: { xs: '100%', sm: 'auto' } }}>
      <Select
        value=""
        displayEmpty
        IconComponent={() => null}
        renderValue={() => (
          <Tooltip title="User Options">
            <AccountCircleIcon sx={{ fontSize: '40px', cursor: 'pointer', color: currentPalette.primary }} />
          </Tooltip>
        )}
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '8px',
          height: '3rem',
          marginTop: '0.125rem',
          width: { xs: '100%', sm: 'auto' },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            
          },
          '& .MuiSelect-icon': {
            display: 'none'
          },
          '& .MuiSelect-select': {
            paddingRight: '0 !important',
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              alignContent: 'center',
              backgroundColor: '#222',
              maxHeight: '50vh',
              '& .MuiList-root': {
                backgroundColor: '#222',
                pt:'0.15rem'
              },
            },
          },
        }}
      >
        {/* Dashboard - links to /dashboard */}
        <Link to={'/dashboard'} style={{ textDecoration: 'none' }}>
          <MenuItem
            value="dashboard"
            sx={{
              backgroundColor: '#222',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            <Typography>{t('userButton.dashboard')}</Typography>
          </MenuItem>
        </Link>

        {/* Profile - will be a popup later */}
        <MenuItem
          value="profile"
          onClick={openProfilePopup}
          sx={{
            backgroundColor: '#222',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          <Typography>{t('userButton.profile')}</Typography>
        </MenuItem>

        {/* Divider */}
        <Divider sx={{backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Logout - has onClick function */}
        <MenuItem
          onClick={signOutRedirect}
          sx={{
            backgroundColor: '#222',
            pt: '0',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          <Typography>{t('userButton.signOut')}</Typography>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default UserButton;
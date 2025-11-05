import type { User } from '../../../auth/useAuth';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onNewEntry: () => void;
}

export const Header = ({ user, onLogout, onNewEntry }: HeaderProps) => (
  <AppBar 
    component="header"
    position="static"
    elevation={0}
    sx={{
      backgroundColor: 'background.paper',
      color: 'text.primary',
      mb: 3,
      borderRadius: 3,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}
  >
    <Toolbar 
      disableGutters
      sx={{
        px: 3,
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography 
        variant="h6" 
        component="h1"
        sx={{
          fontWeight: 600,
          fontSize: '1.5rem',
          lineHeight: 1.2,
        }}
      >
        Hello, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}! 👋
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onNewEntry}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            px: 2,
            py: 1,
          }}
        >
          New Entry
        </Button>
        
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2,
            borderColor: 'divider',
            color: 'text.secondary',
            px: 2,
            py: 1,
            '&:hover': {
              borderColor: 'action.hover',
              backgroundColor: 'action.hover',
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

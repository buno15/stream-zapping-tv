import { FC, useState } from 'react';
import {
  Box,
  Paper,
  Divider,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { AppProviders } from './providers/AppProviders';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import {
  VideoPlayer,
  NavigationControls,
  ChannelList,
  AddChannelForm,
  ErrorBoundary,
} from './components';

const ControlPanel: FC = () => (
  <Paper
    elevation={3}
    sx={{
      bgcolor: 'background.paper',
      borderRadius: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Navigation Controls */}
    <Box className="p-4">
      <NavigationControls />
    </Box>

    <Divider />

    {/* Channel List */}
    <Box className="p-4 flex-1 overflow-y-auto">
      <ChannelList />
    </Box>

    <Divider />

    {/* Add Channel Form */}
    <Box className="p-4">
      <AddChannelForm />
    </Box>
  </Paper>
);

const AppContent: FC = () => {
  useKeyboardShortcuts();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // < 768px
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 768px-1023px

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Mobile Layout (< 768px)
  if (isMobile) {
    return (
      <Box
        className="min-h-screen w-full flex flex-col"
        sx={{ bgcolor: 'background.default' }}
      >
        {/* Video Player - 70% */}
        <Box sx={{ height: '70vh' }}>
          <VideoPlayer />
        </Box>

        {/* Control Panel - 30% */}
        <Box sx={{ height: '30vh', overflow: 'hidden' }}>
          <ControlPanel />
        </Box>

        {/* Floating Navigation Button */}
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            zIndex: 1300,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              height: '70vh',
              bgcolor: 'background.paper',
            },
          }}
        >
          <Box className="p-2 flex justify-end">
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ height: 'calc(100% - 56px)', overflow: 'hidden' }}>
            <ControlPanel />
          </Box>
        </Drawer>
      </Box>
    );
  }

  // Tablet Layout (768px-1023px)
  if (isTablet) {
    return (
      <Box
        className="min-h-screen w-full flex"
        sx={{ bgcolor: 'background.default' }}
      >
        {/* Video Player */}
        <Box className="flex-1">
          <VideoPlayer />
        </Box>

        {/* Toggle Button */}
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            zIndex: 1300,
          }}
        >
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* Side Panel Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          variant="persistent"
          sx={{
            '& .MuiDrawer-paper': {
              width: 320,
              bgcolor: 'background.paper',
            },
          }}
        >
          <ControlPanel />
        </Drawer>
      </Box>
    );
  }

  // Desktop Layout (>= 1024px)
  return (
    <Box
      className="min-h-screen w-full flex"
      sx={{ bgcolor: 'background.default' }}
    >
      {/* Video Player */}
      <Box className="flex-1">
        <VideoPlayer />
      </Box>

      {/* Side Panel - Always visible */}
      <Box
        sx={{
          width: { lg: 320, xl: 384 },
          borderLeft: '1px solid',
          borderColor: 'divider',
        }}
      >
        <ControlPanel />
      </Box>
    </Box>
  );
};

const App: FC = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;

import { FC } from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useAtomValue } from 'jotai';
import {
  channelsAtom,
  currentIndexAtom,
  currentChannelAtom,
} from '@/store/channelAtoms';
import { useChannelNavigation } from '@/hooks/useChannelNavigation';

export const NavigationControls: FC = () => {
  const channels = useAtomValue(channelsAtom);
  const currentIndex = useAtomValue(currentIndexAtom);
  const currentChannel = useAtomValue(currentChannelAtom);
  const { switchChannel } = useChannelNavigation();

  const handlePrevious = () => {
    switchChannel('prev');
  };

  const handleNext = () => {
    switchChannel('next');
  };

  const isDisabled = channels.length === 0;

  return (
    <Box className="flex items-center justify-between w-full">
      <Box className="flex items-center gap-4">
        <Tooltip title="前のチャンネル (↓)">
          <span>
            <IconButton
              onClick={handlePrevious}
              disabled={isDisabled}
              size="large"
              className="text-white"
              sx={{
                '&:disabled': {
                  color: 'gray',
                },
              }}
            >
              <SkipPreviousIcon fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="次のチャンネル (↑)">
          <span>
            <IconButton
              onClick={handleNext}
              disabled={isDisabled}
              size="large"
              className="text-white"
              sx={{
                '&:disabled': {
                  color: 'gray',
                },
              }}
            >
              <SkipNextIcon fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box className="flex flex-col items-end">
        {currentChannel ? (
          <>
            <Typography variant="body1" className="font-semibold">
              {currentChannel.displayName}
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              {currentIndex + 1} / {channels.length}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" className="text-gray-400">
            チャンネルを選択してください
          </Typography>
        )}
      </Box>
    </Box>
  );
};

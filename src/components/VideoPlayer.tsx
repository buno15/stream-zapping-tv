import { FC, useEffect, memo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { currentChannelAtom } from '@/store/channelAtoms';
import { usePlayer } from '@/hooks/usePlayer';

const PLAYER_ELEMENT_ID = 'player-container';

export const VideoPlayer: FC = memo(() => {
  const currentChannel = useAtomValue(currentChannelAtom);
  const { playerState, switchToChannel } = usePlayer(PLAYER_ELEMENT_ID);

  useEffect(() => {
    if (currentChannel) {
      switchToChannel(currentChannel);
    }
  }, [currentChannel, switchToChannel]);

  const renderContent = () => {
    if (!currentChannel) {
      return (
        <Box className="flex flex-col items-center justify-center h-full text-gray-400">
          <Typography variant="h5" className="mb-2">
            チャンネルが選択されていません
          </Typography>
          <Typography variant="body2">
            チャンネルを追加して視聴を開始してください
          </Typography>
        </Box>
      );
    }

    if (playerState === 'loading' || playerState === 'uninitialized') {
      return (
        <Box className="flex flex-col items-center justify-center h-full">
          <CircularProgress size={60} />
          <Typography variant="body1" className="mt-4 text-gray-400">
            読み込み中...
          </Typography>
        </Box>
      );
    }

    if (playerState === 'error') {
      return (
        <Box className="flex flex-col items-center justify-center h-full text-red-400">
          <Typography variant="h6" className="mb-2">
            エラーが発生しました
          </Typography>
          <Typography variant="body2">
            チャンネルの読み込みに失敗しました
          </Typography>
        </Box>
      );
    }

    return null;
  };

  return (
    <Box
      className="relative w-full h-full bg-black"
      sx={{
        minHeight: { xs: '250px', sm: '400px', md: '500px' },
      }}
    >
      <Box
        id={PLAYER_ELEMENT_ID}
        className="absolute inset-0 w-full h-full"
      />
      {renderContent()}
    </Box>
  );
});

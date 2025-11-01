import { FC, memo } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useAtomValue } from 'jotai';
import { channelsAtom, currentIndexAtom } from '@/store/channelAtoms';
import { useChannels } from '@/hooks/useChannels';
import { useChannelNavigation } from '@/hooks/useChannelNavigation';
import type { Channel } from '@/types';

const PlatformIcon: FC<{ platform: Channel['platform'] }> = memo(({ platform }) => {
  if (platform === 'youtube') {
    return <YouTubeIcon className="text-red-500" />;
  }
  // Twitch icon placeholder (Material UI doesn't have a Twitch icon)
  return (
    <Box
      className="w-6 h-6 flex items-center justify-center rounded bg-purple-600 text-white font-bold"
      sx={{ fontSize: '12px' }}
    >
      T
    </Box>
  );
});

export const ChannelList: FC = memo(() => {
  const channels = useAtomValue(channelsAtom);
  const currentIndex = useAtomValue(currentIndexAtom);
  const { removeChannel } = useChannels();
  const { switchChannel } = useChannelNavigation();

  const handleChannelClick = (index: number) => {
    switchChannel(index);
  };

  const handleRemoveChannel = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    removeChannel(index);
  };

  if (channels.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center p-8 text-gray-400">
        <Typography variant="body1">チャンネルが登録されていません</Typography>
        <Typography variant="body2" className="mt-2">
          下のフォームからチャンネルを追加してください
        </Typography>
      </Box>
    );
  }

  return (
    <List className="w-full max-h-64 overflow-y-auto">
      {channels.map((channel, index) => (
        <ListItem
          key={channel.id}
          disablePadding
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(e) => handleRemoveChannel(index, e)}
              className="text-gray-400 hover:text-red-500"
            >
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemButton
            selected={index === currentIndex}
            onClick={() => handleChannelClick(index)}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.dark',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            }}
          >
            <DragIndicatorIcon className="text-gray-500 mr-2" />
            <Box className="mr-2">
              <PlatformIcon platform={channel.platform} />
            </Box>
            <ListItemText
              primary={channel.displayName}
              secondary={
                <Box className="flex items-center gap-2 mt-1">
                  <Chip
                    label={channel.platform}
                    size="small"
                    className="text-xs"
                    sx={{
                      bgcolor:
                        channel.platform === 'youtube' ? '#ff0000' : '#9146ff',
                      color: 'white',
                      height: '20px',
                    }}
                  />
                  {index === currentIndex && (
                    <Chip
                      label="再生中"
                      size="small"
                      color="primary"
                      className="text-xs"
                      sx={{ height: '20px' }}
                    />
                  )}
                </Box>
              }
              secondaryTypographyProps={{ component: 'div' }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
});

import { FC, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useChannels } from '@/hooks/useChannels';

export const AddChannelForm: FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addChannel } = useChannels();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }

    setIsLoading(true);

    try {
      await addChannel(url.trim());
      setUrl('');
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('チャンネルの追加に失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="w-full">
      <Box className="flex gap-2">
        <TextField
          fullWidth
          size="small"
          placeholder="YouTube または Twitch の URL を入力"
          value={url}
          onChange={handleUrlChange}
          disabled={isLoading}
          error={!!error}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !url.trim()}
          startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
          sx={{ minWidth: '100px' }}
        >
          {isLoading ? '追加中' : '追加'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="mt-2" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

import { Component, ReactNode, ErrorInfo } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          className="min-h-screen w-full flex items-center justify-center"
          sx={{ bgcolor: 'background.default', p: 4 }}
        >
          <Box className="max-w-md w-full">
            <Alert severity="error" className="mb-4">
              <Typography variant="h6" className="mb-2">
                エラーが発生しました
              </Typography>
              <Typography variant="body2" className="mb-2">
                アプリケーションでエラーが発生しました。ページを再読み込みしてください。
              </Typography>
              {this.state.error && (
                <Typography
                  variant="caption"
                  className="mt-2 block text-gray-400"
                >
                  {this.state.error.message}
                </Typography>
              )}
            </Alert>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              fullWidth
            >
              ページを再読み込み
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

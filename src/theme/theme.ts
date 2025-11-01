import { createTheme } from '@mui/material/styles';

// MUI コンポーネントのデフォルト設定のみ（スタイリングは Tailwind で行う）
export const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true, // フラットデザイン
      },
    },
  },
});

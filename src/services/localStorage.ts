/**
 * localStorage service
 *
 * データの保存、読み込み、クリアを行うユーティリティ関数
 * すべての操作でエラーハンドリングを実装
 */

/**
 * データを localStorage に保存
 * @param key - 保存キー
 * @param value - 保存する値（JSON シリアライズ可能なもの）
 * @throws Error - localStorage容量超過時やその他のエラー
 */
export const saveToLocalStorage = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (error instanceof Error) {
      // QuotaExceededError: localStorage容量超過
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage容量超過エラー:', error);
        throw new Error('データの保存に失敗しました。ストレージ容量が不足しています。');
      }
      console.error('localStorage保存エラー:', error);
      throw new Error('データの保存に失敗しました。');
    }
    console.error('localStorage保存エラー（不明）:', error);
    throw new Error('データの保存に失敗しました。');
  }
};

/**
 * localStorage からデータを読み込み
 * @param key - 読み込むキー
 * @returns パースされたデータ、存在しない場合やエラー時は null
 */
export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('localStorage load error:', error);
    return null;
  }
};

/**
 * localStorage のすべてのデータをクリア
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('localStorage clear error:', error);
  }
};

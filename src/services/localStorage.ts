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
 */
export const saveToLocalStorage = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('localStorage save error:', error);
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

/**
 * API レート制限クラス
 * YouTube/Twitch への過剰な負荷を防ぐため、リクエスト間隔を制限する
 */
export class RateLimiter {
  private lastRequestTime: number = 0;
  private readonly minInterval: number;

  /**
   * @param minIntervalMs - 最小リクエスト間隔(ミリ秒)
   * @throws {Error} 間隔が0以下の場合
   */
  constructor(minIntervalMs: number) {
    if (minIntervalMs <= 0) {
      throw new Error('Minimum interval must be greater than 0');
    }
    this.minInterval = minIntervalMs;
  }

  /**
   * リクエストをスロットル(遅延)する
   * 前回のリクエストから最小間隔が経過していない場合、待機する
   */
  async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;

    if (elapsed < this.minInterval) {
      // 最小間隔に達するまで待機
      const waitTime = this.minInterval - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    // リクエスト時刻を更新
    this.lastRequestTime = Date.now();
  }
}

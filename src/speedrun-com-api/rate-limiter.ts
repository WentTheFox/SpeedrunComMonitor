interface RateLimiterConfig {
  requestPeriodMs: number;
  requestsPerPeriod: number;
}

export class RateLimiter {
  protected resetTimer: ReturnType<typeof setTimeout> | null = null;
  protected resetPromise: Promise<void> = Promise.resolve();
  protected remainingRequests: number;

  constructor(protected config: RateLimiterConfig) {
    this.resetRemainingRequests();
  }

  async exponentialBackOff(count: number = 1): Promise<void> {
    if (this.resetTimer !== null) {
      clearTimeout(this.resetTimer);
    }
    return this.createResetPromise(Math.pow(2, count) * 1e3);
  }

  async consume() {
    if (this.remainingRequests <= 0) {
      await this.resetPromise;
    }

    if (!this.resetTimer) {
      this.resetPromise =this.createResetPromise();
    }

    this.remainingRequests--;
  }

  protected createResetPromise(timeout: number = this.config.requestsPerPeriod): Promise<void> {
    return  new Promise((resolve) => {
      this.resetTimer = setTimeout(() => {
        this.resetRemainingRequests();
        resolve();
      }, timeout);
    });
  }

  protected resetRemainingRequests(): void {
    this.remainingRequests = this.config.requestPeriodMs;
    this.resetTimer = null;
  }
}

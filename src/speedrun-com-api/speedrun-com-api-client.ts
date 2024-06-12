import { RateLimiter } from './rate-limiter.js';
import { SpeedrunApiEndpoint } from './speedrun-api-endpoint.enum.js';
import { SpeedrunApiRequestParams } from './speedrun-api-request-params.model.js';
import { SpeedrunApiResponse } from './speedrun-api-response.model.js';
import { SpeedrunApiRequestMethods } from './speedrun-api-request-methods.js';

export class SpeedrunComApiClient {
  protected rateLimiter: RateLimiter;

  constructor(protected userAgent: string, protected baseUrl = 'https://www.speedrun.com/api/v1') {
    this.rateLimiter = new RateLimiter({ requestPeriodMs: 100, requestsPerPeriod: 60e3 });
  }

  async request<T extends SpeedrunApiEndpoint>(endpoint: T, params: SpeedrunApiRequestParams[T]): Promise<SpeedrunApiResponse[T]> {
    return this.requestInternal(endpoint, params);
  }

  protected async requestInternal<T extends SpeedrunApiEndpoint>(endpoint: T, params: SpeedrunApiRequestParams[T], backoffCount = 1): Promise<SpeedrunApiResponse[T]> {
    const method = SpeedrunApiRequestMethods[endpoint];
    const pathname = this.getRequestPath(endpoint, params);
    const queryParams = this.getRequestQueryParamsOnly(endpoint, params);
    await this.rateLimiter.consume();
    const searchParams = new URLSearchParams(Object.entries(queryParams)).toString();
    const queryString = searchParams.length > 0 ? `?${searchParams}` : '';
    const requestUrl = new URL(this.baseUrl + pathname + queryString);
    const result = await fetch(requestUrl, {
      method,
      headers: {
        Accept: 'application/json',
        'User-Agent': this.userAgent,
      },
    });
    if (!result.ok) {
      if (result.status === 420) {
        await this.rateLimiter.exponentialBackOff(backoffCount);
        return this.requestInternal(endpoint, params, backoffCount + 1);
      }

      throw new Error(`Speedrun.com API ${method} ${requestUrl} failed, HTTP ${result.status} (${result.statusText})`);
    }
    // else console.debug(`Speedrun.com API ${method} ${requestUrl} successful, HTTP ${result.status} (${result.statusText})`)
    return await result.json();
  }

  protected getRequestPath<T extends SpeedrunApiEndpoint>(endpoint: T, params: SpeedrunApiRequestParams[T]): string {
    switch (endpoint) {
      case SpeedrunApiEndpoint.GET_RUNS:
        return '/runs';
      case SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_CATEGORY_CATEGORY: {
        const { category, game } = params as SpeedrunApiRequestParams[SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_CATEGORY_CATEGORY];
        delete params.game;
        delete params.category;
        return `/leaderboards/${game}/category/${category}`;
      }
      case SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_LEVEL_LEVEL_CATEGORY: {
        const { category, game, level } = params as SpeedrunApiRequestParams[SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_LEVEL_LEVEL_CATEGORY];
        return `/leaderboards/${game}/level/${level}/${category}`;
      }
      default:
        throw new Error(`Unhandled endpoint ${endpoint} while getting request URL`);
    }
  }

  protected getRequestQueryParamsOnly<T extends SpeedrunApiEndpoint>(endpoint: T, params: SpeedrunApiRequestParams[T]): Record<string, string> {
    switch (endpoint) {
      case SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_CATEGORY_CATEGORY: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for removing the values from the source object
        const { category, game, ...rest } = params as SpeedrunApiRequestParams[SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_CATEGORY_CATEGORY];
        return rest;
      }
      case SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_LEVEL_LEVEL_CATEGORY: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for removing the values from the source object
        const { category, game, level, ...rest } = params as SpeedrunApiRequestParams[SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_LEVEL_LEVEL_CATEGORY];
        return rest;
      }
      default:
        return params;
    }
  }
}

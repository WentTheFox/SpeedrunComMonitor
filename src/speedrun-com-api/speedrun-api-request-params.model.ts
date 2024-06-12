import { SpeedrunApiEndpoint } from './speedrun-api-endpoint.enum.js';

type SortDirection = 'asc' | 'desc';

/**
 * Good enough for our needs
 */
type NestedEmbed<T extends string> = T | `${T},${T}` | `${T},${T},${T}` | `${T},${T},${T},${T}` | `${T},${T},${T},${T},${T}`;

type RunStatus = 'new' | 'verified' | 'rejected';

type GetRunsOrderBy =
/**
 * (default) 	sorts by the game the run was done in
 */
  | 'game'
  /**
   * sorts by the category the run was done in
   */
  | 'category'
  /**
   * sorts by the level the run was done in
   */
  | 'level'
  /**
   * sorts by the console used for the run
   */
  | 'platform'
  /**
   * sorts by the console region the run was done in
   */
  | 'region'
  /**
   * sorts by whether or not a run is done via emulator
   */
  | 'emulated'
  /**
   * sorts by the date the run happened on
   */
  | 'date'
  /**
   * sorts by the date when the run was submitted to speedrun.com
   */
  | 'submitted'
  /**
   * sorts by verification status
   */
  | 'status'
  /**
   * sorts by the date the run was verified on
   */
  | 'verify-date';

type GetRunsEmbed =
/**
 * will embed the full game resource.
 */
  | 'game'
  /**
   * will embed the category in which the run was done.
   */
  | 'category'
  /**
   * will embed the level in which the run was done. This can be empty if it's a full-game run.
   */
  | 'level'
  /**
   * will replace the players field with the full user/guest resources of the participating players. Each of those players will have the rel field just as if there was no embedding at all, so you can easily distinguish between users and guests (without resorting to logic like "if there's an ID, it must be a user").
   */
  | 'players'
  /**
   * will embed the full region resource. This can be empty if no region was set for the run.
   */
  | 'region'
  /**
   * will embed the full platform resource. This can be empty if no platform was set for the run.
   */
  | 'platform';


export interface SpeedrunApiRequestParams {
  /**
   * @see https://github.com/speedruncomorg/api/blob/master/version1/runs.md#get-runs
   */
  [SpeedrunApiEndpoint.GET_RUNS]: {
    /**
     * user ID; when given, only returns runs played by that user
     */
    user?: string;
    /**
     * when given, only returns runs done by that guest
     */
    guest?: string;
    /**
     * user ID; when given, only returns runs examined by that user
     */
    examiner?: string;
    /**
     * game ID; when given, restricts to that game
     */
    game?: string;
    /**
     * level ID; when given, restricts to that level
     */
    level?: string;
    /**
     * category ID; when given, restricts to that category
     */
    category?: string;
    /**
     * platform ID; when given, restricts to that platform
     */
    platform?: string;
    /**
     * region ID; when given, restricts to that region
     */
    region?: string;
    /**
     * when 1, yes or true, only games run on emulator will be returned
     */
    emulated?: string;
    /**
     * filters by run status; new, verified and rejected are possible values for this parameter
     */
    status?: RunStatus;

    orderby?: GetRunsOrderBy;
    direction?: SortDirection;
    embed?: NestedEmbed<GetRunsEmbed>;
  };
  [SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_CATEGORY_CATEGORY]: {
    game: string;
    category: string;
  };
  [SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_LEVEL_LEVEL_CATEGORY]: {
    game: string;
    level: string;
    category: string;
  };
}

/**
 * Widen csstype Properties with an index signature so CSS custom
 * properties (e.g. `--d`, `--reveal-distance`) are accepted by
 * `React.CSSProperties` without per-property casts.
 */
declare module "csstype" {
  interface Properties<TLength = (string & {}) | 0, TTime = string & {}> {
    [key: string]: string | number | undefined;
  }
}
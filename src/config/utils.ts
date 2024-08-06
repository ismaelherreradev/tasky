import { type PathsConfig } from "./types";

/**
 * Retrieves a path from the paths configuration based on the specified page key.
 * @param {PathsConfig} paths - The object containing all possible paths.
 * @param {keyof PathsConfig} page - The key of the desired path in the paths configuration.
 * @returns {string} - The corresponding path string.
 */
export function getPath(paths: PathsConfig, page: keyof PathsConfig): string {
  return paths[page];
}

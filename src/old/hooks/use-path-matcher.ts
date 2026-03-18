import { usePathname } from "next/navigation";

import { Paths } from "~/config/site";

export type PathKey = keyof typeof Paths;
export type PathValue = (typeof Paths)[PathKey];

export function usePathMatcher(targetPath: string) {
  const pathname = usePathname();
  return pathname === targetPath;
}

export function generatePath(key: PathKey, ...params: string[]): PathValue {
  let path = Paths[key];
  params.forEach((param, index) => {
    path = path.replace(`:param${index + 1}`, param) as PathValue;
  });
  return path;
}

export function useBoardPath(pathKey: PathKey, boardId: string) {
  const path = generatePath(pathKey, boardId);
  const isMatchingPath = usePathMatcher(path);
  return { path, isMatchingPath };
}

export function useOrganizationPath(pathKey: PathKey, orgId: string) {
  const path = generatePath(pathKey, orgId);
  const isMatchingPath = usePathMatcher(path);
  return { path, isMatchingPath };
}

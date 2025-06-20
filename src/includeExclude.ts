import { FrontmatterAutomateRuleSettings, FrontmatterAutomateSettings } from "./types";
import { DirectorySelectionItem, DirectorySelectionState, DirectorySelectionStateType } from "./uiDirectorySelectionModal";
import { TreeHierarchyFolder } from "./uiTreeHierarchySortableSettings";

/*
class handling include and exclude patterns for file processing
*/
export class Filter {
  filterMap: Map<string, DirectorySelectionItem>;
  constructor() {
    this.filterMap = new Map<string, DirectorySelectionItem>();
  }
  addFilterMap(map: Map<string, DirectorySelectionItem>) {
    map.forEach((value, key) => {
      this.filterMap.set(key, value);
    });
  }
  clearFilterMap() {
    this.filterMap.clear();
  }
  getFilterMap(): Map<string, DirectorySelectionItem> {
    return this.filterMap;
  }
  /**
   * Determines whether a file at the given path should be included or excluded based on the filter map.
   *
   * The method checks the current path and traverses up the directory tree, looking for an explicit
   * 'include' or 'exclude' state in the `filterMap`. If an explicit state is found, it returns the corresponding
   * boolean value. If no explicit state is found for the path or any of its parent directories, the method
   * defaults to including the file.
   *
   * @param path - The absolute path of the file to check.
   * @returns `true` if the file is explicitly included or inherits inclusion from a parent directory, or is not found in the filter map;
   *          `false` if the file is explicitly excluded, inherits exclusion.
   */
  file(path: string): boolean {
    while (true) {
      const item = this.filterMap.get(path);
      if (item) {
        if (item.state === 'include') {
          return true; // explicitly included
        }
        if (item.state === 'exclude') {
          return false; // explicitly excluded
        }
      }

      // move up the directory tree
      if (path === '/' || path === '') break;
      let parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
      if (!parentPath.startsWith('/')) {
          // Ensure parent path is always absolute
          parentPath = '/' + parentPath;
      }
      if (parentPath === path) break;
      path = parentPath;
    }
    return true; // not found in the filter map, default to exclude
  }
  checkState(path: string, state: DirectorySelectionStateType): boolean {
    while (true) {
      const item = this.filterMap.get(path);
      if (item) {
        return item.state === state;
      }

      // move up the directory tree
      if (path === '/' || path === '') break;
      let parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
      if (!parentPath.startsWith('/')) {
          // Ensure parent path is always absolute
          parentPath = '/' + parentPath;
      }
      if (parentPath === path) break;
      path = parentPath;
    }
    return false; // not found in the filter map, default to exclude
  }
  isIncluded(path: string): boolean {
    return this.checkState(path, 'include');
  }
  isExcluded(path: string): boolean {
    return this.checkState(path, 'exclude');
  }
  addFilterArray(array: DirectorySelectionState[]): void {
    array.forEach((item) => {
      this.filterMap.set(item.path, {
        state: item.state,
        type: item.type || 'folder',
      });
    });
  }
  fillFilterMap(settings: FrontmatterAutomateSettings, rulesFolder: TreeHierarchyFolder | string | undefined, rule: FrontmatterAutomateRuleSettings): void {
    this.clearFilterMap();
    if (rule.stateIncludeExclude) {
      this.addFilterArray(rule.stateIncludeExclude); // add rule specific state if available
    }
    if (rulesFolder) {
      if (typeof rulesFolder === 'string') {
        // If rulesFolder is a string, it is likely the path of the folder
        rulesFolder = settings.folderConfig.folders.find(folder => folder.id === rulesFolder);
      }
      if (rulesFolder) {
        this.addFilterArray(rulesFolder.payload?.stateIncludeExclude || []); // add rules current folder state if available
      
        const addParentState = (parentId: string) => {
          const parent = settings.folderConfig.folders.find(folder => folder.id === parentId);
            if (parent && parent.payload?.stateIncludeExclude) {
            this.addFilterArray(parent.payload?.stateIncludeExclude || []);
          }
        };

        if (rulesFolder.parentId) {
          addParentState(rulesFolder.parentId); // add parent folder state if available
        }
      }
    }
    this.addFilterArray(settings.stateIncludeExclude); // add global state from settings
  }
}

export const filter = new Filter();

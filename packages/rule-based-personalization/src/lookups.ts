/**
 * Provides a map-like object where a default object 
 * is returned if the specified key does not match.
 */
export type Lookup<T> = {
  /**
   * 
   * @param key 
   * @param disableFallback if true, no default element is returned even if one is available; otherwise, the default element is returned if available.
   */
  get(key: string, disableFallback?: boolean): T | undefined;
  keys: string[];
}

/**
 * Configuration used to defined how a lookup object works.
 */
export type LookupConfig<T> = {
  /**
   * The lookup returns this element if no element matches the specified key.
   */
  defaultElement?: T;
  /**
   * The elements in the lookup.
   */
  elements?: { [key: string]: T };
}

/**
 * Creates a lookup object using the settings from the specified config.
 * @param config 
 * @returns 
 */
export function createLookup<T>(config: LookupConfig<T>): Lookup<T> {
  const { defaultElement, elements = {} } = config;
  return {
    get: (key: string, disableFallback?: boolean) => {
      if (disableFallback === true) {
        return elements[key];
      }
      return elements[key] ?? defaultElement;
    },
    keys: Object.keys(elements),
  }
}

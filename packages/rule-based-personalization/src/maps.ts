import { MapWithDefault, MapWithDefaultConfig } from "./types";

export function createMapWithDefault<T>(config: MapWithDefaultConfig<T>): MapWithDefault<T> {
  const { defaultElement, elements = {} } = config;
  return {
    get: (key: string) => {
      return elements[key] ?? defaultElement;
    }
  }
}

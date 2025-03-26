import * as React from "react";

export function useCapitalizeFirst() {
  const cache = React.useRef<Record<string, string>>({});

  return React.useCallback((value?: string): string => {
    if (!value) return "";

    if (cache.current[value]) {
      return cache.current[value];
    }

    const result = value[0].toUpperCase() + value.slice(1);

    cache.current[value] = result;

    return result;
  }, []);
}

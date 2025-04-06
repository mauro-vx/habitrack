export const dayNameMap = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};

export const DAILY_DAYS_OF_WEEK = Object.keys(dayNameMap).reduce(
  (acc, key) => {
    acc[parseInt(key) as keyof typeof dayNameMap] = true;
    return acc;
  },
  {} as { [K in keyof typeof dayNameMap]: boolean },
);

export const DEFAULT_DAYS_OF_WEEK = Object.keys(dayNameMap).reduce(
  (acc, key) => {
    acc[parseInt(key) as keyof typeof dayNameMap] = false;
    return acc;
  },
  {} as { [K in keyof typeof dayNameMap]: boolean },
);


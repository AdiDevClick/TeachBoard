import { Temporal } from "@js-temporal/polyfill";

export type ParsingConfig<K = keyof ParsingResultMap> = {
  type: K;
};

export type ParsingResultMap = {
  date: Temporal.PlainDate;
  time: Temporal.PlainTime;
  instant: Temporal.Instant;
  "date-iso": string;
  datetime: Temporal.PlainDateTime;
};

import { Temporal } from "@js-temporal/polyfill";

/** Configuration for parsing date/time strings into Temporal objects. */
export type ParsingConfig<K = keyof ParsingResultMap> = {
  /** Choice of the expected date/time type */
  type: K;
};

export type ParsingResultMap = {
  date: Temporal.PlainDate;
  time: Temporal.PlainTime;
  instant: Temporal.Instant;
  "date-iso": string;
  datetime: Temporal.PlainDateTime;
};

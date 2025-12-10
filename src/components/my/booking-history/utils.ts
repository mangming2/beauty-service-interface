import { parse, differenceInCalendarDays } from "date-fns";

export const getDDayLabel = (dateString: string) => {
  try {
    const date = parse(dateString, "yyyy.MM.dd", new Date());
    const diff = differenceInCalendarDays(date, new Date());
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-DAY";
    return `D+${Math.abs(diff)}`;
  } catch {
    return "";
  }
};

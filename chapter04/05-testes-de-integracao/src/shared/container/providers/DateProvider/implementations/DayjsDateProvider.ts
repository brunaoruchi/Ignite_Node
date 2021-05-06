import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  dateNow(): Date {
    return dayjs().toDate();
  }
  compareInHours(start_date: Date, end_date: Date): number {
    const end_date_utc = dayjs(end_date).utc().local().format();
    const start_date_utc = dayjs(start_date).utc().local().format();

    return dayjs(end_date_utc).diff(start_date_utc, "hours");
  }
}

export { DayjsDateProvider };

import { DateObject } from "../globals";

export function parse_time(time: string): DateObject {
    const split = time.slice(0, -1).split("T");
    const [YYYY, MM, DD] = split[0].split("-").map(x => +x);
    const [HR,MIN,SEC] = split[1].substring(0, 8).split(":").map(x => +x);

    return {
        year: YYYY,
        month: MM,
        day: DD,

        hour: HR,
        minute: MIN,
        second: SEC
    }
}
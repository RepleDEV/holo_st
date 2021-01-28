import moment from "moment";

export function parse_time(time: string): moment.MomentObjectOutput {
    return moment(time).toObject();
}
import { Browser } from "puppeteer";
import { OngoingStream, UpcomingStream } from "../src/globals";

declare module "holo_st" {
    export function get_upcoming_streams(id: string, browser?: Browser): Promise<UpcomingStream[]>;
    export function get_ongoing_streams(id: string, browser?: Browser): Promise<OngoingStream[]>;

    export function get_all_upcoming_streams(): Promise<UpcomingStream[]>;
    export function get_all_ongoing_streams(): Promise<OngoingStream[]>;
}
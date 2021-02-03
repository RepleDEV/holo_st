import { Browser } from "puppeteer";
import { OngoingStream, UpcomingStream } from "./src/globals";

/**
 * Gets all upcoming live streams from a specific channel.
 * @param id Channel ID
 * @param browser Optional Puppeteer browser.
 */
export function get_upcoming_streams(id: string, browser?: Browser): Promise<UpcomingStream[]>;
/**
 * Gets all ongoing live streams from a specific channel.
 * @param id Channel ID
 * @param browser Optional Puppeteer browser.
 */
export function get_ongoing_streams(id: string, browser?: Browser): Promise<OngoingStream[]>;

/**
 * Gets all upcoming streams from (nearly) all Hololive channels.
 * @param callback Optional callback function. Callback will be called after each channel check.
 */
export function get_all_upcoming_streams(callback?: (ongoing_streams: UpcomingStream[], i: number) => void): Promise<UpcomingStream[]>;
/**
 * Gets all ongoing streams from (nearly) all Hololive channels.
 * @param callback Optional callback function. Callback will be called after each channel check.
 */
export function get_all_ongoing_streams(callback?: (ongoing_streams: OngoingStream[], i: number) => void): Promise<OngoingStream[]>;
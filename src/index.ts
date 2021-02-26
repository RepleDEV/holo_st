// TODO: Looping of all the channels will actually be better
// TODO: if done here :>

import puppeteer from "puppeteer";

import { OngoingStream, UpcomingStream } from "./globals";
import { get_upcoming_streams } from "./modules/get_upcoming_streams";
import { get_ongoing_streams } from "./modules/get_ongoing_streams";
import { get_channels } from "./modules/get_channels";

export async function get_all_upcoming_streams(check_callback?: (upcoming_streams: UpcomingStream[], i: number, t: number) => void): Promise<UpcomingStream[]> {
    const channels = await get_channels();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
    );

    const res: UpcomingStream[] = [];

    for (let i = 0; i < channels.length; i++) {
        const channelId = channels[i].channel.id;

        const t = Date.now();

        const upcomingStreams = await get_upcoming_streams(channelId, page);
        res.push(...upcomingStreams);

        if (typeof check_callback === "function") {
            check_callback(upcomingStreams, i, Date.now() - t);
        }
    }

    await browser.close();

    return res;
}

export async function get_all_ongoing_streams(check_callback?: (ongoing_streams: OngoingStream[], i: number, t: number) => void): Promise<OngoingStream[]> {
    const channels = await get_channels();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
    );

    const res: OngoingStream[] = [];

    for (let i = 0; i < channels.length; i++) {
        const channelId = channels[i].channel.id;

        const t = Date.now();

        const ongoingStreams = await get_ongoing_streams(channelId, page);
        res.push(...ongoingStreams);

        if (typeof check_callback === "function") {
            check_callback(ongoingStreams, i, Date.now() - t);
        }
    }

    await browser.close();

    return res;
}

export { get_upcoming_streams, get_ongoing_streams };

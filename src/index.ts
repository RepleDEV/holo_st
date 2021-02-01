// TODO: Looping of all the channels will actually be better
// TODO: if done here :>

import puppeteer from "puppeteer";
import * as path from "path";

import { Channels, OngoingStream, UpcomingStream } from "./globals";
import { promises as fs } from "fs";
import { get_upcoming_streams } from "./modules/get_upcoming_streams";
import { get_ongoing_streams } from "./modules/get_ongoing_streams";
import { get_channels } from "./modules/get_channels";

export async function get_all_upcoming_streams(check_callback?: (upcoming_streams: UpcomingStream[], i: number) => void): Promise<UpcomingStream[]> {
    const channels = await get_channels();

    const browser = await puppeteer.launch();

    const res: UpcomingStream[] = [];

    for (let i = 0; i < channels.length; i++) {
        const channelId = channels[i].channel.id;

        const upcomingStreams = await get_upcoming_streams(channelId, browser);
        res.push(...upcomingStreams);

        if (typeof check_callback === "function") {
            check_callback(upcomingStreams, i);
        }
    }

    await browser.close();

    return res;
}

export async function get_all_ongoing_streams(check_callback?: (ongoing_streams: OngoingStream[], i: number) => void): Promise<OngoingStream[]> {
    const channels = await get_channels();

    const browser = await puppeteer.launch();

    const res: OngoingStream[] = [];

    for (let i = 0; i < channels.length; i++) {
        const channelId = channels[i].channel.id;

        const ongoingStreams = await get_ongoing_streams(channelId, browser);
        res.push(...ongoingStreams);

        if (typeof check_callback === "function") {
            check_callback(ongoingStreams, i);
        }
    }

    await browser.close();

    return res;
}

export { get_upcoming_streams, get_ongoing_streams };

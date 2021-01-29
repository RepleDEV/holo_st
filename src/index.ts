// TODO: Looping of all the channels will actually be better
// TODO: if done here :>

import puppeteer, { Browser } from "puppeteer";
import * as path from "path";

import { Channels, OngoingStream, UpcomingStream } from "./globals";
import { promises as fs } from "fs";
import { get_upcoming_streams } from "./modules/get_upcoming_streams";
import { get_ongoing_streams } from "./modules/get_ongoing_streams";

async function get_channels(): Promise<Channels> {
    const channelsPath = path.resolve("./config/channels.json");
    const channels = JSON.parse(
        await fs.readFile(channelsPath, { encoding: "utf-8" })
    );

    return channels;
}

export async function get_all_upcoming_streams(): Promise<UpcomingStream[]> {
    const channels = await get_channels();

    const browser = await puppeteer.launch();

    const res: UpcomingStream[] = [];

    for (let i = 0; i < channels.length; i++) {
        const channelId = channels[i].channel.id;

        const upcomingStreams = await get_upcoming_streams(channelId, browser);
        res.push(...upcomingStreams);
    }

    await browser.close();

    return res;
}

export async function get_all_ongoing_streams(): Promise<OngoingStream[]> {
    const channels = await get_channels();

    const browser = await puppeteer.launch();

    const res: OngoingStream[] = [];

    for (let i = 0; i < channels.length; i++) {
        const channelId = channels[i].channel.id;

        console.log("Checking %s", i + 1);

        const upcomingStreams = await get_ongoing_streams(channelId, browser);
        res.push(...upcomingStreams);

        console.log("Checked %s", i + 1);
    }

    await browser.close();

    return res;
}

export { get_upcoming_streams, get_ongoing_streams };

import puppeteer from "puppeteer";
import cheerio from "cheerio";
import axios from "axios";

import { YoutubeVideoListResponse, UpcomingStream } from "../globals"
import { parse_time } from "./parse_time";
import { config } from "dotenv";

config();

async function get_stream_info(id: string): Promise<YoutubeVideoListResponse> {
    const key = process.env.API_KEY || "";

    const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos`, {
        params: {
            part: ["snippet", "liveStreamingDetails"].join(","),
            id: id,
            key: key
        }
    });

    const data: YoutubeVideoListResponse = res.data;
    return data;
}

async function get_html(url: string, browser_p?: puppeteer.Browser): Promise<string> {
    const browser = browser_p || await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
    await page.goto(url, { waitUntil: "networkidle0" });
    const data = await page.evaluate(() => document.querySelector("*")?.outerHTML) || "";

    // Don't close the browser if it's imported but close the page.
    if (browser_p) {
        await page.close();
    } else {
        await browser.close();
    }

    return data;
}

export async function get_upcoming_streams(id: string, browser_p?: puppeteer.Browser): Promise<UpcomingStream[]> {
    const data = await get_html(`https://youtube.com/channel/${id}/videos?view=2&live_view=502`, browser_p);
    if (!data)throw "UNABLE TO GET PAGE HTML DATA";

    const $ = cheerio.load(data);

    const hasUpcomingStreams = $("div#label-text.style-scope.yt-dropdown-menu").text() == "Upcoming live streams";
    if (!hasUpcomingStreams)return [];

    const videoIds: string[] = [];

    $("ytd-app div#content ytd-page-manager ytd-browse div#primary div#items")
        .children()
        .each((i, e) => {
            const meta = $(e).find("div#dismissable > div#details > div#meta");
            const videoId = meta.children(":first").children(":last").attr("href")?.substring("/watch?v=".length);

            if (videoId)videoIds.push(videoId);
        });

    const upcomingStreams: UpcomingStream[] = [];

    for (let i = 0;i < videoIds.length;i++) {
        const videoId = videoIds[i];
        const stream_info = await get_stream_info(videoId);

        const { snippet, liveStreamingDetails } = stream_info.items[0];
        const { publishedAt, channelId, title, description, thumbnails, channelTitle, tags, categoryId, defaultAudioLanguage } = snippet;
        const { scheduledStartTime, activeLiveChatId } = liveStreamingDetails;

        upcomingStreams.push({
            streamId: videoId,

            title: title,
            description: description,
            publishedAt: publishedAt,
            tags: tags,
            thumbnail: thumbnails,

            channelName: channelTitle,
            channelId: channelId,

            defaultAudioLanguage: defaultAudioLanguage,

            scheduledStartTime: parse_time(scheduledStartTime),
            activeLiveChatId: activeLiveChatId
        });
    }

    return upcomingStreams;
}
import puppeteer from "puppeteer";

import cheerio from "cheerio";

interface Date {
    day: number;
    month: number;
    year: number;

    hour?: number;
    minute?: number;
    second?: number;
}

interface UpcomingStream {
    title: string;
    waiting?: number;
    start: Date;
}

interface OngoingStream {
    title: string;
    watching?: number;
}

async function get_upcoming_streams(id: string): Promise<UpcomingStream[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
    await page.goto(`https://youtube.com/channel/${id}/videos?view=2&live_view=502`, { waitUntil: "networkidle0" });
    const data = await page.evaluate(() => document.querySelector("ytd-app div#content ytd-page-manager ytd-browse div#primary div#items")?.outerHTML) || "";
    await browser.close();

    if (!data)throw "UNABLE TO GET PAGE HTML DATA";

    const $ = cheerio.load(data);

    const upcomingStreams: UpcomingStream[] = [];

    $("div#items")
        .children()
        .each((i, e) => {
            const meta = $(e).find("div#dismissable > div#details > div#meta");
            const title = meta.children(":first").children(":last").text();
            // the + is to convert str to number.
            const waiting = +meta.find("div#metadata-line").children(":first").text().replace("waiting", "").trim();
            
            // Parse start date.
            // From "Scheduled for 1/1/21, 00:00"

            let start: Date = {
                day: 0,
                month: 0,
                year: 0                        
            }
            const startText = meta.find("div#metadata > div#metadata-line").children(":nth-child(2)").text();

            const startSplit = startText.split(",");
            // MM/DD/YY
            const [DD, MM, YY] = startSplit[0].substring("Scheduled for ".length).split("/").map((x) => +x);
            const [hour, minute] = startSplit[1].trim().split(":").map((x) => +x);
            start.day = DD;
            start.month = MM;
            start.year = YY;

            start.hour = hour;
            start.minute = minute;

            upcomingStreams.push({
                title: title,
                start: start,
                waiting: waiting
            });
        });

    return upcomingStreams;
}

async function get_ongoing_streams(id?: string): Promise<OngoingStream[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");

    if (id) {
        await page.goto(`https://youtube.com/channel/${id}/videos?view=2&live_view=501`, { waitUntil: "networkidle0" });

        const data = await page.evaluate(() => document.querySelector("*")?.outerHTML) || "";

        await browser.close();

        if (!data)throw "UNABLE TO GET HTML DATA";

        const $ = cheerio.load(data);

        const isLive = $("div#label-text.style-scope.yt-dropdown-menu").text() == "Live now";
        if (!isLive)return [];
        
        const ongoingStreams: OngoingStream[] = [];

        $("ytd-app div#content ytd-page-manager ytd-browse div#primary div#items")
            .children()
            .each((i, e) => {
                const meta = $(e).find("div#dismissable > div#details > div#meta");
                const title = meta.children(":first").children(":last").text();
                let watching: string | number = meta.find("div#metadata-line").children(":first").text().replace(" watching", "");
            });
    } else {
        // TODO:

        await browser.close();
    }

    return [];
}

export { get_upcoming_streams };
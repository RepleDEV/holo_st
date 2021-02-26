import puppeteer, { Browser, Page } from "puppeteer";

export async function get_html(
    url: string,
    page_p?: Page,
    close?: boolean
): Promise<string> {
    let browser: Browser = page_p ? page_p.browser(): await puppeteer.launch();
    const page = page_p || await browser.newPage();

    if (!page_p) {
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
        );
    }
    await page.goto(url, { waitUntil: "networkidle0" });
    const data =
        (await page.evaluate(() => document.querySelector("*")?.outerHTML)) ||
        "";

    // Don't close the browser if it's imported but close the page.
    if (page_p && close) {
        await page.close();
    } else if (close) {
        await browser.close();
    }

    return data;
}

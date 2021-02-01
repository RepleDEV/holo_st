import yargs from "yargs";
import logUpdate from "log-update";
import moment from "moment";
import { get_channels } from "./modules/get_channels";
import { Channel } from "./globals";
import { get_upcoming_streams } from "./modules/get_upcoming_streams";
import { get_ongoing_streams } from "./modules/get_ongoing_streams";
import { get_all_ongoing_streams, get_all_upcoming_streams } from ".";

const { argv } = yargs(process.argv.slice(2)).options({
    id: { type: "string" },
});

(async () => {
    const channels = await get_channels();

    let channel: Channel | null = null;

    if (argv._.length) {
        const channel_query = argv._.map((x) => x.toString().toLowerCase());

        let abort = false;
        for (let i = 0;i < channels.length;i++) {
            const _channel = channels[i];
            const { alias, name, channel: ch } = _channel;
            const names = [...alias, ...name.split(" ")];

            for (let j = 0;j < channel_query.length;j++) {
                for (let k = 0;k < names.length;k++) {
                    const c_cqname = channel_query[j];
                    const c_name = names[k].toLowerCase();

                    if (c_name.includes(c_cqname) || c_cqname.includes(c_name)) {
                        channel = _channel;
                        abort = true;
                        break;
                    }
                }
                if (abort)break;
            }
            if (abort)break;
        }
    } else if (argv.id) {
        for (let i = 0;i < channels.length;i++) {
            const _channel = channels[i];
            const { id } = _channel.channel;

            if (id == argv.id) {
                channel = _channel;
                break;
            }
        }
    } else {
        console.log("Checking all channels! This might take a while :>");

        const start_time = Date.now();

        let i = 0;
        logUpdate(`Checking: ${++i}/42`);

        if (argv.u) {
            const upcoming_streams = (await get_all_upcoming_streams(() => {
                logUpdate(`Checking: ${++i}/42`);
            })).reverse();

            logUpdate(`Finished checking channels. Finished time: ${Date.now() - start_time}ms`);

            if (!upcoming_streams.length) {
                console.log("There are no upcoming streams currently!");
                return;
            }

            for (let i = 0;i < upcoming_streams.length;i++)    {
                const upcoming_stream = upcoming_streams[i];
                console.log("---------------------->");
                console.log(`Title: ${upcoming_stream.title}`);
                console.log(`Channel name: ${upcoming_stream.channelName}`);
                console.log(`Starts at: ${moment(upcoming_stream.scheduledStartTime).format("dddd, MMMM Do YYYY, hh:mm:ss")}`);
            }
            console.log("---------------------->");
        } else if (argv.o) {
            const ongoing_streams = await get_all_ongoing_streams(() => {
                logUpdate(`Checking: ${++i}/42`);
            });

            logUpdate(`Finished checking channels. Finished time: ${Date.now() - start_time}ms`);

            if (!ongoing_streams.length) {
                console.log("There are no ongoing streams!");
                return;
            }
    
            for (let i = 0;i < ongoing_streams.length;i++)    {
                const ongoing_stream = ongoing_streams[i];
                console.log("---------------------->");
                console.log(`Title: ${ongoing_stream.title}`);
                console.log(`Channel name: ${ongoing_stream.channelName}`);
                console.log(`Current viewers: ${ongoing_stream.concurrentViewers}`);
                console.log(`Scheduled start time: ${moment(ongoing_stream.scheduledStartTime).format("dddd, MMMM Do YYYY, hh:mm:ss")}`)
                console.log(`Started at: ${moment(ongoing_stream.actualStartTime).format("dddd, MMMM Do YYYY, hh:mm:ss")}`);
            }
            console.log("---------------------->");
        }
        return;
    }

    if (channel === null) {
        console.log("No channel found! Please try again :3\n\nTip: You could specify the channel id by using the --id parameter :D");
        return;
    }

    console.log(`Checking for channel: ${channel.name}. Please wait...`);
    if (argv.u) {
        const upcoming_streams = await get_upcoming_streams(channel.channel.id);

        if (!upcoming_streams.length) {
            console.log("There are no upcoming streams currently!");
            return;
        }

        for (let i = 0;i < upcoming_streams.length;i++)    {
            const upcoming_stream = upcoming_streams[i];
            console.log("---------------------->");
            console.log(`Title: ${upcoming_stream.title}`);
            console.log(`Starts at: ${moment(upcoming_stream.scheduledStartTime).format("dddd, MMMM Do YYYY, hh:mm:ss")}`);
        }
        console.log("---------------------->");
    } else if (argv.o) {
        const ongoing_streams = await get_ongoing_streams(channel.channel.id);

        if (!ongoing_streams.length) {
            console.log("There are no ongoing streams!");
            return;
        }

        for (let i = 0;i < ongoing_streams.length;i++)    {
            const ongoing_stream = ongoing_streams[i];
            console.log("---------------------->");
            console.log(`Title: ${ongoing_stream.title}`);
            console.log(`Current viewers: ${ongoing_stream.concurrentViewers}`);
            console.log(`Scheduled start time: ${moment(ongoing_stream.scheduledStartTime).format("dddd, MMMM Do YYYY, hh:mm:ss")}`)
            console.log(`Started at: ${moment(ongoing_stream.actualStartTime).format("dddd, MMMM Do YYYY, hh:mm:ss")}`);
        }
        console.log("---------------------->");
    }
})();
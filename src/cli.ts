import * as holo_st from "../src";
import { promises as fs } from "fs";
import * as path from "path";

holo_st.get_upcoming_streams("UCa9Y57gfeY0Zro_noHRVrnw").then(async (res) => {
    console.log(res);

    // fs.writeFile(path.resolve("./temp/a.html"), res);
});
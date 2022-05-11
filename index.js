const fs = require("fs");
const axios = require("axios");

if (!fs.existsSync('./config.json')) {
    fs.appendFileSync('./config.json', `{\n    "token": "put ur discord acc token here",\n    "serverID": "put the server id here"\n}`)
    console.log('Config file created, go to "config.json", put the infos and restart the code.')
    process.exit()
}

async function main() {
    const { token, serverID } = require("./config.json");
    
    let res = await axios.get(`https://discord.com/api/v9/guilds/${serverID}/emojis`, { headers: { Authorization: token, } });
    let dones = 1;

    for (const emoji of res.data) {
        let format = `${emoji.id}.${emoji.animated ? 'gif' : 'png'}`
        let response = await axios.get(`https://cdn.discordapp.com/emojis/${format}`, { responseType: "stream" })

        if (!fs.existsSync('./emojis')) {
            fs.mkdirSync('./emojis')
        }

        response.data.pipe(fs.createWriteStream(`./emojis/${format}`));
        console.log(`[${dones++}/${res.data.length}] Complete`)
    }
};

main();
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

require('events').EventEmitter.defaultMaxListeners = 50;

const c = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    dim: '\x1b[2m'
};

const tick = `${c.green}✔${c.reset}`;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const TEAM_DIR = path.join(__dirname, 'team');

if (!fs.existsSync(TEAM_DIR)) {
    fs.mkdirSync(TEAM_DIR);
}

const spinnerFrames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
let spinnerIndex = 0;

function renderProgress(done, total) {
    const width = 22;
    const percent = done / total;
    const filled = Math.floor(percent * width);

    const red = '\x1b[31m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const reset = '\x1b[0m';
    const dim = '\x1b[2m';

    let bar = '';

    for (let i = 0; i < width; i++) {
        const p = i / width;

        if (i < filled) {
            if (p < 0.33) bar += `${red}█`;
            else if (p < 0.66) bar += `${yellow}█`;
            else bar += `${green}█`;
        } else {
            bar += `${dim}░`;
        }
    }

    bar += reset;

    process.stdout.write(
        `\r${spinnerFrames[spinnerIndex++ % spinnerFrames.length]} ` +
        `Descargando ` +
        `[${bar}] ` +
        `${done}/${total} (${Math.floor(percent * 100)}%)`
    );
}

client.once('clientReady', async () => {
    let guild = null;
    let role = null;

    for (const g of client.guilds.cache.values()) {
        try {
            const r = await g.roles.fetch(process.env.ROLE_ID);
            if (r) {
                guild = g;
                role = r;
                break;
            }
        } catch {}
    }

    if (!role) {
        console.log(`❌ Rol no encontrado`);
        client.destroy();
        return;
    }

    await guild.members.fetch();

    const members = [...role.members.values()];
    const total = members.length;

    let done = 0;

    renderProgress(0, total);

    for (const member of members) {
        try {
            const user = member.user;

            const url = user.displayAvatarURL({
                extension: 'webp',
                size: 512,
                forceStatic: true
            });

            const res = await axios.get(url, {
                responseType: 'arraybuffer'
            });

            const safeName = user.username
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
                .trim()
                .toLowerCase();

            let fileName = `${safeName}.webp`;
            let filePath = path.join(TEAM_DIR, fileName);

            let i = 2;
            while (fs.existsSync(filePath)) {
                fileName = `${safeName}_${i}.webp`;
                filePath = path.join(TEAM_DIR, fileName);
                i++;
            }

            fs.writeFileSync(filePath, res.data);

        } catch {}

        done++;
        renderProgress(done, total);
    }

    process.stdout.write('\n');

    console.log(
        `${tick} Completado: ${done}/${total} avatares descargados`
    );

    client.destroy();
    process.exit(0);
});

client.login(process.env.TOKEN);
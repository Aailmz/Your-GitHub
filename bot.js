const puppeteer = require('puppeteer');

const bot = {
    browser: null,
    page: null,

    init: async () => {
        bot.browser = await puppeteer.launch({ headless: true });
        bot.page = await bot.browser.newPage();
    },

    scrapeRepositories: async (url) => {
        await bot.page.goto(url, { waitUntil: 'networkidle2' });

        const repos = await bot.page.$$eval('#user-repositories-list ul li', elements => {
            return elements.map(el => {
                const title = el.querySelector('h3 a').innerText.trim();
                return title; 
            });
        });

        return repos;
    },

    scrapeProfile: async (url) => {
        await bot.page.goto(url, { waitUntil: 'networkidle2' });

        const profileData = await bot.page.$$eval('.vcard-names', elements => {
            const name = elements[0].querySelector('.p-name').innerText.trim();
            const username = elements[0].querySelector('.p-nickname').innerText.trim();
            return { name, username };
        });

        return profileData; 
    },

    close: async () => {
        if (bot.browser) {
            await bot.browser.close();
        }
    }
};

module.exports = bot;

import puppeteer from 'puppeteer';

const main = async () => {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function loginAndScrape() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto('https://www.linkedin.com/login');
        await page.type('#username', EMAIL);
        await page.type('#password', PASSWORD);
        await page.click('.btn__primary--large');
        await page.waitForSelector('.feed-identity-module__actor-meta', { timeout: 10 * 60 * 1000 });

        //companies
        let data = [];
        for (let i = 1; i <= MAX_PAGES; i++) {
            const searchURL = `https://www.linkedin.com/search/results/companies/?keywords=${companyName}`;
            await page.goto(searchURL);
            console.log(`Gone to company page`);
            await sleep(5000);
            // Wait for the specific container to ensure the page has loaded
            await page.waitForSelector('.search-results-container');

            // wait for 5 seconds before moving to the next page
        }

        fs.writeFileSync('links.csv', data.join('\n'));
        console.log('URLs saved to links.csv.');
        console.log({ message: "Links.csv generated", success: true });
        await browser.close();
    }

    loginAndScrape().catch((e) => {
        console.log(e);
        console.log({ message: "Error Occurred", success: false });
    });


}

main();
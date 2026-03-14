const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

        const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
        console.log('RESPONSE:', response.status());

        const content = await page.content();
        fs.writeFileSync('page_error.html', content);

        await browser.close();
        console.log('Capture complete!');
    } catch (e) {
        console.error('SCRIPT ERROR:', e);
        process.exit(1);
    }
})();

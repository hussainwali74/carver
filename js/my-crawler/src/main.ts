// Add import of CheerioCrawler
import { RequestQueue, CheerioCrawler, PlaywrightCrawler } from 'crawlee';

const requestQueue = await RequestQueue.open();
await requestQueue.addRequest({ url: 'https://crawlee.dev' });

// Create the crawler and add the queue with our URL
// and a request handler to process the page.
// const crawler = new CheerioCrawler({
//     maxRequestsPerCrawl: 20,
// 
//     requestQueue,
//     // The `$` argument is the Cheerio object
//     // which contains parsed HTML of the website.
//     async requestHandler({ $, request, enqueueLinks }) {
//         // Extract <title> text with Cheerio.
//         // See Cheerio documentation for API docs.
//         const title = $('title').text();
//         console.log(`The title of "${request.url}" is: ${title}.`);
//         await enqueueLinks({
//             strategy: 'same-domain' // . To include subdomains in your crawl, use the strategy argument.
//         });
//     }
// })

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request, enqueueLinks }) => {
        console.log(`Processing: ${request.url}`)
        // Wait for the actor cards to render,
        // otherwise enqueueLinks wouldn't enqueue anything.
        await page.waitForSelector('.ActorStorePagination-pages a');

        // Add links to the queue, but only from
        // elements matching the provided selector.
        await enqueueLinks({
            selector: '.ActorStorePagination-pages > a',
            label: 'LIST',
        })
    },
});

await crawler.run(['https://apify.com/store']);

// Start the crawler and wait for it to finish
// await crawler.run();
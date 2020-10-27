const openPage = require('../openPage')
const scrapSection = require('../scrapSection')
const scrollToPageBottom = require('../profile/scrollToPageBottom')
const crawlCompanyPeopleByList = require("./crawlCompanyPeopleByList")
const template = require('./companyScraperTemplate')

const logger = require('../logger')(__filename)

module.exports = async (browser, cookies, url, waitTimeToScrapMs = 500, puppeteerAuthenticate = undefined) => {
  logger.info(`starting scraping url: ${url}`);

  let company = {};

  let page;

  if (url.endsWith("/people") || url.endsWith("/people/")) {
    logger.info(`will crawl company people now: ${url}`);

    page = await openPage({ browser, cookies, url, puppeteerAuthenticate });

    const [allEmployeesLink] = await page.$x(`//a[contains(@href,'/search/results/people/?facetCurrentCompany')]`);

    if (allEmployeesLink) {
        const href = await page.evaluate(element => element.href, allEmployeesLink)
        //console.log("\n\n" + href + "\n")
        page = await openPage({ browser, cookies, url: href, puppeteerAuthenticate });
        //await allEmployeesLink.click();
        company.people = await crawlCompanyPeopleByList(page, browser, cookies, puppeteerAuthenticate)
    } else {
      logger.info('scrolling page to the bottom')
      await scrollToPageBottom(page)

      company.url = url;
      company.people = await scrapSection(page, template.people);
    }
  } else {
    if(url.includes('legacySchoolId=')){
        page = await openPage({ browser, cookies, url, puppeteerAuthenticate });
  
        const aboutSelector = 'a[href$="/about/"]';
  
        company.url = page.url();
        
        await page.$eval(aboutSelector, async about => await about.click());
        await page.waitForNavigation();
    } else {
        company.url = url;
        url = url + '/about';
        page = await openPage({ browser, cookies, url, puppeteerAuthenticate });
    }
    company.about = (await scrapSection(page, template.about))[0];
    company.profile = (await scrapSection(page, template.profile))[0];
  }

  await page.close();
  logger.info(`finished scraping url: ${url}`);
  
  return company
    
}

const openPage = require('../openPage')
const scrapSection = require('../scrapSection')
const { people_list } = require('./companyScraperTemplate')
const template = require('./companyScraperTemplate')

const logger = require('../logger')(__filename)

module.exports = async (page, browser, cookies, puppeteerAuthenticate) => {
    let people = []
    let continueCrawling = true
    let iteration = 1

    while (continueCrawling) {
        const [selectedButton] = await page.$x('//li[@data-test-pagination-page-btn and contains(@class, "active selected")]')

        if (!selectedButton) {
            logger.error(`No selected button exists for iteration ${iteration}`)
            return null
        }

        const selectedButtonText = await page.evaluate(element => element.textContent, selectedButton)
        let rippedStr = selectedButtonText.replace(/^\s+|\s+$/g, '')
        logger.info(`Crawling profiles in page '${rippedStr}' - iteration ${iteration}`)

        const new_people = await scrapSection(page, template.people_list)
        let people_filtered = new_people.filter(p => p.full_name !== undefined)
        //console.log(people)
        people = people.concat(people_filtered)

        const [nextPageButton] = await page.$x('//button[@aria-label="Next" and not(@disabled)]')

        if (nextPageButton) {
            //const href = await page.evaluate(element => element.href, nextPageButton)
            //page = await openPage({ browser, cookies, url: href, puppeteerAuthenticate })

            //await nextPageButton.evaluate(nextPageButton => nextPageButton.click())

            await Promise.all([
                page.click('button[aria-label="Next"]:not(.artdeco-button--disabled)'),
                page.waitForNavigation({ waitUntil: 'networkidle2' }),
            ]);

            continueCrawling = true
            iteration++
        } else {
            continueCrawling = false
        }
    }

    return people
}
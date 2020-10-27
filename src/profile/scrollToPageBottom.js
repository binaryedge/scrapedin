const logger = require('../logger')(__filename)

module.exports = async (page) => {
  const MAX_TIMES_TO_SCROLL = 100
  const TIMEOUT_BETWEEN_SCROLLS = 200
  const MAX_TIMES_DIFF_SCROLL = 5
  const PAGE_BOTTOM_SELECTOR_STRING = '#expanded-footer'

  let prev_diff_content = ""
  let _diff_counter = 0

  for (let i = 0; i < MAX_TIMES_TO_SCROLL; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight))
    
    const new_diff_content = await page.evaluate(() => document.body.textContent)

    if (new_diff_content.length === 0) {
      logger.warn(`<!!> Can't use diff runs`)
    } else {
      if (new_diff_content === prev_diff_content) {
        _diff_counter++
  
        if (_diff_counter >= MAX_TIMES_DIFF_SCROLL) {
          logger.warn(`<*> No diffs in ${_diff_counter} runs.`)
  
          return
        } else {
          logger.info(`<+> Diffs: ${new_diff_content.length - prev_diff_content.length}`)
        }
      } else {
        _diff_counter = 0
      }

      prev_diff_content = new_diff_content
    }

    const hasReachedEnd = await page.waitForSelector(PAGE_BOTTOM_SELECTOR_STRING, {
      visible: true,
      timeout: TIMEOUT_BETWEEN_SCROLLS
    }).catch(() => {
      logger.info(`scrolling to page bottom (${i + 1})`)
    })

    if (hasReachedEnd) {
      return
    }
  }

  logger.warn('page bottom not found')
}

const puppeteer = require('puppeteer')
const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const axios = require('axios')

async function main() {
    if (!process.env.saveFolder) {
        console.error('Missing process.env.saveFolder')
        process.exit(1)
    }
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    
    await page.goto('https://storage.googleapis.com/access-logs-summaries-nodejs/index.html')
    
    await page.waitForSelector('a')
    
    const hrefs = await page.evaluate(() => Array.from(document.getElementsByTagName('a')).map(item => item.href))

    browser.close()
    
    const statList = hrefs.map(href => {
        return {
            href,
            date: href.slice(-13, -5)
        }
    })

    const toWrite = {
        lastUpdated: Date.now(),
        data: statList
    }
    
    fs.writeFileSync(path.resolve(process.env.saveFolder, 'data.json'), JSON.stringify(toWrite), {encoding: 'utf-8'})
    
    for (const {href, date} of statList) {
        axios.get(href).then(response => {
            fsPromises.writeFile(path.resolve(process.env.saveFolder, `${date}.json`), JSON.stringify(response.data), {encoding: 'utf-8'}).catch(error => {
                console.error('Error writing file for data with date:', date, error)
            })
        }).catch(error => {
            console.error('Error getting:', href, error)
        })
    }
}

main()
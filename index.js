const puppeteer = require('puppeteer')
const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const axios = require('axios')

async function main() {
    if (!process.env.dayDataFolder) {
        console.error('Missing process.env.dayDataFolder')
        process.exit(1)
    }

    if (!process.env.dayListFolder) {
        console.error('Missing process.env.dayListFolder')
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
    
    fs.writeFileSync(path.resolve(process.env.dayListFolder, 'data.json'), JSON.stringify(toWrite), {encoding: 'utf-8'})

    const files = fs.readdirSync(process.env.dayDataFolder)

    const newFiles = statList.filter(stat => !files.includes(`${stat.date}.json`))

    if (newFiles.length === 0) {
        console.log('No new files to download.')
    } else {
        console.log('Downloading', newFiles.length, 'new files.')
    }
    
    for (const {href, date} of newFiles) {
        axios.get(href).then(response => {
            fsPromises.writeFile(path.resolve(process.env.dayDataFolder, `${date}.json`), JSON.stringify(response.data), {encoding: 'utf-8'}).catch(error => {
                console.error('Error writing file for data with date:', date, error)
            })
        }).catch(error => {
            console.error('Error getting:', href, error)
        })
    }
}

main()
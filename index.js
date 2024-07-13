const params = new URLSearchParams(window.location.search)
const date = params.get('date')

if (date) {
    fetch(`json/${date}.json`).then(response => response.json()).then(response => {
        document.querySelector('main').appendChild(document.getElementById('single-day-template').content.cloneNode(true))
        document.getElementById('loading-container').remove()
        console.log(response)
        document.getElementById('day').textContent = insertDashesInDate(date)
        document.getElementById('data-usage').textContent = (response.bytes / 1000 ** 4).toFixed(2)
        document.getElementById('downloads').textContent = response.total.toLocaleString()

        const archTableBody = document.getElementById('arch-table-body')
        const countryTableBody = document.getElementById('countries-table-body')
        const versionTableBody = document.getElementById('versions-table-body')
        const osTableBody = document.getElementById('os-table-body')

        for (const [key, value] of Object.entries(response.arch)) {
            const item = document.createElement('tr')
            const arch = document.createElement('td')
            const downloads = document.createElement('td')
            arch.textContent = key
            downloads.textContent = value.toLocaleString()
            item.appendChild(arch)
            item.appendChild(downloads)
            archTableBody.appendChild(item)
        }

        for (const [key, value] of Object.entries(response.country)) {
            const item = document.createElement('tr')
            const country = document.createElement('td')
            const downloads = document.createElement('td')
            country.textContent = key
            downloads.textContent = value.toLocaleString()
            item.appendChild(country)
            item.appendChild(downloads)
            countryTableBody.appendChild(item)
        }

        for (const [key, value] of Object.entries(response.version)) {
            const item = document.createElement('tr')
            const version = document.createElement('td')
            const downloads = document.createElement('td')
            version.textContent = key
            downloads.textContent = value.toLocaleString()
            item.appendChild(version)
            item.appendChild(downloads)
            versionTableBody.appendChild(item)
        }

        for (const [key, value] of Object.entries(response.os)) {
            const item = document.createElement('tr')
            const os = document.createElement('td')
            const downloads = document.createElement('td')
            os.textContent = key
            downloads.textContent = value.toLocaleString()
            item.appendChild(os)
            item.appendChild(downloads)
            osTableBody.appendChild(item)
        }
    }).catch(error => {
        console.error('An error occurred while getting data:', error)
        const errorText = document.getElementById('loading-text')
        errorText.classList.add('error')
        errorText.textContent = 'An error occurred. Please refresh the page.'
    })
} else {
    fetch('data.json').then(response => response.json()).then(response => {
        document.querySelector('main').appendChild(document.getElementById('all-days-template').content.cloneNode(true))
        const daysContainer = document.getElementById('days-container')
        console.log(response)
        document.getElementById('loading-container').remove()
        const cardTemplate = document.getElementById('card-template')
        for (const item of response.data) {
            const template = cardTemplate.content.cloneNode(true)
            const dateString = insertDashesInDate(item.date)
            template.querySelector('.card-date').textContent = dateString
            template.querySelector('.card').addEventListener('click', () => {
               params.set('date', item.date)
               window.location.search = params.toString()
            })
            daysContainer.appendChild(template)
        }
    }).catch(error => {
        console.error('An error occurred while getting data:', error)
        const errorText = document.getElementById('loading-text')
        errorText.classList.add('error')
        errorText.textContent = 'An error occurred. Please refresh the page.'
    })
}

function insertDashesInDate(date) {
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`
}
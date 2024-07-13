fetch('data.json').then(response => response.json()).then(response => {
    const daysContainer = document.getElementById('days-container')
    console.log(response)
    document.getElementById('loading-container').remove()
    const cardTemplate = document.getElementById('card-template')
    for (const item of response.data) {
        const template = cardTemplate.content.cloneNode(true)
        const dateString = `${item.date.slice(0, 4)}-${item.date.slice(4, 6)}-${item.date.slice(6)}`
        template.querySelector('.card-date').textContent = dateString
        daysContainer.appendChild(template)
    }
}).catch(error => {
    console.error('An error occurred while getting data:', error)
    const errorText = document.getElementById('loading')
    errorText.classList.add('error')
    errorText.textContent = 'An error occurred. Please refresh the page.'
})
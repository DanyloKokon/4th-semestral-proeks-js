
//==============================Query Selectors==============================//
const formEl = document.querySelector('.form')
const inputEl = document.querySelector('.input')
const btnEl = document.querySelector('.btn-search')

//==============================Logic==============================//
const apiTocken = 'acd1a7db8f824fbc9f9bc66185b587f1'
let query 
const getMusic = function (name) {
    fetch(`https://api.spotify.com/v1/search?q=${name}&type=track&market=KR`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer BQB3A0uLSHlXgfYqs0cTPG1L-SsNGt4WGTMwnY6-D9TiHPQsBa372IZt0Eq3LK4EOUGgK4K0H_6otdqXr1Jb8rgiBkX_0htSF072F_Rqj8Uxvnm1kw4J7GJhxHH85GtqD7ZwdVu3nxg`,
            'Content-Type': 'application/json'
        }
    }).then(res => { 
        return res.json() }
    )
}

//==============================Event Listeners==============================//
formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    query = e.currentTarget.search.value
    getMusic(query)
})
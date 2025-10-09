import { getToken } from "./apiToken"

//==============================Query Selectors==============================//
const formEl = document.querySelector('.form')
const inputEl = document.querySelector('.input')
const btnEl = document.querySelector('.btn-search')
const mainListEl = document.querySelector('.mainListEl')

const artistEl = document.querySelector('.artistP')
const songEl = document.querySelector('.songP')
const albumEl = document.querySelector('.albumP')
const imgEl = document.querySelector('.inModalImg')
const releaseEl = document.querySelector('.releaseP')
const linkA = document.querySelector('.listenA')
//==============================Logic==============================//

let query
const getMusic = function (name, apiTocken) {
    return fetch(`https://api.spotify.com/v1/search?q=${name}&type=track&market=KR`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiTocken}`,
            'Content-Type': 'application/json'
        }
    }).then(res => {
        //console.log(res);
        return res.json()

    }
    )
}
const getMusicDetails = function (id, apiTocken) {
    return fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiTocken}`,
            'Content-Type': 'application/json'
        }
    }).then(res => {
        //console.log(res);
        return res.json()

    }
    )
}
    
    //==============================Event Listeners==============================//
    formEl.addEventListener('submit', (e) => {
        e.preventDefault()
        query = e.currentTarget.search.value

        getToken().then(token => {
            getMusic(query, token.access_token).then((data) => {
                data.tracks.items.map((items) => {
                    mainListEl.insertAdjacentHTML('beforeend', holder(items))
                })


                formEl.reset()
            })

        })
    })


    //==============================Functions==============================//
    const holder = function (sondIdNow) {
        return `
<button data-action="open-modal" id="openModal"><div class="outModal">
  <img class="imgOutModal" id="${sondIdNow.id}" src="${sondIdNow.album.images[0].url}" alt="">
  <p class="mainOutModalp ">${sondIdNow.name}</p>
  <p class="pOutModal">${sondIdNow.artists[0].name}</p>
  <p class="pOutModal">Album name: ${sondIdNow.album.name}</p>
</div></button>


`}


    //==============================Modal==============================//
    let songId

    const openM = document.querySelector('[data-action="open-modal"]');
    const backdrop = document.querySelector('.js-backdrop');
    const modal = document.querySelector('.modal');
    const body = document.body
    const closeM = document.querySelector('[data-action="close-modal"]')

    function onBtnClick(e) {
        if (document.querySelector('#openModal')) {
            document.body.classList.toggle('show-modal')
            songId = e.target.id
            getToken().then(token => {
            getMusicDetails(songId, token.access_token).then((data) => {
                // Add modal content here using data
                //textContent
                //img.src = ""
                artistEl.textContent = data.artists[0].name
                songEl.textContent = data.name
                albumEl.textContent = data.album.name
                imgEl.src = data.album.images[0].url
                releaseEl.textContent = data.album.release_date
                linkA.href = data.external_urls.spotify
            })

        })

    }}

    openM.addEventListener('click', onBtnClick);
    // console.log(openM);
    closeM.addEventListener('click', onBtnClick);
    backdrop.addEventListener('click', (event) => {
        if (event.currentTarget === event.target) {
            onBtnClick()
        }
    });
    window.addEventListener('keydown', (event) => {
        //console.log(event.key);
        if (event.key === 'Escape' && document.body.classList.contains('show-modal')) {
            onBtnClick()
        }
    })
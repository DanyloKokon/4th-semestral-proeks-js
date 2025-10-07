import { getToken } from "./apiToken"

//==============================Query Selectors==============================//
const formEl = document.querySelector('.form')
const inputEl = document.querySelector('.input')
const btnEl = document.querySelector('.btn-search')
const mainListEl = document.querySelector('.mainListEl')

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

//==============================Event Listeners==============================//
formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    query = e.currentTarget.search.value

    getToken().then(token => {
        getMusic(query, token.access_token).then((data) => {
            data.tracks.items.map((items) => {
                mainListEl.insertAdjacentHTML('beforeend', holder(items))
            })
        })
        const openM = document.querySelector('[data-action="open-modal"]');
        const backdrop = document.querySelector('.js-backdrop');
        const modal = document.querySelector('.modal');
        const body = document.body
        const closeM = document.querySelector('[data-action="close-modal"]')

        function onBtnClick() {
            document.body.classList.toggle('show-modal')

        }
        openM.addEventListener('click', onBtnClick);
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


    })
})
//==============================Functions==============================//
const holder = function (sondIdNow) {
    return `
<button data-action="open-modal" id="openModal"><div class="outModal">
  <img class="imgOutModal" src="${sondIdNow.album.images[0].url}" alt="">
  <p class="pOutModal">${sondIdNow.name}</p>
  <p>${sondIdNow.artists[0].name}</p>
  <p>Album name ${sondIdNow.album.name}</p>
</div></button>

<div class="backdrop js-backdrop">
      <div class="modal">
        <h2>Modal window</h2>
        <p>
          
        </p>
        <button type="button" class="button" data-action="close-modal">
          Закрити
        </button>
      </div>
    </div>
`}


//==============================Modal==============================//


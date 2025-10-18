import { a } from "motion/react-client"
import { getToken } from "./apiToken"
import { animate, scroll } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm"
// const { animate, scroll } = Motion
const Pagination = tui.Pagination;
// const Pagination = require('tui-pagination'); /* CommonJS */
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



function fetchPage(query, token, offset) {
    fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&market=KR&limit=20&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            renderTracks(data.tracks.items);
        });
}





let allContent
let myToken
//==============================Event Listeners==============================//
formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    query = e.currentTarget.search.value

    getToken().then(token => {
        myToken = token.access_token
        // getMusic(query, myToken).then((data) => {
        //     allContent = data.tracks.total

        //     data.tracks.items.map((items) => {

        //         mainListEl.insertAdjacentHTML('beforeend', holder(items))

        //         mainListEl.addEventListener('click', (e) => {
        //             if (e.currentTarget){
        //                 animate(e.target, { rotate: 360 }, { stiffness: 300 })
        //             }
        //         })
        //     })


        //     formEl.reset()
        // })
        getMusic(query, myToken).then((data) => {
            allContent = data.tracks.total;

            renderTracks(data.tracks.items); // render first page

            const pagination = new tui.Pagination('tui-pagination-container', {
                totalItems: allContent,
                itemsPerPage: 20,
                visiblePages: 5,
                page: 1,
                centerAlign: true,
                template: {
                    page: '<a href="#" class="custom-page">{{page}}</a>',
                    currentPage: '<strong class="custom-page selected">{{page}}</strong>',
                    moveButton: '<a href="#" class="custom-move {{type}}">{{type}}</a>',
                    disabledMoveButton: '<span class="custom-move disabled {{type}}">{{type}}</span>',
                    moreButton: '<a href="#" class="custom-ellipsis">...</a>'
                }

            });

            pagination.on('afterMove', (event) => {
                const currentPage = event.page;
                const offset = (currentPage - 1) * 20;

                fetchPage(query, myToken, offset);
            });

            formEl.reset();
        });


    })
})







function renderTracks(items) {
    mainListEl.innerHTML = ''; // clear previous results

    items.forEach((item) => {
        mainListEl.insertAdjacentHTML('beforeend', holder(item));
    });
}


// getToken().then(token => {
//     recomendations(token.access_token).then((data) => {
//         data.tracks.map((items) => {
//             mainListEl.insertAdjacentHTML('beforeend', holder(items))
//         })})})

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

    }
}

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

//---------------------------------------------------------------------------------------

//   const  pagination = new tui.Pagination('pagination', {
//         totalItems: allContent ,
//         itemsPerPage: 20,
//         visiblePages: 5,
//         page: 1,
//         centerAlign: true,
//         // template: {
//         //     page: '<a href="#" class="tui-page-btn">{{page}}p</a>',
//         //     currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}p</strong>',
//         //     moveButton:
//         //         '<a href="#" class="tui-page-btn tui-{{type}} custom-class-{{type}}">' +
//         //             '<span class="tui-ico-{{type}}">{{type}}</span>' +
//         //         '</a>',
//         //     disabledMoveButton:
//         //         '<span class="tui-page-btn tui-is-disabled tui-{{type}} custom-class-{{type}}">' +
//         //             '<span class="tui-ico-{{type}}">{{type}}</span>' +
//         //         '</span>',
//         //     moreButton:
//         //         '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip custom-class-{{type}}">' +
//         //             '<span class="tui-ico-ellip">...</span>' +
//         //         '</a>'
//         // }
//     });

// pagination.on
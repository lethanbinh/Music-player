/* 
render song 
scroll top
load current song
play / pause / seek
play song when click
CD rotate
next / prev
random
next / repeat when ended
active song when click
scroll menu when active song
*/

// variable and const
const PLAYER_STORAGE_KEY = 'f8-player'

const s1 = document.querySelector.bind(document)
const s2 = document.querySelectorAll.bind(document)

const heading = s1('.music-name')
const songName = s1('.music-artist')
const cdThump = s1('.background')
const audio = s1('#audio')

const playBtn = s1('.play-toggle')
const loopBtn = s1('.loop-icon')
const preBtn = s1('.pre-icon')
const nextBtn = s1('.next-icon')
const randomBtn = s1('.exchange-icon')
const pause = s1('.pause-icon')
const line = s1('.line')
const menu = s1('.more-menu')

const musicAll = s1('.music-all')
const allPlayer = s1('.all-player')

var isActive = false
var isRepeatPlay = false


// playlist handle Javascript
const playList = {
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    isPlaying: false,
    currentIndex: 0,
    setConfig (key,value) {
        this.config[key] = value,
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Faded',
            artist: 'Alan Walker',
            img: '../assess/music img/faded.jpg',
            song: '../assess/music/y2meta.com - Alan Walker - Faded (320 kbps).mp3'
        },
        {
            name: 'On & On',
            artist: 'Cartoon',
            img: '../assess/music img/on and on.jpg',
            song: '../assess/music/y2meta.com - Cartoon - On & On (feat. Daniel Levi) [NCS Release] (128 kbps).mp3'
        },
        {
            name: 'Savannah',
            artist: 'Diviners',
            img: '../assess/music img/savannah.jpg',
            song: '../assess/music/y2meta.com - Diviners - Savannah (feat. Philly K) [NCS Release] (128 kbps).mp3'
        },
        {
            name: 'Summertime',
            artist: 'K391',
            img: '../assess/music img/summertime.jpg',
            song: '../assess/music/y2meta.com - EDM_ Summertime - K39 (128 kbps).mp3'
        },
        {
            name: 'Nova',
            artist: 'Ahrix',
            img: '../assess/music img/nova.jpg',
            song: '../assess/music/y2meta.com - Ahrix - Nova (320 kbps).mp3'
        },
        {
            name: 'Cloud 9',
            artist: 'Itro & Tobu',
            img: '../assess/music img/cloud 9.jpg',
            song: '../assess/music/y2meta.com - Itro & Tobu - Cloud 9 [NCS Release] (128 kbps).mp3'
        },
        {
            name: 'Ride on',
            artist: 'Garena AOV (Arena of Valor)',
            img: '../assess/music img/ride on.jpg',
            song: '../assess/music/y2meta.com - Ride On - WaVe First Single Lyrics Video - Garena AOV (Arena of Valor) (128 kbps).mp3'
        },
        {
            name: 'Monody',
            artist: 'The FatRat',
            img: '../assess/music img/monody.jpg',
            song: '../assess/music/y2meta.com - TheFatRat - Monody (feat. Laura Brehm) (320 kbps).mp3'
        },
        {
            name: 'Walk Thru Fire',
            artist: 'Vicetone',
            img: '../assess/music img/walk thru fire.jpg',
            song: '../assess/music/y2meta.com - Vicetone - Walk Thru Fire (Lyrics) ft. Meron Ryan (128 kbps).mp3'
        },
        {
            name: 'Nevada',
            artist: 'Vicetone',
            img: '../assess/music img/nevada.jpg',
            song: '../assess/music/y2meta.com - Vicetone - Nevada ft. Cozi Zuehlsdorff (Lyrics) (320 kbps).mp3'
        },
    ],



    defindProperties() {
        Object.defineProperty(this,'currentSong',{
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    render () {
        var htmls = this.songs.map((song,index) => {
            return `
        <div data-index = "${index}" class="song ${index === this.currentIndex ? 'played' : ''}">
            <img class="song-icon" src="${song.img}" alt=""> 
            <div class="song-content">
                <h3 class="song-name">${song.name}</h3>
                <p class="song-artist">${song.artist}</p>
            </div>
            <i class="ti-more-alt more-menu"></i>
        </div>
            `
        })
        var playList = s1('.songs-list')
        playList.innerHTML = htmls.join('')
    },
    

    handleEvent() {
        const this_ = this

        // handle cd width
        const rotateAnimation = cdThump.animate([
                {transform : 'rotate(360deg)'}
            ], {
                duration: 10000,
                iterations: Infinity
            })

        rotateAnimation.pause()

        const cd = s1('.background-music')
        const cdWidth = cd.offsetWidth

        document.onscroll = function () {
            const scrollTop = window.scrollY
            
            const newCDWidth = cdWidth - scrollTop
            if (scrollTop >= 0) {
                cd.style.width = newCDWidth + 'px'
            } else {
                cd.style.width = 0
            }
            cd.style.opacity = newCDWidth / cdWidth
        }
        var _this = this.isPlaying


        // handle play button
        playBtn.onclick = function () {
            if (_this === false) {
                audio.play()
            }
            else {
                audio.pause()
            }
        }   
        audio.onplay = function () {
            _this = true
            musicAll.classList.add('playing')
            rotateAnimation.play()
        }
        audio.onpause = function () {
            _this = false
            musicAll.classList.remove('playing')
            rotateAnimation.pause()
        }

        nextBtn.onclick = function () {

            if (isActive === true) {
                this_.playrandomSong()
            } else {
                this_.nextSong()
            }
            audio.play()
            this_.render()
            this_.scrollToWindow()
        }

        preBtn.onclick = function () {
            if (isActive === true) {
                this_.playrandomSong()
            } else {
                this_.preSong()
            }
            audio.play()
            this_.render()
            this_.scrollToWindow()
        }

        randomBtn.onclick = function () {
            isActive = !isActive
            this_.setConfig('isActive',isActive)
            randomBtn.classList.toggle('active', isActive)
        }

        // time handle
        const line = s1('.progress')

        audio.ontimeupdate = function () {
            if (audio.duration) {
                line.value = Math.floor((audio.currentTime / audio.duration)*100)
            }
        }

        line.onchange = function () {
            const currentTime = line.value / 100 * audio.duration
            if (currentTime != audio.currentTime) {
                audio.currentTime = currentTime  
            }
        }

        // ended audio
        audio.onended = function () {
            if (isRepeatPlay === false) {
                nextBtn.click()
            } else {
                this_.repeatCurrentSong()
                audio.play()
            }
        }

        loopBtn.onclick = function () {
            isRepeatPlay = !isRepeatPlay
            this_.setConfig('isRepeatPlay',isRepeatPlay)
            loopBtn.classList.toggle('active',isRepeatPlay)
        }

        // all player handle click
        
        allPlayer.onclick = function (e) {
            const songnotPlayed = e.target.closest('.song:not(.played)')
            if (songnotPlayed || e.target.closest('.more-menu')) {
                if (songnotPlayed) {
                    this_.currentIndex = Number(songnotPlayed.dataset.index)
                    this_.loadCurrentSong()
                    this_.render()
                    audio.play()
                }
            }
        }
    },
// load song
    loadCurrentSong () {
        heading.textContent = this.currentSong.name
        songName.textContent = this.currentSong.artist
        cdThump.src = this.currentSong.img
        audio.src = this.currentSong.song
    }
    ,
    nextSong () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    preSong () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playrandomSong () {
        let randomIndex

        do {
            randomIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (randomIndex === this.currentIndex)
        this.currentIndex = randomIndex
        this.loadCurrentSong()
    },
    repeatCurrentSong () {
        audio.currentTime = 0
        line.value = 0
        this.loadCurrentSong()
    },
    scrollToWindow () {
        setTimeout( ()=> {
            s1('.song.played').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },300)
    },

    loadconfig () {
        isActive = this.config.isActive
        isRepeatPlay = this.config.isRepeatPlay
    },

    start () {
        this.loadconfig()
        this.render(),
        this.handleEvent(),
        this.defindProperties(),
        this.loadCurrentSong(),
        randomBtn.classList.toggle('active',isActive),
        loopBtn.classList.toggle('active',isRepeatPlay)
    }

}

playList.start()


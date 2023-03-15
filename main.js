const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STOAGE_KEY = 'DS_PLAYER';

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const ramdomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const songActive = $('.song');
const playlist= $('.playlist');



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    isActive: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STOAGE_KEY)) || {} ,
    songs: [
        {
            name: 'You',
            singer: 'msmy, AK49',
            path: './acssets/song/Song1.mp3',
            image: './acssets/img/Song1.jpg'
        },
        {
            name: 'Luôn yêu đời',
            singer: 'Đen, Cheng',
            path: './acssets/song/Song2.mp3',
            image: './acssets/img/Song2.jpg'
        },
        {
            name: 'Comethru',
            singer: 'Jeremy Zucker',
            path: './acssets/song/Song3.mp3',
            image: './acssets/img/Song3.jpg'
        },
        {
            name: 'Shape of You',
            singer: 'Ed Sheeran',
            path: './acssets/song/Song4.mp3',
            image: './acssets/img/Song4.jpg'
        },
        {
            name: 'Bí mật nhỏ',
            singer: 'B Ray x Bảo Hân Helia x Hoàng Tôn ',
            path: './acssets/song/Song5.mp3',
            image: './acssets/img/Song5.jpg'
        },
        {
            name: 'Mong Một Ngày Anh Nhớ Đến Em ',
            singer: 'Huỳnh James x Pjnboys',
            path: './acssets/song/Song6.mp3',
            image: './acssets/img/Song6.jpg'
        }
    ],
    setconfig: function(key,value){
        this.config[key]=value;
        localStorage.setItem(PLAYER_STOAGE_KEY,JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index=${index}>
                <div class="thumb" style="background-image: url(${song.image});""></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('\n');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentsong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cd = $('.cd');
        const cdWith = cd.offsetWidth;

        const cdThumbAnimation = cdThumb.animate([
            {
                transform: 'rotate(360deg)',
            }],
            {
                duration: 10000,
                iterations: Infinity
            }
        );
        cdThumbAnimation.pause();

        document.onscroll = function () {
            const scrollTop = window.screenY || document.documentElement.scrollTop;
            const newCdWidth = cdWith - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWith;
        };

        playBtn.onclick = () => {
            if (this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimation.play();
        };

        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimation.pause();
        };

        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        };

        progress.oninput = (e) => {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
        };

        nextBtn.onclick = () => {
            if (_this.isRamdom) {
                this.playRandomSong();
            } else {
                this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        prevBtn.onclick = () => {
            if (_this.isRamdom) {
                this.playRandomSong();
            } else {
                this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        ramdomBtn.onclick = () => {
            _this.isRamdom = !_this.isRamdom;
            _this.setconfig('isRamdom',_this.isRamdom);
            ramdomBtn.classList.toggle('active', _this.isRamdom);
        };

        repeatBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat;
            _this.setconfig('isRepeat',_this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        audio.onended = () => {
            if (this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };
        playlist.onclick = function(e) {

        const songNode = e.target.closest('.song:not(.active)');
           if( songNode || e.target.closest('.option') ) {
            if(songNode){
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                audio.play();
                _this.render();
            }
            if(e.target.closest('.option'))
            {
                
            }
               
        }
    }
    },
    scrollToActiveSong: function (){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'end'
            });
        },300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentsong.name;
        cdThumb.style.backgroundImage = `url('${this.currentsong.image}')`;
        audio.src = this.currentsong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    loadConfig: function () {
        this.isRamdom = this.config.isRamdom;
        this.isRepeat = this.config.isRepeat;
    },
    start: function () {
        this.loadConfig();
        this.handleEvents();
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
        
        ramdomBtn.classList.toggle('active', this.isRamdom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
};

app.start();

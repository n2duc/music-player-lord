const body = document.body, 
    wrapper = document.querySelector(".wrapper"),
    musicImg = document.querySelector(".img-area .img-music"),
    musicName = document.querySelector(".song-details .name"),
    musicArtist = document.querySelector(".song-details .artist"),
    musicListQueue = document.querySelector(".music-list"),
    mainAudio = document.getElementById("main-audio"),
    playPauseBtn = document.querySelector(".play-pause"),
    prevBtn = document.getElementById("prev"),
    nextBtn = document.getElementById("next"),
    progressBar = document.querySelector(".progress-bar"),
    progressArea = document.querySelector(".progress-area"),
    musicDiscImg = document.querySelector(".img-music-disc"),
    showMoreBtn = document.getElementById("more-music"),
    totolMusic = document.querySelector(".total-music-list"),
    closeListBtn = document.getElementById("close"),
    moreBtn = document.querySelector(".more-btn"),
    actionBtn = document.querySelector(".more_btn"),
    actionMenu = document.querySelector(".action_menu"),
    darkModeBtn = document.querySelector(".dark-mode_btn"),
    textDarkModeBtn = document.querySelector(".dark_mode span"),
    volumeBtn = document.querySelector(".volume-btn"),
    volumeRangeInput = document.getElementById("volume_input"),
    lyricsBox = document.querySelector(".music-lyric"),
    lyricsBtn = document.querySelector(".lyrics-details_btn")

let musicIndex = 1;
let isMuted = false;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
    totolMusic.innerText = `Musiclist [${musicList.length} songs]`
})

actionBtn.addEventListener("click", () => {
    actionMenu.classList.toggle("show");
    actionMenu.classList.contains("show") ? actionBtn.style.color = "var(--green)" : actionBtn.style.color = "var(--lightblack)";
})
darkModeBtn.addEventListener("click", () => {
    if (body.classList.contains("light")) {
        darkModeBtn.innerText = "wb_sunny";
        textDarkModeBtn.innerText = "Light Mode"
        body.classList.remove("light");
    } else {
        darkModeBtn.innerText = "dark_mode";
        textDarkModeBtn.innerText = "Dark Mode"
        body.classList.add("light");
    }
})

// Lyrics
const copyBtn = document.querySelector(".copy-btn")
const textContainer = document.querySelector(".lyrics")
copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(textContainer.innerText);
    copyBtn.innerText = "content_paste";
    copyBtn.style.pointerEvents = "none";
    setTimeout(() => {
        copyBtn.innerText = "content_copy"
        copyBtn.style.pointerEvents = "auto";
    }, 1500)
})
lyricsBtn.addEventListener("click", () => {
    lyricsBox.classList.toggle("show");
    lyricsBox.classList.contains("show") ? lyricsBtn.style.color = "var(--green)" : lyricsBtn.style.color = "var(--lightblack)";
    wrapper.classList.toggle("expand");
})


function loadMusic(indexNumb) {
    musicName.innerText = musicList[indexNumb - 1].name;
    musicName.setAttribute("title", musicList[indexNumb - 1].name);
    musicArtist.innerText = musicList[indexNumb - 1].artist;
    mainAudio.src = `./musics/${musicList[indexNumb - 1].src}.mp3`;
    musicImg.style.backgroundImage = `url(./images/${musicList[indexNumb - 1].img}.jpg)`;
    musicDiscImg.style.backgroundImage = musicImg.style.backgroundImage;
    if (!(musicList[indexNumb - 1].lyric.length === 0)) {
        let spans = musicList[indexNumb - 1].lyric?.map((text) => `<span>${text}</span>`)
        textContainer.innerHTML = spans.join("");
    } else {
        textContainer.innerHTML = `<span>Lyrics are being updated</span>`;
    }
}

function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    document.title = musicList[musicIndex - 1].name;
    mainAudio.play();
}
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    document.title = "Music Lord";
    mainAudio.pause();
}
function nextMusic() {
    musicIndex++;
    if (musicIndex > musicList.length) musicIndex = 1;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
function prevMusic() {
    musicIndex--;
    if (musicIndex < 1) musicIndex = musicList.length;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
})
nextBtn.addEventListener("click", () => {
    nextMusic();
})
prevBtn.addEventListener("click", () => {
    prevMusic();
})
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressBarWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressBarWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`
    });

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
});

progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
});

const repeatBtn = document.getElementById("repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch(getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
})
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch(getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * musicList.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * musicList.length) + 1);
            } while(musicIndex == randIndex)
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
})

showMoreBtn.addEventListener("click", () => {
    musicListQueue.classList.toggle("show");
})
closeListBtn.addEventListener("click", () => {
    showMoreBtn.click();
})

const ulTag = document.querySelector("ul");
for (let i = 0; i < musicList.length; i++) {
    let liTag = `<li li-index="${i+1}">
        <div class="row">
            <span>${musicList[i].name}</span>
            <p>${musicList[i].artist}</p>
        </div>
        <audio class="${musicList[i].src}" src="./musics/${musicList[i].src}.mp3"></audio>
        <span class="audio-duration" id="${musicList[i].src}">3:20</span>
    </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${musicList[i].src}`)
    let liAudioTag = ulTag.querySelector(`.${musicList[i].src}`)

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    })
}

const allLiTag = ulTag.querySelectorAll("li");

function playingNow() {
    allLiTag.forEach(function(li, index) {
        let audioTag = li.querySelector(".audio-duration");
        if (allLiTag[index].classList.contains("playing")) {
            allLiTag[index].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        if (allLiTag[index].getAttribute("li-index") == musicIndex) {
            allLiTag[index].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        allLiTag[index].setAttribute("onclick", "clicked(this)")
    })  
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// Volume Change
const volumeTextDetail = document.querySelector(".volume-text");
volumeRangeInput.addEventListener("input", (e) => {
    let volumeValue = Number(e.target.value) / 100;
    mainAudio.volume = volumeValue;
    volumeTextDetail.innerText = `${Number(e.target.value)}%`;
    changeIconVolume(volumeValue);
})

volumeBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    let currentVolume = Number(volumeRangeInput.value) / 100;
    if(isMuted) {
        volumeBtn.textContent = "volume_off";
        mainAudio.volume = 0;
    } else {
        volumeBtn.textContent = "volume_up";
        mainAudio.volume = currentVolume;
        changeIconVolume(currentVolume);
    }
})

function changeIconVolume(volumeValue) {
    if (volumeValue > 0.5 && volumeValue <= 1) {
        volumeBtn.textContent = "volume_up";
    } else if (volumeValue > 0 && volumeValue <= 0.5) {
        volumeBtn.textContent = "volume_down";
    } else {
        volumeBtn.textContent = "volume_mute";
    }
}

// Keypress Play/Pause
window.addEventListener('keypress', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        playPauseBtn.click()
    }
})
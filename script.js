// ==================== INITIALIZATION ====================
console.log('🎵 Optimized Spotify Clone - Initializing...');

// ==================== GLOBAL VARIABLES ====================
let isPlaying = false;
let currentTime = 0;
let duration = 213;
let volume = 50;
let isShuffle = false;
let repeatMode = 0;

// ==================== OPTIMIZED PARTICLES ====================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 15; // Reduced from 50
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ==================== FAST LOADING SCREEN ====================
window.addEventListener('load', () => {
    createParticles();
    
    const loadingProgress = document.querySelector('.loading-progress');
    let progress = 0;
    
    const progressInterval = setInterval(() => {
        progress += 50; // Faster increment
        if (progress > 100) progress = 100;
        loadingProgress.style.width = progress + '%';
        
        if (progress === 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    initializeGreeting();
                }, 300);
            }, 200);
        }
    }, 100);
});

// ==================== GREETING ====================
function initializeGreeting() {
    const hour = new Date().getHours();
    const greetingTitle = document.getElementById('greetingTitle');
    
    if (hour < 12) {
        greetingTitle.textContent = 'Good morning';
    } else if (hour < 18) {
        greetingTitle.textContent = 'Good afternoon';
    } else {
        greetingTitle.textContent = 'Good evening';
    }
}

// ==================== TOAST NOTIFICATIONS ====================
let toastTimeout;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');
    
    clearTimeout(toastTimeout);
    
    if (type === 'success') {
        icon.className = 'fa-solid fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fa-solid fa-exclamation-circle';
    } else if (type === 'info') {
        icon.className = 'fa-solid fa-info-circle';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ==================== OPTIMIZED CANVAS VISUALIZER ====================
const canvas = document.getElementById('audioCanvas');
const ctx = canvas.getContext('2d', { alpha: false }); // Performance boost
let animationId;

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = 3 * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = '3px';
    ctx.scale(dpr, dpr);
}
resizeCanvas();

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 150);
});

// Simplified visualizer
let bars = [];
const barCount = 50; // Reduced from 100
for (let i = 0; i < barCount; i++) {
    bars.push(Math.random());
}

function drawVisualizer() {
    if (!isPlaying) return;
    
    const barWidth = canvas.width / barCount;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1db954';
    
    for (let i = 0; i < barCount; i++) {
        bars[i] = bars[i] * 0.9 + Math.random() * 0.1; // Smooth animation
        const height = bars[i] * 3;
        ctx.fillRect(i * barWidth, 3 - height, barWidth - 1, height);
    }
    
    animationId = requestAnimationFrame(drawVisualizer);
}

// ==================== MUSIC PLAYER ====================
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const progressFilled = document.getElementById('progressFilled');
const volumeBar = document.getElementById('volumeBar');
const volumeFilled = document.getElementById('volumeFilled');
const volumeIcon = document.getElementById('volumeIcon');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const currentTimeEl = document.getElementById('currentTime');

// Play/Pause
playBtn.addEventListener('click', togglePlay);

function togglePlay() {
    isPlaying = !isPlaying;
    const icon = playBtn.querySelector('i');
    
    if (isPlaying) {
        icon.className = 'fa-solid fa-pause';
        playBtn.title = 'Pause';
        startProgress();
        drawVisualizer();
        showToast('Now playing', 'info');
    } else {
        icon.className = 'fa-solid fa-play';
        playBtn.title = 'Play';
        stopProgress();
        cancelAnimationFrame(animationId);
    }
}

// Progress
let progressInterval;

function startProgress() {
    progressInterval = setInterval(() => {
        if (currentTime < duration) {
            currentTime += 0.1;
            updateProgress();
        } else {
            handleSongEnd();
        }
    }, 100);
}

function stopProgress() {
    clearInterval(progressInterval);
}

function updateProgress() {
    const percentage = (currentTime / duration) * 100;
    progressBar.value = percentage;
    progressFilled.style.width = percentage + '%';
    currentTimeEl.textContent = formatTime(currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

progressBar.addEventListener('input', (e) => {
    const percentage = e.target.value;
    currentTime = (percentage / 100) * duration;
    updateProgress();
});

// Volume
volumeBar.addEventListener('input', (e) => {
    volume = e.target.value;
    volumeFilled.style.width = volume + '%';
    updateVolumeIcon();
});

function updateVolumeIcon() {
    const icon = volumeIcon.querySelector('i');
    if (volume == 0) {
        icon.className = 'fa-solid fa-volume-xmark';
    } else if (volume < 50) {
        icon.className = 'fa-solid fa-volume-low';
    } else {
        icon.className = 'fa-solid fa-volume-high';
    }
}

volumeIcon.addEventListener('click', () => {
    if (volume > 0) {
        volumeBar.dataset.previousVolume = volume;
        volumeBar.value = 0;
        volume = 0;
    } else {
        const prevVolume = volumeBar.dataset.previousVolume || 50;
        volumeBar.value = prevVolume;
        volume = prevVolume;
    }
    volumeFilled.style.width = volume + '%';
    updateVolumeIcon();
});

// Shuffle
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    showToast(`Shuffle ${isShuffle ? 'on' : 'off'}`, 'info');
});

// Repeat
repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const icon = repeatBtn.querySelector('i');
    
    if (repeatMode === 0) {
        repeatBtn.classList.remove('active');
        icon.className = 'fa-solid fa-repeat';
        showToast('Repeat off', 'info');
    } else if (repeatMode === 1) {
        repeatBtn.classList.add('active');
        icon.className = 'fa-solid fa-repeat';
        showToast('Repeat all', 'info');
    } else {
        repeatBtn.classList.add('active');
        icon.className = 'fa-solid fa-repeat-1';
        showToast('Repeat one', 'info');
    }
});

// Previous/Next
document.getElementById('prevBtn').addEventListener('click', () => {
    currentTime = 0;
    updateProgress();
    showToast('Previous', 'info');
});

document.getElementById('nextBtn').addEventListener('click', () => {
    currentTime = 0;
    updateProgress();
    showToast('Next', 'info');
});

function handleSongEnd() {
    if (repeatMode === 2) {
        currentTime = 0;
        updateProgress();
    } else if (repeatMode === 1) {
        currentTime = 0;
        updateProgress();
    } else {
        isPlaying = false;
        const icon = playBtn.querySelector('i');
        icon.className = 'fa-solid fa-play';
        stopProgress();
    }
}

// ==================== LIKE ====================
const likeBtn = document.getElementById('likeBtn');
let isLiked = false;

likeBtn.addEventListener('click', () => {
    isLiked = !isLiked;
    likeBtn.classList.toggle('liked', isLiked);
    
    if (isLiked) {
        likeBtn.className = 'fa-solid fa-heart music-icon-1 liked';
        showToast('Liked', 'success');
    } else {
        likeBtn.className = 'fa-regular fa-heart music-icon-1';
        showToast('Unliked', 'info');
    }
});

// ==================== CARD INTERACTIONS ====================
document.addEventListener('click', (e) => {
    if (e.target.closest('.play-btn')) {
        const card = e.target.closest('.card');
        if (card) {
            const title = card.dataset.title || 'Track';
            document.getElementById('songTitle').textContent = title;
            
            if (!isPlaying) {
                togglePlay();
            }
            showToast(`Playing: ${title}`, 'success');
        }
    }
    
    if (e.target.closest('.card-action-icon.fa-heart')) {
        const icon = e.target.closest('.card-action-icon');
        icon.classList.toggle('fa-solid');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('liked');
    }
    
    if (e.target.closest('.quick-play-btn')) {
        const card = e.target.closest('.quick-play-card');
        const title = card.querySelector('span').textContent;
        showToast(`Playing: ${title}`, 'success');
        if (!isPlaying) togglePlay();
    }
});

// ==================== SEARCH ====================
const searchInput = document.getElementById('searchInput');
const searchContainer = document.getElementById('searchContainer');
const clearSearch = document.getElementById('clearSearch');
const searchPage = document.getElementById('searchPage');
const homePage = document.getElementById('homePage');
const searchResults = document.getElementById('searchResults');
const browseCategories = document.getElementById('browseCategories');

searchInput.addEventListener('focus', () => {
    searchContainer.classList.add('focused');
});

searchInput.addEventListener('blur', () => {
    if (!searchInput.value) {
        searchContainer.classList.remove('focused');
    }
});

let searchTimeout;
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    
    clearTimeout(searchTimeout);
    
    if (query) {
        clearSearch.style.display = 'block';
        searchTimeout = setTimeout(() => performSearch(query), 300);
    } else {
        clearSearch.style.display = 'none';
        searchResults.classList.add('hidden');
        browseCategories.classList.remove('hidden');
    }
});

clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    clearSearch.style.display = 'none';
    searchResults.classList.add('hidden');
    browseCategories.classList.remove('hidden');
});

function performSearch(query) {
    searchResults.classList.remove('hidden');
    browseCategories.classList.add('hidden');
    showToast(`Searching for "${query}"`, 'info');
}

// ==================== NAVIGATION ====================
const navOptions = document.querySelectorAll('.nav-option');

navOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        const page = e.target.dataset.page || e.target.closest('a')?.dataset.page;
        
        if (page) {
            navOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            if (page === 'search') {
                homePage.classList.add('hidden');
                searchPage.classList.remove('hidden');
                setTimeout(() => searchInput.focus(), 100);
            } else if (page === 'home') {
                searchPage.classList.add('hidden');
                homePage.classList.remove('hidden');
            }
        }
    });
});

// ==================== PANELS ====================
const queueBtn = document.getElementById('queueBtn');
const queuePanel = document.getElementById('queuePanel');
const closeQueue = document.getElementById('closeQueue');
const lyricsBtn = document.getElementById('lyricsBtn');
const lyricsPanel = document.getElementById('lyricsPanel');
const closeLyrics = document.getElementById('closeLyrics');
const equalizerBtn = document.getElementById('equalizerBtn');
const equalizerPanel = document.getElementById('equalizerPanel');
const closeEqualizer = document.getElementById('closeEqualizer');

queueBtn.addEventListener('click', () => {
    queuePanel.classList.toggle('active');
    lyricsPanel.classList.remove('active');
    equalizerPanel.classList.remove('active');
});

closeQueue.addEventListener('click', () => queuePanel.classList.remove('active'));

lyricsBtn.addEventListener('click', () => {
    lyricsPanel.classList.toggle('active');
    queuePanel.classList.remove('active');
    equalizerPanel.classList.remove('active');
});

closeLyrics.addEventListener('click', () => lyricsPanel.classList.remove('active'));

equalizerBtn.addEventListener('click', () => {
    equalizerPanel.classList.toggle('active');
    queuePanel.classList.remove('active');
    lyricsPanel.classList.remove('active');
});

closeEqualizer.addEventListener('click', () => equalizerPanel.classList.remove('active'));

// EQ Presets
document.querySelectorAll('.eq-preset').forEach(preset => {
    preset.addEventListener('click', () => {
        document.querySelectorAll('.eq-preset').forEach(p => p.classList.remove('active'));
        preset.classList.add('active');
        showToast(`Preset: ${preset.textContent}`, 'info');
    });
});

// ==================== SETTINGS ====================
const settingsIcon = document.getElementById('settingsIcon');
const settingsMenu = document.getElementById('settingsMenu');

settingsIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle('active');
});

document.addEventListener('click', () => {
    settingsMenu.classList.remove('active');
    document.getElementById('userMenu').classList.remove('active');
});

settingsMenu.addEventListener('click', (e) => e.stopPropagation());

document.getElementById('themeSelect').addEventListener('change', (e) => {
    showToast(`Theme: ${e.target.value}`, 'info');
});

document.getElementById('crossfadeSlider').addEventListener('input', (e) => {
    document.querySelector('.slider-value').textContent = e.target.value + 's';
});

// ==================== USER MENU ====================
const userProfile = document.getElementById('userProfile');
const userMenu = document.getElementById('userMenu');

userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.classList.toggle('active');
});

// ==================== CONTEXT MENU ====================
const contextMenu = document.getElementById('contextMenu');

document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.card')) {
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
    }
});

document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
});

document.querySelectorAll('.context-item').forEach(item => {
    item.addEventListener('click', () => {
        showToast(`${item.querySelector('span').textContent}`, 'success');
        contextMenu.style.display = 'none';
    });
});

// ==================== MODAL ====================
const modal = document.getElementById('playlistModal');
const createPlaylistBtn = document.getElementById('createPlaylistBtn');
const createPlaylistIcon = document.getElementById('createPlaylist');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmCreateBtn = document.getElementById('confirmCreateBtn');

function openModal() {
    modal.classList.add('show');
}

function closeModalFunc() {
    modal.classList.remove('show');
    document.getElementById('playlistName').value = '';
    document.getElementById('playlistDesc').value = '';
}

createPlaylistBtn.addEventListener('click', openModal);
createPlaylistIcon.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
cancelBtn.addEventListener('click', closeModalFunc);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
});

const imagePreview = document.getElementById('imagePreview');
const playlistImageInput = document.getElementById('playlistImageInput');

imagePreview.addEventListener('click', () => playlistImageInput.click());

playlistImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
            imagePreview.innerHTML = '';
        };
        reader.readAsDataURL(file);
    }
});

confirmCreateBtn.addEventListener('click', () => {
    const playlistName = document.getElementById('playlistName').value || 'My Playlist';
    showToast(`Created: ${playlistName}`, 'success');
    closeModalFunc();
});

// ==================== FULLSCREEN ====================
const fullscreenBtn = document.getElementById('fullscreenBtn');

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.querySelector('i').className = 'fa-solid fa-minimize';
    } else {
        document.exitFullscreen();
        fullscreenBtn.querySelector('i').className = 'fa-solid fa-maximize';
    }
});

// ==================== KEYBOARD SHORTCUTS ====================
const shortcutsPanel = document.getElementById('shortcutsPanel');

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
        case ' ':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight':
            e.preventDefault();
            document.getElementById('nextBtn').click();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            document.getElementById('prevBtn').click();
            break;
        case 'ArrowUp':
            e.preventDefault();
            volumeBar.value = Math.min(100, parseInt(volumeBar.value) + 5);
            volume = volumeBar.value;
            volumeFilled.style.width = volume + '%';
            updateVolumeIcon();
            break;
        case 'ArrowDown':
            e.preventDefault();
            volumeBar.value = Math.max(0, parseInt(volumeBar.value) - 5);
            volume = volumeBar.value;
            volumeFilled.style.width = volume + '%';
            updateVolumeIcon();
            break;
        case 'm':
        case 'M':
            volumeIcon.click();
            break;
        case 'l':
        case 'L':
            likeBtn.click();
            break;
        case 'q':
        case 'Q':
            queueBtn.click();
            break;
        case 'f':
        case 'F':
            fullscreenBtn.click();
            break;
        case '?':
            shortcutsPanel.classList.add('active');
            break;
    }
});

document.getElementById('closeShortcuts').addEventListener('click', () => {
    shortcutsPanel.classList.remove('active');
});

// ==================== FILTERS ====================
document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    });
});

// ==================== SCROLL OPTIMIZATION ====================
const mainContent = document.getElementById('mainContent');
const stickyNav = document.querySelector('.sticky-nav');
const dynamicGradient = document.querySelector('.dynamic-gradient');

let scrollTimeout;
let ticking = false;

mainContent.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (mainContent.scrollTop > 50) {
                stickyNav.classList.add('scrolled');
                dynamicGradient.style.opacity = '0.3';
            } else {
                stickyNav.classList.remove('scrolled');
                dynamicGradient.style.opacity = '1';
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ==================== INITIALIZE ====================
progressFilled.style.width = '0%';
volumeFilled.style.width = '50%';

console.log('✨ Optimized Spotify Clone - Ready!');
console.log('💡 Press ? for shortcuts');
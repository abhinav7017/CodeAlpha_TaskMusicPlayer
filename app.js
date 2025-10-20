// Music Player Implementation
class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.isAutoplay = false;
        this.currentSongIndex = 0;

        // UI Elements
        this.playPauseBtn = document.getElementById('play-pause');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.volumeBtn = document.getElementById('volume-btn');
        this.titleElement = document.getElementById('title');
        this.artistElement = document.getElementById('artist');
        this.currentTimeElement = document.getElementById('current-time');
        this.durationElement = document.getElementById('duration');
        this.progressBar = document.querySelector('.progress');
        this.volumeProgress = document.querySelector('.volume-progress');
        this.autoplayToggle = document.getElementById('autoplay');
        this.playlistElement = document.getElementById('playlist-songs');
        this.coverArt = document.getElementById('cover');

        this.initEventListeners();
        this.loadPlaylist();
    }

    initEventListeners() {
        // Play/Pause
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());

        // Previous/Next
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());

        // Progress bar
        const progressArea = document.querySelector('.progress-bar');
        progressArea.addEventListener('click', (e) => {
            const width = progressArea.clientWidth;
            const clickX = e.offsetX;
            const duration = this.audio.duration;
            this.audio.currentTime = (clickX / width) * duration;
        });

        // Volume control
        const volumeSlider = document.querySelector('.volume-slider');
        volumeSlider.addEventListener('click', (e) => {
            const width = volumeSlider.clientWidth;
            const clickX = e.offsetX;
            const volume = clickX / width;
            this.setVolume(volume);
        });

        // Volume button (mute/unmute)
        this.volumeBtn.addEventListener('click', () => this.toggleMute());

        // Autoplay toggle
        this.autoplayToggle.addEventListener('click', () => this.toggleAutoplay());

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());

        // Playlist click handler
        this.playlistElement.addEventListener('click', (e) => {
            const songElement = e.target.closest('.playlist-song');
            if (songElement) {
                const index = Array.from(this.playlistElement.children).indexOf(songElement);
                this.playSong(index);
            }
        });
    }

    loadPlaylist() {
        // Demo playlist - replace with your actual song loading logic
        this.playlist = Array.from(document.querySelectorAll('.playlist-song')).map(song => ({
            title: song.querySelector('.song-title').textContent,
            artist: song.querySelector('.song-artist').textContent,
            src: song.dataset.src,
            duration: song.querySelector('.song-duration').textContent
        }));
    }

    togglePlay() {
        if (this.audio.src) {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        } else if (this.playlist.length > 0) {
            this.playSong(0);
        }
    }

    play() {
        this.audio.play();
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    playSong(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentSongIndex = index;
            const song = this.playlist[index];
            
            // Update audio source
            this.audio.src = song.src;
            this.audio.load();
            this.play();

            // Update UI
            this.titleElement.textContent = song.title;
            this.artistElement.textContent = song.artist;
            
            // Update playlist highlighting
            document.querySelectorAll('.playlist-song').forEach((el, i) => {
                el.classList.toggle('active', i === index);
            });
        }
    }

    playNext() {
        let nextIndex = this.currentSongIndex + 1;
        if (nextIndex >= this.playlist.length) {
            nextIndex = 0;
        }
        this.playSong(nextIndex);
    }

    playPrevious() {
        let prevIndex = this.currentSongIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.playlist.length - 1;
        }
        this.playSong(prevIndex);
    }

    updateProgress() {
        const duration = this.audio.duration;
        const currentTime = this.audio.currentTime;
        
        if (duration) {
            // Update progress bar
            const progressPercent = (currentTime / duration) * 100;
            this.progressBar.style.width = `${progressPercent}%`;
            
            // Update time display
            this.currentTimeElement.textContent = this.formatTime(currentTime);
        }
    }

    updateDuration() {
        this.durationElement.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    setVolume(value) {
        const volume = Math.max(0, Math.min(1, value));
        this.audio.volume = volume;
        this.volumeProgress.style.width = `${volume * 100}%`;
        
        // Update volume icon
        const volumeIcon = this.volumeBtn.querySelector('i');
        volumeIcon.className = volume === 0 ? 'fas fa-volume-mute' :
                             volume < 0.5 ? 'fas fa-volume-down' :
                             'fas fa-volume-up';
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.lastVolume = this.audio.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.lastVolume || 1);
        }
    }

    toggleAutoplay() {
        this.isAutoplay = !this.isAutoplay;
        this.autoplayToggle.classList.toggle('active', this.isAutoplay);
    }

    handleSongEnd() {
        if (this.isAutoplay) {
            this.playNext();
        } else {
            this.pause();
        }
    }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});
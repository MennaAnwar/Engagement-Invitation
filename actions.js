document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------
    // Elements
    // -----------------------------------------
    const envelopeScreen = document.getElementById("envelope-screen");
    const invitationScreen = document.getElementById("invitation-screen");
    const envelope = document.getElementById("envelope");
    const stamp = document.getElementById("envelopeButton");
    const prompt = document.getElementById("openPrompt");

    const audio = document.getElementById("background-music");
    const player = document.getElementById("music-player");
    const toggle = document.getElementById("music-toggle");

    // -----------------------------------------
    // State
    // -----------------------------------------
    let opening = false;
    let userPausedMusic = false;

    // -----------------------------------------
    // Music player UI
    // -----------------------------------------
    function updatePlayer() {
        if (!audio) return;

        // The player is active if it's playing AND not muted
        const playing = !audio.paused && !audio.muted;

        player?.classList.toggle("is-playing", playing);

        if (toggle) {
            const label = playing
                ? "إيقاف الموسيقى مؤقتًا"
                : "تشغيل الموسيقى";

            toggle.setAttribute("aria-pressed", String(playing));
            toggle.setAttribute("aria-label", label);
            toggle.setAttribute("title", label);
        }
    }

    // -----------------------------------------
    // Remove fallback listeners after playback
    // succeeds with sound unmuted
    // -----------------------------------------
    function removeMusicInteractionListeners() {
        document.removeEventListener(
            "touchstart",
            startMusicOnInteraction
        );

        document.removeEventListener(
            "pointerdown",
            startMusicOnInteraction
        );

        document.removeEventListener(
            "click",
            startMusicOnInteraction
        );

        document.removeEventListener(
            "keydown",
            startMusicOnInteraction
        );

        // Remove new scroll listeners
        window.removeEventListener(
            "scroll",
            startMusicOnInteraction
        );

        window.removeEventListener(
            "wheel",
            startMusicOnInteraction
        );
    }

    // -----------------------------------------
    // First real visitor interaction - Unmutes audio
    // -----------------------------------------
    function startMusicOnInteraction() {
        if (!audio || userPausedMusic) {
            return;
        }

        // Unmute upon first user touch/click/scroll gesture
        if (audio.muted) {
            audio.muted = false;
        }

        // If it got paused or failed, kickstart it again
        if (audio.paused) {
            playMusic();
        } else {
            updatePlayer();
            removeMusicInteractionListeners();
        }
    }

    // -----------------------------------------
    // Initialize audio
    // -----------------------------------------
    if (audio) {
        // Enforce muted on code level for safe auto-opening initialization
        audio.muted = true; 
        audio.autoplay = true;
        audio.loop = true;
        audio.volume = 0.7;

        // Attempt autoplay immediately (plays in muted state)
        playMusic();

        // Listen for the absolute first touch, click, or key down to unmute audio context safely
        document.addEventListener(
            "touchstart",
            startMusicOnInteraction,
            { passive: true }
        );

        document.addEventListener(
            "pointerdown",
            startMusicOnInteraction
        );

        document.addEventListener(
            "click",
            startMusicOnInteraction
        );

        document.addEventListener(
            "keydown",
            startMusicOnInteraction
        );

        // ADDED: Capture passive user scroll movements 
        window.addEventListener(
            "scroll",
            startMusicOnInteraction,
            { passive: true }
        );

        window.addEventListener(
            "wheel",
            startMusicOnInteraction,
            { passive: true }
        );

        audio.addEventListener("play", updatePlayer);
        audio.addEventListener("pause", updatePlayer);
        audio.addEventListener("ended", updatePlayer);

        audio.addEventListener("error", () => {
            console.error(
                "Music failed to load:",
                audio.currentSrc
            );
            updatePlayer();
        });
    }

    // -----------------------------------------
    // Music toggle button
    // -----------------------------------------
    if (toggle && audio) {
        toggle.addEventListener("click", async (event) => {
            event.stopPropagation();

            // If audio is paused OR currently muted, user is explicitly asking for sound
            if (audio.paused || audio.muted) {
                userPausedMusic = false;
                audio.muted = false; // Unmute sound directly from user click
                await playMusic();
            } else {
                userPausedMusic = true;
                audio.pause();
                updatePlayer();
            }
        });
    }

    // -----------------------------------------
    // Start background music
    // -----------------------------------------
    async function playMusic() {
        if (!audio || userPausedMusic) {
            return false;
        }

        try {
            await audio.play();
            updatePlayer();

            // Only remove listeners if browser cleared the unmuted restriction
            if (!audio.muted) {
                removeMusicInteractionListeners();
            }

            return true;
        } catch (error) {
            updatePlayer();
            console.info(
                "Music playback failed:",
                error.name
            );
            return false;
        }
    }

    // -----------------------------------------
    // Open invitation
    // -----------------------------------------
    function openInvitation(event) {
        event?.preventDefault();

        if (opening) return;
        opening = true;

        // Keep running music silently in the background
        if (audio && audio.paused && !userPausedMusic) {
            playMusic();
        }

        envelope?.classList.add("opening");
        stamp?.classList.add("is-opening");

        if (stamp) {
            stamp.disabled = true;
            stamp.setAttribute("aria-disabled", "true");
        }

        if (prompt) {
            prompt.disabled = true;
        }

        // Wait for the envelope animation to finish
        window.setTimeout(() => {
            if (envelopeScreen) {
                envelopeScreen.hidden = true;
            }

            if (invitationScreen) {
                invitationScreen.hidden = false;
            }

            document.body.classList.add("invitation-visible");

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            if (audio && audio.paused && !userPausedMusic) {
                playMusic();
            }
        }, 1700);
    }

    // -----------------------------------------
    // Envelope event listeners
    // -----------------------------------------
    stamp?.addEventListener("click", openInvitation);
    prompt?.addEventListener("click", openInvitation);

    // -----------------------------------------
    // Automatically open after two seconds
    // -----------------------------------------
    window.setTimeout(() => {
        openInvitation();
    }, 2000);

    // -----------------------------------------
    // Initial player state
    // -----------------------------------------
    updatePlayer();
});

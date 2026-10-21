
document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------
    // Elements
    // -----------------------------------------
    const envelopeScreen = document.getElementById("envelope-screen");
    const invitationScreen = document.getElementById("invitation-screen");
    const envelope = document.getElementById("envelope");
    const stamp = document.getElementById("envelopeButton");

    const audio = document.getElementById("background-music");
    const player = document.getElementById("music-player");
    const toggle = document.getElementById("music-toggle");

    let opening = false;
    let userPausedMusic = false;
    let musicStarted = false;

    // -----------------------------------------
    // Update player UI
    // -----------------------------------------
    function updatePlayer() {
        if (!audio) return;

        const playing = !audio.paused && !audio.muted;

        player?.classList.toggle("is-playing", playing);

        if (toggle) {
            const label = playing
                ? "إيقاف الموسيقى مؤقتًا"
                : "تشغيل الموسيقى";

            toggle.setAttribute("aria-label", label);
            toggle.setAttribute("title", label);
            toggle.setAttribute("aria-pressed", String(playing));
        }
    }

    // -----------------------------------------
    // Initialize audio
    // -----------------------------------------
    if (audio) {
        audio.pause();
        audio.muted = false;
        audio.loop = true;
        audio.volume = 0.7;
        audio.autoplay = false;

        audio.addEventListener("play", () => {
            musicStarted = true;
            updatePlayer();
        });

        audio.addEventListener("pause", updatePlayer);
        audio.addEventListener("volumechange", updatePlayer);

        audio.addEventListener("error", () => {
            console.error(
                "Music failed to load:",
                audio.currentSrc,
                audio.error
            );
            updatePlayer();
        });
    }

    // -----------------------------------------
    // Play music
    // -----------------------------------------
    async function playMusic() {
        if (!audio || userPausedMusic || !audio.paused) {
            return false;
        }

        try {
            audio.muted = false;
            await audio.play();

            musicStarted = true;
            updatePlayer();

            return true;
        } catch (error) {
            // Keep listening for further interactions.
            console.info(
                "Music playback attempt failed:",
                error.name
            );

            updatePlayer();
            return false;
        }
    }

    // -----------------------------------------
    // Retry music on ANY user interaction
    // -----------------------------------------
    function handleInteraction(event) {
        if (!audio || userPausedMusic || !audio.paused) {
            return;
        }

        // Ignore events generated programmatically.
        if (event && !event.isTrusted) {
            return;
        }

        // Attempt playback directly from the interaction.
        playMusic();
    }

    const interactionEvents = [
        "pointerdown",
        "touchstart",
        "click",
        "scroll",
        "wheel",
        "keydown",
        "pointermove",
        "touchmove"
    ];

    interactionEvents.forEach((eventName) => {
        document.addEventListener(
            eventName,
            handleInteraction,
            {
                passive: true,
                capture: true
            }
        );
    });

    // -----------------------------------------
    // Music toggle button
    // -----------------------------------------
    toggle?.addEventListener("click", async (event) => {
        event.stopPropagation();

        if (!audio) return;

        if (!audio.paused) {
            userPausedMusic = true;
            audio.pause();
            updatePlayer();
        } else {
            userPausedMusic = false;
            await playMusic();
        }
    });

    // -----------------------------------------
    // Open invitation
    // -----------------------------------------
    function openInvitation(event) {
        event?.preventDefault();

        if (opening) return;

        opening = true;

        // A real seal click also attempts to start music.
        if (event && audio && !userPausedMusic) {
            playMusic();
        }

        envelope?.classList.add("opening");
        stamp?.classList.add("is-opening");

        if (stamp) {
            stamp.disabled = true;
            stamp.setAttribute("aria-disabled", "true");
        }

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
        }, 2500);
    }

    // Manual opening
    stamp?.addEventListener("click", openInvitation);

    // Automatic opening after two seconds
    window.setTimeout(() => {
        openInvitation();
    }, 2000);

    updatePlayer();
});

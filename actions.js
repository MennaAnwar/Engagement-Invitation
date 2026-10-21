
document.addEventListener("DOMContentLoaded", () => {
    const envelopeScreen = document.getElementById("envelope-screen");
    const invitationScreen = document.getElementById("invitation-screen");
    const envelope = document.getElementById("envelope");
    const stamp = document.getElementById("envelopeButton");

    const audio = document.getElementById("background-music");
    const player = document.getElementById("music-player");
    const toggle = document.getElementById("music-toggle");

    let opening = false;
    let userPausedMusic = false;

    // -----------------------------------------
    // Music player UI
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
    // Initialize audio WITHOUT autoplay
    // -----------------------------------------
    if (audio) {
        audio.pause();
        audio.muted = false;
        audio.loop = true;
        audio.volume = 0.7;
        audio.autoplay = false;

        audio.addEventListener("play", updatePlayer);
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
    // Play music from an actual user interaction
    // -----------------------------------------
    async function playMusic() {
        if (!audio) return false;

        try {
            // Call play() directly from the click interaction.
            audio.muted = false;

            await audio.play();

            updatePlayer();
            return true;
        } catch (error) {
            console.warn("Music playback failed:", error.name);
            updatePlayer();
            return false;
        }
    }

    // -----------------------------------------
    // Floating music button: play / pause
    // -----------------------------------------
    toggle?.addEventListener("click", async (event) => {
        event.stopPropagation();

        if (!audio) return;

        if (audio.paused || audio.ended) {
            userPausedMusic = false;
            await playMusic();
        } else {
            userPausedMusic = true;
            audio.pause();
            updatePlayer();
        }
    });

    // -----------------------------------------
    // Open invitation ONLY when the seal is clicked
    // -----------------------------------------
    stamp?.addEventListener("click", (event) => {
        event.preventDefault();

        if (opening) return;

        opening = true;

        // Start music immediately from the seal click.
        // Do not await before initiating the opening animation.
        if (!userPausedMusic && audio) {
            playMusic();
        }

        envelope?.classList.add("opening");
        stamp.classList.add("is-opening");

        stamp.disabled = true;
        stamp.setAttribute("aria-disabled", "true");

        // Wait for the envelope animation.
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
    });

    // No click handler for openPrompt.
    // It must not open the invitation.

    updatePlayer();
});

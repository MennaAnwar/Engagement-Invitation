
document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("envelope");
    const stamp = document.getElementById("envelopeButton");
    const prompt = document.getElementById("openPrompt");

    if (!envelope || !stamp || !prompt) return;

    let isOpening = false;

    function openInvitation(event) {
        event?.preventDefault();

        if (isOpening) return;

        isOpening = true;

        // Trigger the envelope and stamp animations.
        envelope.classList.add("opening");
        stamp.classList.add("is-opening");

        // Prevent additional clicks during the animation.
        stamp.setAttribute("aria-disabled", "true");
        stamp.disabled = true;
        prompt.disabled = true;

        // Navigate to the invitation page when the animation finishes.
        window.setTimeout(() => {
            window.location.href = "invitation.html";
        }, 1700);
    }

    // Clicking the wax seal opens the invitation.
    stamp.addEventListener("click", openInvitation);

    // Clicking the invitation prompt does the same.
    prompt.addEventListener("click", openInvitation);
});


document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("envelope");
    const stamp = document.getElementById("envelopeButton");
    const prompt = document.getElementById("openPrompt");

    if (!envelope || !stamp || !prompt) return;

    let isOpening = false;

    function openInvitation() {
        if (isOpening) return;

        isOpening = true;

        envelope.classList.add("opening");
        stamp.setAttribute("aria-disabled", "true");
        prompt.disabled = true;

        window.setTimeout(() => {
            window.location.href = "invitation.html";
        }, 1700);
    }

    stamp.addEventListener("click", openInvitation);
    prompt.addEventListener("click", openInvitation);
});

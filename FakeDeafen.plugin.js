/**
 * @name FakeDeafen
 * @author 0lRushy (upd06)
 * @authorId 241340069850513409
 * @version 1.2.0
 * @description Creates a fake deafen button that does nothing while keeping the real functionality hidden.
 */

module.exports = class FakeDeafen {
    constructor() {
        this.deafenRegex = /self_deafs.truem/;
        this.decoder = new TextDecoder();
        this.observer = null;
    }

    start() {
        this.hookWebSocket();
        this.observeButtons();
    }

    stop() {
        WebSocket.prototype.send = WebSocket.prototype._send;
        this.removeFakeButton();
        if (this.observer) this.observer.disconnect();
    }

    hookWebSocket() {
        const decoder = this.decoder;
        const deafenRegex = this.deafenRegex;

        WebSocket.prototype._send = WebSocket.prototype.send;
        WebSocket.prototype.send = function (data) {
            if (data instanceof ArrayBuffer && deafenRegex.test(decoder.decode(data))) {
                window.deafen = () => this._send(data);
                FakeDeafen.addFakeButton();
            }
            this._send(data);
        };
    }

    observeButtons() {
        const observer = new MutationObserver(() => FakeDeafen.addFakeButton());
        this.observer = observer;
        observer.observe(document.body, { childList: true, subtree: true });
    }

    static addFakeButton() {
        let deafenBtn = document.querySelector("button[aria-label='Deafen']");
        if (!deafenBtn || document.querySelector("#fakeDeafenBtn")) return;

        let fakeDeafenBtn = document.createElement("button");
        fakeDeafenBtn.id = "fakeDeafenBtn";
        fakeDeafenBtn.style.backgroundColor = "#fff";
        fakeDeafenBtn.style.border = "none";
        fakeDeafenBtn.style.borderRadius = "8px";
        fakeDeafenBtn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        fakeDeafenBtn.style.padding = "6px";
        fakeDeafenBtn.style.cursor = "pointer";
        fakeDeafenBtn.style.display = "flex";
        fakeDeafenBtn.style.alignItems = "center";
        fakeDeafenBtn.style.justifyContent = "center";
        fakeDeafenBtn.style.transition = "transform 0.2s ease";
        fakeDeafenBtn.style.marginLeft = "8px";

        fakeDeafenBtn.onmouseover = () => fakeDeafenBtn.style.transform = "scale(1.05)";
        fakeDeafenBtn.onmouseleave = () => fakeDeafenBtn.style.transform = "scale(1)";

        const icon = document.createElement("img");
        icon.src = "https://cdn-icons-png.flaticon.com/512/5610/5610944.png"; 
        icon.alt = "Fake Deafen";
        icon.style.width = "20px";
        icon.style.height = "20px";

        fakeDeafenBtn.appendChild(icon);
        fakeDeafenBtn.onclick = () => window.deafen();

        deafenBtn.parentNode.appendChild(fakeDeafenBtn);
    }

    removeFakeButton() {
        let fakeDeafenBtn = document.querySelector("#fakeDeafenBtn");
        if (fakeDeafenBtn) fakeDeafenBtn.remove();
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingListener = void 0;
const vscode = require("vscode");
class TypingListener {
    sessionManager;
    idleTimer = null;
    isTyping = false;
    minuteTracker = null;
    copyCount = 0;
    pasteCount = 0;
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
    }
    register() {
        // Main typing listener
        const typingDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
            // Detect paste: a single change that adds more than 5 characters at once
            if (event.contentChanges.length > 0) {
                const change = event.contentChanges[0];
                if (change.text.length > 5 && !change.text.includes('\n') === false || change.text.length > 20) {
                    this.pasteCount++;
                    this.sessionManager.recordPaste();
                }
            }
            this.handleTyping();
        });
        return typingDisposable;
    }
    // Track when user manually copies (Ctrl+C)
    recordCopy() {
        this.copyCount++;
        this.sessionManager.recordCopy();
    }
    getCopyCount() {
        return this.copyCount;
    }
    getPasteCount() {
        return this.pasteCount;
    }
    handleTyping() {
        if (!this.isTyping) {
            this.isTyping = true;
            this.minuteTracker = setInterval(() => {
                const editor = vscode.window.activeTextEditor;
                const languageId = editor ? editor.document.languageId : 'unknown';
                const fileName = editor ? editor.document.fileName.split(/[\\/]/).pop() || 'unknown' : 'unknown';
                this.sessionManager.addActiveMinute(languageId, fileName);
            }, 60000);
        }
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }
        // 5 minutes idle = break the streak
        this.idleTimer = setTimeout(() => {
            this.isTyping = false;
            if (this.minuteTracker) {
                clearInterval(this.minuteTracker);
                this.minuteTracker = null;
            }
            this.sessionManager.breakStreak();
        }, 300000);
    }
}
exports.TypingListener = TypingListener;
//# sourceMappingURL=TypingListener.js.map
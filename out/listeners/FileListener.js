"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileListener = void 0;
const vscode = require("vscode");
class FileListener {
    sessionManager;
    switchCount = 0;
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
    }
    register() {
        return vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                this.switchCount++;
                this.sessionManager.logContextSwitch();
            }
        });
    }
    getCount() {
        return this.switchCount;
    }
}
exports.FileListener = FileListener;
//# sourceMappingURL=FileListener.js.map
import * as vscode from 'vscode';
import { SessionManager } from '../engine/SessionManager';

export class FileListener {
    private sessionManager: SessionManager;
    private switchCount: number = 0;

    constructor(sessionManager: SessionManager) {
        this.sessionManager = sessionManager;
    }

    public register(): vscode.Disposable {
        return vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                this.switchCount++;
                this.sessionManager.logContextSwitch();
            }
        });
    }

    public getCount(): number {
        return this.switchCount;
    }
}
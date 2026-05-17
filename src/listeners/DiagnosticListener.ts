import * as vscode from 'vscode';
import { SessionManager } from '../engine/SessionManager';
import * as path from 'path';

export class DiagnosticListener {
    private sessionManager: SessionManager;
    private errorCount: number = 0;
    private syntaxCount: number = 0;
    private warningCount: number = 0;

    constructor(sessionManager: SessionManager) {
        this.sessionManager = sessionManager;
    }

    public register(): vscode.Disposable {
        return vscode.languages.onDidChangeDiagnostics((event: vscode.DiagnosticChangeEvent) => {
            event.uris.forEach(uri => {
                const diagnostics = vscode.languages.getDiagnostics(uri);
                const fileName = path.basename(uri.fsPath);

                const errors = diagnostics.filter(
                    d => d.severity === vscode.DiagnosticSeverity.Error
                );
                const warnings = diagnostics.filter(
                    d => d.severity === vscode.DiagnosticSeverity.Warning
                );

                if (errors.length > 0) {
                    this.errorCount += errors.length;
                    this.sessionManager.logError(fileName, errors.length);

                    errors.forEach(e => {
                        if (e.message.toLowerCase().includes('syntax')) {
                            this.syntaxCount++;
                        }
                    });
                }

                this.warningCount += warnings.length;
            });
        });
    }

    public getCounts() {
        return {
            errors: this.errorCount,
            syntax: this.syntaxCount,
            warnings: this.warningCount
        };
    }
}
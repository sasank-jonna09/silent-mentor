"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticListener = void 0;
const vscode = require("vscode");
const path = require("path");
class DiagnosticListener {
    sessionManager;
    errorCount = 0;
    syntaxCount = 0;
    warningCount = 0;
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
    }
    register() {
        return vscode.languages.onDidChangeDiagnostics((event) => {
            event.uris.forEach(uri => {
                const diagnostics = vscode.languages.getDiagnostics(uri);
                const fileName = path.basename(uri.fsPath);
                const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
                const warnings = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning);
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
    getCounts() {
        return {
            errors: this.errorCount,
            syntax: this.syntaxCount,
            warnings: this.warningCount
        };
    }
}
exports.DiagnosticListener = DiagnosticListener;
//# sourceMappingURL=DiagnosticListener.js.map
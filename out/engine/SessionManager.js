"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
class SessionManager {
    startTime = Date.now();
    burstCount = 0;
    metrics = {
        activeCodingMinutes: 0,
        errorCount: 0,
        contextSwitches: 0,
        languageBreakdown: {},
        fileErrors: {},
        fileTime: {},
        currentStreak: 0,
        longestStreak: 0,
        copyCount: 0,
        pasteCount: 0,
    };
    // Called every minute while actively typing
    addActiveMinute(languageId, fileName) {
        this.metrics.activeCodingMinutes += 1;
        this.burstCount++;
        this.metrics.currentStreak += 1;
        if (this.metrics.currentStreak > this.metrics.longestStreak) {
            this.metrics.longestStreak = this.metrics.currentStreak;
        }
        // Track time per language
        this.metrics.languageBreakdown[languageId] =
            (this.metrics.languageBreakdown[languageId] || 0) + 1;
        // Track time per file
        this.metrics.fileTime[fileName] =
            (this.metrics.fileTime[fileName] || 0) + 1;
    }
    // Called on every text change (burst tracking)
    recordBurst() {
        this.burstCount++;
    }
    // Called when a paste event is detected
    recordPaste() {
        this.metrics.pasteCount += 1;
    }
    // Called when a copy event is detected
    recordCopy() {
        this.metrics.copyCount += 1;
    }
    // Called with file name and error count
    logError(fileName, count) {
        this.metrics.errorCount += count;
        this.metrics.fileErrors[fileName] =
            (this.metrics.fileErrors[fileName] || 0) + count;
    }
    // Called on file switch
    logContextSwitch() {
        this.metrics.contextSwitches += 1;
        this.metrics.currentStreak = 0;
    }
    // Called after 5 minutes of idle
    breakStreak() {
        this.metrics.currentStreak = 0;
    }
    // Used by extension.ts to get the final summary for the dashboard
    getSummary(switches, diagnostics) {
        const totalMinutes = Math.round((Date.now() - this.startTime) / 60000);
        const focusScore = Math.max(0, Math.min(100, Math.round((this.metrics.activeCodingMinutes / Math.max(totalMinutes, 1)) * 100
            - (switches * 2)
            + (this.metrics.longestStreak * 2))));
        // Find the file with the most errors
        let troublemakerFile = 'None';
        let maxErrors = 0;
        for (const [file, count] of Object.entries(this.metrics.fileErrors)) {
            if (count > maxErrors) {
                maxErrors = count;
                troublemakerFile = file;
            }
        }
        const originalPct = this.burstCount > 0
            ? Math.min(100, Math.round(((this.burstCount - this.metrics.pasteCount) / this.burstCount) * 100))
            : 100;
        return {
            bursts: this.burstCount,
            switches: switches,
            errors: diagnostics.errors,
            syntax: diagnostics.syntax,
            warnings: diagnostics.warnings,
            focusScore: focusScore,
            totalMinutes: totalMinutes,
            activeCodingMinutes: this.metrics.activeCodingMinutes,
            longestStreak: this.metrics.longestStreak,
            languageBreakdown: this.metrics.languageBreakdown,
            fileErrors: this.metrics.fileErrors,
            fileTime: this.metrics.fileTime,
            copyCount: this.metrics.copyCount,
            pasteCount: this.metrics.pasteCount,
            originalPct: originalPct,
            troublemakerFile: troublemakerFile,
        };
    }
    // Called when session ends — wipes everything
    clear() {
        this.burstCount = 0;
        this.startTime = Date.now();
        this.metrics = {
            activeCodingMinutes: 0,
            errorCount: 0,
            contextSwitches: 0,
            languageBreakdown: {},
            fileErrors: {},
            fileTime: {},
            currentStreak: 0,
            longestStreak: 0,
            copyCount: 0,
            pasteCount: 0,
        };
    }
}
exports.SessionManager = SessionManager;
//# sourceMappingURL=SessionManager.js.map
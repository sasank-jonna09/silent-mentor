"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
const DashboardPanel_1 = require("./ui/DashboardPanel");
const TypingListener_1 = require("./listeners/TypingListener");
const FileListener_1 = require("./listeners/FileListener");
const DiagnosticListener_1 = require("./listeners/DiagnosticListener");
const SessionManager_1 = require("./engine/SessionManager");
const MentorAI_1 = require("./ai/MentorAI");
let sessionManager;
function activate(context) {
    console.log('Silent Mentor is silently observing...');
    // 1. Create the Master Clipboard
    sessionManager = new SessionManager_1.SessionManager();
    // 2. Hand the SAME clipboard to all three workers
    const typingListener = new TypingListener_1.TypingListener(sessionManager);
    const fileListener = new FileListener_1.FileListener(sessionManager);
    const diagnosticListener = new DiagnosticListener_1.DiagnosticListener(sessionManager);
    // 3. Start the workers
    context.subscriptions.push(typingListener.register());
    context.subscriptions.push(fileListener.register());
    context.subscriptions.push(diagnosticListener.register());
    // 4. Create the Status Bar Button
    // 4. Create the Professional Status Bar Button
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = '$(pulse) Analyze Session';
    statusBar.tooltip = 'Silent Mentor: Generate behavioral analytics';
    // Add a sleek Emerald color to the text and icon to make it pop
    statusBar.color = '#10B981';
    statusBar.command = 'silentMentor.endSession';
    statusBar.show();
    context.subscriptions.push(statusBar);
    // 5. The "End Session" Command
    // 5. The "End Session" Command
    const endCommand = vscode.commands.registerCommand('silentMentor.endSession', async () => {
        statusBar.text = '$(sync~spin) Generating summary...';
        try {
            // 1. Grab all the upgraded data straight from the clipboard
            const metrics = sessionManager.getSummary(fileListener.getCount(), diagnosticListener.getCounts());
            console.log("Session Data:", metrics);
            // 2. Fetch the AI Summary
            const insight = await MentorAI_1.MentorAI.generateSummary(metrics);
            // 3. Launch the Cinematic Webview! (Variables are safe inside the try block)
            DashboardPanel_1.DashboardPanel.createOrShow(metrics, insight, () => {
                sessionManager.clear();
            });
        }
        catch (err) {
            vscode.window.showErrorMessage('Silent Mentor: AI call failed. Check your Debug Console.');
        }
        // Reset the button status
        statusBar.text = '$(circle-filled) Silent Mentor';
    });
}
//# sourceMappingURL=extension.js.map
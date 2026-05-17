import * as vscode from 'vscode';
import { DashboardPanel } from './ui/DashboardPanel';
import { TypingListener } from './listeners/TypingListener';
import { FileListener } from './listeners/FileListener';
import { DiagnosticListener } from './listeners/DiagnosticListener';
import { SessionManager } from './engine/SessionManager';
import { MentorAI } from './ai/MentorAI';

let sessionManager: SessionManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('Silent Mentor is silently observing...');

    // 1. Create the Master Clipboard
    sessionManager = new SessionManager(); 

    // 2. Hand the SAME clipboard to all three workers
    const typingListener = new TypingListener(sessionManager);
    const fileListener = new FileListener(sessionManager);
    const diagnosticListener = new DiagnosticListener(sessionManager);

    // 3. Start the workers
    context.subscriptions.push(typingListener.register());
    context.subscriptions.push(fileListener.register());
    context.subscriptions.push(diagnosticListener.register());

    // 4. Create the Status Bar Button
  // 4. Create the Professional Status Bar Button
    const statusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right, 100
    );
    statusBar.text = '$(pulse) Analyze Session';
    statusBar.tooltip = 'Silent Mentor: Generate behavioral analytics';
    // Add a sleek Emerald color to the text and icon to make it pop
    statusBar.color = '#10B981'; 
    statusBar.command = 'silentMentor.endSession';
    statusBar.show();
    context.subscriptions.push(statusBar);

    // 5. The "End Session" Command
 // 5. The "End Session" Command
    const endCommand = vscode.commands.registerCommand(
        'silentMentor.endSession', async () => {

            statusBar.text = '$(sync~spin) Generating summary...';

            try {
                // 1. Grab all the upgraded data straight from the clipboard
                const metrics = sessionManager.getSummary(
                fileListener.getCount(),
                diagnosticListener.getCounts()
            );
                console.log("Session Data:", metrics);

                // 2. Fetch the AI Summary
                const insight = await MentorAI.generateSummary(metrics);

                // 3. Launch the Cinematic Webview! (Variables are safe inside the try block)
                DashboardPanel.createOrShow(metrics, insight, () => {
                    sessionManager.clear();
                });

            } catch (err) {
                vscode.window.showErrorMessage('Silent Mentor: AI call failed. Check your Debug Console.');
            }

            // Reset the button status
            statusBar.text = '$(circle-filled) Silent Mentor';
        }
    );
}

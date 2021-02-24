// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand("typo.fix", async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const document = editor.document;
		for (let index = 0; index < editor.selections.length; index++) {
			const selection = editor.selections[index];
			const selectedVar = document.getText(selection);
			console.log('-->', selectedVar, selection, selection.active.line, document.lineAt(selection.active.line));
			const lineOfSelectedVar = selection.active.line;
			// Check if the selection line is not the last one in the document and the selected variable is not empty
			let currentline = document.lineAt(selection.active.line);
			let lineText = currentline.text;

			if (lineText) {

				let langId = editor.document.languageId;

				lineText = lineText.replace(/。/g, '.');
				lineText = lineText.replace(/，/g, ',');
				lineText = lineText.replace(/“/g, '"');
				lineText = lineText.replace(/”/g, '"');
				lineText = lineText.replace(/（/g, '(');
				lineText = lineText.replace(/）/g, ')');
				lineText = lineText.replace(/；/g, ';');
				lineText = lineText.replace(/？/g, '?');
				lineText = lineText.replace(/：/g, ':');
				lineText = lineText.replace(/》/g, '>');
				lineText = lineText.replace(/《/g, '<');
				lineText = lineText.replace(/‘/g, '\'');
				lineText = lineText.replace(/’/g, '\'');

				if (['css', 'less', 'scss'].includes(langId)) {
					lineText = lineText.replace(/##/g, '#');
					lineText = lineText.replace(/\.\./g, '.');
					lineText = lineText.replace(/。\./g, '.');
					lineText = lineText.replace(/\【/g, '[');
					lineText = lineText.replace(/\】/g, ']');
					if (lineText.indexOf('{') > -1 && lineText.indexOf('.') == -1) {
						let raw = lineText.trim();
						lineText = lineText.replace(raw, '.' + raw);
					}
					if (lineText.indexOf('color: ') > -1 && lineText.indexOf('#') == -1) {
						lineText = lineText.replace('color: ', 'color: #');
					}
					if (lineText.indexOf('background: ') > -1 && lineText.indexOf('#') == -1) {
						lineText = lineText.replace('background: ', 'background: #');
					}
					if (lineText.indexOf('="') > -1) {
						lineText = lineText.replace(/="/g, ': ').replace(/" /g, ';\n').replace(/"/g, '');
					}
					if (lineText.indexOf('::') > -1 && lineText.indexOf('&') == -1) {
						lineText = lineText.replace(/::/g, '&::');
					}
				}
				if (['js', 'jsx'].includes(langId)) {
					if (lineText.includes('法（')) {
						lineText = lineText.replace('法（', 'if (');
					}
					lineText = lineText.replace('毁掉', 'var');
					lineText = lineText.replace('胃管', 'let');
				}

				await editor.edit(editBuilder => {
					//edit
					editBuilder.replace(currentline.range, lineText);
					//insert
				});
			}
		}
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

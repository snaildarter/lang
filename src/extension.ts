import * as vscode from 'vscode';
import Hover from './hover';

export function activate(context: vscode.ExtensionContext) {
	console.log('插件已经被激活');
	context.subscriptions.push(Hover);
}

export function deactivate() { }

import * as vscode from 'vscode';
import * as fs from 'fs';

const hover = vscode.languages.registerHoverProvider("*", {
    provideHover(document, position) {
        const word = document.getText(document.getWordRangeAtPosition(position));
        const lineText = document.lineAt(position)?.text;

        const isObject: boolean = vscode.workspace
            .getConfiguration()
            .get("vscodePluginLang.IsObject") || false;

        const pattern = /[\"|'|`](.*?)[\"|'|`]/gi;
        const arr = lineText.match(pattern);
        const tmpArr: string[] = [];
        if (arr?.length) {
            arr.forEach(item => {
                let tmpS = item.replace(/(\"|\'|\`|\|)/g, "");
                if (tmpS.includes(isObject ? "." : '_')) {
                    tmpArr.push(tmpS);
                }
            });
        }

        if (tmpArr.length === 1 && tmpArr[0].includes(word)) {
            const appRoot = vscode.window.activeTextEditor?.document.uri.fsPath;
            const langPath: string = vscode.workspace
                .getConfiguration()
                .get("vscodePluginLang.langPath") || '';

            let tmpRoot = appRoot?.split("src")[0];
            tmpRoot = tmpRoot?.replace(/\\/g, '/');

            const jsonUrlCn: string = tmpRoot + langPath + 'zh-CN.json';
            const jsonUrlEn: string = tmpRoot + langPath + 'en-US.json';

            let jsonCN;
            try {
                jsonCN = JSON.parse(fs.readFileSync(jsonUrlCn, 'utf8'));
            } catch (e) {
                console.log(e);
            }

            let jsonEn;
            try {
                jsonEn = JSON.parse(fs.readFileSync(jsonUrlEn, 'utf8'));
            } catch (e) { }

            let key = tmpArr[0];
            let txt = '';
            let txtEn = '';
            eval("txt = jsonCN." + key);
            eval("txtEn = jsonEn." + key);

            return new vscode.Hover(`- 中文: ${txt}\n- 英文: ${txtEn}`);
        } else if (tmpArr.length > 1) {
            // 一行内有两个及以上key
        }
    }
});

export default hover;
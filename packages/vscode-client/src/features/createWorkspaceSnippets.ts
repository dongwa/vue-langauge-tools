import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const template = `{
    // Place your snippets for vue here. Each snippet is defined under a snippet name and has a prefix, body and 
    // description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
    // $1, $2 for tab stops, $0 for the final cursor position, and \${1:label}, \${2:another} for placeholders. Placeholders with the 
    // same ids are connected.
    // Example:
    // "template": {
    //     "scope": "vue",
    //     "prefix": "template",
    //     "body": [
    //         "<template>",
    //         "  $1",
    //         "</template>"
    //     ],
    //     "description": "Create <template> block"
    // },
    // "script": {
    //     "scope": "vue",
    //     "prefix": "script",
    //     "body": [
    //         "<script lang=\\"ts\\">",
    //         "import { defineComponent } from 'vue';",
    //         "",
    //         "export default defineComponent({",
    //         "  $2",
    //         "});",
    //         "</script>"
    //     ],
    //     "description": "Create <script> block"
    // },
    // "script setup": {
    //     "scope": "vue",
    //     "prefix": "script setup",
    //     "body": [
    //         "<script lang=\\"ts\\" setup>",
    //         "$1",
    //         "</script>",
    //         "",
    //         "<script lang=\\"ts\\">",
    //         "$2",
    //         "</script>"
    //     ],
    //     "description": "Create <script setup> + <script> blocks"
    // },
    // "style": {
    //     "scope": "vue",
    //     "prefix": "style",
    //     "body": [
    //         "<style lang=\\"scss\\" scoped>",
    //         "$1",
    //         "</style>"
    //     ],
    //     "description": "Create <style> block"
    // },
    // "v-for": {
    //     "scope": "html",
    //     "prefix": "v-for",
    //     "body": [
    //         "<template v-for=\\"$1 in $2\\">",
    //         "  $3",
    //         "</template>"
    //     ],
    //     "description": "Create html tag with v-for"
    // },
    // "v-if": {
    //     "scope": "html",
    //     "prefix": "v-if",
    //     "body": [
    //         "<template v-if=\\"$1\\">",
    //         "  $2",
    //         "</template>"
    //     ],
    //     "description": "Create html tag with v-if"
    // },
    // "v-else-if": {
    //     "scope": "html",
    //     "prefix": "v-else-if",
    //     "body": [
    //         "<template v-else-if=\\"$1\\">",
    //         "  $2",
    //         "</template>"
    //     ],
    //     "description": "Create html tag with v-else-if"
    // },
    // "v-else": {
    //     "scope": "html",
    //     "prefix": "v-else",
    //     "body": [
    //         "<template v-else>",
    //         "  $2",
    //         "</template>"
    //     ],
    //     "description": "Create html tag with v-else"
    // }
}`;

export async function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('volar.action.createWorkspaceSnippets', async () => {
        if (vscode.workspace.workspaceFolders) {
            for (const rootPath of vscode.workspace.workspaceFolders) {
                const templatePath = path.join(rootPath.uri.fsPath, '.vscode', 'vue.code-snippets');
                if (!fs.existsSync(templatePath)) {
                    fs.writeFileSync(templatePath, template);
                }
                const document = await vscode.workspace.openTextDocument(templatePath);
                await vscode.window.showTextDocument(document);
            }
        }
    }));
}

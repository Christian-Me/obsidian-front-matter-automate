import { App, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	jsCode: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	jsCode: "function (app, file) { // do not change this!\n  const result = 'ok';\n  return result;\n}"
}

export class FolderTagSettingTab extends PluginSettingTab {
	plugin: any;
	codeMirrorEditor: CodeMirror.Editor | null = null;

	constructor(app: App, plugin: any) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Code Editor Field')
			.setDesc('ENter your code here')
			.addTextArea(text => {
				text
					.setPlaceholder("function (app, file) { // do not change this!\n  const result = 'ok';\n  return result;\n}")
					.setValue(this.plugin.settings.jsCode)
					.onChange(async (value) => {
						this.plugin.settings.jsCode = value;
						await this.plugin.saveSettings();
						if (this.codeMirrorEditor) {
							this.codeMirrorEditor.setValue(value);
						}
					})
					.inputEl.classList.add('cm-s-obsidian');

				this.app.workspace.onLayoutReady(() => {
					this.initializeCodeMirror(text.inputEl);
				});
			});
	}

  async initializeCodeMirror(textArea: HTMLTextAreaElement): Promise<void> {
    if (window.CodeMirror) {
        this.codeMirrorEditor = window.CodeMirror.fromTextArea(textArea, {
            mode: 'javascript',
            lineNumbers: true,
            theme: 'obsidian',
            indentUnit: 2,
        });
        //this.codeMirrorEditor.doc.markText({line:1,ch:0}, {line:2, ch:0}, {readonly:true});
        //const cmElement = this.codeMirrorEditor.getWrapperElement();
        textArea.style.display = 'none';

        this.codeMirrorEditor.setValue(this.plugin.settings.jsCode);
        this.codeMirrorEditor.on('change', (cm: CodeMirror.Editor) => {
            this.plugin.settings.jsCode = cm.getValue();
            this.plugin.saveSettings();
        });
    } else {
        console.error('CodeMirror is not available.');
    }
}
}
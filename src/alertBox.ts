import { Modal, App, Setting } from 'obsidian';

/**
 * display an Alert Modal
 */
export class AlertModal extends Modal {
    private title: string;
    private description: string;
    private resolvePromise!: (value: {proceed:boolean, data:any}) => void;
    private promise: Promise<{proceed:boolean, data:any}>;
    private btn1Text: string;
    private btn2Text: string;
    private checkboxEl!: HTMLInputElement;
    private askAgainLabel: string | undefined;
  
    constructor(app: App, title: string, description: string, btn1: string, btn2:string, askAgainLabel?: string | undefined) {
      super(app);
      this.title = title;
      this.description = description;
      this.btn1Text = btn1;
      this.btn2Text = btn2;
      this.askAgainLabel = askAgainLabel;
      this.promise = new Promise((resolve) => {
        this.resolvePromise = resolve;
      });
    }
  
    onOpen() {
      const { contentEl } = this;
  
      contentEl.createEl('h2', { text: this.title });
      contentEl.createEl('p', { text: this.description });
  
      const settings = new Setting(contentEl);
      if (this.askAgainLabel) {
        const itemInfoDiv = settings.settingEl.getElementsByClassName('setting-item-info')[0];
        if (itemInfoDiv) {
          this.checkboxEl = itemInfoDiv.createEl('input', { type: 'checkbox' });
          const label = itemInfoDiv.createEl('label', { text: this.askAgainLabel });
          label.style.marginLeft = '8px';
        }
      }
      settings.addButton((btn) => {
          btn.setButtonText(this.btn1Text)
            .setCta()
            .onClick(() => {
              this.close();
              this.resolvePromise({proceed:true, data:{askConfirmation: this.checkboxEl?.checked}});
            });
        })
      settings.addButton((btn) => {
          btn.setButtonText(this.btn2Text)
            .onClick(() => {
              this.close();
              this.resolvePromise({proceed:false, data:{askConfirmation: this.checkboxEl?.checked}});
            });
        });
    }
  
    onClose() {
      const { contentEl } = this;
      contentEl.empty();
    }
  
    async openAndGetValue(): Promise<{proceed:boolean, data:any}> {
      this.open();
      return this.promise;
    }
  }
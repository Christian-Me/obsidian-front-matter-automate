import { Modal, App, Setting } from 'obsidian';
/**
 * Display a Alert Modal asynchronously 
 */
export class AsyncAlertModal extends Modal {
  private title: string;
  private description: string;
  private btn1Text: string;
  private btn2Text: string;
  private onYes: () => void;
  private onNo: () => void;

  constructor(app: App, title: string, description: string, btn1: string, btn2:string, onYes: () => void, onNo: () => void) {
    super(app);
    this.title = title;
    this.description = description;
    this.btn1Text = btn1;
    this.btn2Text = btn2;
    this.onYes = onYes;
    this.onNo = onNo;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: this.title });
    contentEl.createEl('p', { text: this.description });

    new Setting(contentEl)
      .addButton((btn) => {
        btn.setButtonText(this.btn1Text)
          .setCta()
          .onClick(() => {
                this.close();
                this.onYes();
          });
      })
      .addButton((btn) => {
        btn.setButtonText(this.btn2Text)
            .onClick(() => {
                this.close();
                this.onNo();
            });
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

/**
 * display an Alert Modal
 */
export class AlertModal extends Modal {
    private title: string;
    private description: string;
    private resolvePromise: (value: boolean) => void;
    private promise: Promise<boolean>;
    private btn1Text: string;
    private btn2Text: string;
  
    constructor(app: App, title: string, description: string, btn1: string, btn2:string) {
      super(app);
      this.title = title;
      this.description = description;
      this.btn1Text = btn1;
      this.btn2Text = btn2;
      this.promise = new Promise((resolve) => {
        this.resolvePromise = resolve;
      });
    }
  
    onOpen() {
      const { contentEl } = this;
  
      contentEl.createEl('h2', { text: this.title });
      contentEl.createEl('p', { text: this.description });
  
      new Setting(contentEl)
        .addButton((btn) => {
          btn.setButtonText(this.btn1Text)
            .setCta()
            .onClick(() => {
              this.close();
              this.resolvePromise(true);
            });
        })
        .addButton((btn) => {
          btn.setButtonText(this.btn2Text)
            .onClick(() => {
              this.close();
              this.resolvePromise(false);
            });
        });
    }
  
    onClose() {
      const { contentEl } = this;
      contentEl.empty();
    }
  
    async openAndGetValue(): Promise<boolean> {
      this.open();
      return this.promise;
    }
  }
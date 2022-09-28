import { Fonts } from "../types";
import Utils from './../libs/Utils';

export default class Modal extends Phaser.Scene {
  constructor() {
    super('Modal');
  }

  create(data: { type: ModalType }) {
    switch(data.type) {
      case ModalType.Tutorial:
        this.createTutorial();
        break;
      default:
        break;
    }
  }

  private createTutorial() {
    const { main } = this.cameras;
    main.setBackgroundColor('rgba(14, 9, 29, 0.5)');
    this.add.tileSprite(0, 0, main.displayWidth, main.displayHeight, 'pixel').setInteractive().setOrigin(0);
    this.add.sprite(main.centerX, main.centerY, 'tutorial-window');

    const close = this.add.sprite(main.centerX, main.centerY + 220, 'button');
    this.add.text(close.x, close.y, 'Понятно', { fontFamily: Fonts.GothaPro, fontSize: '22px' }).setOrigin(0.5);

    Utils.click(close, () => {
      this.scene.stop();
    });
  }
}

export enum ModalType {
  Tutorial,
}

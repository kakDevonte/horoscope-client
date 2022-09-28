import { Fonts, Signs, State } from "../types";
import langs from "../langs";
import Utils from "./../libs/Utils";
import { horoscopeAPI } from "../libs/Api";
export default class Start extends Phaser.Scene {
  public state: State;
  private _sign?: Signs;
  private _buttons: Button[];

  constructor() {
    super("Start");
  }

  public init(state: State) {
    this.state = state;
    console.log(state);
  }

  public create(): void {
    if (this.state.sign) {
      this.scene.stop();
      this.scene.start("Main", this.state);
    }

    console.log("start");
    const { centerX } = this.cameras.main;
    this.add.sprite(0, 0, "background").setOrigin(0);
    this.add
      .text(centerX, 180, "Выбери свой знак", {
        fontFamily: Fonts.Nasalization,
        fontSize: "44px",
        wordWrap: { width: 300 },
        align: "center",
      })
      .setOrigin(0.5);

    this._buttons = [];
    const x = 135;
    const y = 350;

    Object.values(Signs).forEach((sign, index) => {
      const buttonX = x + this.calcOffsetX(index);
      const buttonY = y + this.calcOffsetY(index);
      this._buttons.push(this.createSignButton(buttonX, buttonY, sign));
    });

    this._buttons.push(this.createMainButton(this.cameras.main.centerX, 1250));
  }

  private calcOffsetX(index: number): number {
    return (index % 3) * 240;
  }

  private calcOffsetY(index: number): number {
    return Math.floor(index / 3) * 240;
  }

  private createSignButton(x: number, y: number, sign: Signs): Button {
    const round = this.add.sprite(x, y, "rect");
    const icon = this.add.sprite(x, y - 20, `${sign}-icons`);
    const text = this.add
      .text(x, icon.getBounds().bottom + 30, langs[sign], {
        fontFamily: Fonts.Nasalization,
        fontSize: "24px",
      })
      .setOrigin(0.5);
    Utils.click(round, () => {
      this._sign = sign;
      this._buttons.forEach((button) => button.update());
    });

    return {
      sprite: round,
      update: () => {
        round.setTexture(this._sign === sign ? "selected-rect" : "rect");
      },
    };
  }

  private createMainButton(x: number, y: number): Button {
    const sprite = this.add.sprite(x, y, "big-button-active").setVisible(false);
    const text = this.add
      .text(x, y, "Далее", {
        fontSize: "30px",
        fontFamily: Fonts.Nasalization,
      })
      .setOrigin(0.5)
      .setVisible(false);

    Utils.click(sprite, () => {
      if (this._sign) {
        this.state.sign = this._sign;
        horoscopeAPI.setSign(this.state.id, this.state.sign);
        this.scene.stop();
        this.scene.start("Main", this.state);
      }
    });

    return {
      sprite,
      update: () => {
        sprite.setVisible(Boolean(this._sign));
        text.setVisible(Boolean(this._sign));
      },
    };
  }
}

type Button = {
  sprite: Phaser.GameObjects.Sprite;
  update: () => void;
};

import { Fonts } from "../types";

export class HoroscopeScroll {
  private _topSide: Phaser.GameObjects.Sprite;
  private _bottomSide: Phaser.GameObjects.Sprite;
  private _background: Phaser.GameObjects.TileSprite;
  private _text: Phaser.GameObjects.Text;
  private _height = 120;
  private _maxHeight = 230;
  private readonly START_Y = 730;
  private readonly BACKGROUND_WIDTH = 652;
  private readonly REGEX = /((\s*\S+){15})([\s\S]*)/;
  private readonly _fullText: string;
  private readonly _isFull = false;
  private _shortText: string;

  constructor(private readonly _scene: Phaser.Scene, text, isFull) {
    const { centerX } = this._scene.cameras.main;
    this._fullText = text;
    this._isFull = isFull;

    this._shortText = text ? this.REGEX.exec(text)[1] + "..." : "";

    this._topSide = this._scene.add
      .sprite(centerX, this.START_Y, "scroll")
      .setOrigin(0.5, 0);
    this._background = this._scene.add
      .tileSprite(
        centerX,
        this._topSide.getBounds().bottom,
        this.BACKGROUND_WIDTH,
        this._height,
        "scroll-background"
      )
      .setOrigin(0.5, 0);

    const textGoroscopeStyle = {
      fontSize: "24px",
      fontFamily: Fonts.GothaPro,
      color: "#bcbed1",
      align: "left",
      wordWrap: { width: this._scene.cameras.main.width * 0.8 },
    };

    let graphics = this._scene.add.graphics();

    const rect = graphics.fillRect(
      0,
      this._topSide.y + 70,
      this._scene.cameras.main.width,
      this._maxHeight
    );

    let mask = new Phaser.Display.Masks.GeometryMask(this._scene, graphics);

    this._text = this._scene.add
      .text(centerX, this._topSide.y + 70, this._shortText, textGoroscopeStyle)
      .setOrigin(0.5, 0); //.setWordWrapWidth(this.cameras.main.width * 0.8)
    this._text.setLineSpacing(15).setAlpha(1, 1, 0, 0);

    this._text.setMask(mask);

    this._bottomSide = this._scene.add
      .sprite(centerX, this.START_Y + this._height + 5, "scroll")
      .setOrigin(0.5, 1)
      .setScale(1, -1)
      .setAlpha(1, 1, 0.8, 0.8);

    if (this._isFull) this.showFullText();
  }

  public showFullText(): void {
    this._background.setDisplaySize(this.BACKGROUND_WIDTH, this._maxHeight);
    this._text.setText(this._fullText);
    this._text.setAlpha(1, 1, 1, 1);
    this._bottomSide.setAlpha(1, 1, 1, 1);
    this._bottomSide.setY(this.START_Y + this._maxHeight + 5);

    let zone = this._scene.add
      .zone(
        this._scene.cameras.main.centerX,
        this._topSide.y + 70,
        this._scene.cameras.main.width * 0.8,
        this._maxHeight
      )
      .setOrigin(0.5, 0)
      .setInteractive();

    let previousPointerPositionY;
    let currentPointerPositionY;

    zone.on("pointerdown", (pointer) => {
      previousPointerPositionY = pointer.y;
    });

    zone.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        currentPointerPositionY = pointer.y;

        if (currentPointerPositionY > previousPointerPositionY) {
          this._text.y += 10;
        } else if (currentPointerPositionY < previousPointerPositionY) {
          this._text.y -= 10;
        }
        previousPointerPositionY = currentPointerPositionY;
        this._text.y = Phaser.Math.Clamp(
          this._text.y,
          this._text.height > this._maxHeight ? 800 - this._text.height : 800,
          800
        );
      }
    });
  }
}

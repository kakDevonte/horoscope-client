import { Fonts, State } from "../types";
import { horoscopeAPI } from "../libs/Api";

export class Timer {
  private readonly _text: Phaser.GameObjects.Text;
  private _timer: Phaser.Time.TimerEvent;
  private _timeInSeconds: number;
  private state: State;

  constructor(private readonly _scene: Phaser.Scene, state) {
    const { centerX, centerY } = this._scene.cameras.main;
    this.state = state;
    let now = new Date();
    let date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      25,
      0,
      0,
      0
    );
    // @ts-ignore
    const diff = date - new Date();
    this._timeInSeconds = diff / 1000;
    this._text = this._scene.add
      .text(centerX, centerY + 290, this.secondsToHms(this._timeInSeconds), {
        fontSize: "40px",
        fontFamily: Fonts.Nasalization,
      })
      .setOrigin(0.5);

    this._timer = this._scene.time.addEvent({
      delay: 1000,
      args: [this._text],
      callback: () => {
        this.tick();
      },
      callbackScope: this,
      loop: true,
      repeat: -1,
    });
  }

  private tick(): void {
    this._timeInSeconds--;
    this._text.text = this.secondsToHms(this._timeInSeconds);
    if (this._timeInSeconds == 0) {
      horoscopeAPI.getData(this.state.id);
      this._scene.scene.restart(this.state);
    }
  }

  private secondsToHms(d): string {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    let hDisplay = h > 0 ? this.addZeros(h) + ":" : "00:";
    let mDisplay = m > 0 ? this.addZeros(m) + ":" : "00:";
    let sDisplay = s > 0 ? this.addZeros(s) + "" : "00";
    return hDisplay + mDisplay + sDisplay;
  }

  private addZeros(num) {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  }
}

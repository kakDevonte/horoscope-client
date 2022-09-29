export default class Utils {
  public static click(
    object: any,
    action: () => void,
    maxMoveCounter: number = 3
  ): void {
    object.setInteractive();
    let moveCounter: number = 0;

    object.on("pointerdown", (): void => {
      object.xDown = object.x;
      object.yDown = object.y;
      object.press = true;
      action();
    });

    object.on("pointermove", (): void => {
      if (object.press) moveCounter++;
    });

    object.on("pointerout", (): void => {
      if (object.press) {
        moveCounter = 0;
        object.press = false;
      }
    });

    object.on("pointerup", (): void => {
      let x: number;
      let y: number;

      if (object.xDown >= object.x) x = object.xDown - object.x;
      else x = object.x - object.xDown;

      if (object.yDown >= object.y) y = object.yDown - object.y;
      else y = object.y - object.yDown;

      if (object.press && moveCounter < maxMoveCounter && x < 5 && y < 5) {
        object.press = false;
      } else if (object.press) {
        object.press = false;
      }
      moveCounter = 0;
    });
  }

  public static clickButton(
    scene: Phaser.Scene,
    button: any,
    action: () => void
  ): void {
    button.setInteractive();
    const scale = button.scale;
    button.on("pointerdown", (): void => {
      button.press = true;
      button.increase = false;
      let counter: number = 0;
      let interval = scene.time.addEvent({
        delay: 5,
        callback: () => {
          if (button.scale > 0.9 && !button.increase) {
            let scale: number = button.scale - 0.05;
            button.scale = Number(scale.toFixed(2));
          }
          counter++;
          if (counter >= 2) interval.remove(false);
        },
        callbackScope: scene,
        loop: true,
      });
    });

    button.on("pointerout", (): void => {
      if (button.press) {
        button.press = false;
        button.increase = true;
        let interval = scene.time.addEvent({
          delay: 10,
          callback: () => {
            if (button.scale < scale && button.increase) {
              let scale: number = button.scale + 0.05;
              button.scale = Number(scale.toFixed(2));
            }
            if (button.scale >= scale) interval.remove(false);
          },
          callbackScope: scene,
          loop: true,
        });
      }
    });

    button.on("pointerup", (): void => {
      if (button.press) {
        button.press = false;
        button.increase = true;
        let interval = scene.time.addEvent({
          delay: 10,
          callback: () => {
            if (button.scale < scale && button.increase) {
              let scale: number = button.scale + 0.05;
              button.scale = Number(scale.toFixed(2));
            }
            if (button.scale >= scale) interval.remove(false);
          },
          callbackScope: scene,
          loop: true,
        });
        action();
      }
    });
  }

  public static setHoverEffect(
    btn: Phaser.GameObjects.Sprite | Phaser.GameObjects.TileSprite
  ): void {
    btn.on("pointerover", () => {
      btn.setAlpha(0.8);
    });
    btn.on("pointerout", () => {
      btn.setAlpha(1);
    });
  }

  public static interval(date1, date2) {
    if (date1 > date2) {
      // swap
      let result = this.interval(date2, date1);
      result.years = -result.years;
      result.months = -result.months;
      result.days = -result.days;
      result.hours = -result.hours;
      return result;
    }
    let result = {
      years: date2.getYear() - date1.getYear(),
      months: date2.getMonth() - date1.getMonth(),
      days: date2.getDate() - date1.getDate(),
      hours: date2.getHours() - date1.getHours(),
    };
    if (result.hours < 0) {
      result.days--;
      result.hours += 24;
    }
    if (result.days < 0) {
      result.months--;
      let copy1 = new Date(date1.getTime());
      copy1.setDate(32);
      result.days = 32 - date1.getDate() - copy1.getDate() + date2.getDate();
    }
    if (result.months < 0) {
      result.years--;
      result.months += 12;
    }
    return result;
  }
}

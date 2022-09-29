import { Fonts, Screens, State } from "../types";
import Utils from "./../libs/Utils";
import langs from "./../langs";
import { HoroscopeScroll } from "../component/HoroscopeScroll";
import { ModalType } from "./Modal";
import { Timer } from "../component/Timer";
import { horoscopeAPI } from "../libs/Api";
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge";
import * as qs from "qs";

export default class Main extends Phaser.Scene {
  state: State;
  private _screenButtons: Button[];
  private _todayElements: any[];
  private scroll: HoroscopeScroll;

  constructor() {
    super("Main");
  }

  init(state: State) {
    this.state = state;
    this.checkGetBonus();
    if (!this.state.screen) {
      this.state.screen = Screens.Today;
    }
  }

  private checkGetBonus(): void {
    if (this.state.isGetTodayDay) {
      return;
    } else {
      this.state.day += 1;
      this.state.isGetTodayDay = true;
      horoscopeAPI.setDays(this.state.id, this.state.day);
      if (this.state.day >= 5) {
        this.state.day = 0;
        this.state.stars += 5;
      }
    }
  }

  create() {
    this._todayElements = [];
    this.add.sprite(0, 0, "background-star").setOrigin(0);
    this.createStars();
    this.createProgress();
    this.createSign();
    this.createButtons();
    this.createSocialButtons();

    switch (this.state.screen) {
      case Screens.Today:
        this.createTodayScreen();
        break;
      case Screens.Tomorrow:
        this.createTomorrowScreen();
        break;
      default:
        break;
    }
  }

  private createSign() {
    const x = this.cameras.main.centerX;
    const y = 400;
    const { sign } = this.state;
    const main = this.add.sprite(x, y, `${sign}-image`).setScale(1);
    const min = this.add.sprite(main.x, main.y + 120, `${sign}-icons`);
    const text = this.add
      .text(x, y + 200, langs[sign], {
        fontFamily: Fonts.Nasalization,
        fontSize: "36px",
      })
      .setOrigin(0.5);
  }

  private createButtons() {
    const x = 140;
    const y = 680;
    const buttonOffset = 235;
    this._screenButtons = [];
    this._screenButtons.push(this.createScreenButton(x, y, Screens.Today));
    this._screenButtons.push(
      this.createScreenButton(x + buttonOffset, y, Screens.Tomorrow)
    );
    this._screenButtons.push(
      this.createScreenButton(x + buttonOffset * 2, y, Screens.Week)
    );
    this._screenButtons.forEach((button) => button.update());
  }

  private createScreenButton(x: number, y: number, screen: Screens): Button {
    const sprite = this.add.sprite(x, y, "button-disable");
    const text = this.add
      .text(x, y, screen, {
        fontFamily: Fonts.Nasalization,
        fontSize: "24px",
      })
      .setOrigin(0.5);

    Utils.click(sprite, () => {
      if (screen !== this.state.screen) {
        this.state.screen = screen;
        this.scene.restart(this.state);
      }
    });

    const update = () => {
      sprite.setTexture(
        this.state.screen === screen ? "button-active" : "button-disable"
      );
    };
    return { sprite, update };
  }

  private createTodayScreen() {
    const { centerX, centerY } = this.cameras.main;

    this.scroll = new HoroscopeScroll(
      this,
      this.state.today[this.state.sign],
      this.state.isFullPredict
    );

    const buyY = centerY + 330;
    const adY = centerY + 440;
    const price = 2;
    const starAdCount = 2;
    const stageAdCount = 1;

    const textButtonStyle = {
      fontSize: "30px",
      fontFamily: Fonts.Nasalization,
    };
    const buyButton = this.add
      .sprite(
        centerX,
        buyY,
        this.state.stars <= 0 ? "big-button-disable" : "big-button-active"
      )
      .setVisible(!this.state.isFullPredict);

    this._todayElements.push(buyButton);
    buyButton.setAlpha(1, 0.1, 0.1, 0.1);

    const text = this.add
      .text(centerX, buyY, "Читать полностью за " + price, textButtonStyle)
      .setOrigin(0, 0.5)
      .setVisible(!this.state.isFullPredict);
    this._todayElements.push(text);

    const star = this.add
      .sprite(centerX, buyY, "star")
      .setOrigin(0, 0.5)
      .setVisible(!this.state.isFullPredict);
    const width = text.displayWidth + star.displayWidth + 10;
    text.setX(centerX - width / 2);
    star.setX(text.getBounds().right + 5);
    this._todayElements.push(star);

    Utils.click(buyButton, () => {
      if (this.state.stars <= 0) return;
      this.buyHoroscope();
    });

    let adBtn = this.isClickAdButton();

    const adButton = this.add.sprite(
      centerX,
      adY,
      !adBtn.isShowAd && !adBtn.isTakeBonus
        ? "big-button-disable"
        : "big-button-active"
    );
    // .setVisible(!this.state.isFullPredict);
    this._todayElements.push(adButton);

    const textBtn = adBtn.isShowAd ? "Посмотреть рекламу" : "Получить";

    const adText = this.add
      .text(centerX, adY, textBtn, textButtonStyle)
      .setOrigin(0, 0.5);
    // .setVisible(!this.state.isFullPredict);
    this._todayElements.push(adText);

    const countStarText = this.add
      .text(centerX, adY, `+${starAdCount}`, textButtonStyle)
      .setOrigin(0, 0.5);
    // .setVisible(!this.state.isFullPredict);
    this._todayElements.push(countStarText);

    const adStar = this.add.sprite(centerX, adY, "star").setOrigin(0, 0.5);
    // .setVisible(!this.state.isFullPredict);
    this._todayElements.push(adStar);

    const countStageText = this.add
      .text(centerX, adY, `+${stageAdCount}`, textButtonStyle)
      .setOrigin(0, 0.5);
    // .setVisible(!this.state.isFullPredict);
    this._todayElements.push(countStageText);

    const adStage = this.add
      .sprite(centerX, adY, "moon-stage1")
      .setOrigin(0, 0.5);
    // .setVisible(!this.state.isFullPredict);
    this._todayElements.push(adStage);

    const addWidth =
      adText.displayWidth +
      countStarText.displayWidth +
      adStar.displayWidth +
      countStageText.displayWidth +
      adStage.displayWidth +
      40;

    adText.setX(centerX - addWidth / 2);
    countStarText.setX(adText.getBounds().right + 5);
    adStar.setX(countStarText.getBounds().right + 5);
    countStageText.setX(adStar.getBounds().right + 5);
    adStage.setX(countStageText.getBounds().right + 5);

    Utils.click(adButton, () => {
      if (!adBtn.isShowAd && !adBtn.isTakeBonus) return;
      this.showAd();
    });
  }

  private buyHoroscope() {
    console.log("buy horoscope");

    this.scroll.showFullText();
    this.state.isFullPredict = true;
    this.state.stars -= 2;
    horoscopeAPI.setFullPredict(this.state.id, this.state.stars);
    this.scene.restart(this.state);
  }

  private isClickAdButton() {
    let isAds = false;
    let isShowAd = false;
    let isTakeBonus = false;

    bridge
      .send("VKWebAppCheckNativeAds", { ad_format: EAdsFormats.REWARD })
      .then((data) => (isAds = data.result));

    if (this.state.countOfAdsPerDay >= 3) isShowAd = false;

    if (this.state.dateOfShowAds) {
      let date1 = new Date(this.state.dateOfShowAds);
      let date2 = new Date();

      const diff = Utils.interval(date1, date2);
      if (diff.hours >= 6) {
        this.state.dateOfShowAds = new Date().toUTCString();
        this.state.countOfAdsPerDay += 1;
        horoscopeAPI.setAdsData(
          this.state.id,
          this.state.dateOfShowAds,
          this.state.countOfAdsPerDay
        );
        isShowAd = true;
      }
    }

    if (isShowAd && isAds) return { isShowAd, isTakeBonus };

    if (this.state.dateOfGetStars) {
      let date1 = new Date(this.state.dateOfGetStars);
      let date2 = new Date();

      const diff = Utils.interval(date1, date2);
      if (diff.hours >= 21) {
        isTakeBonus = true;
      }
    } else {
      isTakeBonus = true;
    }
    return { isShowAd, isTakeBonus };
  }

  private showAd() {
    console.log("show ad");
    this.state.day += 1;
    this.state.stars += 2;
    horoscopeAPI.setDays(this.state.id, this.state.day);
    horoscopeAPI.setStars(this.state.id, this.state.stars);
    this.state.dateOfGetStars = new Date().toUTCString();
    horoscopeAPI.setDateOfGetStars(this.state.id, new Date().toUTCString());
    if (this.state.day >= 5) {
      this.state.day = 0;
      this.state.stars += 5;
    }
    this.scene.restart(this.state);
  }

  private createTomorrowScreen() {
    const { centerX, centerY } = this.cameras.main;
    this.add.sprite(centerX, centerY + 285, "tomorrow-tutorial");

    const timer = new Timer(this, this.state);

    const close = this.add
      .sprite(centerX, centerY + 400, "button")
      .setScale(1.3);
    this.add
      .text(close.x, close.y, "Напомните мне", {
        fontFamily: Fonts.GothaPro,
        fontSize: "22px",
      })
      .setOrigin(0.5);

    Utils.clickButton(this, close, () => {
      let parsed = qs.parse(window.location.href);
      if (parseInt(parsed.vk_are_notifications_enabled)) {
        horoscopeAPI.addPushNotice(this.state.id);
      } else {
        bridge.send("VKWebAppAllowNotifications").then((data) => {
          if (data.result) horoscopeAPI.addPushNotice(this.state.id);
        });
      }
    });
  }

  private createSocialButtons() {
    const x = 138;
    const y = this.cameras.main.displayHeight - 60;
    const offset = 235;
    this.add
      .text(this.cameras.main.centerX, y - 65, "Поделиться гороскопом", {
        fontSize: "24px",
        fontFamily: Fonts.GothaPro,
        color: "#BCBED1",
      })
      .setOrigin(0.5);

    const textStyle = { fontSize: "22px", fontFamily: Fonts.Nasalization };
    const wallButton = this.add.sprite(x, y, "button");
    const wallText = this.add.text(x, y, "На стену", textStyle).setOrigin(0.5);
    const storyButton = this.add.sprite(x + offset, y, "button");
    const storyText = this.add
      .text(x + offset, y, "В историю", textStyle)
      .setOrigin(0.5);
    const messageButton = this.add.sprite(x + offset * 2, y, "button");
    const messageText = this.add
      .text(x + offset * 2, y, "В личку", textStyle)
      .setOrigin(0.5);

    Utils.clickButton(this, wallButton, () => {
      this.wallButtonHandler();
    });
    Utils.clickButton(this, storyButton, () => {
      this.storyButtonHandler();
    });
    Utils.clickButton(this, messageButton, () => {
      this.messageButtonHandler();
    });
  }

  private wallButtonHandler() {
    console.log("wallButton");
    bridge.send("VKWebAppShowWallPostBox", {
      message: this.state.today[this.state.sign],
    });
  }

  private storyButtonHandler() {
    console.log("storyButton");
    bridge.send("VKWebAppShowStoryBox", {
      background_type: "image",
      url: "https://sun9-65.userapi.com/c850136/v850136098/1b77eb/0YK6suXkY24.jpg",
      stickers: [
        {
          sticker_type: "renderable",
          sticker: {
            content_type: "image",
            url: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Dialog.png",
            clickable_zones: [
              {
                action_type: "link",
                action: {
                  link: "https://vk.com/wall-166562603_1192",
                  tooltip_text_key: "tooltip_open_post",
                },
                clickable_area: [
                  {
                    x: 17,
                    y: 110,
                  },
                  {
                    x: 97,
                    y: 110,
                  },
                  {
                    x: 97,
                    y: 132,
                  },
                  {
                    x: 17,
                    y: 132,
                  },
                ],
              },
            ],
          },
        },
      ],
    });
    //     {
    //   background_type: "image",
    //   url: "https://sun9-65.userapi.com/c850136/v850136098/1b77eb/0YK6suXkY24.jpg",
    // }
  }

  private messageButtonHandler() {
    console.log("messageButton");
    bridge.send("VKWebAppGetFriends", {}).then((data) => {
      console.log(data);
    });
    bridge
      .send("VKWebAppGetAuthToken", {
        app_id: 51435661,
        scope: "friends,status",
      })
      .then((data) => {
        console.log(data.access_token);
      });
  }

  private createProgress() {
    const { day } = this.state;
    const x = 54;
    const y = 200;
    const OFFSET = 40;
    const MAX_DAY = 5;

    for (let i = 1; i <= MAX_DAY; i += 1) {
      const spriteX = x + (i - 1) * OFFSET;
      this.add.sprite(spriteX, y, i <= day ? `moon-stage${i}` : "moon-clear");
    }

    const text = this.add
      .text(x + OFFSET * MAX_DAY, y, "что это?", {
        fontSize: "20px",
        fontFamily: Fonts.GothaPro,
        color: "#1570FE",
      })
      .setOrigin(0, 0.5);

    const fixString =
      langs[this.state.sign][0] +
      langs[this.state.sign].toLocaleLowerCase().slice(1);

    this.add
      .text(this.cameras.main.displayWidth - 32, y, fixString, {
        fontSize: "28px",
        fontFamily: Fonts.GothaPro,
        color: "#BCBED1",
      })
      .setOrigin(1, 0.5);

    Utils.click(text, () => {
      this.openTutorial();
    });
  }

  private openTutorial() {
    this.scene.launch("Modal", { type: ModalType.Tutorial });
  }

  private createStars() {
    const { centerX } = this.cameras.main;
    const x = centerX - 50;
    const y = 85;

    const count = this.add
      .text(x, y, this.state.stars.toString(), {
        fontFamily: Fonts.Nasalization,
        fontSize: "24px",
      })
      .setOrigin(1, 0.5);
    this.add
      .sprite(x + 5, y, "star")
      .setOrigin(0, 0.5)
      .setScale(0.7);

    const button = this.add
      .text(centerX, y, "пополнить", {
        fontFamily: Fonts.GothaPro,
        fontSize: "20px",
        color: "#BBBED1",
      })
      .setOrigin(0, 0.5);

    Utils.click(button, () => {
      this.openShop();
    });
  }

  private openShop() {
    console.log("open shop");
  }
}

type Button = {
  sprite: Phaser.GameObjects.Sprite;
  update: () => void;
};

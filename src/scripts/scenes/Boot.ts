import * as Webfont from "../libs/Webfonts.js";
import { Fonts, State } from "../types";
import state from "../state";
import { horoscopeAPI } from "../libs/Api";
import bridge from "@vkontakte/vk-bridge";

export default class BootScene extends Phaser.Scene {
  private fontsReady: boolean;
  private userReady: boolean;
  public state: State;

  constructor() {
    super("Boot");
  }

  public init(): void {
    this.state = state;
    bridge.send("VKWebAppInit");

    Webfont.load({
      custom: { families: [Fonts.Nasalization, Fonts.GothaPro] },
      active: () => {
        this.fontsReady = true;
      },
    });

    this.initUser();
  }

  private initUser(): void {
    bridge.send("VKWebAppGetUserInfo").then((data) => {
      this.checkUser(data.id);
    });
  }

  private checkUser(id: number): void {
    horoscopeAPI.getData(id).then((data) => {
      console.log(data.data);
      this.state.id = data.data.id;
      this.state.sign = data.data.sign;
      this.state.stars = data.data.stars;
      this.state.day = data.data.days;
      this.state.today = data.data.today;
      this.state.tomorrow = data.data.tomorrow;
      this.state.newcomer = data.data.newcomer;
      this.state.timestamp = data.data.timestamp;
      this.state.isGetTodayDay = data.data.isGetTodayDay;
      this.state.isFullPredict = data.data.isFullPredict;
      this.userReady = true;
    });
  }

  public update(): void {
    if (!this.fontsReady) return;
    if (!this.userReady) return;
    this.scene.start("Preload", this.state);
  }
}

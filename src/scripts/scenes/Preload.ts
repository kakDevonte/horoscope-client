import { State } from "../types";

const background = require("../../assets/images/background.png");
const scroll = require("../../assets/images/scroll.png");
const scrollBackground = require("../../assets/images/scroll-background.png");
const bigButtonActive = require("../../assets/images/big-button-active.png");
const bigButtonDisable = require("../../assets/images/big-button-disable.png");
const buttonActive = require("../../assets/images/button-active.png");
const buttonDisable = require("../../assets/images/button-disable.png");
const button = require("../../assets/images/button.png");
const closeButton = require("../../assets/images/close-button.png");
const tomorrowTutorial = require("../../assets/images/tomorrow-tutorial.png");
const tutorialWindow = require("../../assets/images/tutorial-window.png");
const star = require("../../assets/images/star.png");
const rect = require("../../assets/images/rect.png");
const selectedRect = require("../../assets/images/selected-rect.png");
const moonClear = require("../../assets/images/moon/clear.png");
const moonStage1 = require("../../assets/images/moon/stage-1.png");
const moonStage2 = require("../../assets/images/moon/stage-2.png");
const moonStage3 = require("../../assets/images/moon/stage-3.png");
const moonStage4 = require("../../assets/images/moon/stage-4.png");
const moonStage5 = require("../../assets/images/moon/stage-5.png");
const ariesIcons = require("../../assets/images/icons/aries.png");
const taurusIcons = require("../../assets/images/icons/taurus.png");
const geminiIcons = require("../../assets/images/icons/gemini.png");
const cancerIcons = require("../../assets/images/icons/cancer.png");
const leoIcons = require("../../assets/images/icons/leo.png");
const virgoIcons = require("../../assets/images/icons/virgo.png");
const libraIcons = require("../../assets/images/icons/libra.png");
const scorpioIcons = require("../../assets/images/icons/scorpio.png");
const sagittariusIcons = require("../../assets/images/icons/sagittarius.png");
const capricornIcons = require("../../assets/images/icons/capricorn.png");
const aquariusIcons = require("../../assets/images/icons/aquarius.png");
const piscesIcons = require("../../assets/images/icons/pisces.png");
const ariesImage = require("../../assets/images/sign/aries.png");
const taurusImage = require("../../assets/images/sign/taurus.png");
const geminiImage = require("../../assets/images/sign/gemini.png");
const cancerImage = require("../../assets/images/sign/cancer.png");
const leoImage = require("../../assets/images/sign/leo.png");
const virgoImage = require("../../assets/images/sign/virgo.png");
const libraImage = require("../../assets/images/sign/libra.png");
const scorpioImage = require("../../assets/images/sign/scorpio.png");
const sagittariusImage = require("../../assets/images/sign/sagittarius.png");
const capricornImage = require("../../assets/images/sign/capricorn.png");
const aquariusImage = require("../../assets/images/sign/aquarius.png");
const piscesImage = require("../../assets/images/sign/pisces.png");
const starBg = require("../../assets/images/background-with-star.png");
const pixel = require("../../assets/images/pixel.png");

export default class Preload extends Phaser.Scene {
  public state: State;

  constructor() {
    super("Preload");
  }

  public init(state: State) {
    this.state = state;
  }

  public preload(): void {
    this.preloadAssets();
  }

  private preloadAssets(): void {
    this.load.image("pixel", pixel);
    this.load.image("background", background);
    this.load.image("scroll", scroll);
    this.load.image("scroll-background", scrollBackground);
    this.load.image("big-button-active", bigButtonActive);
    this.load.image("big-button-disable", bigButtonDisable);
    this.load.image("button-active", buttonActive);
    this.load.image("button-disable", buttonDisable);
    this.load.image("button", button);
    this.load.image("close-button", closeButton);
    this.load.image("tomorrow-tutorial", tomorrowTutorial);
    this.load.image("tutorial-window", tutorialWindow);
    this.load.image("star", star);
    this.load.image("rect", rect);
    this.load.image("selected-rect", selectedRect);
    this.load.image("moon-clear", moonClear);
    this.load.image("moon-stage1", moonStage1);
    this.load.image("moon-stage2", moonStage2);
    this.load.image("moon-stage3", moonStage3);
    this.load.image("moon-stage4", moonStage4);
    this.load.image("moon-stage5", moonStage5);
    this.load.image("aries-icons", ariesIcons);
    this.load.image("taurus-icons", taurusIcons);
    this.load.image("gemini-icons", geminiIcons);
    this.load.image("cancer-icons", cancerIcons);
    this.load.image("leo-icons", leoIcons);
    this.load.image("virgo-icons", virgoIcons);
    this.load.image("libra-icons", libraIcons);
    this.load.image("scorpio-icons", scorpioIcons);
    this.load.image("sagittarius-icons", sagittariusIcons);
    this.load.image("capricorn-icons", capricornIcons);
    this.load.image("aquarius-icons", aquariusIcons);
    this.load.image("pisces-icons", piscesIcons);
    this.load.image("aries-image", ariesImage);
    this.load.image("taurus-image", taurusImage);
    this.load.image("gemini-image", geminiImage);
    this.load.image("cancer-image", cancerImage);
    this.load.image("leo-image", leoImage);
    this.load.image("virgo-image", virgoImage);
    this.load.image("libra-image", libraImage);
    this.load.image("scorpio-image", scorpioImage);
    this.load.image("sagittarius-image", sagittariusImage);
    this.load.image("capricorn-image", capricornImage);
    this.load.image("aquarius-image", aquariusImage);
    this.load.image("pisces-image", piscesImage);
    this.load.image("background-star", starBg);
  }

  public create(): void {
    this.scene.stop();
    this.scene.start("Start", this.state);
  }
}

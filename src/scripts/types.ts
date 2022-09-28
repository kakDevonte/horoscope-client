type State = {
  id: number;
  newcomer: boolean;
  sign?: Signs;
  screen?: Screens;
  timestamp: string;
  stars: number;
  isFullPredict: boolean;
  today: [SingType];
  tomorrow: [SingType];
  day: number;
  isGetTodayDay: boolean;
};

type SingType = {
  [key: string]: string;
};
enum Screens {
  Today = "Сегодня",
  Tomorrow = "Завтра",
  Week = "Неделя",
}

enum Fonts {
  Nasalization = "Nasalization",
  GothaPro = "GothaPro",
}

enum Signs {
  Aries = "aries",
  Taurus = "taurus",
  Gemini = "gemini",
  Cancer = "cancer",
  Leo = "leo",
  Virgo = "virgo",
  Libra = "libra",
  Scorpio = "scorpio",
  Sagittarius = "sagittarius",
  Capricorn = "capricorn",
  Aquarius = "aquarius",
  Pisces = "pisces",
}

export { State, Screens, Fonts, Signs };

import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/api/",
  //baseURL: "https://297349.simplecloud.ru/api/",
});

export const horoscopeAPI = {
  getData(id) {
    return instance.post(`getData/`, { id });
  },
  setSign(id, sign) {
    return instance.post(`setSign/`, { id, sign });
  },
  setDays(id, day) {
    return instance.post(`setDays/`, { id, day });
  },
  setFullPredict(id, stars) {
    return instance.post(`setFullPredict/`, { id, stars });
  },
  addPushNotice(id: number) {
    return instance.post("addPushNotice/", { id });
  },
  endGame() {
    return instance.post("stats/end_game/");
  },
};

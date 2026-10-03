const base = {
  name: "Patepic",

  twitch: {
    handle: "Patepic",
    url: "https://twitch.tv/patepic",
  },

  youtube: {
    name: "Patepic",
    handle: "@patepic",
    url: "https://youtube.com/@patepic",
  },

  pixie: {
    name: "Pixie",
    handle: "@pixie",
    url: "https://www.youtube.com/@pixie",
  },
};

export const creator = {
  ...base,
  youtubeChannels: [base.youtube, base.pixie].filter((c) => c.url),
};

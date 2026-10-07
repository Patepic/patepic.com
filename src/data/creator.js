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
    handle: "@pixievgm",
    url: "https://www.youtube.com/@pixievgm",
  },
};

export const creator = {
  ...base,
  youtubeChannels: [base.youtube, base.pixie].filter((c) => c.url),
};

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
    handle: "@PixieTheHiddenTrack",
    url: "https://www.youtube.com/@PixieTheHiddenTrack",
  },
};

export const creator = {
  ...base,
  youtubeChannels: [base.youtube, base.pixie].filter((c) => c.url),
};

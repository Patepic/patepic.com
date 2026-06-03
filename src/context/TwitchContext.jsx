import React, { createContext, useContext, useState, useEffect } from "react";
import { creator } from "../data/creator";

const TwitchContext = createContext(null);

export function TwitchProvider({ children }) {
  const [live, setLive] = useState(null);
  const handle =
    creator.twitch?.handle ?? creator.twitch?.url?.split("/").pop();

  useEffect(() => {
    if (!handle) return;

    const check = async () => {
      try {
        const tokenRes = await fetch(
          `https://id.twitch.tv/oauth2/token?client_id=${import.meta.env.VITE_TWITCH_CLIENT_ID}&client_secret=${import.meta.env.VITE_TWITCH_SECRET_KEY}&grant_type=client_credentials`,
          { method: "POST" },
        );
        const { access_token } = await tokenRes.json();

        const streamRes = await fetch(
          `https://api.twitch.tv/helix/streams?user_login=${handle}`,
          {
            headers: {
              "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        const { data } = await streamRes.json();
        const stream = data[0] ?? null;
        setLive({
          isLive: !!stream,
          title: stream?.title ?? "",
          game: stream?.game_name ?? "",
          viewers: stream?.viewer_count ?? 0,
        });
      } catch {
        setLive({ isLive: false });
      }
    };

    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [handle]);

  return (
    <TwitchContext.Provider value={live}>{children}</TwitchContext.Provider>
  );
}

export const useTwitch = () => useContext(TwitchContext);

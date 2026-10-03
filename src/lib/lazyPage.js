import { lazy } from "react";

const RELOAD_KEY = "patepic-chunk-reload";

const readFlag = () => {
  try {
    return sessionStorage.getItem(RELOAD_KEY);
  } catch {
    return "1";
  }
};

const writeFlag = (value) => {
  try {
    if (value) sessionStorage.setItem(RELOAD_KEY, value);
    else sessionStorage.removeItem(RELOAD_KEY);
  } catch {
    return;
  }
};

export const lazyPage = (load) =>
  lazy(() =>
    load()
      .then((module) => {
        writeFlag(null);
        return module;
      })
      .catch((error) => {
        if (!readFlag()) {
          writeFlag("1");
          window.location.reload();
          return new Promise(() => {});
        }
        throw error;
      }),
  );

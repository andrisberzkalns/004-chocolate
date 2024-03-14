import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useMemo } from "react";
import { KeyboardControls } from "@react-three/drei";
import type { KeyboardControlsEntry } from "@react-three/drei";
import { Provider } from "react-redux";
import { store } from "~/lib/store";

enum Controls {
  left = "left",
  right = "right",
}

const MyApp: AppType = ({ Component, pageProps }) => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    ],
    [],
  );
  return (
    <Provider store={store}>
      <KeyboardControls map={map}>
        <Component {...pageProps} />
      </KeyboardControls>
    </Provider>
  );
};

export default api.withTRPC(MyApp);

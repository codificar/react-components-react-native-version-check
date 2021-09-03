import { Alert, NativeModules, Platform, Linking } from "react-native";
import { versionCompare } from "./utils";
import axios from "axios";

let storeUrl = null;

export async function checkVersion({
  currentVersion: currentVersionDefault,
  bundleId: bundleIdDefault,
  country = "br",
}) {
  try {
    const android = Platform.OS === "android";
    const ios = Platform.OS === "ios";
    const bundleId =
      bundleIdDefault ||
      (NativeModules.RNDeviceInfo ? NativeModules.RNDeviceInfo.bundleId : null);
    const currentVersion =
      currentVersionDefault ||
      (NativeModules.RNDeviceInfo
        ? NativeModules.RNDeviceInfo.appVersion
        : null);

    // Check if we have retrieved a bundle ID
    if (!bundleId && !("RNDeviceInfo" in NativeModules)) {
      throw Error(
        "[react-native-check-version] Missing react-native-device-info dependency, " +
          "please manually specify a bundleId in the options object."
      );
    }

    if (ios) {
      try {
        const url = `http://itunes.apple.com/lookup?lang=pt&bundleId=${bundleId}&country=${country}`;
        const { data } = await axios.get(url);

        if (!data || !("results" in data)) {
          throw new Error("Unknown error connecting to iTunes.");
        }
        if (!data.results.length) {
          throw new Error("App for this bundle ID not found.");
        }
        let res = data.results[0];

        const needsUpdate = versionCompare(currentVersion, res.version);

        storeUrl =
          res.trackViewUrl || res.artistViewUrl || res.sellerUrl || null;

        return {
          ...needsUpdate,
          version: res.version || null,
          released: res.currentVersionReleaseDate || res.releaseDate || null,
          notes: res.releaseNotes || "",
          url: res.trackViewUrl || res.artistViewUrl || res.sellerUrl || null,
          country,
          lastChecked: new Date().toISOString(),
        };
      } catch (e) {
        throw new Error(e);
      }
    }

    if (android) {
      const url = `https://play.google.com/store/apps/details?id=${bundleId}&hl=en`;
      try {
        const { data } = await axios.get(url);

        let res = data;
        const startToken = "Current Version";
        const endToken = "Requires";
        const indexStart = res.indexOf(startToken);

        res = res.substr(indexStart + startToken.length);

        const indexEnd = res.indexOf(endToken);

        const version = res
          .substr(0, indexEnd)
          .replace(/<[^>]+>/g, "")
          .trim();

        storeUrl = `https://play.google.com/store/apps/details?id=${bundleId}`;

        const needsUpdate = versionCompare(currentVersion, version);

        return {
          ...needsUpdate,
          version: version || null,
          released: new Date(),
          notes: "",
          url: `https://play.google.com/store/apps/details?id=${bundleId}`,
          lastChecked: new Date().toISOString(),
        };
      } catch (e) {
        if (e.response && e.response.status && e.response.status === 404) {
          throw new Error(
            `App with bundle ID "${bundleId}" not found in Google Play.`
          );
        }
        throw new Error(e);
      }
    }
  } catch (e) {
    throw new Error(e);
  }
}

export function showAlert({
  appName = "{appname}",
  title = "Atualização Disponível",
  textClose = "Fechar",
  textUpdate = "Atualizar Agora",
  description = `Está disponível na LOJA a nova Versão do Aplicativo ${appName}, clique em “${textUpdate}” para realizar a atualização. Esta nova Versão tem muitas novidades APROVEITE!`,
  onClose = () => {},
  onUpdate = () => {},
}) {
  try {
    const handleUpdate = () => {
      if (storeUrl) Linking.openURL(storeUrl);
      onUpdate();
    };

    const handleClose = () => {
      onClose();
    };

    Alert.alert(title, description, [
      {
        text: textClose,
        onPress: handleClose,
        style: "cancel",
      },
      {
        text: textUpdate,
        onPress: handleUpdate,
      },
    ]);
  } catch (e) {
    throw new Error(e);
  }
}

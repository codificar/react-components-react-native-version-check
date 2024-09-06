import { Alert, NativeModules, Platform, Linking } from "react-native";
import { versionCompare } from "./utils";
import axios from "axios";

// Locales
import { strings } from './Locales/i18n';

let storeUrl = null;

export async function checkVersion({
  currentVersion: currentVersionDefault,
  bundleId: bundleIdDefault,
  country = "br",
  baseUrl: url
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
        const response = await axios.post(url, {
			    bundle_id: bundleId,
			    type: 'ios'
		    });

		    if (!response.status == 200) return;
	
		    const json = response.data;

        const needsUpdate = versionCompare(currentVersion, json.version);

        return {
          ...needsUpdate,
          version: json.version || null,
          released: json.currentVersionReleaseDate || json.releaseDate || null,
          notes: json.releaseNotes || "",
          url: json.trackViewUrl || json.artistViewUrl || json.sellerUrl || null,
          country,
          lastChecked: new Date().toISOString(),
        };
      } catch (e) {
        throw new Error(e);
      }
    }

    if (android) {
      try {
        const response  = await axios.post(url, {
          bundle_id: bundleId,
          type: 'android'
        });

		    if (!response.status == 200) return;
	
		    const json = response.data;
		
		    const needsUpdate = versionCompare(currentVersion, json.version);

        storeUrl = `https://play.google.com/store/apps/details?id=${bundleId}`;
        
        return {
          ...needsUpdate,
          version: json.version || null,
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
  textClose = strings('version_check.textClose'),
  textUpdate = strings('version_check.textUpdate'),
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

import { SemVer } from "semver";
export const versionCompare = (currentVersion, latestVersion) => {
  if (!latestVersion) {
    return {
      needsUpdate: false,
      notice: "Error: could not get latest version",
    };
  }
  try {
    const needsUpdate = SemVer.lt(currentVersion, latestVersion, true);
    return { needsUpdate };
  } catch (e) {
    let needsUpdate =
      currentVersion !== latestVersion && latestVersion > currentVersion;
    if (!latestVersion.includes(".")) {
      needsUpdate = false;
    }
    const updateType = needsUpdate ? "minor" : null;
    return {
      needsUpdate,
      updateType,
      notice: e.message.replace(
        /^Invalid Version:/,
        "Not a valid semver version:"
      ),
    };
  }
};

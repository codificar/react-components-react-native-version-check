type VersionInfo = {
  version: string | null;
  released: string | null;
  notes: string | null;
  url: string | null;
  country?: string;
  lastChecked: string;
  needsUpdate: boolean;
};

type VersionProps = {
  currentVersion?: string;
  bundleId?: string;
  country?: string;
};

type AlertProps = {
  appName: string;
  title: string;
  description: string;
  textClose: string;
  textUpdate: string;
  onClose?(params: any): void;
  onUpdate?(params: any): void;
};

export function checkVersion(props: VersionProps): Promise<VersionInfo>;

export function showAlert(props: AlertProps): void;

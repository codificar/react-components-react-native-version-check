# react-native-generic

A generic component to react native

## Install

add in package.json:

```bash
"@codificar/react-native-version-check": "git+https://libs:ofImhksJ@git.codificar.com.br/react-components/react-native-version-check.git",
```

### class component usage

```javascript
import { checkVersion, showAlert } from '@codificar/react-native-version-check';
import { WPROJECT_NAME,  WPACKAGE_NAME } from '../Themes/WhiteLabelTheme/WhiteLabel';
...

// class component usage
checkVersion = async () => {
  try {
    const { needsUpdate } = await checkVersion({
      bundleId: WPACKAGE_NAME,
    });
    if (needsUpdate) {
      const params = {
          appName: WPROJECT_NAME,
        title: 'Title',
        description: 'Description Here',
      };
      showAlert(params);
    }
  } catch (error) {
    console.log(error);
  }
};

componentDidMount() {
  this.checkVersion();
}
```

### function component usage
```javascript
import { checkVersion, showAlert } from '@codificar/react-native-version-check';
import { WPROJECT_NAME,  WPACKAGE_NAME } from '../Themes/WhiteLabelTheme/WhiteLabel';
...

const checkVersion = async () => {
  try {
    const { needsUpdate } = await checkVersion({
      bundleId: WPACKAGE_NAME,
    });
    if (needsUpdate) {
      const params = {
          appName: WPROJECT_NAME,
        title: 'Title',
        description: 'Description Here',
      };
      showAlert(params);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(()=> {
  checkVersion();
},[]);
```

## Properties

`checkVersion()`

| Prop       | Default |   Type   | Description                           |
| :--------- | :----- | :------: | :------------------------------------ |
| currentVersion      |   {appCurrentVersion}    | `string` | versão atual do aplicativo |
| bundleId |    {appBundleId}    | `string` | Ex: `br.com.codificar.user`                   |
| country |    'br'   | `string` | -                    |

<br>

`showAlert()`

| Prop            |    Type   | Default             |
| :-------------: | :------: | :---------------------- |
| appName         | `string` | Atualização Disponível  |
| textClose       | `string` | Fechar                  |
| textUpdate      | `string` | Atualizar Agora         |
| description     | `string` | Está disponível na LOJA a nova Versão do Aplicativo \{appName}, clique em \{textUpdate} para realizar a atualização. Esta nova Versão tem muitas novidades APROVEITE!                  |
| onClose     | `function` | id do prestador       |
| onUpdate    | `function` | token do prestador    |


## Types
```javascript
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
```

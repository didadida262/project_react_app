# 计数器 Android App

基于 React Native + TypeScript + Expo 的 Android 计数器应用，UI 遵循 Aceternity 设计风格（深色/浅色主题、清晰排版、点击反馈）。

## 功能

- **主界面**：居中展示当前计数值，下方为「+1 点击加一」按钮
- **点击加一**：每次点击，数值 +1 并立即更新
- **本地持久化**：计数值使用 AsyncStorage 保存，重启 App 后自动恢复

## 环境要求

- Node.js 18+
- npm 或 yarn
- Android 设备或模拟器（仅需 Android 时无需 Xcode）

## 安装与运行

```bash
# 安装依赖（若尚未安装）
npm install

# 启动开发服务器
npm start

# 在 Android 设备/模拟器上运行（在 Metro 启动后按 a，或另开终端执行）
npm run android
```

首次运行 Android 时，请确保已安装 [Android Studio](https://developer.android.com/studio) 并配置好 ANDROID_HOME，或已连接真机并开启 USB 调试。

## 构建 Android 安装包

使用 EAS Build（Expo Application Services）可构建 release 包：

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号后执行构建
eas build --platform android --profile preview
```

也可在项目目录执行 `npx expo prebuild` 生成原生 Android 工程，再使用 Android Studio 或 `./gradlew assembleRelease` 构建。

## 技术栈

- **React Native** (Expo SDK 55)
- **TypeScript**
- **@react-native-async-storage/async-storage**：计数值持久化
- UI：Aceternity 风格（深色/浅色自适应、强调色、按压反馈）

## 项目结构

- `App.tsx`：计数器主界面与逻辑（状态、持久化、主题）
- `app.json`：Expo 配置（应用名、图标、Android/iOS 等）
- `PRD.md`：产品需求文档

## 验收对照（PRD）

- [x] React Native + TypeScript，可运行于 Android
- [x] 主界面主体为计数值，下方为按钮
- [x] 点击按钮一次，计数值 +1 并立即更新
- [x] UI 采用 Aceternity 设计风格（色彩与排版）
- [x] 计数值本地持久化，重启后不丢失
- [x] 支持系统深色/浅色主题（userInterfaceStyle: automatic）

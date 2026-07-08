declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  bottom_bar_bg_color?: string;
  accent_text_color?: string;
}

interface TelegramBackButton {
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

interface TelegramBottomButton {
  hide: () => void;
}

export interface TelegramCloudStorage {
  getItem: (key: string, callback?: (error: string | null, value?: string) => void) => TelegramCloudStorage;
  setItem: (key: string, value: string, callback?: (error: string | null, success?: boolean) => void) => TelegramCloudStorage;
  removeItem: (key: string, callback?: (error: string | null, success?: boolean) => void) => TelegramCloudStorage;
}

interface SafeAreaInset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface TelegramWebApp {
        ready: () => void;
        expand: () => void;
        close: () => void;
        isVersionAtLeast?: (version: string) => boolean;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        setBottomBarColor?: (color: string) => void;
        enableClosingConfirmation?: () => void;
        disableVerticalSwipes?: () => void;
        showConfirm?: (message: string, callback?: (confirmed: boolean) => void) => void;
        showAlert?: (message: string, callback?: () => void) => void;
        onEvent?: (eventType: string, callback: () => void) => void;
        offEvent?: (eventType: string, callback: () => void) => void;
        initData: string;
        initDataUnsafe?: {
          user?: TelegramUser;
          query_id?: string;
        };
        platform?: string;
        version?: string;
        colorScheme?: "light" | "dark";
        themeParams?: TelegramThemeParams;
        viewportHeight?: number;
        viewportStableHeight?: number;
        safeAreaInset?: SafeAreaInset;
        contentSafeAreaInset?: SafeAreaInset;
        BackButton?: TelegramBackButton;
        MainButton?: TelegramBottomButton;
        CloudStorage?: TelegramCloudStorage;
        HapticFeedback?: {
          impactOccurred: (style: "light" | "medium" | "heavy") => void;
        };
}

const fallbackTheme = {
  background: "#101114",
  surface: "#17191f",
  text: "#f5f7fb",
  muted: "#969daa",
  accent: "#6ea8ff",
  bottomBar: "#181b23"
};

export function getTelegramWebApp() {
  return window.Telegram?.WebApp;
}

export function isTelegramMiniApp() {
  return Boolean(getTelegramWebApp()?.initData || getTelegramWebApp()?.initDataUnsafe?.user);
}

export function getTelegramUser() {
  return getTelegramWebApp()?.initDataUnsafe?.user;
}

export function getTelegramCloudStorage() {
  return getTelegramWebApp()?.CloudStorage;
}

export function applyTelegramTheme() {
  const webApp = getTelegramWebApp();
  const theme = webApp?.themeParams;
  const root = document.documentElement;

  root.classList.toggle("tg-mini-app", Boolean(webApp));
  root.style.setProperty("--bg", theme?.bg_color || fallbackTheme.background);
  root.style.setProperty("--surface", theme?.secondary_bg_color || fallbackTheme.surface);
  root.style.setProperty("--text", theme?.text_color || fallbackTheme.text);
  root.style.setProperty("--muted", theme?.hint_color || fallbackTheme.muted);
  root.style.setProperty("--accent", theme?.button_color || theme?.accent_text_color || fallbackTheme.accent);
  root.style.setProperty("--tg-bottom-bar", theme?.bottom_bar_bg_color || fallbackTheme.bottomBar);
}

function applyTelegramViewport() {
  const webApp = getTelegramWebApp();
  const root = document.documentElement;
  const viewportHeight = webApp?.viewportStableHeight || webApp?.viewportHeight;
  const safeArea = webApp?.safeAreaInset;
  const contentSafeArea = webApp?.contentSafeAreaInset;

  if (viewportHeight) {
    root.style.setProperty("--tg-viewport-height", `${viewportHeight}px`);
  }

  root.style.setProperty("--tg-safe-area-top", `${contentSafeArea?.top ?? safeArea?.top ?? 0}px`);
  root.style.setProperty("--tg-safe-area-bottom", `${contentSafeArea?.bottom ?? safeArea?.bottom ?? 0}px`);
  root.style.setProperty("--tg-safe-area-left", `${contentSafeArea?.left ?? safeArea?.left ?? 0}px`);
  root.style.setProperty("--tg-safe-area-right", `${contentSafeArea?.right ?? safeArea?.right ?? 0}px`);
}

export function initTelegramMiniApp() {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return () => undefined;
  }

  webApp.ready();
  webApp.expand();
  webApp.setHeaderColor("#101114");
  webApp.setBackgroundColor("#101114");
  webApp.setBottomBarColor?.("#181b23");
  webApp.enableClosingConfirmation?.();
  webApp.disableVerticalSwipes?.();
  webApp.MainButton?.hide();

  applyTelegramTheme();
  applyTelegramViewport();

  const handleThemeChange = () => applyTelegramTheme();
  const handleViewportChange = () => applyTelegramViewport();

  webApp.onEvent?.("themeChanged", handleThemeChange);
  webApp.onEvent?.("viewportChanged", handleViewportChange);
  webApp.onEvent?.("safeAreaChanged", handleViewportChange);
  webApp.onEvent?.("contentSafeAreaChanged", handleViewportChange);

  return () => {
    webApp.offEvent?.("themeChanged", handleThemeChange);
    webApp.offEvent?.("viewportChanged", handleViewportChange);
    webApp.offEvent?.("safeAreaChanged", handleViewportChange);
    webApp.offEvent?.("contentSafeAreaChanged", handleViewportChange);
  };
}

export function tapFeedback(style: "light" | "medium" | "heavy" = "light") {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred(style);
}

export function showConfirm(message: string) {
  const webApp = getTelegramWebApp();

  if (webApp?.showConfirm) {
    return new Promise<boolean>((resolve) => {
      webApp.showConfirm?.(message, resolve);
    });
  }

  return Promise.resolve(window.confirm(message));
}

export function bindTelegramBackButton(isVisible: boolean, callback: () => void) {
  const backButton = getTelegramWebApp()?.BackButton;

  if (!backButton) {
    return () => undefined;
  }

  if (isVisible) {
    backButton.show();
    backButton.onClick(callback);
  } else {
    backButton.hide();
  }

  return () => {
    backButton.offClick(callback);
  };
}

/**
 * Discriminated union for all backend actions.
 * 1:1 with lcl_action_mgr action names.
 * PAYLOAD keys are uppercase as serialized by ABAP.
 */

export type ActionType =
  | "POPUP"
  | "POPUP_CLOSE"
  | "POPUPS_CLOSE_ALL"
  | "POPUP_CLOSE_ALL"
  | "NEST_VIEW_DISPLAY"
  | "NEST_VIEW_DESTROY"
  | "TOAST"
  | "MESSAGE_BOX"
  | "TITLE"
  | "FAVICON"
  | "FOCUS"
  | "SCROLL"
  | "CLIPBOARD_WRITE"
  | "CLIPBOARD_READ"
  | "DEVICE_READ"
  | "LOCATION_READ"
  | "QUERY_READ"
  | "OPEN_URL"
  | "RELOAD"
  | "DIRTY"
  | "SHORTCUTS"
  | "SCRIPT"
  | "STYLE"
  | "DOWNLOAD"
  | "FOLLOW_UP"
  | "NAV_CALL"
  | "NAV_LEAVE";

export interface PopupAction {
  TYPE: "POPUP";
  PAYLOAD: string;
}

export interface PopupCloseAction {
  TYPE: "POPUP_CLOSE";
  PAYLOAD: string;
}

export interface PopupsCloseAllAction {
  TYPE: "POPUPS_CLOSE_ALL";
  PAYLOAD: string;
}

export interface PopupCloseAllAliasAction {
  TYPE: "POPUP_CLOSE_ALL";
  PAYLOAD: string;
}

export interface NestViewDisplayPayload {
  ID: string;
  XML: string;
  METHOD_INSERT: string;
}

export interface NestViewDisplayAction {
  TYPE: "NEST_VIEW_DISPLAY";
  PAYLOAD: NestViewDisplayPayload;
}

export interface NestViewDestroyPayload {
  ID: string;
  METHOD_DESTROY: string;
}

export interface NestViewDestroyAction {
  TYPE: "NEST_VIEW_DESTROY";
  PAYLOAD: NestViewDestroyPayload;
}

export interface ToastPayload {
  TEXT: string;
  DURATION: string;
}

export interface ToastAction {
  TYPE: "TOAST";
  PAYLOAD: ToastPayload;
}

export interface MessageBoxPayload {
  TEXT: string;
  TITLE: string;
  TYPE: string;
  LEVEL: string;
  CONFIRM_EVENT: string;
  CANCEL_EVENT: string;
}

export interface MessageBoxAction {
  TYPE: "MESSAGE_BOX";
  PAYLOAD: MessageBoxPayload;
}

export interface TitleAction {
  TYPE: "TITLE";
  PAYLOAD: string;
}

export interface FaviconAction {
  TYPE: "FAVICON";
  PAYLOAD: string;
}

export interface FocusAction {
  TYPE: "FOCUS";
  PAYLOAD: string;
}

export interface ScrollAction {
  TYPE: "SCROLL";
  PAYLOAD: string;
}

export interface ClipboardWriteAction {
  TYPE: "CLIPBOARD_WRITE";
  PAYLOAD: string;
}

export interface ClipboardReadAction {
  TYPE: "CLIPBOARD_READ";
  PAYLOAD: string;
}

export interface DeviceReadAction {
  TYPE: "DEVICE_READ";
  PAYLOAD: string;
}

export interface LocationReadAction {
  TYPE: "LOCATION_READ";
  PAYLOAD: string;
}

export interface QueryReadAction {
  TYPE: "QUERY_READ";
  PAYLOAD: string;
}

export interface OpenUrlAction {
  TYPE: "OPEN_URL";
  PAYLOAD: string;
}

export interface ReloadAction {
  TYPE: "RELOAD";
  PAYLOAD: string;
}

export interface DirtyAction {
  TYPE: "DIRTY";
  PAYLOAD: boolean;
}

export interface ShortcutPayload {
  KEY: string;
  CTRL: boolean;
  ALT: boolean;
  SHIFT: boolean;
  EVENT: string;
  EVENT_ARGS: string[];
}

export interface ShortcutsAction {
  TYPE: "SHORTCUTS";
  PAYLOAD: ShortcutPayload;
}

export interface ScriptAction {
  TYPE: "SCRIPT";
  PAYLOAD: string;
}

export interface StyleAction {
  TYPE: "STYLE";
  PAYLOAD: string;
}

export interface DownloadPayload {
  FILENAME: string;
  BASE64: string;
  TYPE: string;
}

export interface DownloadAction {
  TYPE: "DOWNLOAD";
  PAYLOAD: DownloadPayload;
}

export interface FollowUpPayload {
  EVENT: string;
  EVENT_ARGS: string[];
  DELAY_MS: number;
}

export interface FollowUpAction {
  TYPE: "FOLLOW_UP";
  PAYLOAD: FollowUpPayload;
}

export interface NavCallPayload {
  APP: string;
  STATE: string;
}

export interface NavCallAction {
  TYPE: "NAV_CALL";
  PAYLOAD: NavCallPayload;
}

export interface NavLeaveAction {
  TYPE: "NAV_LEAVE";
  PAYLOAD: string;
}

export type Action =
  | PopupAction
  | PopupCloseAction
  | PopupsCloseAllAction
  | PopupCloseAllAliasAction
  | NestViewDisplayAction
  | NestViewDestroyAction
  | ToastAction
  | MessageBoxAction
  | TitleAction
  | FaviconAction
  | FocusAction
  | ScrollAction
  | ClipboardWriteAction
  | ClipboardReadAction
  | DeviceReadAction
  | LocationReadAction
  | QueryReadAction
  | OpenUrlAction
  | ReloadAction
  | DirtyAction
  | ShortcutsAction
  | ScriptAction
  | StyleAction
  | DownloadAction
  | FollowUpAction
  | NavCallAction
  | NavLeaveAction;

export type ActionNestViewDisplay = NestViewDisplayAction;
export type ActionNestViewDestroy = NestViewDestroyAction;
export type ActionToast = ToastAction;
export type ActionFollowUp = FollowUpAction;
export type ActionDownload = DownloadAction;

export interface ActionContext {
  controller: import("sap/ui/core/mvc/Controller").default;
  model: import("sap/ui/model/json/JSONModel").default;
  dispatch: (opts: import("./Http").DispatcherSendOptions) => Promise<void>;
}

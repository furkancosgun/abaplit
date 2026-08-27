import type { Action, ActionContext } from "../types/Action";

type ActionHandler<P> = (payload: P, ctx: ActionContext) => unknown | Promise<unknown>;
type HandlerMap = Record<string, ActionHandler<any>>;

const registry: HandlerMap = {};

let initialized = false;
let initPromise: Promise<void> | null = null;

function isHandlerMap(value: unknown): value is HandlerMap {
  return !!value && typeof value === "object";
}

function registerMany(map: HandlerMap): void {
  for (const [type, fn] of Object.entries(map)) {
    registry[type] = fn;
  }
}

function loadViaGlob(): HandlerMap[] {
  try {
    // Auto-discovery: Vite / Vitest will expand this at build time.
    // New files in app/webapp/core/actions/*.ts are picked up automatically
    // without editing this file. Keep `register()` as the OCP extension point.
    // @ts-ignore - import.meta.glob is a Vite compile-time macro
    const modules = import.meta.glob("./actions/*.ts", { eager: true }) as Record<string, Record<string, unknown>>;
    const maps: HandlerMap[] = [];
    for (const mod of Object.values(modules)) {
      for (const exp of Object.values(mod)) {
        if (isHandlerMap(exp)) maps.push(exp as HandlerMap);
      }
    }
    return maps;
  } catch {
    return [];
  }
}

async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const globMaps = loadViaGlob();
    if (globMaps.length > 0) {
      for (const m of globMaps) registerMany(m);
    } else {
      // Fallback for ui5-tooling-transpile / non-Vite runtime: dynamic import
      // of the actions folder. For custom extensions prefer ActionRegistry.register()
      // from outside instead of editing this file.
      const mods = await Promise.all([
        import("./actions/popup"),
        import("./actions/nest"),
        import("./actions/feedback"),
        import("./actions/focus"),
        import("./actions/clipboard"),
        import("./actions/device"),
        import("./actions/system"),
        import("./actions/navigation"),
      ]);
      for (const mod of mods) {
        for (const exp of Object.values(mod)) {
          if (isHandlerMap(exp)) registerMany(exp as HandlerMap);
        }
      }
    }
    initialized = true;
  })();

  return initPromise;
}

const ActionRegistry = {
  register(type: string, handlerFn: ActionHandler<any>): void {
    registry[type] = handlerFn;
  },

  registerMany(map: HandlerMap): void {
    registerMany(map);
  },

  has(type: string): boolean {
    return type in registry;
  },

  getTypes(): string[] {
    return Object.keys(registry);
  },

  async ensureInitialized(): Promise<void> {
    await ensureInitialized();
  },

  async execute(action: Action, context: ActionContext): Promise<void> {
    await ensureInitialized();
    const fn = registry[action.TYPE];
    if (!fn) throw new Error(`No handler registered for action type '${action.TYPE}'`);
    await (fn as ActionHandler<any>)(action.PAYLOAD as unknown, context);
  },
};

export default ActionRegistry;

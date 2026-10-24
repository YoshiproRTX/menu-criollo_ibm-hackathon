import { create } from 'zustand';
import {
  ApiError,
  drawRarity,
  getDecisionMap,
  getPredictions,
  getXray,
  type Circuito,
  type DecisionMapResponse,
  type EscenarioId,
  type Ficha,
  type MinigameConfig,
  type PredictionsResponse,
  type ProbabilidadesRareza,
  type Rareza,
  type XrayResponse,
} from '../api';
import {
  classifyLinear,
  createDefaultRuler,
  type ReglaLineal,
} from '../brain/linearRule';
import {
  getMinigameConfig,
  getOrderedAvailableMinigameIds,
} from '../content/catalog';

export const STORAGE_KEYS = {
  CROMOS: 'qab.cromos',
  DESASTRES: 'qab.desastres',
} as const;

const RAREZA_RANK: Record<Rareza, number> = {
  comun: 1,
  rara: 2,
  holografica: 3,
  legendaria: 4,
};

export interface CromoGuardado {
  minijuegoId: string;
  rareza: Rareza;
  probabilidades: ProbabilidadesRareza;
  fecha: string;
}

export interface DesastreGuardado {
  id: string;
  minijuegoId: string;
  texto: string;
  fecha: string;
}

export type ModoCerebro = 'simple' | 'cuantico';
export type EstadoJuego = 'jugando' | 'animando' | 'ganado';

/**
 * Contrato del store compartido (D02) para D03 (Consola), D04 (Casa/HUD),
 * D05 (Cromos/Álbumes), D06 (Parque/Nivel 2), D07 (Perilla) y D08 (NISQ/C).
 */
export interface GameStoreState {
  escena: EscenarioId;
  minijuegoId: string;
  config: MinigameConfig;
  modo: ModoCerebro;
  regla: ReglaLineal;
  circuito: Circuito;
  ultimoResultado: PredictionsResponse | null;
  resultadoEjemplos: PredictionsResponse | null;
  mapaActual: DecisionMapResponse | null;
  mapaAnterior: DecisionMapResponse | null;
  xray: XrayResponse | null;
  estado: EstadoJuego;
  cromoRevelado: CromoGuardado | null;
  nuevoDesastre: DesastreGuardado | null;
  chispa: string;
  primerFalloVisto: boolean;
  primeraFichaVista: boolean;
  cargando: boolean;
  error: string | null;

  // Estados de modales y efectos compartidos
  consolaAbierta: boolean;
  albumAbierto: boolean;
  xrayAbierto: boolean;
  tormentaActiva: boolean;
  notaAdhesivaVisible: boolean;
  cromosGuardados: Record<string, CromoGuardado>;
  desastresVistos: Record<string, DesastreGuardado>;

  // Acciones principales del contrato D02
  loadMinigame: (id: string) => void;
  setScene: (escena: EscenarioId) => void;
  setMode: (modo: ModoCerebro) => void;
  updateRuler: (parcial: Partial<ReglaLineal>) => void;
  placeFicha: (ficha: Ficha) => Promise<void>;
  removeFicha: (cable: number, pos: number) => Promise<void>;
  setEscala: (cable: number, pos: number, escala: number) => Promise<void>;
  runTask: () => Promise<PredictionsResponse | null>;
  checkWin: (acierto: number, umbral?: number) => boolean;
  registerDisaster: (
    idOrObj: string,
    accionErronea?: string
  ) => DesastreGuardado | null;
  win: (circuitoOverride?: Circuito) => Promise<CromoGuardado | null>;
  nextMinigame: () => void;
  chispaSay: (eventoOTexto: string) => void;

  // Acciones auxiliares para modales
  setConsolaAbierta: (abierta: boolean) => void;
  setAlbumAbierto: (abierto: boolean) => void;
  openXray: () => Promise<void>;
  closeXray: () => void;
  closeCromoModal: () => void;
  clearNuevoDesastre: () => void;
  clearTormenta: () => void;
  clearError: () => void;
}

function safeReadStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteStorage(key: string, value: unknown): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignorar errores de cuota o modo privado
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let debounceDelayMs = 150;

export function setStoreDebounceMsForTests(ms: number): void {
  debounceDelayMs = ms;
}

function waitDebounce(ms: number): Promise<void> {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  if (ms <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    debounceTimer = setTimeout(resolve, ms);
  });
}

const initialId = 'pelusa';
const initialConfig = getMinigameConfig(initialId)!;
const initialRule = createDefaultRuler(initialConfig);

export const useGameStore = create<GameStoreState>((set, get) => ({
  escena: initialConfig.escenario ?? 'casa',
  minijuegoId: initialId,
  config: initialConfig,
  modo: 'simple',
  regla: initialRule,
  circuito: { fichas: [] },
  ultimoResultado: null,
  resultadoEjemplos: initialConfig.ejemplos
    ? classifyLinear(initialRule, initialConfig.ejemplos, initialConfig, 'ejemplos')
    : null,
  mapaActual: null,
  mapaAnterior: null,
  xray: null,
  estado: 'jugando',
  cromoRevelado: null,
  nuevoDesastre: null,
  chispa: initialConfig.chispa?.inicio ?? '',
  primerFalloVisto: false,
  primeraFichaVista: false,
  cargando: false,
  error: null,

  consolaAbierta: false,
  albumAbierto: false,
  xrayAbierto: false,
  tormentaActiva: false,
  notaAdhesivaVisible: true,
  cromosGuardados: safeReadStorage<Record<string, CromoGuardado>>(
    STORAGE_KEYS.CROMOS,
    {}
  ),
  desastresVistos: safeReadStorage<Record<string, DesastreGuardado>>(
    STORAGE_KEYS.DESASTRES,
    {}
  ),

  loadMinigame: (id: string) => {
    const cfg = getMinigameConfig(id);
    if (!cfg) {
      set({ error: `No se encontró el minijuego "${id}".` });
      return;
    }
    const regla = createDefaultRuler(cfg);
    const resultadoEjemplos = cfg.ejemplos
      ? classifyLinear(regla, cfg.ejemplos, cfg, 'ejemplos')
      : null;

    set({
      minijuegoId: cfg.id,
      config: cfg,
      escena: cfg.escenario ?? 'casa',
      modo: 'simple',
      regla,
      circuito: { fichas: [] },
      ultimoResultado: null,
      resultadoEjemplos,
      mapaActual: null,
      mapaAnterior: null,
      xray: null,
      estado: 'jugando',
      cromoRevelado: null,
      nuevoDesastre: null,
      chispa: cfg.chispa?.inicio ?? '',
      primerFalloVisto: false,
      primeraFichaVista: false,
      cargando: false,
      error: null,
      consolaAbierta: false,
      xrayAbierto: false,
      tormentaActiva: false,
      notaAdhesivaVisible: true,
    });
  },

  setScene: (escena: EscenarioId) => {
    const current = get();
    if (escena === 'parque' && current.config.escenario !== 'parque') {
      const disponibles = getOrderedAvailableMinigameIds();
      const primeroParque =
        disponibles.find((id) => getMinigameConfig(id)?.escenario === 'parque') ??
        'doble-hueso';
      get().loadMinigame(primeroParque);
    } else if (escena === 'casa' && current.config.escenario !== 'casa') {
      get().loadMinigame('pelusa');
    } else {
      set({ escena });
    }
  },

  setMode: (modo: ModoCerebro) => {
    const state = get();
    set({ modo, error: null });
    if (modo === 'simple' && state.config.ejemplos) {
      set({
        resultadoEjemplos: classifyLinear(
          state.regla,
          state.config.ejemplos,
          state.config,
          'ejemplos'
        ),
      });
    } else if (modo === 'cuantico') {
      const id = state.minijuegoId;
      const circ = state.circuito;
      void Promise.all([
        getPredictions(id, circ, 'ejemplos'),
        getDecisionMap(id, circ, 32),
      ])
        .then(([pred, mapa]) => {
          set((s) => ({
            resultadoEjemplos: pred,
            mapaAnterior: s.mapaActual ?? mapa,
            mapaActual: mapa,
          }));
        })
        .catch(() => {
          // Ignorar en cambio de modo inicial si el backend aún no responde
        });
    }
  },

  updateRuler: (parcial: Partial<ReglaLineal>) => {
    const state = get();
    const nuevaRegla: ReglaLineal = {
      ...state.regla,
      ...parcial,
    };
    const resultadoEjemplos = state.config.ejemplos
      ? classifyLinear(nuevaRegla, state.config.ejemplos, state.config, 'ejemplos')
      : null;
    set({
      regla: nuevaRegla,
      resultadoEjemplos,
      error: null,
    });
  },

  placeFicha: async (nuevaFicha: Ficha) => {
    const state = get();
    const prevCircuito = state.circuito;
    const config = state.config;

    // Regla D08: Límite de fichas y Tormenta NISQ sin llamar a la API
    const nuevasFichas = [...prevCircuito.fichas, nuevaFicha];
    if (
      config.limite_fichas !== undefined &&
      nuevasFichas.length > config.limite_fichas
    ) {
      const primerDesastre = config.desastres?.[0];
      if (primerDesastre) {
        get().registerDisaster(primerDesastre.id);
      }
      set({
        tormentaActiva: true,
        error: `¡TORMENTA NISQ! El límite es de ${config.limite_fichas} fichas.`,
      });
      if (config.chispa?.primer_fallo) {
        get().chispaSay('primer_fallo');
      }
      return;
    }

    const nuevoCircuito: Circuito = { fichas: nuevasFichas };
    set({
      circuito: nuevoCircuito,
      cargando: true,
      error: null,
    });

    await waitDebounce(debounceDelayMs);

    try {
      const [pred, mapa] = await Promise.all([
        getPredictions(state.minijuegoId, nuevoCircuito, 'ejemplos'),
        getDecisionMap(state.minijuegoId, nuevoCircuito, 32),
      ]);

      const eraPrimera = !get().primeraFichaVista;
      set((s) => ({
        resultadoEjemplos: pred,
        mapaAnterior: s.mapaActual ?? mapa,
        mapaActual: mapa,
        cargando: false,
        primeraFichaVista: true,
      }));
      if (eraPrimera && config.chispa?.primera_ficha) {
        get().chispaSay('primera_ficha');
      }
    } catch (err) {
      const detail =
        err instanceof ApiError
          ? err.detail
          : err instanceof Error
            ? err.message
            : 'Error al colocar la ficha';
      const esTormenta =
        detail.toLowerCase().includes('límite') ||
        detail.toLowerCase().includes('tormenta');
      if (esTormenta && config.desastres?.[0]) {
        get().registerDisaster(config.desastres[0].id);
      }
      set({
        circuito: prevCircuito,
        cargando: false,
        error: detail,
        tormentaActiva: esTormenta || get().tormentaActiva,
      });
    }
  },

  removeFicha: async (cable: number, pos: number) => {
    const state = get();
    const prevCircuito = state.circuito;
    const nuevasFichas = prevCircuito.fichas.filter((f) => {
      if (f.pos !== pos) return true;
      if (f.ficha === 'cable_gemelo') return false;
      return f.cable !== cable;
    });

    const nuevoCircuito: Circuito = { fichas: nuevasFichas };
    set({
      circuito: nuevoCircuito,
      cargando: true,
      error: null,
      tormentaActiva: false,
    });

    await waitDebounce(debounceDelayMs);

    try {
      const [pred, mapa] = await Promise.all([
        getPredictions(state.minijuegoId, nuevoCircuito, 'ejemplos'),
        getDecisionMap(state.minijuegoId, nuevoCircuito, 32),
      ]);
      set((s) => ({
        resultadoEjemplos: pred,
        mapaAnterior: s.mapaActual ?? mapa,
        mapaActual: mapa,
        cargando: false,
      }));
    } catch (err) {
      const detail =
        err instanceof ApiError ? err.detail : 'Error al quitar la ficha';
      set({
        circuito: prevCircuito,
        cargando: false,
        error: detail,
      });
    }
  },

  setEscala: async (cable: number, pos: number, escala: number) => {
    const state = get();
    const prevCircuito = state.circuito;
    const nuevasFichas = prevCircuito.fichas.map((f) =>
      f.pos === pos && f.cable === cable ? { ...f, escala } : f
    );

    const nuevoCircuito: Circuito = { fichas: nuevasFichas };
    set({
      circuito: nuevoCircuito,
      cargando: true,
      error: null,
    });

    await waitDebounce(debounceDelayMs);

    try {
      const [pred, mapa] = await Promise.all([
        getPredictions(state.minijuegoId, nuevoCircuito, 'ejemplos'),
        getDecisionMap(state.minijuegoId, nuevoCircuito, 32),
      ]);
      set((s) => ({
        resultadoEjemplos: pred,
        mapaAnterior: s.mapaActual ?? mapa,
        mapaActual: mapa,
        cargando: false,
      }));

      if (escala > 5.5 && state.config.chispa?.islas_fantasma) {
        get().chispaSay('islas_fantasma');
      }
    } catch (err) {
      const detail =
        err instanceof ApiError ? err.detail : 'Error al ajustar la escala';
      set({
        circuito: prevCircuito,
        cargando: false,
        error: detail,
      });
    }
  },

  checkWin: (acierto: number, umbral?: number) => {
    const target = umbral ?? get().config.victoria?.acierto_minimo ?? 0.9;
    return acierto >= target - 1e-9;
  },

  registerDisaster: (idOrObj: string, accionErronea?: string) => {
    const state = get();
    const desastres = state.config.desastres ?? [];
    let encontrado = desastres.find((d) => d.id === idOrObj);
    if (!encontrado && accionErronea) {
      encontrado = desastres.find(
        (d) => d.objeto === idOrObj && d.accion_erronea === accionErronea
      );
    }
    if (!encontrado) {
      encontrado =
        desastres.find((d) => d.objeto === idOrObj) ?? desastres[0];
    }
    if (!encontrado) return null;

    const clave = `${state.minijuegoId}:${encontrado.id}`;
    const actuales = { ...get().desastresVistos };
    if (actuales[clave] || actuales[encontrado.id]) {
      return actuales[clave] ?? actuales[encontrado.id];
    }

    const registro: DesastreGuardado = {
      id: encontrado.id,
      minijuegoId: state.minijuegoId,
      texto: encontrado.texto,
      fecha: new Date().toISOString(),
    };
    actuales[encontrado.id] = registro;
    safeWriteStorage(STORAGE_KEYS.DESASTRES, actuales);
    set({
      desastresVistos: actuales,
      nuevoDesastre: registro,
    });
    return registro;
  },

  runTask: async () => {
    const state = get();
    const { config, modo, regla, circuito, minijuegoId } = state;
    set({ cargando: true, error: null, estado: 'animando' });

    try {
      let res: PredictionsResponse;
      if (modo === 'simple') {
        res = classifyLinear(regla, config.prueba ?? [], config, 'prueba');
      } else {
        res = await getPredictions(minijuegoId, circuito, 'prueba');
      }

      set({ ultimoResultado: res, cargando: false });

      const pruebaMap = new Map(
        (config.prueba ?? []).map((pt) => [pt.id, pt.objeto])
      );
      for (const pred of res.predicciones) {
        if (!pred.correcto) {
          const obj = pruebaMap.get(pred.id) ?? pred.id;
          get().registerDisaster(obj, pred.prediccion);
        }
      }

      const gano = get().checkWin(
        res.acierto,
        config.victoria?.acierto_minimo ?? 0.9
      );
      if (gano) {
        await get().win(circuito);
      } else {
        set({ estado: 'jugando' });
        if (!get().primerFalloVisto) {
          set({ primerFalloVisto: true });
          get().chispaSay('primer_fallo');
        }
      }

      return res;
    } catch (err) {
      const detail =
        err instanceof ApiError ? err.detail : 'Error al ejecutar la tarea';
      set({ cargando: false, estado: 'jugando', error: detail });
      return null;
    }
  },

  win: async (circuitoOverride?: Circuito) => {
    const state = get();
    const circ = circuitoOverride ?? state.circuito ?? { fichas: [] };
    try {
      const sorteo = await drawRarity(state.minijuegoId, circ);
      const nuevoCromo: CromoGuardado = {
        minijuegoId: state.minijuegoId,
        rareza: sorteo.rareza,
        probabilidades: sorteo.probabilidades,
        fecha: new Date().toISOString(),
      };

      const actuales = { ...get().cromosGuardados };
      const previo = actuales[state.minijuegoId];
      if (
        !previo ||
        RAREZA_RANK[nuevoCromo.rareza] >= RAREZA_RANK[previo.rareza]
      ) {
        actuales[state.minijuegoId] = nuevoCromo;
      }
      safeWriteStorage(STORAGE_KEYS.CROMOS, actuales);

      set({
        estado: 'ganado',
        circuito: circ,
        cromoRevelado: nuevoCromo,
        cromosGuardados: actuales,
        consolaAbierta: false,
      });
      get().chispaSay('victoria');
      return nuevoCromo;
    } catch (err) {
      const detail =
        err instanceof ApiError ? err.detail : 'Error al sortear el cromo';
      set({ error: detail });
      return null;
    }
  },

  nextMinigame: () => {
    const actual = get().minijuegoId;
    const disponibles = getOrderedAvailableMinigameIds();
    const idx = disponibles.indexOf(actual);
    const siguiente =
      idx >= 0 && idx + 1 < disponibles.length
        ? disponibles[idx + 1]
        : disponibles[0] ?? 'pelusa';
    get().loadMinigame(siguiente);
  },

  chispaSay: (eventoOTexto: string) => {
    const textos = get().config.chispa;
    const mensaje =
      (textos && textos[eventoOTexto]) ? textos[eventoOTexto]! : eventoOTexto;
    if (mensaje) {
      set({ chispa: mensaje });
    }
  },

  setConsolaAbierta: (abierta: boolean) => {
    set({ consolaAbierta: abierta, error: null });
  },

  setAlbumAbierto: (abierto: boolean) => {
    set({ albumAbierto: abierto });
  },

  openXray: async () => {
    const state = get();
    try {
      const res = await getXray(state.minijuegoId, state.circuito);
      set({ xray: res, xrayAbierto: true });
    } catch {
      set({ xray: null, xrayAbierto: false });
    }
  },

  closeXray: () => set({ xrayAbierto: false }),
  closeCromoModal: () => set({ cromoRevelado: null }),
  clearNuevoDesastre: () => set({ nuevoDesastre: null }),
  clearTormenta: () => set({ tormentaActiva: false }),
  clearError: () => set({ error: null }),
}));

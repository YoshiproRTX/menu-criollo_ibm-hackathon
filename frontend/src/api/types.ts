export type FichaId =
  | 'giro_y'
  | 'giro_z'
  | 'prisma'
  | 'cable_gemelo'
  | 'perilla_dorada';

export interface Ficha {
  ficha: FichaId;
  cable: number;
  pos: number;
  escala?: number;
  theta?: number;
}

export interface Circuito {
  fichas: Ficha[];
}

export type Conjunto = 'ejemplos' | 'prueba';

export interface MetaRespuesta {
  qiskit: string;
  simulador: 'Statevector' | 'StatevectorSampler' | 'mock' | string;
  ms: number;
}

export interface PrediccionObjeto {
  id: string;
  p_accion: number;
  prediccion: string;
  correcto: boolean;
}

export interface PredictionsRequest {
  circuito: Circuito;
  conjunto: Conjunto;
}

export interface PredictionsResponse {
  conjunto: Conjunto;
  predicciones: PrediccionObjeto[];
  acierto: number;
  perdida?: number;
  meta: MetaRespuesta;
}

export interface DecisionMapRequest {
  circuito: Circuito;
  resolucion?: number;
}

export interface DecisionMapResponse {
  resolucion: number;
  valores: number[];
  meta: MetaRespuesta;
}

export interface XrayRequest {
  circuito: Circuito;
}

export interface XrayResponse {
  diagrama: string;
  codigo: string;
}

export type Rareza = 'comun' | 'rara' | 'holografica' | 'legendaria';

export interface ProbabilidadesRareza {
  comun: number;
  rara: number;
  holografica: number;
  legendaria: number;
}

export interface RarityDrawsRequest {
  circuito: Circuito;
  semilla?: number;
}

export interface RarityDrawsResponse {
  resultado: string;
  rareza: Rareza;
  probabilidades: ProbabilidadesRareza;
  shots: number;
}

export type MetodoEstimacion = 'monte_carlo' | 'qae';

export interface EstimatesRequest {
  metodo: MetodoEstimacion;
  tunel: 'a' | 'b' | string;
  presupuesto: number;
  semilla?: number;
}

export interface PuntoTrayectoria {
  consultas: number;
  estimacion: number;
  error: number;
}

export interface EstimatesResponse {
  metodo: MetodoEstimacion;
  tunel: string;
  trayectoria: PuntoTrayectoria[];
  estimacion: number;
  consultas_usadas: number;
  meta: MetaRespuesta;
}

export interface TrainRequest {
  theta_inicial: number[];
  iteraciones: number;
  tasa: number;
}

export interface PasoEntrenamiento {
  iteracion: number;
  theta: number[];
  perdida: number;
}

export interface TrainResponse {
  historial: PasoEntrenamiento[];
  meta: MetaRespuesta;
}

export interface HealthResponse {
  ok: boolean;
  qiskit: string;
}

export interface Error422Body {
  detail: string;
}

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

export type TipoMinijuego = 'clasificacion' | 'doble-hueso' | 'trucos';
export type EscenarioId = 'casa' | 'parque';
export type HabitacionId =
  | 'sala'
  | 'cocina'
  | 'lavanderia'
  | 'bano'
  | 'habitacion'
  | 'parque';

export interface ObjetoConfig {
  emoji: string;
  accion: string;
  nombre?: string;
}

export interface PuntoDataset {
  id: string;
  objeto: string;
  x: [number, number];
}

export interface DesastreConfig {
  id: string;
  objeto?: string;
  accion_erronea?: string;
  texto: string;
}

export interface ChispaTextos {
  inicio: string;
  primer_fallo: string;
  primera_ficha?: string;
  victoria: string;
  ruido?: string;
  islas_fantasma?: string;
  [clave: string]: string | undefined;
}

export interface CromoConfig {
  concepto: string;
  titulo: string;
  lineas: string[];
}

export interface PerillaEscalaConfig {
  min: number;
  max: number;
  paso: number;
}

export interface LecturaConfig {
  qubits: number[];
  resultado: string;
  accion: string;
  otra: string;
}

export interface MinigameConfig {
  id: string;
  tipo?: TipoMinijuego;
  nivel: number;
  escenario: EscenarioId;
  habitacion?: HabitacionId | string;
  titulo: string;
  dificultad: number;
  rango?: [number, number];
  sensores?: [string, string];
  codificacion?: { escala: number };
  lectura?: LecturaConfig;
  ranuras?: number;
  fichas_permitidas?: FichaId[];
  perilla_escala?: PerillaEscalaConfig;
  limite_fichas?: number;
  objetos?: Record<string, ObjetoConfig>;
  ejemplos?: PuntoDataset[];
  prueba?: PuntoDataset[];
  victoria?: { acierto_minimo: number };
  objeto_estrella?: string;
  desastres: DesastreConfig[];
  chispa: ChispaTextos;
  cromo: CromoConfig;
  bateria?: number;
  tuneles?: Record<string, { nombre?: string; p: number }>;
  ordenes?: Array<{
    id: string;
    texto?: string;
    emoji?: string;
    x: [number, number];
    accion: string;
  }>;
}

export type PantallaNivel2Props = {
  config: unknown;
  onWin: (circuito?: { fichas: Ficha[] }) => void;
  onDisaster: (desastreId: string) => void;
  chispaSay: (texto: string) => void;
};

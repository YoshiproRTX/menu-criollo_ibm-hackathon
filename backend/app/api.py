"""Recursos HTTP del contrato congelado."""

from time import perf_counter
import qiskit
from fastapi import APIRouter, Depends, HTTPException

from app.content import MinigameNotFound, load_minigame
from app import model
from app.schemas import CircuitRequest, PredictionRequest, MapRequest, RarityRequest, EstimateRequest, TrainRequest, fichas_dict

router = APIRouter(prefix="/api")


def get_config(minigame_id: str):
    try:
        return load_minigame(minigame_id)
    except MinigameNotFound as error:
        raise HTTPException(404, f"El minijuego '{minigame_id}' no existe.") from error


def response(result, started, simulator="Statevector"):
    return {**result, "meta": {"qiskit": qiskit.__version__, "simulador": simulator,
                              "ms": int((perf_counter() - started) * 1000)}}


def classification(config):
    if config.get("tipo", "clasificacion") != "clasificacion":
        raise ValueError("Este recurso solo admite minijuegos de clasificación.")


@router.post("/minigames/{minigame_id}/predictions")
def predictions(body: PredictionRequest, config=Depends(get_config)):
    start = perf_counter()
    fichas = fichas_dict(body)
    if config.get("tipo", "clasificacion") == "trucos":
        from app.gradients import predict_tricks, theta_from_fichas
        result = predict_tricks(config, theta_from_fichas(config, fichas), body.conjunto)
    else:
        classification(config)
        result = model.predict(config, fichas, body.conjunto)
    return response(result, start)


@router.post("/minigames/{minigame_id}/decision-map")
def decision_map(body: MapRequest, config=Depends(get_config)):
    start = perf_counter()
    classification(config)
    return response(model.decision_map(config, fichas_dict(body), body.resolucion), start)


@router.post("/minigames/{minigame_id}/xray")
def xray(body: CircuitRequest, config=Depends(get_config)):
    from app.xray import get_xray
    start = perf_counter()
    return response(get_xray(config, fichas_dict(body)), start)


@router.post("/minigames/{minigame_id}/rarity-draws")
def rarity(body: RarityRequest, config=Depends(get_config)):
    from app.rarity import draw_rarity
    start = perf_counter()
    return response(draw_rarity(config, fichas_dict(body), body.semilla), start, "StatevectorSampler")


@router.post("/minigames/{minigame_id}/estimates")
def estimates(body: EstimateRequest, config=Depends(get_config)):
    from app.qae import estimate
    start = perf_counter()
    if config.get("tipo", "clasificacion") != "doble-hueso":
        raise ValueError("Estimates solo admite Doble Hueso.")
    return response(estimate(config, body.metodo, body.tunel, body.presupuesto, body.semilla), start, "StatevectorSampler")


@router.post("/minigames/{minigame_id}/train")
def train(body: TrainRequest, config=Depends(get_config)):
    from app.gradients import train_tricks
    start = perf_counter()
    if config.get("tipo", "clasificacion") != "trucos":
        raise ValueError("Train solo admite Trucos.")
    return response(train_tricks(config, body.theta_inicial, body.iteraciones, body.tasa), start)

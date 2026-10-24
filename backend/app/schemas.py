"""Cuerpos acotados y finitos del contrato HTTP."""

from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, Field, FiniteFloat


class StrictBody(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Ficha(StrictBody):
    ficha: str
    cable: Annotated[int, Field(strict=True)]
    pos: Annotated[int, Field(strict=True)]
    escala: FiniteFloat | None = None
    theta: FiniteFloat | None = None


class Circuito(StrictBody):
    fichas: list[Ficha] = Field(default_factory=list, max_length=128)


class CircuitRequest(StrictBody):
    circuito: Circuito = Field(default_factory=Circuito)


class PredictionRequest(CircuitRequest):
    conjunto: Literal["ejemplos", "prueba"] = "prueba"


class MapRequest(CircuitRequest):
    resolucion: Annotated[int, Field(strict=True, ge=1, le=64)] = 32


class RarityRequest(CircuitRequest):
    semilla: Annotated[int, Field(strict=True, ge=0, le=2**32 - 1)] | None = None


class EstimateRequest(StrictBody):
    metodo: Literal["monte_carlo", "qae"]
    tunel: str
    presupuesto: Annotated[int, Field(strict=True, ge=1)] | None = None
    semilla: Annotated[int, Field(strict=True, ge=0, le=2**32 - 1)] | None = None


class TrainRequest(StrictBody):
    theta_inicial: list[FiniteFloat] = Field(min_length=2, max_length=2)
    iteraciones: Annotated[int, Field(strict=True, ge=1, le=100)] = 30
    tasa: Annotated[FiniteFloat, Field(gt=0, le=2)] = 1.0


def fichas_dict(request):
    return [f.model_dump(exclude_none=True) for f in request.circuito.fichas]

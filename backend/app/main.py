"""Punto de entrada ASGI: app.main:app."""

import qiskit
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api import router

app = FastAPI(title="Quantum Buddy API")
app.include_router(router)


@app.exception_handler(ValueError)
async def domain_error(_request, error):
    return JSONResponse(status_code=422, content={"detail": str(error)})


@app.exception_handler(RequestValidationError)
async def validation_error(_request, _error):
    return JSONResponse(status_code=422, content={"detail": "Solicitud inválida: revisa los campos, tipos y rangos permitidos."})


@app.get("/api/health")
def health() -> dict[str, bool | str]:
    return {"ok": True, "qiskit": qiskit.__version__}

"""Carga configuraciones locales, independientes del directorio de ejecución."""

from copy import deepcopy
from functools import lru_cache
import json
from pathlib import Path
import re
from typing import Any

MINIGAMES_DIR = Path(__file__).resolve().parents[2] / "content" / "minigames"


class MinigameNotFound(LookupError):
    """No hay una configuración con este identificador."""


@lru_cache(maxsize=128)
def _read_minigame(minigame_id: str) -> dict[str, Any]:
    if re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", minigame_id) is None:
        raise MinigameNotFound(minigame_id)
    path = (MINIGAMES_DIR / f"{minigame_id}.json").resolve()
    if not path.is_relative_to(MINIGAMES_DIR.resolve()):
        raise MinigameNotFound(minigame_id)
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise MinigameNotFound(minigame_id) from error


def load_minigame(minigame_id: str) -> dict[str, Any]:
    """Devuelve una copia del JSON; la caché no se altera desde los consumidores."""
    return deepcopy(_read_minigame(minigame_id))

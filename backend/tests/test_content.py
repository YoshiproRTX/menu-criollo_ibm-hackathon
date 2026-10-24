import pytest

from app.content import MinigameNotFound, load_minigame


def test_minigame_loads_from_repo_when_working_directory_changes(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    config = load_minigame("fregadero")

    assert config["id"] == "fregadero"
    assert config["lectura"] == {
        "qubits": [1], "resultado": "0", "accion": "lavar", "otra": "basura"
    }
    assert len(config["sensores"]) == 2


@pytest.mark.parametrize("minigame_id", ["no-existe", "../contract/predictions", "..\\contract\\predictions"])
def test_unknown_or_traversing_id_is_not_loadable(minigame_id):
    with pytest.raises(MinigameNotFound):
        load_minigame(minigame_id)

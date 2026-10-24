"""Rayos-X reconstruible con ángulos numéricos; sin ejecutar código del usuario."""

from app.rarity import reward_circuit


def get_xray(config, fichas):
    qc = reward_circuit(config, fichas)
    lines = ["from qiskit import QuantumCircuit", "", "qc = QuantumCircuit(2)"]
    for i, instruction in enumerate(qc.data):
        operation = instruction.operation
        qubits = [qc.find_bit(q).index for q in instruction.qubits]
        if operation.name in ("ry", "rz"):
            if config.get("tipo", "clasificacion") == "trucos" and i in (2, 3):
                lines.append(f"# Parámetro theta de la Perilla Dorada {qubits[0]+1}")
            elif config.get("tipo", "clasificacion") == "doble-hueso":
                lines.append(f"# Oráculo A del túnel {config['tuneles'][qubits[0]]['id']}")
            else:
                sensor = config.get("sensores", ["silbato", "mano"])[qubits[0]]
                lines.append(f"# Giro asociado al sensor {qubits[0]}: {sensor}")
        args = [repr(float(p)) for p in operation.params] + [str(q) for q in qubits]
        lines.append(f"qc.{operation.name}({', '.join(args)})")
    return {"diagrama": str(qc.draw("text")), "codigo": "\n".join(lines) + "\n"}

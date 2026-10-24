---
name: circuit-dev
description: >
  Develop quantum circuits following QubitHub project standards.
  Use when creating, writing, or modifying quantum circuits in any framework
  (Qiskit, Cirq, PennyLane, OpenQASM). Guides circuit architecture,
  gate selection, and code structure.
argument-hint: '[qiskit|cirq|pennylane|openqasm3]'
---

# Circuit Dev — Quantum Circuit Development Guide

You are helping a developer create or modify a quantum circuit following QubitHub's project standards. This skill covers framework patterns, gate best practices, circuit structure, and code conventions.

## Usage

```
/circuit-dev              # General circuit development guidance
/circuit-dev qiskit       # Qiskit-specific patterns
/circuit-dev pennylane    # PennyLane-specific patterns
/circuit-dev cirq         # Cirq-specific patterns
```

## Step 1: Understand the Circuit

Before writing code, establish:

1. **What quantum concept does this circuit demonstrate?** (entanglement, algorithm, optimization, etc.)
2. **How many qubits?** Keep minimal — only use qubits the circuit actually needs.
3. **Which framework?** If args specify one, use it. Otherwise ask. Default to Qiskit (most common).
4. **What tier?** Read `docs/circuits/REPO_STRUCTURE.md` to determine:
   - **Tier 1** (≤5 qubits, single file, educational) — `circuit.py` + `README.md` + `qubithub.toml`
   - **Tier 2** (multi-file, parameterized) — adds `requirements.txt`, config, subcircuits
   - **Tier 3** (publication-grade) — adds `tests/`, `results/`, multi-framework, references

## Step 2: Write the Circuit Code

### Entry Point Convention

Every circuit must expose a circuit object via ONE of these resolution paths (first match wins):

1. **Declared `[execution].entry_function = "<name>"` in `qubithub.toml`** — the runner calls `<name>()` with zero args. Authoritative; if declared but missing or requires args, the runner hard-fails. Preferred for any named factory (`create_<circuit_name>()`).
2. A top-level `circuit` variable bound to a framework circuit object.
3. A top-level `qc` variable (the Qiskit-tutorial alias).
4. A `main()` function that returns the circuit object.

When using a named factory, declare it in TOML so the platform finds it:

```toml
[execution]
entry_function = "create_bell_state"
```

```python
def create_bell_state():
    """Create and return the quantum circuit."""
    # ... build circuit ...
    return circuit
```

The factory must:
- Take no required arguments (optional keyword args with defaults OK; per-run parameters belong in TOML `[parameters]`, NOT as positional args)
- Match `^[a-z_][a-z0-9_]*$` — no dunders, no Python keywords, no builtin names (`open`, `eval`, etc.)
- Return the framework's native circuit object (Qiskit `QuantumCircuit`, Cirq `cirq.Circuit`)
- **PennyLane exception**: QNodes are decorated functions that return measurement results (`qml.counts()`, `qml.expval()`), not circuit objects. The factory still has the same name convention but acts as both builder and executor.
- Include measurement gates (unless explicitly variational/ansatz)

**Anti-pattern**: `[execution].entry_args` — the parser **rejects** this with a `ValueError`. Per-run parameters live in the top-level `[parameters]` section.

### Framework-Specific Patterns

#### Qiskit (default)

```python
from qiskit import QuantumCircuit

def create_circuit():
    """Bell State — maximally entangled two-qubit state."""
    qc = QuantumCircuit(2, 2)
    qc.h(0)
    qc.cx(0, 1)
    qc.measure([0, 1], [0, 1])
    return qc
```

Key rules:
- Import from `qiskit`, not `qiskit.circuit`
- Use `QuantumCircuit(n_qubits, n_classical)` — always include classical bits for measurement
- QASM export: use `qiskit.qasm2.dumps(circuit)` — **never** `circuit.qasm()` (deprecated in Qiskit 1.0+)
- Transpilation: don't transpile in `create_circuit()` — the platform handles this
- Qiskit 1.0+ removed `execute()` — use `qiskit_aer.AerSimulator().run()` or the platform execution

#### PennyLane

```python
import pennylane as qml

dev = qml.device("default.qubit", wires=2, shots=1024)

@qml.qnode(dev)
def create_circuit():
    """Bell State using PennyLane."""
    qml.Hadamard(wires=0)
    qml.CNOT(wires=[0, 1])
    return qml.counts()
```

Key rules:
- Device selection in code is for local testing — the platform overrides the backend
- Use `@qml.qnode` decorator
- Return `qml.counts()`, `qml.expval()`, or `qml.probs()` — not `qml.state()` for measured circuits
- Gate names: `qml.Hadamard`, `qml.CNOT` (not `qml.CX`), `qml.RY`, `qml.RZ`

#### Cirq

```python
import cirq

def create_circuit():
    """Bell State using Cirq."""
    q0, q1 = cirq.LineQubit.range(2)
    circuit = cirq.Circuit([
        cirq.H(q0),
        cirq.CNOT(q0, q1),
        cirq.measure(q0, q1, key='result'),
    ])
    return circuit
```

Key rules:
- Use `cirq.LineQubit.range(n)` for linear qubit allocation
- Use `cirq.Circuit([...])` with a list of operations
- Measurements need a `key` parameter
- Gate names: `cirq.H`, `cirq.CNOT`, `cirq.rx`, `cirq.rz`

#### OpenQASM 3

```python
def create_circuit():
    """Bell State as OpenQASM 3.0 string."""
    return """
    OPENQASM 3.0;
    include "stdgates.inc";
    qubit[2] q;
    bit[2] c;
    h q[0];
    cx q[0], q[1];
    c = measure q;
    """
```

Key rules:
- Return the QASM string directly
- Use `OPENQASM 3.0;` header
- Include `stdgates.inc` for standard gates

### Gate Best Practices

1. **Minimize two-qubit gates** — they're the primary source of noise on real hardware. One CX costs ~10× more error than a single-qubit gate.
2. **Prefer native gate sets** — IBM: {CX, ID, RZ, SX, X}. Google Sycamore: {√iSWAP, Phased-XZ}. If targeting specific hardware, use native gates.
3. **Keep depth reasonable** — rule of thumb: depth should not exceed 3× qubit count for NISQ circuits. Deeper circuits lose coherence on real hardware.
4. **Use barriers sparingly** — `qc.barrier()` prevents transpiler optimization across sections. Only use when gate ordering is semantically important.
5. **Parameterize when appropriate** — use `qiskit.circuit.Parameter` or `pennylane.numpy.tensor` for variational circuits. Never hardcode angles that a user might want to sweep.

### Code Quality

- **No hardcoded parameters** for variational circuits — use the `[parameters]` section in `qubithub.toml`
- **Clean imports** — only import what you use
- **Docstring required** — explain what the circuit does, the gate flow, and expected output
- **No execution in `create_circuit()`** — the function builds the circuit, it doesn't run it. **PennyLane exception**: QNodes execute on call by design — this rule does not apply to PennyLane.
- **Type hints encouraged** — `def create_circuit() -> QuantumCircuit:`

## Step 3: Write the Documentation

Every circuit needs a `README.md` with these sections:

1. **Title + hook** — what the user will learn
2. **Metadata** — level, time estimate, qubits, framework
3. **The Idea** — intuitive explanation (no jargon first, then formalize)
4. **How It Works** — circuit diagram + step-by-step gate explanation
5. **Expected Output** — what measurement results to expect and why
6. **Try It** — `qubithub execute` command or web demo link
7. **References** — papers, textbooks, further reading

Read existing circuit READMEs (e.g., `circuits/foundational/bell_state/README.md`) for the expected style.

## Step 4: Create the Manifest

Create `qubithub.toml` following the spec in `docs/circuits/TOML_SPEC.md`.

**Minimum (Tier 1)**:
```toml
[project]
name = "my-circuit"
title = "My Circuit"
type = "circuit"
framework = "qiskit"
entry_point = "circuit.py"
qubits = 2
```

**Recommended (Tier 2)** — add these sections:
```toml
schema_version = "1.0.0"

[project]
# ... plus:
depth = 4
gates = ["H", "CX"]
category = "entanglement"
difficulty = "beginner"
tags = ["entanglement", "foundational"]

[execution]
default_backend = "aer_simulator"
default_shots = 1024
timeout_seconds = 30

[educational]
level = "beginner"
concepts = ["superposition", "entanglement"]
prerequisites = []
learning_outcomes = ["Understand quantum entanglement"]
estimated_time = "10 minutes"
next_circuits = ["ghz-state"]

[expected_output]
dominant_states = ["00", "11"]
probability_range = [0.45, 0.55]
```

### TOML Field Rules
- `name`: URL slug — lowercase, hyphens only, max 100 chars
- `framework`: one of `qiskit`, `pennylane`, `cirq`, `braket`, `openqasm3`
- `gates`: use framework-standard names — `["H", "CX"]` for Qiskit, `["Hadamard", "CNOT"]` for PennyLane
- `category`: one of `entanglement`, `algorithm`, `optimization`, `chemistry`, `machine_learning`, `error_correction`, `communication`, `cryptography`, `simulation`, `transform`, `utility`, `ansatz`, `research`
- `tags`: max 5, use existing taxonomy
- `qubits`: must match the actual circuit

## Step 5: Verify

Before finalizing:

1. **Circuit executes** — test locally from the circuit directory: `python -c "from circuit import create_circuit; print(create_circuit())"` (Tier 1) or adjust the import path to match `entry_point` for Tier 2/3
2. **TOML is valid** — parse test: `python3 -c "try:\n import tomllib\nexcept ImportError:\n import tomli as tomllib\ntomllib.load(open('qubithub.toml', 'rb'))"` — or simply: `pip install tomli && python3 -c "import tomli; tomli.load(open('qubithub.toml', 'rb'))"` (works on all Python 3.7+ versions)
3. **Qubits match** — the `qubits` field in TOML matches the actual circuit qubit count
4. **Gates match** — the `gates` field lists all gate types actually used
5. **README is complete** — has all required sections from Step 3

## Important Rules

- **Always include measurements** unless the circuit is explicitly a variational ansatz (category `ansatz`)
- **Never use deprecated APIs** — Qiskit 1.0+ removed `execute()`, `circuit.qasm()`, `Aer.get_backend()`
- **Never hardcode backend** in `create_circuit()` — the platform passes the backend at execution time
- **TOML is source of truth** — `metadata.json` is auto-generated, never hand-author it
- **Follow existing patterns** — read 2-3 similar circuits in `circuits/` before creating a new one
- **Test with the platform** — after creation, run `qubithub execute <org>/<circuit>` to verify end-to-end

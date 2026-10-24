---
name: qubithub-project
description: >
  Scaffold new quantum circuit projects following QubitHub's repo structure.
  Use when initializing a new circuit, creating qubithub.toml manifests,
  or setting up project directory structure. Guides tier selection
  (Tier 1 minimal → Tier 3 research-grade).
argument-hint: '[tier1|tier2|tier3]'
---

# QubitHub Project — Circuit Scaffolding Guide

You are helping a developer scaffold a new quantum circuit project following QubitHub's standard repository structure. This skill guides tier selection, file creation, and manifest authoring.

## Usage

```
/qubithub-project              # Interactive tier selection
/qubithub-project tier1        # Scaffold Tier 1 (minimal)
/qubithub-project tier2        # Scaffold Tier 2 (intermediate)
/qubithub-project tier3        # Scaffold Tier 3 (full repo)
```

## Step 1: Gather Requirements

Ask the user (skip questions they've already answered):

1. **Circuit name**: What should the circuit be called? (slug format: lowercase, hyphens, e.g., `bell-state`)
2. **Framework**: Which quantum framework? (`qiskit`, `pennylane`, `cirq`, `braket`, `openqasm3`)
3. **Qubits**: How many qubits does this circuit use?
4. **Purpose**: What does this circuit do? (one sentence — used for description + README hook)
5. **Category**: Which domain? (`entanglement`, `algorithm`, `optimization`, `chemistry`, `machine_learning`, `error_correction`, `communication`, `cryptography`, `simulation`, `transform`, `utility`, `ansatz`, `research`)

## Step 2: Select Tier

If tier is specified in args, use it. Otherwise recommend based on complexity:

| Tier | When to Use | Files | Example Circuits |
|------|------------|-------|------------------|
| **Tier 1** | ≤5 qubits, single-file, educational | 3 files | Bell State, GHZ, Deutsch-Jozsa |
| **Tier 2** | Multi-module, parameterized, or has config | 5-6 files | VQE, QAOA, quantum kernels |
| **Tier 3** | Publication-grade, multi-framework, tests, references | 8+ files | Research reproductions, benchmarks |

**Decision guide**:
- Is it a single `create_circuit()` function with no imports beyond the framework? → **Tier 1**
- Does it have parameters users can tune, or split across multiple Python files? → **Tier 2**
- Does it reproduce a paper, target real hardware, or need test suites? → **Tier 3**

## Step 3: Create File Structure

### Tier 1 — Minimum Viable

```
{circuit-name}/
├── README.md
├── circuit.py
└── qubithub.toml
```

### Tier 2 — Intermediate

```
{circuit-name}/
├── README.md
├── circuits/
│   ├── main_circuit.py      # Entry point
│   └── ansatz.py            # Reusable subcircuit (if applicable)
├── config.yaml              # Parameters / optimizer settings (if applicable)
├── qubithub.toml
└── requirements.txt
```

### Tier 3 — Full Repo

```
{circuit-name}/
├── README.md
├── circuits/
│   ├── qiskit/
│   │   └── main_circuit.py
│   ├── pennylane/           # Optional: multi-framework
│   │   └── main_circuit.py
│   └── ansatz.py
├── config.yaml
├── qubithub.toml
├── requirements.txt
├── params.json              # Default parameter values
├── tests/
│   └── test_circuit.py
└── results/
    └── histogram.json       # Reference output
```

## Step 4: Generate `qubithub.toml`

Reference the full spec at `docs/circuits/TOML_SPEC.md`. Generate based on the selected tier:

### Tier 1 Template

```toml
[project]
name = "{circuit-name}"
title = "{Circuit Title}"
type = "circuit"
framework = "{framework}"
entry_point = "circuit.py"
qubits = {N}
```

### Tier 2 Template

```toml
schema_version = "1.0.0"

[project]
name = "{circuit-name}"
title = "{Circuit Title}"
type = "circuit"
framework = "{framework}"
framework_version = "{version}"
entry_point = "circuits/main_circuit.py"
qubits = {N}
depth = {D}
gates = [{gates}]
category = "{category}"
difficulty = "{difficulty}"
tags = [{tags}]
description = """{description}"""

[execution]
default_backend = "{backend}"
default_shots = 1024
timeout_seconds = 30
entry_function = "create_{circuit-name-underscored}"  # see "Python entry-point contract" below

[hardware]
connectivity = "any"
min_qubits = {N}
required_gates = [{gates_lowercase}]

[educational]
level = "{difficulty}"
concepts = [{concepts}]
prerequisites = [{prereqs}]
learning_outcomes = [{outcomes}]
estimated_time = "{time}"
next_circuits = [{next}]

[expected_output]
dominant_states = [{states}]
probability_range = [{min}, {max}]
```

### Tier 3 Template

Extends Tier 2, but update `entry_point` to match the multi-framework layout:

```toml
# Override from Tier 2 template:
# entry_point = "circuits/qiskit/main_circuit.py"  (not "circuits/main_circuit.py")

[parameters]
# theta = { default = 0.785, range_min = 0.0, range_max = 6.283, description = "Rotation angle" }

[reproducibility]
backend_used = "aer_simulator"
shots_used = 1024
seed = 42
framework_version_tested = "{version}"
last_verified = "{today}"

# [implementations]
# qiskit = "circuits/qiskit/main_circuit.py"
# pennylane = "circuits/pennylane/main_circuit.py"

# [[references.papers]]
# title = ""
# authors = [""]
# year = 2024
# arxiv = ""

[files]
readme = "README.md"
source = "circuits/qiskit/main_circuit.py"   # Must match project.entry_point
# params = "params.json"
# tests = "tests/"
# results = "results/"
```

### Python entry-point contract

When `project.entry_point` is a `.py` file, the platform resolves the circuit using this chain, first match wins:

1. **Declared `[execution].entry_function`** — the named factory in your TOML, called with zero arguments. **Authoritative**: if declared but missing or requires args, the runner hard-fails rather than falling through.
2. A top-level `circuit` variable bound to a framework circuit object, or
3. A top-level `qc` variable (Qiskit-tutorial alias), or
4. A `main()` function that returns the circuit object.

Use `entry_function` for any circuit that ships a named factory (`create_<name>()`) — the default chain can't resolve `create_<name>` without the declaration. Validation: must match `^[a-z_][a-z0-9_]*$`; dunders / Python keywords / builtins are rejected.

**Reject anti-pattern**: `[execution].entry_args` is **not supported** — the parser rejects it with a `ValueError`. Per-run parameters live in the top-level `[parameters]` section.

## Step 5: Generate Starter Files

### `circuit.py` (Tier 1), `circuits/main_circuit.py` (Tier 2), or `circuits/qiskit/main_circuit.py` (Tier 3)

Generate a working circuit file using the `/circuit-dev` skill patterns. The function must:
- Be named `create_circuit()`
- Return the framework's native circuit object (Qiskit `QuantumCircuit`, Cirq `cirq.Circuit`). **PennyLane exception**: QNodes return measurement results (`qml.counts()`, `qml.expval()`), not circuit objects — this is by design.
- Include measurements (unless ansatz category)
- Have a descriptive docstring

### `README.md`

Generate with these sections:

```markdown
# {Circuit Title}

> {One-line hook — what the user will learn}

| | |
|---|---|
| **Level** | {beginner/intermediate/advanced} |
| **Time** | {estimated_time} |
| **Qubits** | {N} |
| **Framework** | {framework} |

## The Idea

{Intuitive explanation — start with no jargon, then formalize}

## How It Works

{Circuit diagram or gate-by-gate explanation}

## Expected Output

{What measurements to expect and why}

## Try It

\```bash
qubithub execute {org}/{circuit-name}
\```

## References

{Papers, textbooks, or further reading}
```

### `requirements.txt` (Tier 2-3)

```
qiskit>=1.0.0
# or: pennylane>=0.38.0
# or: cirq-core>=1.4.0
```

## Step 6: Verify Structure

After creating all files, verify:

1. **All required files exist** for the selected tier
2. **TOML parses cleanly**: `pip install tomli && python3 -c "import tomli; tomli.load(open('qubithub.toml', 'rb'))"` (works on all Python 3.7+; Python 3.11+ can use `tomllib` from stdlib instead)
3. **Entry point matches**: `entry_point` in TOML points to an existing file
4. **Circuit executes**: Adjust import to match `entry_point` in TOML — Tier 1: `python3 -c "from circuit import create_circuit; print(create_circuit())"`, Tier 2: `python3 -c "from circuits.main_circuit import create_circuit; print(create_circuit())"`, Tier 3: `python3 -c "from circuits.qiskit.main_circuit import create_circuit; print(create_circuit())"`
5. **README renders**: Check markdown formatting

## Step 7: Suggest Next Steps

After scaffolding:

```
Project scaffolded! Next steps:
1. Flesh out the circuit implementation in {entry_point}
2. Complete the README with algorithm explanation
3. Run /circuit-dev to refine the circuit code
4. Run /circuit-publish when ready to publish
```

## Important Rules

- **Always create all 3 required files** — `qubithub.toml`, `circuit.py`/`main_circuit.py`, `README.md`
- **TOML is source of truth** — never create `metadata.json` (it's auto-generated by the platform)
- **Never create `.qubithub.yaml`** — this format is deprecated and removed
- **Slug format for names** — lowercase, hyphens only, max 100 chars (e.g., `bell-state`, not `Bell_State`)
- **Match existing patterns** — browse `circuits/foundational/` for Tier 1 examples, `circuits/intermediate/` for Tier 2
- **Don't over-tier** — if in doubt, start with Tier 1 and upgrade later. A working simple circuit beats an elaborate empty scaffold.
- **CLI integration** — when `qubithub init` is available, suggest it as an alternative to manual scaffolding

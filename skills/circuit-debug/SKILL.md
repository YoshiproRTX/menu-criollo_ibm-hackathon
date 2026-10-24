---
name: circuit-debug
description: >
  Debug quantum circuit execution failures and unexpected results.
  Use when a circuit fails to run, produces wrong output, or throws
  framework-specific errors. Guides through systematic diagnosis
  of backend, qubit, gate, parameter, and measurement issues.
---

# Circuit Debug — Execution Failure Diagnosis

You are helping a developer debug a quantum circuit that failed to execute, produced unexpected results, or threw an error. This skill provides a systematic decision tree for diagnosing issues across all supported frameworks.

## Usage

```
/circuit-debug                    # Diagnose circuit in current directory
/circuit-debug "error message"    # Diagnose from error message
/circuit-debug path/to/circuit    # Diagnose specific circuit
```

## Step 1: Gather Error Context

1. **What happened?** Ask or determine:
   - Circuit failed to execute (error/exception)
   - Circuit ran but produced unexpected results
   - Circuit hangs or times out

2. **Collect info**:
   - Error message (if any)
   - Framework and version
   - Backend used (simulator vs hardware)
   - The `qubithub.toml` manifest
   - The circuit code (entry point file — check `entry_point` in `qubithub.toml`)
   - How they ran it (CLI, web, direct Python)

## Step 2: Decision Tree — "My Circuit Failed"

Follow this tree from top to bottom. Stop at the first match.

```
Circuit failed
├── Import/syntax error?
│   └── → Check Step 3A: Python/Import Issues
├── Framework-specific error?
│   ├── TranspilerError (Qiskit)     → Step 3B
│   ├── DeviceError (PennyLane)      → Step 3C
│   ├── ValueError (Cirq)            → Step 3D
│   └── Other framework error        → Step 3E
├── Execution error?
│   ├── Timeout                      → Step 3F
│   ├── Backend unavailable          → Step 3G
│   ├── Auth/quota error             → Step 3H
│   └── Sandbox/container error      → Step 3I
├── Wrong results?
│   ├── All zeros                    → Step 4A
│   ├── Uniform distribution         → Step 4B
│   ├── Wrong dominant states        → Step 4C
│   └── Results vary wildly          → Step 4D
└── Hangs/no output?
    └── → Step 3F (timeout)
```

## Step 3: Execution Failures

### 3A: Python/Import Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ModuleNotFoundError: qiskit` | Framework not installed | `pip install qiskit` (or pennylane, cirq-core) |
| `ImportError: cannot import name 'execute'` | Qiskit 1.0+ removed `execute()` | Use `AerSimulator().run(circuit)` |
| `ImportError: cannot import name 'Aer'` | Qiskit Aer separate package | `pip install qiskit-aer` |
| `SyntaxError` | Python version mismatch | Check `python --version` (need 3.9+) |
| `NameError: 'create_circuit' not defined` | Entry point function missing | Ensure `def create_circuit():` exists |

### 3B: Qiskit TranspilerError

```
TranspilerError: "Unable to map source circuit onto target backend"
```

**Causes & fixes**:
| Cause | Diagnosis | Fix |
|-------|-----------|-----|
| Gate not in backend's basis gates | Check `backend.operation_names` | Use `transpile(circuit, backend)` or decompose to native gates |
| Too many qubits | Circuit qubits > backend qubits | Reduce circuit qubits or use a larger backend |
| Connectivity mismatch | Gate between non-connected qubits | Let transpiler handle routing, or use `optimization_level=3` |

```python
# Diagnostic snippet
from qiskit import transpile
from qiskit_aer import AerSimulator

backend = AerSimulator()
transpiled = transpile(circuit, backend, optimization_level=3)
print(f"Depth: {transpiled.depth()}, Gates: {transpiled.count_ops()}")
```

### 3C: PennyLane DeviceError

```
DeviceError: "Operation X not supported on device Y"
```

| Cause | Fix |
|-------|-----|
| Gate not supported by device | Check `dev.operations` — use supported gates |
| Wrong wire count | Device `wires=N` must match circuit wire count |
| `shots` not set for sampling | Add `shots=1024` to `qml.device()` |
| Returning wrong measurement type | Use `qml.counts()` for histograms, `qml.expval()` for expectation values |

### 3D: Cirq ValueError

```
ValueError: "Qubit not in circuit" / "Wrong number of qubits"
```

| Cause | Fix |
|-------|-----|
| Qubit object mismatch | Use consistent qubit objects (`cirq.LineQubit.range(n)`) |
| Gate applied to wrong qubit count | Check gate arity (e.g., `CNOT` needs exactly 2 qubits) |
| Missing measurement key | Add `key='result'` to `cirq.measure()` |

### 3E: Other Framework Errors

**Braket**:
- `ValueError: "No credentials"` → Configure AWS credentials
- Circuit validation errors → Check gate names match Braket's API

**OpenQASM**:
- Parse errors → Validate syntax: `OPENQASM 3.0;`, `include "stdgates.inc";`
- Gate not found → Ensure `stdgates.inc` is included

### 3F: Timeout

```
TimeoutError / Execution exceeded timeout_seconds
```

| Cause | Diagnosis | Fix |
|-------|-----------|-----|
| Circuit too deep | Check `circuit.depth()` | Reduce depth, increase `timeout_seconds` in TOML |
| Too many shots | `default_shots` very high | Reduce to 1024-4096 for testing |
| Classical optimization loop | VQE/QAOA optimizer stuck | Check convergence, reduce max iterations |
| Hardware queue wait | Real backend has queue | Use simulator for testing |

**Rule of thumb**: Simulators handle ≤20 qubits in seconds. 20-30 qubits: minutes. >30 qubits on a simulator: likely to timeout.

### 3G: Backend Unavailable

```
"Backend X not found" / "Backend is offline"
```

| Fix |
|-----|
| Check available backends: `qubithub backends list` |
| Use fallback: `--backend aer_simulator` (always available) |
| For hardware: check IBM Quantum status page |

### 3H: Auth/Quota Errors

```
QiskitRuntimeError / 401 Unauthorized / Quota exceeded
```

| Cause | Fix |
|-------|-----|
| Not logged in | `qubithub login` or save IBM Quantum API token via `QiskitRuntimeService.save_account(channel="ibm_quantum", token="...")` |
| Token expired | Re-authenticate with a fresh token |
| Quota exceeded | Wait or use simulator |

> **Note**: Qiskit 1.0+ replaced the old IBMQ provider with `qiskit_ibm_runtime`. If you see `IBMQBackendApiError` or `IBMQ.save_account()` in existing code, those are deprecated — migrate to `QiskitRuntimeService`.

### 3I: Sandbox/Container Errors

```
"Execution refused" / "Docker unavailable" / "Sandbox error"
```

| Cause | Fix |
|-------|-----|
| Docker not running | Start Docker Desktop |
| `SANDBOX_USE_DOCKER=true` but no Docker | Set to `false` for local testing (not recommended) |
| Forbidden import detected | AST denylist blocked an import — check for `subprocess`, `os`, `sys` usage |
| Container resource limit | Increase `SANDBOX_MEMORY_LIMIT` |

## Step 4: Wrong Results

### 4A: All Zeros (|000...0⟩)

**Most common cause**: Missing gates — the circuit does nothing.

| Check | How |
|-------|-----|
| Are gates actually applied? | Print circuit: `print(circuit)` |
| Are measurements present? | Look for `measure` operations |
| Is the circuit returned correctly? | Verify `create_circuit()` returns the built circuit, not an empty one |
| Parameter values? | Check if variational parameters default to 0 (no rotation = no state change) |

### 4B: Uniform Distribution (equal probabilities for all states)

**Common causes**:
| Cause | Fix |
|-------|-----|
| Only Hadamard gates, no entanglement/algorithm gates | Add the algorithm's core gates |
| Measurements on all qubits but only some matter | Measure only relevant qubits |
| Noise overwhelming signal | Use simulator first, increase shots, reduce depth |
| Barren plateau (variational) | Check gradient magnitudes, use shallower ansatz |

### 4C: Wrong Dominant States

| Check | How |
|-------|-----|
| Gate order correct? | Walk through the circuit gate by gate |
| Qubit indexing correct? | Qiskit uses little-endian (q0 is rightmost bit in state string) |
| CNOT direction? | Control/target swapped changes the output |
| Phase correct? | Phase gates (RZ, RY) — check angle values |

**Qiskit endianness trap**: State `|01⟩` in Qiskit means q0=1, q1=0. This is opposite to most textbooks. If your results are "backwards", this is likely why.

### 4D: Results Vary Wildly Between Runs

| Cause | Fix |
|-------|-----|
| Too few shots | Increase to 4096+ for stable statistics |
| Hardware noise | Use simulator for development, compare to hardware |
| Random seed not set | For reproducible simulator results, set `seed_simulator` |

```python
# Reproducible execution
from qiskit_aer import AerSimulator
backend = AerSimulator(seed_simulator=42)
```

## Step 5: Generate Diagnosis Report

```markdown
## Debug Report — {circuit-name}

### Symptom
{What went wrong — error message or unexpected behavior}

### Root Cause
{What's actually causing the issue}

### Fix
{Specific code/config changes to resolve}

### Verification
{How to confirm the fix worked}
```

## Step 6: Suggest Prevention

After fixing, recommend:

1. **Add `[expected_output]` to TOML** — document what correct results look like
2. **Run `/circuit-review`** — catch quality issues before they become runtime bugs
3. **Test locally first** — `python -c "from circuit import create_circuit; print(create_circuit())"` (adjust import path to match `entry_point` in `qubithub.toml` for Tier 2/3 circuits)
4. **Use reproducibility section** — set `seed` in `[reproducibility]` for deterministic testing

## Important Rules

- **Read the actual error message** — don't guess. Errors are specific.
- **Check the simplest causes first** — missing imports before hardware incompatibility
- **Qiskit endianness** — always mention the little-endian qubit ordering when results seem "backwards"
- **Simulator first** — if a circuit fails on hardware, test on `aer_simulator` to isolate hardware vs logic issues
- **Never modify sandbox security** — if the sandbox blocks something, the circuit likely uses forbidden operations. Fix the circuit, not the sandbox.
- **Framework versions matter** — Qiskit 1.0+ has breaking changes. Check `qiskit.__version__`.
- **Be systematic** — follow the decision tree, don't jump to advanced causes before checking basics

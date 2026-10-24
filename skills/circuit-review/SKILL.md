---
name: circuit-review
description: >
  Review quantum circuit quality against QubitHub audit standards.
  Use when reviewing PRs, auditing circuits, or checking quality before
  publishing. Evaluates gate efficiency, documentation completeness,
  TOML validity, code quality, and educational metadata.
---

# Circuit Review — Quality Audit

You are reviewing a quantum circuit against QubitHub's quality standards established during the Circuit Quality Audit (5 phases, 50 circuits). This skill provides a structured review template with Pass/Warn/Fail per criterion.

## Usage

```
/circuit-review                       # Review circuit in current directory
/circuit-review path/to/circuit       # Review specific circuit
/circuit-review --all circuits/       # Batch review all circuits in directory
```

## Step 1: Load the Circuit

1. Locate `qubithub.toml`, `circuit.py` (or entry point), and `README.md`
2. Read all three files completely — do not skip any
3. If `qubithub.toml` is missing, this circuit cannot be reviewed — suggest `/qubithub-project` first

## Step 2: Run Review Criteria

### Criterion 1: Code Quality

Read the entry point file and evaluate:

| Check | Pass | Warn | Fail |
|-------|------|------|------|
| `create_circuit()` function exists | Defined, returns circuit | Exists but unclear return | Missing |
| Measurements included | Present (unless ansatz) | Present but incomplete | Missing on non-ansatz circuit |
| No hardcoded backends | Clean | Backend created but not executed | `backend.run()` inside function |
| No execution in builder | Pure circuit construction (PennyLane QNodes exempt — they execute on call by design) | Prints debug info | Runs/executes the circuit (non-PennyLane) |
| Clean imports | Only used imports | Minor unused | Wildcard imports |
| Docstring | Describes circuit + gates | Brief but present | Missing |
| Type hints | Return type annotated | Partially annotated | — (not required, warn only) |
| No deprecated APIs | Uses current APIs | — | Uses `circuit.qasm()`, `execute()`, `Aer.get_backend()` |

**Framework-specific checks**:
- **Qiskit**: Uses `QuantumCircuit(n, n)` with classical bits. No `from qiskit import execute`.
- **PennyLane**: Uses `@qml.qnode` decorator. Returns measurement (`qml.counts()`, `qml.expval()`).
- **Cirq**: Measurements have `key` parameter. Uses `cirq.LineQubit.range()`.

### Criterion 2: Documentation

Read `README.md` and evaluate:

| Check | Pass | Warn | Fail |
|-------|------|------|------|
| Title heading | Present, descriptive | Generic ("Circuit") | Missing |
| What You'll Learn / Hook | Clear learning outcome | Vague | Missing |
| The Idea / Explanation | Intuitive + formal explanation | Only formal OR only intuitive | Missing |
| Circuit diagram or gate explanation | Step-by-step gates | High-level overview only | Missing |
| Expected output | Describes measurement results | Mentions output vaguely | Missing |
| Usage / Try It | `qubithub execute` command | Partial instructions | Missing |
| Level/Time/Qubits metadata | All present | Some present | None |
| Length | >30 lines | 20-30 lines | <20 lines |
| No placeholders | Clean | — | Contains TODO/FIXME/Lorem |

### Criterion 3: Metadata (TOML)

Parse `qubithub.toml` and validate against `docs/circuits/TOML_SPEC.md`:

| Check | Pass | Warn | Fail |
|-------|------|------|------|
| Required fields (6) | All present | — | Any missing |
| `schema_version` | `"1.0.0"` present | Missing (defaults OK) | Invalid version |
| `name` slug format | Lowercase, hyphens, ≤100 | — | Invalid chars or too long |
| `framework` valid | Recognized value | — | Unknown framework |
| `entry_point` resolves | File exists | — | File not found |
| `qubits` matches code | Exact match | Off by 1 (ancilla?) | Off by 2+ |
| `gates` matches code | All gates listed | Missing 1-2 gates | Missing most gates |
| `category` valid | From recognized list | — | Invalid category |
| `difficulty` appropriate | Matches complexity | Debatable | Clearly wrong (advanced for 2-qubit Bell) |
| `tags` quality | 1-5 relevant tags | >5 tags or slightly off | Irrelevant tags |
| `[execution]` section | Present with defaults | Missing (OK for Tier 1) | Invalid values |
| `[educational]` section | `level`, `concepts`, `outcomes` | Partially filled | — (optional) |
| `[expected_output]` | `dominant_states` + `probability_range` | Only states | — (optional) |

### Criterion 4: Educational Value

Evaluate the circuit's learning effectiveness:

| Check | Pass | Warn | Fail |
|-------|------|------|------|
| Difficulty calibration | Matches actual complexity | Borderline | Clearly miscalibrated |
| Concepts tagged | Relevant, specific concepts | Generic ("quantum") | Missing |
| Prerequisites listed | Correct dependency chain | Missing some deps | Wrong prereqs |
| Learning outcomes | Specific, measurable | Vague ("understand quantum") | Missing |
| Next circuits | Valid, progressive | — | Points to non-existent circuits |

**Difficulty calibration guide**:
- **Beginner**: ≤5 qubits, single concept, 1-2 gate types, no parameters
- **Intermediate**: 3-15 qubits, multiple concepts, parameters, classical optimization
- **Advanced**: 10+ qubits OR research-grade, multi-framework, complex ansatz, error correction

### Criterion 5: Execution Readiness

Verify the circuit can actually run:

| Check | Pass | Warn | Fail |
|-------|------|------|------|
| Circuit constructs | `create_circuit()` returns without error | — | Throws exception |
| Output is correct type | Returns framework circuit object — OR for PennyLane: returns measurement results (dict/counts) which is correct | Returns unexpected string/dict (non-PennyLane) | Returns None |
| Backend compatible | Default backend can run this circuit | — | Qubit count exceeds backend |
| Timeout reasonable | `timeout_seconds` allows completion | Tight but OK | Too short for circuit complexity |

If possible, actually execute (adjust import path to match `entry_point` from TOML):
```bash
# Tier 1 (entry_point = "circuit.py"):
python -c "from circuit import create_circuit; c = create_circuit(); print(type(c), c)"
# Tier 2 (entry_point = "circuits/main_circuit.py"):
python3 -c "from circuits.main_circuit import create_circuit; c = create_circuit(); print(type(c), c)"
# Tier 3 (entry_point = "circuits/qiskit/main_circuit.py"):
python3 -c "from circuits.qiskit.main_circuit import create_circuit; c = create_circuit(); print(type(c), c)"
```

## Step 3: Generate Review Report

```markdown
## Circuit Quality Review — {circuit-name} — YYYY-MM-DD

### Summary
- **Framework**: {framework} | **Qubits**: {N} | **Difficulty**: {level}
- **Tier**: {1/2/3} | **Category**: {category}

### Results

| Criterion | Grade | Findings |
|-----------|-------|----------|
| Code Quality | Pass/Warn/Fail | {count} issues |
| Documentation | Pass/Warn/Fail | {count} issues |
| Metadata (TOML) | Pass/Warn/Fail | {count} issues |
| Educational Value | Pass/Warn/Fail | {count} issues |
| Execution Readiness | Pass/Warn/Fail | {count} issues |

### Detailed Findings

| # | Criterion | Severity | Finding | Suggested Fix |
|---|-----------|----------|---------|---------------|
| 1 | Code | Fail | Missing measurements | Add `qc.measure_all()` |
| 2 | TOML | Warn | Missing `[educational]` section | Add concepts and outcomes |

### Overall Grade: A / B / C / D / F

- **A** (Excellent): 0 Fail, ≤2 Warn — publish-ready
- **B** (Good): 0 Fail, 3-5 Warn — minor improvements recommended
- **C** (Acceptable): 1 Fail or 6+ Warn — fix required items
- **D** (Needs Work): 2-3 Fail — significant issues
- **F** (Not Ready): 4+ Fail — major rework needed
```

## Step 4: Fix & Re-Review

If issues found:
1. Ask: "Want me to fix these findings?"
2. Fix all Fail items first, then Warn items
3. Re-verify each specific fix
4. Update the report with final grades

## Important Rules

- **Read every file** — never review from filenames or TOML alone
- **Compare TOML to code** — cross-check qubits, gates, framework between manifest and implementation
- **Use the TOML spec** — reference `docs/circuits/TOML_SPEC.md` for valid values
- **Difficulty must match** — a 2-qubit Bell State is beginner, not intermediate
- **Don't over-penalize Tier 1** — minimal circuits don't need `[parameters]` or `[reproducibility]`
- **Flag drift** — if `next_circuits` or `prerequisites` reference slugs that don't exist, warn
- **Be actionable** — every finding must include a specific fix suggestion
- **Batch mode** — when reviewing multiple circuits (`--all`), generate a summary table with grades

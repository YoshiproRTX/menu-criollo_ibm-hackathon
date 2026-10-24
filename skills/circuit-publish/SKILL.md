---
name: circuit-publish
description: >
  Publish quantum circuits to QubitHub. Runs pre-publish validation,
  checks metadata completeness, and guides through the push workflow.
  Use when ready to share a circuit publicly or update an existing one.
---

# Circuit Publish — Pre-Publish Validation & Push

You are helping a developer publish a quantum circuit to QubitHub. This skill runs a pre-publish validation checklist, flags issues, and guides through the push workflow.

## Usage

```
/circuit-publish              # Validate current directory and publish
/circuit-publish path/to/circuit  # Validate specific circuit directory
```

## Step 1: Locate the Circuit

1. If a path is provided in args, use it
2. Otherwise, look for `qubithub.toml` in the current directory
3. If not found, check common locations: `./`, `./circuits/`, subdirectories
4. If still not found: "No `qubithub.toml` found. Run `/qubithub-project` to scaffold a new circuit first."

## Step 2: Pre-Publish Validation

Run all checks against the circuit directory. Read the actual files — don't guess from filenames.

### Check 1: Required Files

| File | Required | Check |
|------|----------|-------|
| `qubithub.toml` | Always | Exists and parses as valid TOML |
| `circuit.py` (or `entry_point`) | Always | Exists at the path specified in `entry_point` |
| `README.md` | Always | Exists, non-empty, >10 lines |

**Fail** if any required file is missing. **Warn** if README is under 20 lines (probably incomplete).

### Check 2: TOML Manifest Validation

Parse `qubithub.toml` and validate against `docs/circuits/TOML_SPEC.md`:

**Required fields** (must exist):
- [ ] `project.name` — slug format (lowercase, hyphens, 1-100 chars)
- [ ] `project.title` — non-empty string
- [ ] `project.type` — must be `"circuit"` (or `"dataset"`, `"space"`, `"benchmark"`)
- [ ] `project.framework` — one of: `qiskit`, `pennylane`, `cirq`, `braket`, `openqasm3`
- [ ] `project.entry_point` — file must exist at this path
- [ ] `project.qubits` — positive integer

**Recommended fields** (warn if missing):
- [ ] `schema_version` — should be `"1.0.0"`
- [ ] `project.category` — valid category from the spec
- [ ] `project.difficulty` — `beginner`, `intermediate`, or `advanced`
- [ ] `project.tags` — 1-5 tags
- [ ] `project.description` — 1-2 sentences (if missing, platform extracts from README)
- [ ] `[execution]` section — `default_backend`, `default_shots`
- [ ] `[execution].entry_function` — strongly recommended when the entry point uses a named factory (`create_<name>()`); without it, the runner only matches a module-scope `circuit` / `qc` / `main()` binding
- [ ] `[educational]` section — `level`, `concepts`, `learning_outcomes`

**Validation rules**:
- `execution.default_shots` between 1 and 100,000
- `execution.timeout_seconds` between 1 and 300
- `execution.entry_function`, if declared, must match `^[a-z_][a-z0-9_]*$`; dunders, Python keywords, and builtins (`open`, `eval`, etc.) are rejected
- `execution.entry_args` is **rejected** — flag as a HARD failure if present; per-run params belong in `[parameters]`
- `hardware.connectivity` is a recognized value (warn on unknown, don't fail)
- Tags: max 5, use existing taxonomy

### Check 3: Code Quality

Read the entry point file and verify:

- [ ] **`create_circuit()` exists** — must define this function
- [ ] **Returns a circuit object** — function returns (not just prints). **PennyLane exception**: QNodes return measurement results (`qml.counts()`, `qml.expval()`), not circuit objects — this is correct for PennyLane.
- [ ] **Has measurements** — unless `category` is `ansatz` or tags include `variational`
- [ ] **No hardcoded backends** — don't create/run backends inside `create_circuit()`
- [ ] **No execution** — `create_circuit()` builds, it doesn't execute. **PennyLane exception**: QNodes execute on call by design — this check does not apply to PennyLane circuits.
- [ ] **Clean imports** — no unused imports, no wildcard imports
- [ ] **Docstring present** — function has a docstring

### Check 4: Qubit/Gate Consistency

Cross-check TOML metadata against actual circuit code:

- [ ] **Qubit count matches** — `project.qubits` matches the circuit's actual qubit count
- [ ] **Gates listed** — `project.gates` lists all gate types used (warn if missing gates) in the framework's native notation (Qiskit: `CX`, PennyLane/Cirq: `CNOT`)
- [ ] **Framework matches** — `project.framework` matches the import in the entry point file. Note: Qiskit, PennyLane, and Cirq execute natively today; `braket` and `openqasm3` circuits can be hosted/shared but raise `FrameworkNotSupported` at execution time
- [ ] **Entry function resolves** — if `[execution].entry_function = "<name>"` is declared, that exact zero-arg function must exist in the entry point file. If not declared, one of `circuit` (module-scope variable), `qc` (module-scope variable), or `main()` (function returning the circuit) must exist

### Check 5: README Quality

Read `README.md` and check for:

- [ ] **Title** — first line is a heading
- [ ] **Description** — explains what the circuit does (not just the name)
- [ ] **Expected output** — describes what measurements to expect
- [ ] **Usage instructions** — how to run the circuit
- [ ] **No placeholder text** — no `TODO`, `FIXME`, `Lorem ipsum`, or template markers

### Check 6: Common Mistakes

Flag these specific issues:

- **Aspirational qubit counts** — TOML says 100 qubits but circuit only uses 4
- **Wrong framework** — TOML says `pennylane` but code imports `qiskit`
- **Missing `entry_point`** — TOML points to a file that doesn't exist
- **Stale tags** — tags don't relate to the circuit's actual content
- **Deprecated APIs** — using `circuit.qasm()` instead of `qiskit.qasm2.dumps()`
- **`metadata.json` hand-authored** — this file should NOT be in the circuit directory (platform generates it)
- **`.qubithub.yaml` present** — deprecated format, should be removed

## Step 3: Generate Validation Report

```markdown
## Pre-Publish Validation — {circuit-name}

| Check | Status | Details |
|-------|--------|---------|
| Required files | Pass/Fail | {details} |
| TOML validation | Pass/Warn/Fail | {N} required OK, {M} recommended missing |
| Code quality | Pass/Warn | {details} |
| Qubit/gate consistency | Pass/Warn | {details} |
| README quality | Pass/Warn | {details} |
| Common mistakes | Pass/Warn | {details} |

### Issues Found

| # | Severity | Check | Issue | Fix |
|---|----------|-------|-------|-----|
| 1 | Fail | TOML | Missing `project.framework` | Add `framework = "qiskit"` |
| 2 | Warn | README | Under 20 lines | Expand algorithm explanation |

### Verdict: READY / NEEDS FIXES / BLOCKED

**READY**: All checks pass. Safe to publish.
**NEEDS FIXES**: Warnings present — fix recommended but not blocking.
**BLOCKED**: Failures present — must fix before publishing.
```

## Step 4: Fix Issues

If issues were found:

1. Ask: "Want me to fix these issues?"
2. Fix all **Fail** items (these block publishing)
3. For **Warn** items, ask: "Should I fix these now or publish as-is?"
4. After fixes, re-validate the specific checks

## Step 5: Push Workflow

Once validation passes:

```markdown
## Ready to Publish

### Option A: CLI Push (recommended)
\```bash
qubithub push
\```

### Option B: Web Upload
1. Go to qubithub.co/new
2. Upload the circuit files
3. The platform validates your `qubithub.toml` on upload

### After Publishing
- Verify at: `https://qubithub.co/{org}/{circuit-name}`
- Test execution: `qubithub execute {org}/{circuit-name}`
- Run `/circuit-review` for a quality audit
```

### Version Management

- **First publish**: Creates v1 automatically
- **Update existing**: `qubithub push` creates a new version
- **When to version bump**: Changed circuit logic, updated qubits/gates, new framework version
- **When NOT to version**: README typo fixes, tag updates, description changes

## Important Rules

- **Always validate before publishing** — never skip the checklist
- **Read actual files** — don't guess content from filenames or TOML metadata alone
- **TOML is source of truth** — if TOML and code disagree, fix one or the other (ask user which)
- **Never create `metadata.json`** — the platform generates it from `qubithub.toml`
- **Never create `.qubithub.yaml`** — deprecated format
- **Flat file push limitation** — current `qubithub push` supports flat files only. Warn about nested directory structures.
- **Don't auto-push** — present the validation report and let the user decide when to push

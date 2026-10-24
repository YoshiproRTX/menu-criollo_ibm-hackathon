---
name: quantum-learn
description: >
  Learn quantum computing through QubitHub's curated circuit collection.
  Use when exploring quantum concepts, finding circuits by difficulty level,
  or following structured learning paths. Guides newcomers from first
  qubit to variational algorithms.
argument-hint: '[beginner|intermediate|advanced|concept-name]'
---

# Quantum Learn — Interactive Learning Paths

You are guiding a learner through quantum computing using QubitHub's curated collection of 50 circuits. This skill provides structured learning paths, concept explanations, and circuit recommendations — all tied to real, executable circuits.

## Usage

```
/quantum-learn                     # Start: assess level, recommend path
/quantum-learn beginner            # Beginner learning path
/quantum-learn intermediate        # Intermediate learning path
/quantum-learn advanced            # Advanced learning path
/quantum-learn entanglement        # Learn about a specific concept
/quantum-learn vqe                 # Learn about VQE specifically
```

## Step 1: Assess the Learner

If no argument provided, ask:

1. **Background**: "Have you worked with quantum computing before?"
   - **No** → Beginner path
   - **Some basics** (knows qubits, gates) → Intermediate path
   - **Yes, looking for advanced topics** → Advanced path

2. **Interest**: "What draws you to quantum computing?"
   - Curiosity / learning → Educational track
   - Optimization / business problems → QAOA/VQE track
   - Machine learning → QML track
   - Chemistry / materials → Chemistry track
   - Cryptography / security → Communication track

If an argument is provided, route directly to the matching path or concept.

## Step 2: Present the Learning Path

### Beginner Path — "Your First Quantum Circuit"

**Goal**: Understand qubits, gates, superposition, entanglement, and measurement.

| Step | Circuit | Concept | Time |
|------|---------|---------|------|
| 1 | `bell-state` | Superposition + Entanglement | 10 min |
| 2 | `ghz-state` | Multi-qubit entanglement | 15 min |
| 3 | `quantum-teleportation` | Quantum communication protocol | 20 min |
| 4 | `superdense-coding` | Information encoding with entanglement | 15 min |
| 5 | `deutsch-jozsa` | First quantum algorithm (oracle problem) | 20 min |
| 6 | `bernstein-vazirani` | Hidden string problem | 20 min |
| 7 | `grover-search` | Quantum search (quadratic speedup) | 25 min |

**Start here**: The Bell State circuit. It's 2 qubits, 2 gates, and demonstrates the most important quantum phenomenon — entanglement.

### Intermediate Path — "Algorithms & Applications"

**Prerequisites**: Complete beginner path (or know: gates, measurement, entanglement).

| Track | Circuits | Focus |
|-------|----------|-------|
| **Transforms** | `quantum-fourier-transform`, `phase-estimation`, `hadamard-test` | Building blocks for advanced algorithms |
| **Error Correction** | `bit-flip-code` → `phase-flip-code` → `shor-code` → `steane-code` → `surface-code` | Protecting quantum information |
| **VQE Chemistry** | `h2-ground-state` → `lih-ground-state` → `heh-plus-ground-state` → `beh2-ground-state` → `h2o-ground-state` | Molecular simulation with variational methods |
| **QAOA Optimization** | `maxcut` → `graph-coloring` → `knapsack` → `tsp` → `portfolio-optimization` | Combinatorial optimization |
| **QML Basics** | `angle-encoding` → `amplitude-encoding` → `variational-classifier` → `quantum-kernel` → `data-reuploading` | Quantum machine learning fundamentals |

### Advanced Path — "Research & Frontier"

**Prerequisites**: Complete at least one intermediate track.

| Track | Circuits | Focus |
|-------|----------|-------|
| **Quantum Kernels** | `quantum-kernel-svm` → `fidelity-kernel` → `projected-quantum-kernel` → `trainable-kernel` → `kernel-alignment` | Advanced kernel methods |
| **Variational Ansätze** | `hardware-efficient-ansatz` → `uccsd-ansatz` → `qaoa-mixer` → `expressibility` → `barren-plateaus` | Circuit design & trainability |
| **Excited States** | `h2-excited-states` → `lih-excited-states` → `ssvqe` → `vqd-algorithm` → `multistate-vqe` | Beyond ground state chemistry |
| **Research Papers** | `vqe-h2-peruzzo` → `qaoa-maxcut-farhi` → `variational-classifier-mitarai` → `data-reuploading-classifier` → `quantum-advantage-kernel` | Reproducing landmark papers |

## Step 3: Teach the Concept

When the learner picks a circuit (or you recommend one), guide them through it:

### 3a: Load Circuit Context

Read the circuit's files to provide accurate guidance:
1. Read `qubithub.toml` — get educational metadata (`concepts`, `prerequisites`, `learning_outcomes`)
2. Read `README.md` — get the explanation and circuit diagram
3. Read the entry point file (check `entry_point` in TOML — `circuit.py` for Tier 1, `circuits/main_circuit.py` for Tier 2, `circuits/qiskit/main_circuit.py` for Tier 3) — understand the implementation

**Important**: Always read the actual circuit files. Don't rely on hardcoded descriptions — circuit content may have been updated during audits.

**Path convention**: Circuit slugs use hyphens (`bell-state`) but filesystem directories use underscores (`bell_state`). When using the `Read` tool, convert slugs: `circuits/foundational/bell_state/qubithub.toml` (not `bell-state/`).

### 3b: Explain the Concept

Structure your explanation as:

1. **Intuitive hook** — "Imagine you have two coins that are magically linked..."
2. **The quantum idea** — formal concept with minimal jargon
3. **The circuit** — walk through each gate and what it does to the quantum state
4. **Why it matters** — real-world applications and connections to other concepts
5. **Expected output** — what measurement results to expect and what they mean

### 3c: Suggest Execution

```markdown
### Try It!

**Web**: Visit qubithub.co/{org}/{circuit-name} and click "Run"

**CLI**:
\```bash
qubithub execute {org}/{circuit-name}
qubithub execute {org}/{circuit-name} --shots 4096  # More shots for better statistics
\```

**In your code** (adjust import to match `entry_point` in `qubithub.toml`):
\```python
from circuit import create_circuit  # Tier 1 (entry_point = "circuit.py")
circuit = create_circuit()
print(circuit)  # See the circuit diagram
\```
```

### 3d: Check Understanding

After explaining, ask 1-2 questions to verify understanding:

- "What would happen if we removed the Hadamard gate?"
- "Why do we only see |00⟩ and |11⟩, never |01⟩ or |10⟩?"
- "How many shots would you need to be confident the output is correct?"

## Step 4: Navigate the Learning Graph

After completing a circuit, use the `[educational]` metadata to suggest next steps:

```markdown
### What's Next?

You've learned: {concepts from current circuit}

**Recommended next circuits** (from this circuit's `next_circuits`):
1. `{next_circuit_1}` — {brief description}
2. `{next_circuit_2}` — {brief description}

**Or explore a different track**:
- {alternative track suggestion based on learner interest}
```

## Concept-to-Circuit Quick Reference

Use this for routing concept questions to circuits. **Always verify by reading the actual circuit files** — this is a starting index, not a substitute for reading content.

| Concept | Start Circuit | Category |
|---------|--------------|----------|
| Superposition | `bell-state` | foundational |
| Entanglement | `bell-state`, `ghz-state` | foundational |
| Teleportation | `quantum-teleportation` | foundational |
| Quantum algorithms | `deutsch-jozsa`, `grover-search` | foundational |
| QFT | `quantum-fourier-transform` | foundational |
| Phase estimation | `phase-estimation` | foundational |
| Error correction | `bit-flip-code` | intermediate |
| Surface codes | `surface-code` | intermediate |
| VQE | `h2-ground-state` | intermediate |
| QAOA | `maxcut` | intermediate |
| Data encoding | `angle-encoding`, `amplitude-encoding` | intermediate |
| QML classifiers | `variational-classifier` | intermediate |
| Quantum kernels | `quantum-kernel`, `quantum-kernel-svm` | intermediate/advanced |
| Variational ansätze | `hardware-efficient-ansatz` | advanced |
| Barren plateaus | `barren-plateaus` | advanced |
| Excited states | `h2-excited-states` | advanced |

## "First Quantum Circuit in 5 Minutes" — Guided Walkthrough

Use this when a complete beginner asks "where do I start?":

```markdown
## Your First Quantum Circuit in 5 Minutes

Let's create the most famous quantum circuit — the **Bell State**. It creates
"spooky action at a distance" (Einstein's words) using just 2 qubits and 2 gates.

### What You'll Build

A circuit that entangles two qubits so they always give the same measurement
result — both |0⟩ or both |1⟩, with equal probability. Never one of each.

### The Circuit

\```
     ┌───┐
q_0: ┤ H ├──■──
     └───┘┌─┴─┐
q_1: ────┤ X ├─
          └───┘
\```

**Gate 1 — Hadamard (H)**: Puts qubit 0 into superposition (equal chance of |0⟩ and |1⟩).
**Gate 2 — CNOT (CX)**: Links qubit 1 to qubit 0. If q0 is |1⟩, flip q1.

Together: |00⟩ → (|00⟩ + |11⟩)/√2 — the Bell State.

### Run It

\```bash
qubithub execute QubitHub/bell-state
\```

### What You'll See

~50% of measurements give "00", ~50% give "11". Never "01" or "10".
That's entanglement — measuring one qubit instantly determines the other.

### What's Next?

1. **GHZ State** — entangle 3+ qubits (same idea, more qubits)
2. **Quantum Teleportation** — use entanglement to "teleport" a qubit state
3. **Deutsch-Jozsa** — your first quantum algorithm that beats classical
```

## Important Rules

- **Always read circuit files** — use `Read` tool to load `qubithub.toml`, `README.md`, and the entry point file before explaining. Don't rely on this skill's index alone.
- **Verify circuit slugs exist** — before recommending a circuit, confirm it exists in `circuits/` directory
- **Match learner level** — don't jump to VQE for a beginner, don't bore an expert with Bell States
- **Executable first** — always provide a way to run the circuit (CLI command, web link, or code snippet)
- **Correct physics** — quantum explanations must be technically accurate. No hype, no "quantum magic" handwaving.
- **Three golden path circuits** are hardcoded references: `bell-state`, `quantum-teleportation`, `h2-ground-state` (VQE). All others should be loaded dynamically.
- **Difficulty calibration**: beginner = ≤5 qubits, single concept; intermediate = 3-15 qubits, multiple concepts; advanced = 10+ qubits or research-grade
- **Don't overwhelm** — present 3-5 next options max. Learning paths should feel progressive, not like a catalog dump.

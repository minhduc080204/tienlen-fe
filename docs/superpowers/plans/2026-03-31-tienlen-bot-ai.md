# Tien Len Bot AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a rule-based AI bot for "Tiến Lên Miền Nam" with Easy and Medium difficulty levels.

**Architecture:** A utility-based approach with a `HandAnalyzer` for grouping, `MoveValidator` for rule enforcement, and a `StrategySelector` for decision making.

**Tech Stack:** TypeScript, Vitest (for testing).

---

### Task 1: Setup Testing Framework
**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install Vitest**
Run: `npm install -D vitest`

- [ ] **Step 2: Add test script to package.json**
Add to `scripts`: `"test": "vitest run"`

- [ ] **Step 3: Create vitest.config.ts**
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
```

- [ ] **Step 4: Commit**
```bash
git add package.json vitest.config.ts
git commit -m "chore: setup vitest for AI testing"
```

### Task 2: Define Types
**Files:**
- Create: `src/type/game-ai.ts`

- [ ] **Step 1: Define Combination and HandAnalysis types**
```typescript
import { CardType } from "./card";

export type CombinationType = "SINGLE" | "PAIR" | "TRIPLE" | "QUAD" | "SEQUENCE" | "DOUBLE_SEQUENCE";

export interface Combination {
  type: CombinationType;
  cards: CardType[];
  power: number; // (highestCard.rank * 10) + highestCard.suit
}

export interface HandAnalysis {
  singles: CardType[];
  pairs: Combination[];
  triples: Combination[];
  quads: Combination[];
  sequences: Combination[];
  doubleSequences: Combination[];
}
```

- [ ] **Step 2: Commit**
```bash
git add src/type/game-ai.ts
git commit -m "feat: define AI-specific types"
```

### Task 3: Implement HandAnalyzer
**Files:**
- Create: `src/utils/tienlenAI.ts`
- Create: `src/utils/tienlenAI.test.ts`

- [ ] **Step 1: Write failing tests for grouping**
```typescript
import { describe, it, expect } from 'vitest';
import { analyzeHand } from './tienlenAI';
import { cardIdToCard } from './cardIdToCard';

describe('HandAnalyzer', () => {
  it('should identify pairs and triples', () => {
    const hand = ['31', '32', '51', '52', '53'].map(cardIdToCard);
    const analysis = analyzeHand(hand);
    expect(analysis.pairs).toHaveLength(1);
    expect(analysis.triples).toHaveLength(1);
  });

  it('should identify sequences', () => {
    const hand = ['31', '42', '53'].map(cardIdToCard);
    const analysis = analyzeHand(hand);
    expect(analysis.sequences).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Implement `analyzeHand` function**
Include logic for matching ranks (Pairs, Triples, Quads) and consecutive ranks (Sequences, Double Sequences).

- [ ] **Step 3: Run tests and verify they pass**
Run: `npm test src/utils/tienlenAI.test.ts`

- [ ] **Step 4: Commit**
```bash
git add src/utils/tienlenAI.ts src/utils/tienlenAI.test.ts
git commit -m "feat: implement hand grouping logic"
```

### Task 4: Implement MoveValidator
**Files:**
- Modify: `src/utils/tienlenAI.ts`
- Modify: `src/utils/tienlenAI.test.ts`

- [ ] **Step 1: Write tests for "Chặt" (Chop) rules**
Test 3-pairs sequence vs 2, Quad vs 2, etc.

- [ ] **Step 2: Implement `getCombination(cards)` and `isValidMove(tableCards, responseCards)`**
Ensure rule-based comparison (Type must match OR it's a Chop).

- [ ] **Step 3: Verify tests pass**

- [ ] **Step 4: Commit**
```bash
git add src/utils/tienlenAI.ts src/utils/tienlenAI.test.ts
git commit -m "feat: implement move validation and chop rules"
```

### Task 5: Implement StrategySelector
**Files:**
- Modify: `src/utils/tienlenAI.ts`
- Modify: `src/utils/tienlenAI.test.ts`

- [ ] **Step 1: Implement `chooseMove` with Level EASY**
Always pick the lowest valid combination. Do not break sets (Sequences/Double Sequences).

- [ ] **Step 2: Implement `chooseMove` with Level MEDIUM**
Adaptive logic: if opponent hand size < 5, allow breaking sets to chop or win turn.

- [ ] **Step 3: Verify AI behavior tests**

- [ ] **Step 4: Commit**
```bash
git add src/utils/tienlenAI.ts src/utils/tienlenAI.test.ts
git commit -m "feat: implement Easy and Medium AI strategies"
```

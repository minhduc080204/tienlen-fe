# Design Spec: Tien Len Bot AI (Rule-Based)

## 1. Overview
Implementation of an AI bot for "Tiến Lên Miền Nam" (Vietnamese Southern Poker). The bot will support two difficulty levels: **Easy** (Strict Defensive) and **Medium** (Adaptive Strategy).

## 2. Requirements
- **Standard Rules**: 52-card deck, Rank: 3 < 4 < ... < A < 2. Suit: Bích < Chuồn < Rô < Cơ.
- **Valid Moves**: Single, Pair, Triple, Quad (4 of a kind), Sequence (3+ cards), Double Sequence (3+ consecutive pairs).
- **"Chặt" (Chop) Rules**:
    - 3 pairs of sequences chops a single 2 or a smaller 3-pair sequence.
    - Quad chops a single 2, a pair of 2s, or a smaller Quad.
    - 4 pairs of sequences chops a single 2, a pair of 2s, 3 pairs of sequences, or a smaller 4-pair sequence (can be played out of turn).
- **Personality**: Defensive (preserves sets, pushes trash first).

## 3. Architecture

### 3.1 Data Structures
- `Card`: `{ id: string, rank: number, suit: number }`
- `Combination`:
    - `type`: `SINGLE | PAIR | TRIPLE | QUAD | SEQUENCE | DOUBLE_SEQUENCE`
    - `cards`: `Card[]`
    - `power`: Calculated from the highest card's rank and suit for comparison.

### 3.2 Core Components
1.  **Hand Analyzer**: Groups cards into all possible combinations, prioritizing larger sets to minimize "Trash" (un-grouped cards).
2.  **Move Validator**: Determines if a combination can legally beat the current table cards.
3.  **Strategy Selector**:
    - **Easy (Level A)**: Always picks the lowest valid move. Never breaks a Sequence or Double Sequence to play a Single or Pair.
    - **Medium (Level C)**:
        - *Early/Mid Game*: Same as Easy.
        - *Late Game (Opponent < 5 cards)*: Switches to Aggressive. Will break sequences to "Chặt" (chop) a 2 or stop the opponent from finishing.

## 4. Logic Flow

### 4.1 Leading (Empty Table)
1.  Identify all "Trash" cards (singles not in sets).
2.  Play the **lowest Trash card**.
3.  If no Trash, play the **lowest pair**.
4.  Avoid leading with 2s or large sequences unless necessary to finish.

### 4.2 Responding (Table not empty)
1.  Identify all valid combinations in hand that can beat the table.
2.  **Easy Mode**: Filter out moves that would break a Sequence/Double Sequence. Pick the move with the lowest power.
3.  **Medium Mode**:
    - If any opponent has < 5 cards: Treat all combinations as available (allow breaking sets). Pick the move that maximizes chance of winning the turn (regaining control).
    - Else: Follow Easy Mode.

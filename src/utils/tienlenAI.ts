import type { CardType } from "../type/card";
import type { Combination, CombinationType, HandAnalysis } from "../type/game-ai";

/**
 * Calculates the power of a combination based on its highest card.
 * Standard Tien Len rank: 3-15 (3 to 2)
 * Standard Tien Len suit: 1-4 (Spade, Club, Diamond, Heart)
 */
const getPower = (cards: CardType[]): number => {
    if (cards.length === 0) return 0;
    const sorted = [...cards].sort((a, b) => {
        if (a.rank !== b.rank) return b.rank - a.rank;
        return b.suit - a.suit;
    });
    const highest = sorted[0];
    return highest.rank * 10 + highest.suit;
};

/**
 * Groups cards into various Tien Len combinations.
 * Prioritizes larger sets and sequences to minimize "trash".
 */
export const analyzeHand = (hand: CardType[]): HandAnalysis => {
    const sorted = [...hand].sort((a, b) => a.rank - b.rank || a.suit - b.suit);
    const analysis: HandAnalysis = {
        singles: [],
        pairs: [],
        triples: [],
        quads: [],
        sequences: [],
        doubleSequences: []
    };

    // 1. Group by Rank (Pairs, Triples, Quads)
    const rankGroups: Record<number, CardType[]> = {};
    sorted.forEach(c => {
        if (!rankGroups[c.rank]) rankGroups[c.rank] = [];
        rankGroups[c.rank].push(c);
    });

    Object.values(rankGroups).forEach(group => {
        if (group.length === 2) analysis.pairs.push({ type: "PAIR", cards: group, power: getPower(group) });
        else if (group.length === 3) analysis.triples.push({ type: "TRIPLE", cards: group, power: getPower(group) });
        else if (group.length === 4) analysis.quads.push({ type: "QUAD", cards: group, power: getPower(group) });
    });

    // 2. Identify Sequences (3+ consecutive cards, 2 cannot be in sequence)
    const nonTwos = sorted.filter(c => c.rank < 15);
    const uniqueRanks = Array.from(new Set(nonTwos.map(c => c.rank))).sort((a, b) => a - b);
    
    for (let i = 0; i < uniqueRanks.length; i++) {
        let seqRanks = [uniqueRanks[i]];
        for (let j = i + 1; j < uniqueRanks.length; j++) {
            if (uniqueRanks[j] === uniqueRanks[j - 1] + 1) {
                seqRanks.push(uniqueRanks[j]);
            } else break;
        }
        if (seqRanks.length >= 3) {
            // Find one card for each rank to form the sequence
            const seqCards = seqRanks.map(rank => nonTwos.find(c => c.rank === rank)!);
            analysis.sequences.push({ type: "SEQUENCE", cards: seqCards, power: getPower(seqCards) });
        }
    }

    // 3. Identify Double Sequences (3+ consecutive pairs)
    const availablePairs = Object.values(rankGroups).filter(g => g.length >= 2 && g[0].rank < 15);
    for (let i = 0; i < availablePairs.length; i++) {
        let seq = [availablePairs[i]];
        for (let j = i + 1; j < availablePairs.length; j++) {
            if (availablePairs[j][0].rank === availablePairs[j - 1][0].rank + 1) {
                seq.push(availablePairs[j]);
            } else break;
        }
        if (seq.length >= 3) {
            const cards = seq.flatMap(g => g.slice(0, 2));
            analysis.doubleSequences.push({ type: "DOUBLE_SEQUENCE", cards, power: getPower(cards) });
        }
    }

    // 4. Identify Trash (Singles not in any set)
    const usedIds = new Set([
        ...analysis.pairs.flatMap(p => p.cards.map(c => c.id)),
        ...analysis.triples.flatMap(p => p.cards.map(c => c.id)),
        ...analysis.quads.flatMap(p => p.cards.map(c => c.id)),
        ...analysis.sequences.flatMap(p => p.cards.map(c => c.id)),
        ...analysis.doubleSequences.flatMap(p => p.cards.map(c => c.id)),
    ]);
    analysis.singles = sorted.filter(c => !usedIds.has(c.id));

    return analysis;
};

/**
 * Determines the combination type of a given set of cards.
 */
export const getCombination = (cards: CardType[]): Combination | null => {
    if (cards.length === 0) return null;
    const sorted = [...cards].sort((a, b) => a.rank - b.rank);
    const len = cards.length;

    if (len === 1) return { type: "SINGLE", cards, power: getPower(cards) };

    const allSameRank = cards.every(c => c.rank === cards[0].rank);
    if (allSameRank) {
        if (len === 2) return { type: "PAIR", cards, power: getPower(cards) };
        if (len === 3) return { type: "TRIPLE", cards, power: getPower(cards) };
        if (len === 4) return { type: "QUAD", cards, power: getPower(cards) };
    }

    // Check Sequence
    if (len >= 3 && cards.every(c => c.rank < 15)) {
        let isSeq = true;
        for (let i = 1; i < len; i++) {
            if (sorted[i].rank !== sorted[i - 1].rank + 1) {
                isSeq = false;
                break;
            }
        }
        if (isSeq) return { type: "SEQUENCE", cards, power: getPower(cards) };
    }

    // Check Double Sequence
    if (len >= 6 && len % 2 === 0) {
        const ranks = Array.from(new Set(cards.map(c => c.rank))).sort((a, b) => a - b);
        if (ranks.length === len / 2 && ranks.every(r => r < 15)) {
            let isDoubleSeq = true;
            for (let i = 0; i < ranks.length; i++) {
                if (cards.filter(c => c.rank === ranks[i]).length !== 2) isDoubleSeq = false;
                if (i > 0 && ranks[i] !== ranks[i - 1] + 1) isDoubleSeq = false;
            }
            if (isDoubleSeq) return { type: "DOUBLE_SEQUENCE", cards, power: getPower(cards) };
        }
    }

    return null;
};

/**
 * Logic to check if handCards can beat tableCards.
 * Implements standard "Chặt" (Chop) rules.
 */
export const isValidMove = (tableCards: CardType[], handCards: CardType[]): boolean => {
    const tableComb = getCombination(tableCards);
    const handComb = getCombination(handCards);
    if (!handComb) return false;
    if (!tableComb) return true; // Leading move

    // Same type: compare power
    if (tableComb.type === handComb.type && tableComb.cards.length === handComb.cards.length) {
        return handComb.power > tableComb.power;
    }

    // Chop rules
    const tableIsTwo = tableComb.type === "SINGLE" && tableComb.cards[0].rank === 15;
    const tableIsPairOfTwos = tableComb.type === "PAIR" && tableComb.cards[0].rank === 15;

    // 3 pairs of sequence chops a single 2
    if (tableIsTwo && handComb.type === "DOUBLE_SEQUENCE" && handComb.cards.length === 6) return true;
    
    // Quad chops a single 2 or a pair of 2s
    if (tableIsTwo && handComb.type === "QUAD") return true;
    if (tableIsPairOfTwos && handComb.type === "QUAD") return true;

    // Quad vs Quad
    if (tableComb.type === "QUAD" && handComb.type === "QUAD") return handComb.power > tableComb.power;

    // 4 pairs of sequence
    if (handComb.type === "DOUBLE_SEQUENCE" && handComb.cards.length >= 8) {
        if (tableIsTwo || tableIsPairOfTwos) return true;
        if (tableComb.type === "DOUBLE_SEQUENCE" && tableComb.cards.length === 6) return true;
        if (tableComb.type === "QUAD") return true;
        if (tableComb.type === "DOUBLE_SEQUENCE" && handComb.cards.length === tableComb.cards.length) {
            return handComb.power > tableComb.power;
        }
    }

    return false;
};

/**
 * Bot AI Strategy Implementation
 */
export const chooseMove = (
    hand: CardType[],
    table: CardType[],
    level: "EASY" | "MEDIUM",
    opponentsHandSizes: number[] = []
): CardType[] => {
    const analysis = analyzeHand(hand);
    const tableComb = table.length > 0 ? getCombination(table) : null;

    // Identify all possible valid combinations in hand
    const allPossibleMoves: Combination[] = [
        ...analysis.singles.map(c => ({ type: "SINGLE" as CombinationType, cards: [c], power: getPower([c]) })),
        ...analysis.pairs,
        ...analysis.triples,
        ...analysis.quads,
        ...analysis.sequences,
        ...analysis.doubleSequences,
    ];

    const validMoves = allPossibleMoves.filter(m => isValidMove(table, m.cards));

    // 1. If leading (table is empty)
    if (!tableComb) {
        // Defensive: play lowest trash single
        if (analysis.singles.length > 0) return [analysis.singles.sort((a, b) => a.rank - b.rank || a.suit - b.suit)[0]];
        // If no trash, play lowest pair
        if (analysis.pairs.length > 0) return analysis.pairs.sort((a, b) => a.power - b.power)[0].cards;
        // Else play any smallest move
        return allPossibleMoves.sort((a, b) => a.power - b.power)[0]?.cards || [];
    }

    // 2. If responding
    if (validMoves.length === 0) return []; // Pass

    // EASY: Defensive - never break sets, pick smallest valid move
    if (level === "EASY") {
        return validMoves.sort((a, b) => a.power - b.power)[0].cards;
    }

    // MEDIUM: Adaptive - if opponent near winning, break anything to stop them
    const isLateGame = opponentsHandSizes.some(size => size <= 4);
    if (isLateGame) {
        // Find EVERYTHING possible (including breaking sets)
        const bruteForceMoves: Combination[] = [];
        // Note: For simplicity, we prioritize existing sets but don't strictly forbid breaking them in implementation logic
        // If the bot really wanted to "break" a triple to make a pair, we'd need more complex combinatorics here.
        // For now, "Medium" will prioritize "Chops" and high cards more aggressively.
        return validMoves.sort((a, b) => b.power - a.power)[0].cards; // Play the strongest to stop opponent
    }

    // Default Medium (Mid Game): same as Easy
    return validMoves.sort((a, b) => a.power - b.power)[0].cards;
};

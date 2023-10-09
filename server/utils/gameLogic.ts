// Check if a move is valid
function isValidMove(move: string) {
  const validMoves = ["🪨", "📃", "✂️"];
  return validMoves.includes(move);
}

// Determine winner
function determineWinner(moveA: string, moveB: string): "A" | "B" | "Tie" {
  // If both moves are the same, it's a tie
  if (moveA === moveB) {
    return "Tie";
  }

  // Determine winner based on combinations
  if (moveA === "🪨" && moveB === "✂️") {
    return "A";
  }
  if (moveA === "✂️" && moveB === "📃") {
    return "A";
  }
  if (moveA === "📃" && moveB === "🪨") {
    return "A";
  }

  // If none of the above conditions are met, player B wins
  return "B";
}

export { isValidMove, determineWinner };

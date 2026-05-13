const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
let board = ["", "", "", "", "", "", "", "", ""];
const HUMAN = "O";
const AI = "X";
let isGameOver = false;

function initBoard() {
    boardElement.innerHTML = "";
    board.forEach((_, i) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleMove);
        boardElement.appendChild(cell);
    });
}

function handleMove(e) {
    const index = e.target.dataset.index;
    if (board[index] !== "" || isGameOver) return;

    updateCell(index, HUMAN);
    
    if (!checkGameStatus()) {
        statusElement.innerText = "IA pensando...";
        setTimeout(() => {
            const bestMove = getBestMove();
            updateCell(bestMove, AI);
            checkGameStatus();
        }, 400);
    }
}

function updateCell(index, player) {
    board[index] = player;
    const cell = boardElement.children[index];
    cell.innerText = player;
    cell.dataset.player = player;
    cell.classList.add('taken');
}

function checkGameStatus() {
    const result = checkWinner(board);
    if (result) {
        isGameOver = true;
        if (result === "draw") statusElement.innerText = "Empate Técnico!";
        else statusElement.innerText = result === AI ? "A IA venceu!" : "Você venceu!";
        return true;
    }
    statusElement.innerText = "Sua vez (O)";
    return false;
}

function checkWinner(b) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let combo of wins) {
        if (b[combo[0]] && b[combo[0]] === b[combo[1]] && b[combo[0]] === b[combo[2]]) return b[combo[0]];
    }
    return b.includes("") ? null : "draw";
}

function minimax(tempBoard, depth, isMaximizing) {
    const score = checkWinner(tempBoard);
    if (score === AI) return 10 - depth;
    if (score === HUMAN) return depth - 10;
    if (score === "draw") return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = AI;
                best = Math.max(best, minimax(tempBoard, depth + 1, false));
                tempBoard[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = HUMAN;
                best = Math.min(best, minimax(tempBoard, depth + 1, true));
                tempBoard[i] = "";
            }
        }
        return best;
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = AI;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameOver = false;
    statusElement.innerText = "Sua vez (O)";
    initBoard();
}

initBoard();
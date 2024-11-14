const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    // create board
    const clearBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }

        }
    }

    clearBoard();

    const getBoard = () => board;

    const takeCell = (column, row, player) => {
        board[row][column].markCell(player);
    };

    const printBoard = () => {
        const boardPrintOut = board.map((row) => row.map((cell) => cell.getValue()).join("")).join("\n");
        console.log(boardPrintOut);
    };

    return { getBoard, takeCell, printBoard, clearBoard };
})();

function Cell() {
    let value = "";
    let winner = false;

    const markCell = (player) => {
        value = player.symbol;
    };

    const setWinner = () => {
        winner = true;
    };

    const isWinner = () => winner;
    const getValue = () => value;

    return { markCell, getValue, setWinner, isWinner };

}

function GameController(p1Name, p2Name) {
    console.log("first")
    const board = Gameboard;

    const players = [
        {
            name: p1Name,
            symbol: "X"
        },
        {
            name: p2Name,
            symbol: "O"
        }
    ];

    let activePlayer = players[0];
    const switchPlayerTurn = () => {
        activePlayer === players[0] ? activePlayer = players[1] : activePlayer = players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn. (${getActivePlayer().symbol})`);
    };

    const checkForWinner = () => {
        let boardArr = board.getBoard();


        let winningRows = boardArr.filter((row, rowNum) => {
            if (
                row.every(cell => {
                    return cell.getValue().trim() === "X"
                }) ||
                row.every(cell => {
                    return cell.getValue().trim() === "O"
                })
            ) {
                row.forEach(cell => {
                    cell.setWinner();
                })
                return true
            }
        });

        let columns = boardArr[0].map((e, columnIndex) => boardArr.map(row => row[columnIndex]));

        let winningCols = columns.filter((col, colNum) => {
            if (
                col.every(cell => {
                    return cell.getValue().trim() === "X"
                }) ||
                col.every(cell => {
                    return cell.getValue().trim() === "O"
                })
            ) {
                col.forEach(cell => {
                    cell.setWinner();
                })
                return true
            }
        });

        let diags = [[boardArr[0][0], boardArr[1][1], boardArr[2][2]], [boardArr[0][2], boardArr[1][1], boardArr[2][0]]]

        let winningDiags = diags.filter((diag, diagNum) => {
            if (
                diag.every(cell => {
                    return cell.getValue().trim() === "X"
                }) ||
                diag.every(cell => {
                    return cell.getValue().trim() === "O"
                })
            ) {
                diag.forEach(cell => {
                    cell.setWinner();
                })
                return true
            }
        });

        if (winningRows.length > 0 || winningCols.length > 0 || winningDiags.length > 0) {
            console.log(`${getActivePlayer().name} wins!`)
            return true
        } else {
            return false
        }
    }

    const checkForDraw = () => {
        let boardArr = board.getBoard();
        return boardArr.every(row => row.every(cell => cell.getValue() !== ""));
    }


    const playRound = (column, row) => {
        let gameOver = false;
        let draw = false;

        if (board.getBoard()[row][column].getValue() !== "") {
            console.log("That square is already taken, try again!");
            printNewRound();
            return
        }
        // Drop a token for the current player
        console.log(
            `${getActivePlayer().name} took ${column}, ${row}...`
        );
        board.takeCell(column, row, getActivePlayer());

        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */
        if (checkForWinner()) {
            gameOver = true;
            // board.clearBoard();
        } else if (checkForDraw()) {
            gameOver = true;
            draw = true;
        } else {
            // Switch player turn
            switchPlayerTurn();
            printNewRound();
        }
        return {gameOver, draw};
    }

    // Initial play game message
    printNewRound();

    return { playRound, getActivePlayer };
}

let game = GameController("Jim", "Alf");

(function ScreenController() {
    // needs to make the grid and fill it with the current values
    // add click listener and handler
    let turnDiv = document.querySelector("#turn");
    let gridDiv = document.querySelector("#grid");
    let playAgainButton = document.querySelector('#play-again');

    const updateScreen = (gameOver) => {

        // update grid
        gridDiv.innerHTML = "";
        Gameboard.getBoard().forEach((row, rowNum) => {
            row.forEach((cell, columnNum) => {
                let cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                if (!gameOver) {

                    cellDiv.classList.add('active');
                }
                cellDiv.dataset.columnNumber = columnNum;
                cellDiv.dataset.rowNumber = rowNum;
                cellDiv.innerText = cell.getValue();
                if (cell.isWinner()) {
                    cellDiv.classList.add('winner');
                }

                gridDiv.appendChild(cellDiv);
            });
        });

        // update turn
        turnDiv.innerText = `${game.getActivePlayer().name}'s turn. (${game.getActivePlayer().symbol})`;

        // update play again
        if (gameOver) playAgainButton.style.display = 'block';
    }

    const gameOverFunction = (isDraw) => {
        gridDiv.removeEventListener('click', gridClickHandler);
        updateScreen(true);
        if (isDraw) { // draw
            turnDiv.innerText = `Awww it's a draw! Nobody wins!`
        } else {
            turnDiv.innerText = `${game.getActivePlayer().name} wins!`
        }
    }
    const gridClickHandler = (e) => {
        let row = e.target.dataset.rowNumber;
        let column = e.target.dataset.columnNumber;
        let gameStatus = game.playRound(column, row);
        
        if (gameStatus.gameOver) { // gameover
            gameOverFunction(gameStatus.draw);
        } else {
            updateScreen();
        }
    }

    gridDiv.addEventListener('click', gridClickHandler);

    const playAgainClickHandler = (e) => {
        Gameboard.clearBoard();
        updateScreen();
        gridDiv.addEventListener('click', gridClickHandler);
        playAgainButton.style.display = 'none';
    }

    playAgainButton.addEventListener('click', playAgainClickHandler);

    updateScreen();
})()



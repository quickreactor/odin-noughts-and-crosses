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
    let value = "[ ]";

    const markCell = (player) => {
        value = ` ${player.symbol} `;
    };

    const getValue = () => value;

    return { markCell, getValue };

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
        
        let winningRows = boardArr.filter(row => {
            return row.every(cell => {
                return cell.getValue().trim() === "X" || cell.getValue().trim() === "O"
            })
        });
        
        let columns = boardArr[0].map((e, columnIndex) => boardArr.map(row => row[columnIndex]));
        
        let winningCols = columns.filter(col => {
            return col.every(cell => {
                return cell.getValue().trim() === "X" || cell.getValue().trim() === "O"
            })
        });

        let diags = [[boardArr[0][0], boardArr[1][1], boardArr[2][2]],[boardArr[0][2], boardArr[1][1], boardArr[2][0]]]

        let winningDiags = diags.filter(diag => {
            return diag.every(cell => {
                return cell.getValue().trim() === "X" || cell.getValue().trim() === "O"
            })
        });

        if (winningRows.length > 0 || winningCols.length > 0 || winningDiags.length > 0) {
            console.log(`${getActivePlayer().name} wins!`)
            return true
        } else {
            return false
        }
    }


    const playRound = (column, row) => {
        if (board.getBoard()[row - 1][column - 1].getValue() !== "[ ]") {
            console.log("That square is already taken, try again!");
            printNewRound();
            return
        }
        // Drop a token for the current player
        console.log(
            `${getActivePlayer().name} took ${column}, ${row}...`
        );
        board.takeCell(column - 1, row - 1, getActivePlayer());

        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */
        if (checkForWinner()) {
            board.clearBoard();
        };
        // Switch player turn
        switchPlayerTurn();
        printNewRound();
    }

    // Initial play game message
    printNewRound();

    return { playRound, getActivePlayer };
}

let game = GameController("Jim", "Alf");


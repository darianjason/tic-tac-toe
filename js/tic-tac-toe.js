const gameBoard = (() => {
    let _board = new Array(9);

    let _spaces = Array.from(document.getElementsByClassName("space"));

    _spaces.forEach((space, index) => {
        space.setAttribute("data-index", index);
    });

    const enableBoardClicks = () => {
        _spaces.forEach(space => {
            space.addEventListener("click", event => {
                gameController.playMove(space);
            });
        });
    };

    const disableBoardClicks = () => {
        _spaces.forEach(space => {
            // cloneNode() removes event listeners
            let newSpace = space.cloneNode(true);

            space.replaceWith(newSpace);
        });
    };

    const updateBoard = (marker, index) => {
        _board.splice(index, 1, marker);
    };

    const resetBoard = () => {
        _board = new Array(9);

        // re-assign _spaces after replacing with cloned nodes
        _spaces = Array.from(document.getElementsByClassName("space"));

        enableBoardClicks();
    };

    const checkWin = (index1, index2, index3) => {
        if (_board[index1] && _board[index2] && _board[index3]) {
            if (_board[index1] === _board[index2] && _board[index2] === _board[index3]) {
                const winningIndexArray = [index1, index2, index3];

                gameController.win(winningIndexArray);

                return true;
            }
        }
    };

    const isFull = arr => {
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i]) return false;
        }

        return true;
    };

    const checkGameOver = () => {
        let won = false;

        won = checkWin(0, 1, 2);
        won = checkWin(3, 4, 5);
        won = checkWin(6, 7, 8);
        won = checkWin(0, 3, 6);
        won = checkWin(1, 4, 7);
        won = checkWin(2, 5, 8);
        won = checkWin(0, 4, 8);
        won = checkWin(2, 4, 6);

        if (won != true && isFull(_board)) {
            gameController.tie();
        }
    };

    return {
        enableBoardClicks,
        disableBoardClicks,
        updateBoard,
        resetBoard,
        checkGameOver
    };
})();

const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    return {
        getName,
        getMarker
    };
};

const displayController = (() => {
    let _spaces = Array.from(document.getElementsByClassName("space"));

    const fillSpace = (space, marker) => {
        space.append(marker);
    };

    const resetBoard = () => {
        // re-assign _spaces after replacing with cloned nodes
        _spaces = Array.from(document.getElementsByClassName("space"));

        _spaces.forEach(space => {
            space.textContent = "";
            space.classList.remove("winning-marker");
        });
    };

    const displayPlayerInfo = (player) => {
        let playerInfo = document.createElement("div");
        playerInfo.classList.add("player-info");

        let playerMarker = document.createElement("div");
        playerMarker.classList.add("player-marker");

        playerMarker.append(player.getMarker());

        playerInfo.append(playerMarker);
        playerInfo.append(player.getName());

        let playerInfoContainer = document.getElementById("player-info-container");
        playerInfoContainer.appendChild(playerInfo);
    };

    const highlightCurrentPlayer = currentPlayer => {
        // TODO: change color for current turn's player
    };

    const highlightWinningMarkers = winningIndexArray => {
        _spaces.forEach(space => {
            for (let i = 0; i < winningIndexArray.length; i++) {
                if (space.getAttribute("data-index") == winningIndexArray[i]) {
                    space.classList.add("winning-marker");
                }
            }
        });
    };

    const displayWinnerText = winner => {
        const playerMarkers = Array.from(document.getElementsByClassName("player-marker"));

        playerMarkers.forEach(marker => {
            if(marker.textContent === winner.getMarker()) {
                let winnerText = document.createElement("div");
                winnerText.id = "winner-text";
                winnerText.textContent = "WINNER";

                marker.parentNode.prepend(winnerText);
            }
        });
    }

    return {
        fillSpace,
        resetBoard,
        displayPlayerInfo,
        highlightWinningMarkers,
        displayWinnerText,
    };
})();

const gameController = (() => {
    let _player1 = Player("Player 1", "X");
    let _player2 = Player("Player 2", "O");

    let currentPlayer = _player1;

    displayController.displayPlayerInfo(_player1);
    displayController.displayPlayerInfo(_player2);

    const playMove = space => {
        if (!space.textContent) {
            displayController.fillSpace(space, currentPlayer.getMarker());

            gameBoard.updateBoard(currentPlayer.getMarker(), space.getAttribute("data-index"));

            // TODO: start after 4th turn? (use turnCounter)
            gameBoard.checkGameOver();

            _swapPlayers();
        }
    };

    const _swapPlayers = () => {
        if (currentPlayer === _player1) {
            currentPlayer = _player2;
        }
        else if (currentPlayer === _player2) {
            currentPlayer = _player1;
        }
    };

    const win = winningIndexArray => {
        displayController.highlightWinningMarkers(winningIndexArray);

        console.log(currentPlayer.getName() + " has won!");

        displayController.displayWinnerText(currentPlayer);

        gameBoard.disableBoardClicks();
    };

    const tie = () => {
        // TODO: display "game over, it's a tie" message
        console.log("Game over, it's a tie!");

        gameBoard.disableBoardClicks();
    };

    let restartButton = document.getElementById("restart-button");

    restartButton.addEventListener("click", event => {
        gameBoard.resetBoard();
        displayController.resetBoard();

        currentPlayer = _player1;
    });

    return {
        playMove,
        currentPlayer,
        win,
        tie
    };
})();

gameBoard.enableBoardClicks();
const gameBoard = (() => {
    let _board = new Array(9);

    let _spaces = Array.from(document.getElementsByClassName("space"));

    _spaces.forEach((space, index) => {
        space.setAttribute("data-index", index);
    });

    const updateBoard = (marker, index) => {
        _board.splice(index, 1, marker);
    };

    const resetBoard = () => {
        _board = new Array(9);
    };

    const checkWin = (index1, index2, index3) => {
        if (_board[index1] && _board[index2] && _board[index3]) {
            if (_board[index1] === _board[index2] && _board[index2] === _board[index3]) {
                gameController.win(index1, index2, index3);
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
        checkWin(0, 1, 2);
        checkWin(3, 4, 5);
        checkWin(6, 7, 8);
        checkWin(0, 3, 6);
        checkWin(1, 4, 7);
        checkWin(2, 5, 8);
        checkWin(0, 4, 8);
        checkWin(2, 4, 6);

        if (isFull(_board)) {
            gameController.tie();
        }
    };

    return {
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

    _spaces.forEach(space => {
        space.addEventListener('click', event => {
            gameController.playMove(space);
        });
    });

    const fillSpace = (space, marker) => {
        space.append(marker);
    };

    const resetBoard = () => {
        _spaces.forEach(space => {
            space.textContent = "";
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

    return {
        fillSpace,
        resetBoard,
        displayPlayerInfo
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

            _swapPlayers();

            // TODO: checkGameOver function to check for win (3 in a row) or tie (board is full without win)
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

    let restartButton = document.getElementById("restart-button");

    restartButton.addEventListener("click", event => {
        displayController.resetBoard();
        gameBoard.resetBoard();
    });

    return {
        playMove,
        currentPlayer
    };
})();
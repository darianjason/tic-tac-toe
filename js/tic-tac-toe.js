const gameBoard = (() => {
    let _board = new Array(9);

    let _spaces = Array.from(document.getElementsByClassName("space"));

    _spaces.forEach((space, index) => {
        space.setAttribute("data-index", index);
    });

    const enableBoardClicks = () => {
        _spaces.forEach(space => {
            space.addEventListener("click", e => {
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

    const checkWin = () => {
        const winningIndices2DArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        for (let i = 0; i < winningIndices2DArray.length; i++) {
            if (_board[winningIndices2DArray[i][0]] && _board[winningIndices2DArray[i][1]] && _board[winningIndices2DArray[i][2]]) {
                if (_board[winningIndices2DArray[i][0]] === _board[winningIndices2DArray[i][1]] && _board[winningIndices2DArray[i][1]] === _board[winningIndices2DArray[i][2]]) {
                    gameController.win(winningIndices2DArray[i]);

                    return true;
                }
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

        won = checkWin();

        if (isFull(_board) && !won) {
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

    const setName = newName => {
        name = newName;
    };

    return {
        getName,
        getMarker,
        setName
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

    const displayPlayerInfo = player => {
        const playerInfo = document.createElement("div");
        playerInfo.classList.add("player-info");

        const playerMarker = document.createElement("div");
        playerMarker.classList.add("player-marker");

        playerMarker.append(player.getMarker());
        playerInfo.append(playerMarker);

        const playerName = document.createElement("div");
        playerName.classList.add("player-name");

        playerName.append(player.getName());
        playerInfo.append(playerName);

        const playerInfoContainer = document.getElementById("player-info-container");
        playerInfoContainer.appendChild(playerInfo);
    };

    const allowChangePlayerNames = (player1, player2) => {
        const playerNames = Array.from(document.getElementsByClassName("player-name"));

        const players = new Array(player1, player2);

        playerNames.forEach((playerName, index) => {
            playerName.contentEditable = "true";

            playerName.addEventListener("keydown", e => {
                if (e.keyCode === 13) {
                    playerName.blur();
                }
            });

            playerName.onblur = () => {
                players[index].setName(playerName.textContent);
            };
        });
    };

    const highlightLastPlayer = () => {
        const players = Array.from(document.getElementsByClassName("player-info"));

        let highlighted = false;

        for (let i = 0; i < players.length; i++) {
            if (players[i].classList.contains("last-player")) {
                highlighted = true;
                break;
            }
        }

        if (!highlighted) {
            players[0].classList.add("last-player");
        }
        else {
            players.forEach(player => {
                player.classList.toggle("last-player");
            });
        }
    };

    const resetLastPlayer = () => {
        const players = Array.from(document.getElementsByClassName("player-info"));

        players.forEach(player => {
            player.classList.remove("last-player");
        });
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
            if (marker.textContent === winner.getMarker()) {
                const winnerText = document.createElement("div");
                winnerText.id = "winner-text";
                winnerText.textContent = "WINNER";

                marker.parentNode.prepend(winnerText);
            }
        });
    };

    const resetWinnerText = () => {
        const winnerText = document.getElementById("winner-text");
    
        if (winnerText) {
            winnerText.remove();
        }
    };
    
    const displayTieText = () => {
        const playerInfoContainer = document.getElementById("player-info-container");
    
        const tieText = document.createElement("div");
        tieText.id = "tie-text";
        tieText.textContent = "TIE";
    
        playerInfoContainer.insertBefore(tieText, playerInfoContainer.lastChild);
    };
    
    const resetTieText = () => {
        const tieText = document.getElementById("tie-text");
    
        if (tieText) {
            tieText.remove();
        }
    };

    return {
        fillSpace,
        resetBoard,
        displayPlayerInfo,
        allowChangePlayerNames,
        highlightLastPlayer,
        resetLastPlayer,
        highlightWinningMarkers,
        displayWinnerText,
        resetWinnerText,
        displayTieText,
        resetTieText
    };
})();

const gameController = (() => {
    const _player1 = Player("Player 1", "X");
    const _player2 = Player("Player 2", "O");

    let _currentPlayer = _player1;

    displayController.displayPlayerInfo(_player1);
    displayController.displayPlayerInfo(_player2);
    displayController.allowChangePlayerNames(_player1, _player2);

    const playMove = space => {
        if (!space.textContent) {
            displayController.highlightLastPlayer();

            displayController.fillSpace(space, _currentPlayer.getMarker());

            gameBoard.updateBoard(_currentPlayer.getMarker(), space.getAttribute("data-index"));

            // TODO: start after 4th turn? (use turnCounter)
            gameBoard.checkGameOver();

            _swapPlayers();
        }
    };

    const _swapPlayers = () => {
        if (_currentPlayer === _player1) {
            _currentPlayer = _player2;
        }
        else if (_currentPlayer === _player2) {
            _currentPlayer = _player1;
        }
    };

    const win = winningIndexArray => {
        displayController.highlightWinningMarkers(winningIndexArray);

        // console.log(_currentPlayer.getName() + " has won!");

        displayController.displayWinnerText(_currentPlayer);

        gameBoard.disableBoardClicks();
    };

    const tie = () => {
        // console.log("Game over, it's a tie!");

        displayController.displayTieText();

        gameBoard.disableBoardClicks();
    };

    const _restartButton = document.getElementById("restart-button");

    _restartButton.addEventListener("click", e => {
        gameBoard.resetBoard();
        displayController.resetBoard();
        displayController.resetLastPlayer();
        displayController.resetWinnerText();
        displayController.resetTieText();

        _currentPlayer = _player1;
    });

    return {
        playMove,
        win,
        tie
    };
})();

gameBoard.enableBoardClicks();
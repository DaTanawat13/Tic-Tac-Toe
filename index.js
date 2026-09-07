window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');   // Selects the element that displays the current player
    const resetbutton = document.querySelector('#reset');  // Selects the reset button element
    const announcer = document.querySelector('.announcer');  // Selects the announcer element

    // Game variables

    let board = ['', '', '', '', '', '', '', '', '']; // Represents the game board as an array of 9 elements
    let currentPlayer = 'X'; // Represents the current player ('X' or 'O')
    let isGameActive = true;// Indicates whether the game is currently active or not

    const PLAYERX_WON = 'PLAYERX_WON'; // Constant representing the state when player X wins
    const PLAYERO_WON = 'PLAYERO_WON'; // Constant representing the state when player O wins
    const TIE = 'TIE'; // Constant representing the state when the game ends in a tie

    /*  
        Indexes within the board

        {0} | {1} | {2}
        -----------
        {3} | {4} | {5}
        -----------
        {6} | {7} | {8}
    */


    const winningConditions = [ // Array of winning combinations
        [0, 1, 2],    //rows
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleResultValidation() { // Function to check if the game has been won or tied
        let roundWon = false;
        for (let i = 0; i <= 7; i++) { // Loop through each winning condition
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') { // If any of the positions are empty, continue to the next iteration
                continue;
            }
            if (a === b && b === c) { // If all three positions are the same, the round is won
                roundWon = true;
                break;
            }
        }
    if (roundWon) { // If the round is won, announce the winner and end the game
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }
    
    

        if (!board.includes('')) { // If the board is full and no winner, announce a tie
            announce(TIE);
        }
    }

    const announce = (type) => { // Function to announce the game result
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide'); // Show the announcer element
    }

    const isValidAction = (tile) => { // Function to check if the selected tile is a valid action
        if (tile.innerText === 'X' || tile.innerText === 'O') { // If the tile is already occupied, return false
            return false;
        }
        return true;
    };

    const updateBoard = (index) => { // Function to update the game board with the current player's move
        board[index] = currentPlayer; // Update the board array at the specified index with the current player's symbol
    }

    const changePlayer = () => { // Function to switch the current player
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switches the current player
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) { // Check if the action is valid and the game is active
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`); // Add a class to the tile based on the current player
            updateBoard(index);
            handleResultValidation(); // Check if the game has been won or tied
            changePlayer(); // Switch to the other player
        }
        
    }

    const resetBoard = () => { // Function to reset the game board
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide'); // Hide the announcer element

        // Reset current player to X and update display
        currentPlayer = 'X';
        playerDisplay.classList.remove('playerO', 'playerX');
        playerDisplay.innerText = 'X';
        playerDisplay.classList.add('playerX');

        // Clear the UI tiles
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    };
    

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    if (resetbutton) {
        resetbutton.addEventListener('click', resetBoard);
    }

});
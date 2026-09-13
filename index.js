// Wait until the whole page is ready before starting the game.
window.addEventListener('DOMContentLoaded', () => {
    // Collect all nine squares on the game board.
    const tiles = Array.from(document.querySelectorAll('.tile'));
    // Find the place that shows whose turn it is.
    const playerDisplay = document.querySelector('.display-player');   // Selects the element that displays the current player
    // Find the Reset button.
    const resetbutton = document.querySelector('#reset');  // Selects the reset button element
    // Find the place that announces the winner or a tie.
    const announcer = document.querySelector('.announcer');  // Selects the announcer element

    // This list remembers what is inside each of the nine squares.
    let board = ['', '', '', '', '', '', '', '', '']; // Represents the game board as an array of 9 elements
    // X gets the first turn.
    let currentPlayer = 'X'; // Represents the current player ('X' or 'O')
    // true means players are still allowed to make moves.
    let isGameActive = true;// Indicates whether the game is currently active or not

    // A special name for the result when X wins.
    const PLAYERX_WON = 'PLAYERX_WON'; // Constant representing the state when player X wins
    // A special name for the result when O wins.
    const PLAYERO_WON = 'PLAYERO_WON'; // Constant representing the state when player O wins
    // A special name for the result when nobody wins.
    const TIE = 'TIE'; // Constant representing the state when the game ends in a tie

    /*
        These numbers show the position number of every square.

        {0} | {1} | {2}
        -----------
        {3} | {4} | {5}
        -----------
        {6} | {7} | {8}
    */


    // These are all the rows, columns, and diagonals that can win the game.
    const winningConditions = [ // Array of winning combinations
        // The three horizontal rows.
        [0, 1, 2],    //rows
        [3, 4, 5],
        [6, 7, 8],
        // The three vertical columns.
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // The two diagonal lines.
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Check whether the latest move made somebody win or caused a tie.
    function handleResultValidation() { // Function to check if the game has been won or tied
        // Start by assuming nobody has won.
        let roundWon = false;
        // Look at each of the eight possible winning lines.
        for (let i = 0; i <= 7; i++) { // Loop through each winning condition
            // Get one possible winning line.
            const winCondition = winningConditions[i];
            // Read the first square in that line.
            const a = board[winCondition[0]];
            // Read the second square in that line.
            const b = board[winCondition[1]];
            // Read the third square in that line.
            const c = board[winCondition[2]];
            // An empty square means this line cannot be a winning line yet.
            if (a === '' || b === '' || c === '') { // If any of the positions are empty, continue to the next iteration
                // Skip this line and check the next one.
                continue;
            }
            // If all three squares match, the current player wins.
            if (a === b && b === c) { // If all three positions are the same, the round is won
                // Remember that this round has a winner.
                roundWon = true;
                // Stop checking because one winning line is enough.
                break;
            }
        }
        // If somebody won, show the winner and stop accepting moves.
        if (roundWon) { // If the round is won, announce the winner and end the game
            // Tell the page which player won.
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            // Turn the game off until Reset is clicked.
            isGameActive = false;
            // Leave this function because the game is already finished.
            return;
        }

        // If there are no empty squares, the game is a tie.
        if (!board.includes('')) { // If the board is full and no winner, announce a tie
            // Show the tie message.
            announce(TIE);
        }
    }

    // Show a message describing how the game ended.
    const announce = (type) => { // Function to announce the game result
        // Choose the correct message based on the result name.
        switch(type){
            // This message is used when O wins.
            case PLAYERO_WON:
                // Add O's colored letter to the winner message.
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                // Stop checking other cases.
                break;
            // This message is used when X wins.
            case PLAYERX_WON:
                // Add X's colored letter to the winner message.
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                // Stop checking other cases.
                break;
            // This message is used when nobody wins.
            case TIE:
                // Put the word Tie on the page.
                announcer.innerText = 'Tie';
        }
        // Remove the hidden class so the result can be seen.
        announcer.classList.remove('hide'); // Show the announcer element
    }

    // Check whether a square is free to use.
    const isValidAction = (tile) => { // Function to check if the selected tile is a valid action
        // A square with X or O already inside it cannot be used again.
        if (tile.innerText === 'X' || tile.innerText === 'O') { // If the tile is already occupied, return false
            // Tell the game that this move is not allowed.
            return false;
        }
        // An empty square is safe to use.
        return true;
    };

    // Put the current player's letter into the memory list.
    const updateBoard = (index) => { // Function to update the game board with the current player's move
        // Save X or O at the square's position number.
        board[index] = currentPlayer; // Update the board array at the specified index with the current player's symbol
    }

    // Change the turn from X to O or from O to X.
    const changePlayer = () => { // Function to switch the current player
        // Remove the old player's color from the turn display.
        playerDisplay.classList.remove(`player${currentPlayer}`);
        // Choose the other player.
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switches the current player
        // Show the new player's letter.
        playerDisplay.innerText = currentPlayer;
        // Add the new player's color to the turn display.
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    // Handle one click on one game square.
    const userAction = (tile, index) => {
        // Only act when the square is empty and the game is still running.
        if (isValidAction(tile) && isGameActive) { // Check if the action is valid and the game is active
            // Put the current player's letter in the clicked square.
            tile.innerText = currentPlayer;
            // Give the square the correct player color.
            tile.classList.add(`player${currentPlayer}`); // Add a class to the tile based on the current player
            // Save the move in the board list.
            updateBoard(index);
            // Check whether this move ended the game.
            handleResultValidation(); // Check if the game has been won or tied
            // Prepare for the other player's turn.
            changePlayer(); // Switch to the other player
        }
    }

    // Put the game back into its starting state.
    const resetBoard = () => { // Function to reset the game board
        // Make all nine board positions empty again.
        board = ['', '', '', '', '', '', '', '', ''];
        // Allow players to make moves again.
        isGameActive = true;
        // Hide the old winner or tie message.
        announcer.classList.add('hide'); // Hide the announcer element

        // Make X the first player again.
        currentPlayer = 'X';
        // Remove both possible player colors from the turn display.
        playerDisplay.classList.remove('playerO', 'playerX');
        // Show X as the player whose turn it is.
        playerDisplay.innerText = 'X';
        // Add X's color to the turn display.
        playerDisplay.classList.add('playerX');

        // Visit every square and clean it up.
        tiles.forEach(tile => {
            // Remove the letter from the square.
            tile.innerText = '';
            // Remove X's color from the square.
            tile.classList.remove('playerX');
            // Remove O's color from the square.
            tile.classList.remove('playerO');
        });
    };

    // Give every square a click listener.
    tiles.forEach((tile, index) => {
        // When a square is clicked, run the move function for that square.
        tile.addEventListener('click', () => userAction(tile, index));
    });

    // Make sure the Reset button exists before giving it a job.
    if (resetbutton) {
        // Reset the game whenever the button is clicked.
        resetbutton.addEventListener('click', resetBoard);
    }

// Finish the code that starts after the page is ready.
});
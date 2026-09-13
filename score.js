// Wait until the web page is fully loaded before looking for anything on it.
window.addEventListener('DOMContentLoaded', () => {
    // Find the box that tells us who won or if the game was a tie.
    const announcer = document.querySelector('.announcer');
    // Find the box that says whose turn it is.
    const display = document.querySelector('.display');

    // Stop if either important box is missing from the page.
    if (!announcer || !display) {
        // Leave the function because there is nowhere to show the score.
        return;
    }

    // Make a new section that will hold all three scores.
    const scoreBoard = document.createElement('section');
    // Give the new section a name so CSS can make it look nice.
    scoreBoard.className = 'score-board';
    // Put the starting score numbers inside the new section.
    scoreBoard.innerHTML = `
        <!-- Show Player X's score. -->
        <div>Player X: <strong id="score-x">0</strong></div>
        <!-- Show how many games ended in a tie. -->
        <div>Ties: <strong id="score-ties">0</strong></div>
        <!-- Show Player O's score. -->
        <div>Player O: <strong id="score-o">0</strong></div>
    `;
    // Put the scoreboard directly after the turn display on the page.
    display.insertAdjacentElement('afterend', scoreBoard);

    // Keep the three scores in one easy-to-use object.
    const scores = {
        // Player X starts with zero wins.
        X: 0,
        // Player O starts with zero wins.
        O: 0,
        // No games have ended in a tie yet.
        ties: 0
    };
    // Remember the last result so one game is not counted twice.
    let countedResult = '';

    // Create a small function that puts the newest numbers on the screen.
    const updateScoreBoard = () => {
        // Find Player X's number and replace it with the current X score.
        scoreBoard.querySelector('#score-x').innerText = scores.X;
        // Find Player O's number and replace it with the current O score.
        scoreBoard.querySelector('#score-o').innerText = scores.O;
        // Find the tie number and replace it with the current tie score.
        scoreBoard.querySelector('#score-ties').innerText = scores.ties;
    };

    // Create a function that checks the game's latest message.
    const countResult = () => {
        // When Reset hides the message, prepare to count the next game.
        if (announcer.classList.contains('hide')) {
            // Empty this memory so the next identical result can be counted.
            countedResult = '';
            // Stop here because there is no finished game to count.
            return;
        }

        // Read the message and remove extra spaces around it.
        const result = announcer.innerText.trim();
        // If this exact result was already counted, do nothing.
        if (result === countedResult) {
            // Stop here so one win does not add two points.
            return;
        }

        // If the message says Player X won, add one win for X.
        if (result.includes('Player X Won')) {
            // Increase X's score by one.
            scores.X += 1;
        // Otherwise, check whether Player O won.
        } else if (result.includes('Player O Won')) {
            // Increase O's score by one.
            scores.O += 1;
        // Otherwise, check whether the game ended in a tie.
        } else if (result === 'Tie') {
            // Increase the tie score by one.
            scores.ties += 1;
        // If the message is not a known game result, ignore it.
        } else {
            // Stop because this message should not change any score.
            return;
        }

        // Remember this result after counting it.
        countedResult = result;
        // Show the new score numbers on the page.
        updateScoreBoard();
    };

    // Watch the winner message for changes made by the original game code.
    new MutationObserver(countResult).observe(announcer, {
        // Notice when text or HTML is added or removed.
        childList: true,
        // Also notice changes inside smaller elements in the message.
        subtree: true,
        // Notice when the hidden or visible class changes.
        attributes: true,
        // Notice when text letters change.
        characterData: true
    });
// Finish setting up the code that runs after the page loads.
});

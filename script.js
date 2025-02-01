//tablero
const gameBoard = (function(){
    const rows= 3;
    const columns = 3;
    const board = [];

    //crear tablero vacío 3x3
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] ="-";
        }
    }

    //obtener tablero
    function getBoard(){
        return board;
    }


    //PARA VERSIÓN CONSOLA:
    //imprimir tablero (al ser navegador web y usar consolelog con getBoard,
    //se estara guardando una referencia y acabara impriminedo la version final
    //por eso hay q hacer una copia)
    //function printBoard() {
    //    const boardCopy = gameBoard.getBoard().map(row => [...row]);
    //    console.log(boardCopy);
    //}
    

    //colocar token en tablero
    function placeToken(row,col,token){
        if (board[row][col] === "-") {
            board[row][col] = token;
            return true;
        }
        return false;
    };

    //PARA VERSIÓN CONSOLA:
    //return {getBoard, placeToken, printBoard}
    return {getBoard, placeToken};
})();

//jugadores, guardan token (O ó X)
function createPlayer(token){
    return{token};
}


//controlador, cambia de turno y juega las rondas segun la posicion
const gameController = (function(){
    const player1 = createPlayer("X");
    const player2 = createPlayer("O");
    let currentPlayer = player1;
    let gameOver = false;


    //VERSIÓN CONSOLA
    /*
    function getPlayerInput() {
        const row = prompt(`Jugador ${currentPlayer.token}, ingresa la fila (0, 1, 2):`);
        const col = prompt(`Jugador ${currentPlayer.token}, ingresa la columna (0, 1, 2):`);
        return { row: parseInt(row), col: parseInt(col) }; // Devolver un objeto con las coordenadas
    }
    */

    //cambio de turno, sería función privada usada solo por playRound
    function switchTurns(){
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };


    //si el turno ha sido valido se vuelve a mostrar el tablero actualizado
    function playRound(row, col){
        //const { row, col } = getPlayerInput();

        //si el juego ha terminado no permite seguir jugando
        if(gameOver) return;

        if(gameBoard.placeToken(row,col,currentPlayer.token)){
            //console.log(`Jugador ${currentPlayer.token} juega en (${row}, ${col})`);
            //console.log(gameBoard.getBoard());
            //gameBoard.printBoard();

            switchTurns();
            screenCtrl.updateScreen();

            switch(checkWinner()){
                case "X":
                setTimeout(() => alert("Ganan las X"), 100); // Usar setTimeout para mostrar la alerta después
                gameOver=true;
                break;
                case "O":
                setTimeout(() => alert("Ganan las O"), 100); // Usar setTimeout para mostrar la alerta después
                gameOver = true;
                break;
                case "empate":
                setTimeout(() => alert("Es un empate"), 100); // Usar setTimeout para mostrar la alerta después
                gameOver=true;
                break;
                default:
                // El juego continúa
                break;
            }

            
        }else{
            alert("Casilla ocupada. Intenta otra vez");
        }
        
    };

    function getCurrentPlayer(){
        return currentPlayer;
    }

    function getGameOver(){
        return gameOver;
    }

    
    function checkWinner(){
        const board = gameBoard.getBoard();

        // Comprobar filas
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== "-") {
                return board[i][0]; // Retorna "X" o "O" como el ganador
            }
        }

        // Comprobar columnas
        for (let j = 0; j < 3; j++) {
            if (board[0][j] === board[1][j] && board[1][j] === board[2][j] && board[0][j] !== "-") {
                return board[0][j]; // Retorna "X" o "O" como el ganador
            }
        }

        // Comprobar diagonales
        switch (true) {
            case (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== "-"):
                return board[0][0]; // Retorna "X" o "O" como el ganador
            case (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== "-"):
                return board[0][2]; // Retorna "X" o "O" como el ganador
        }

        // Comprobar empate
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "-") {
                    return null; // El juego sigue
                }
            }
        }

        return "empate"; // Empate si no hay casillas vacías
    }
    
        
    


    /*
    //SI EL JUEGO NECESITASE INPUTS: (al hacerlo con UI los gestionamos diferente)
    function startGame() {
        let gameActive = true; 

        while(gameActive) {
            playRound(); 
            
            //verificar fin del juego
            switch(checkWinner()){
                case "X":
                    console.log("¡El ganador es el jugador X!");
                    gameActive = false;
                    break;
                case "O":
                    console.log("¡El ganador es el jugador O!");
                    gameActive = false;
                    break;
                case "empate":
                    console.log("¡Es un empate!");
                    gameActive = false;
                    break;
                default:
                    // El juego continúa
                    break;
            }
            
        }
    }
    */


    //Función de reset
    function resetGame(){
        gameBoard.getBoard().forEach(row => row.fill("-"));
        currentPlayer = player1;
        gameOver = false;
        screenCtrl.updateScreen();

    }

    return{playRound, getCurrentPlayer, resetGame, getGameOver};


})();

//gameController.startGame();

//startGame();

//PARTE UI
function screenController(){
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const resetButton = document.querySelector(".reset-button");

    //Actualizar la interfaz
    function updateScreen(){
        //limpiar tablero
        boardDiv.innerHTML =" ";

        //obtener el estado más reciente del tablero y el jugador actual
        const board = gameBoard.getBoard();
        const activePlayer = gameController.getCurrentPlayer();

        //mostrar el turno del jugador
        playerTurnDiv.textContent = gameController.getGameOver() ? "Juego Terminado" : `${activePlayer.token}'s turn...`;
    
        //renderizar las celdas del tablero
        board.forEach((row, rowIndex)=>{
            row.forEach((cell,colIndex)=>{
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.col = colIndex;
                cellButton.textContent = cell === "-" ? "" : cell;  //la primera vez que recorramos el tablero queremos cambiar los "-" del tablero por consola a espacios en blanco
                if(cell !== "-"){
                    cellButton.classList.add(cell);
                }
                boardDiv.appendChild(cellButton);
            })
        })
    }

    //click en el tablero
    function clickHandlerBoard(e){
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.col;

        // Asegurarnos de que se ha hecho clic en una celda y no en un espacio vacío
        if (selectedRow === undefined || selectedCol === undefined) return;

        gameController.playRound(parseInt(selectedRow), parseInt(selectedCol));
        //updateScreen()
    }

    boardDiv.addEventListener("click", clickHandlerBoard);


    //click en el botón de reset
    resetButton.addEventListener("click", ()=>{
        gameController.resetGame();
}); 

    //renderizar el tablero al inicio
    updateScreen();

    return{updateScreen};
    
}

//inicializar el controlador de pantalla
const screenCtrl = screenController();
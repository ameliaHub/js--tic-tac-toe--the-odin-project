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

    //imprimir tablero (al ser navegador web y usar consolelog con getBoard,
    //se estara guardando una referencia y acabara impriminedo la version final
    //por eso hay q hacer una copia)
    function printBoard() {
        const boardCopy = gameBoard.getBoard().map(row => [...row]);
        console.log(boardCopy);
    }
    

    //colocar token en tablero
    function placeToken(row,col,token){
        if (board[row][col] === "-") {
            board[row][col] = token;
            return true;
        }
        return false;
    };

    return {getBoard, placeToken, printBoard}
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

    function getPlayerInput() {
        const row = prompt(`Jugador ${currentPlayer.token}, ingresa la fila (0, 1, 2):`);
        const col = prompt(`Jugador ${currentPlayer.token}, ingresa la columna (0, 1, 2):`);
        return { row: parseInt(row), col: parseInt(col) }; // Devolver un objeto con las coordenadas
    }

    //cambio de turno, sería función privada usada solo por playRound
    function switchTurns(){
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };


    //si el turno ha sido valido se vuelve a mostrar el tablero actualizado
    function playRound(){
        const { row, col } = getPlayerInput();

        if(gameBoard.placeToken(row,col,currentPlayer.token)){
            console.log(`Jugador ${currentPlayer.token} juega en (${row}, ${col})`);
            //console.log(gameBoard.getBoard());
            gameBoard.printBoard();
            switchTurns();
        }else{
            console.log("Casilla ocupada. Intenta otra vez");
        }
        
    };


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


    return{ startGame};


})();


gameController.startGame();

//startGame();


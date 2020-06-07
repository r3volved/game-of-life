const printer = async ( board ) => {
    console.clear()
    console.log(
        board.reduce((acc, row) => {
            acc.push( row.map(c => c ? "▉" : " ").join("") )
            return acc
        },[]).join("\n")
    )
    return 
}

const checkSurround = ( board, row, col ) => {
    const spaces = [ -1, 0, 1 ]
    const checkNeighbours = ( r, c, me ) => {
        if( !board[r] ) return 0
        return spaces.reduce((acc,pos) => {
            if( !pos && me ) return acc
            if( board[r][c+pos] ) acc++
            return acc
        },0)
    }
    return spaces.reduce((acc,pos) => acc + checkNeighbours( row+pos, col, !pos ),0)
}

const checkCell = ( board, row, col ) => {
    let alive = board[row][col] !== 0
    let neighbours = checkSurround( board, row, col )

    if( neighbours == 3 ) return 1
    if( alive && neighbours == 2 ) return 1
    return 0
}

const step = ( board ) => {
    var newBoard = []
    for( let r = 0; r < board.length; ++r ) {
        newBoard[r] = []
        for( let c = 0; c < board[r].length; ++c ) {
            newBoard[r][c] = checkCell( board, r, c )
        }
    }
    return newBoard
}

(async function() {

    let board = []
    const size = 30
    const iterations = 1000
    for( let rows = 0; rows < size; ++rows ) {
        board.push( new Array(size).fill(0) )
    }

	//Seed the board
    board[10][10] = 1
    board[10][11] = 1
    board[11][9] = 1
    board[11][10] = 1
    board[12][10] = 1

    for( let i = 0; i <= iterations; ++i ) {
        printer( board )
        board = step( board )
        await new Promise(end => setTimeout(end, 100))
    }

})()
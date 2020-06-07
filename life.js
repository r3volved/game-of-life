const printer = async ( board, options = {} ) => {
    const border = '-'.repeat( board[0].length+2 )
    const environment = board.reduce((acc, row) => {
        acc.push([ '|', row.map(c => {
            return c == 0 ? " " : "▮"//"▉" 
        }).join(""), '|' ].join(""))
        return acc
    },[]).join("\n")
    const details = Object.keys(options).reduce((acc,opt) => {
        if( options[opt] ) acc.push(`${opt} : ${options[opt]}`)
        return acc
    },[])
    const report = [ border, environment, border ].concat( details )
    
    console.clear()
    console.log(report.join("\n"))
}

const checkCell = ( board, row, col ) => {
    const spaces = [ -1, 0, 1 ]
    const checkNeighbours = ( r, c, me ) => {
        if( r < 0 ) r += board.length //Wrap board
        if( r >= board.length ) r -= board.length //Wrap board
        return spaces.reduce((acc,pos) => {        
            if( !pos && me ) return acc            
            if( c+pos < 0 ) c += board[r].length //Wrap board
            if( c+pos >= board[r].length ) c -= board[r].length //Wrap board
            if( board[r][c+pos] ) acc++
            return acc
        },0)
    }

    const alive = board[row][col] !== 0
    const neighbours = spaces.reduce((acc,pos) => {
        return acc + checkNeighbours( row+pos, col, !pos )
    },0)

    if( neighbours == 3 ) return neighbours
    if( alive && neighbours == 2 ) return neighbours
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

const seedRandom = ( board ) => {
    for( let r = 0; r < board.length; ++r ) {
        for( let c = 0; c < board[r].length; ++c ) {
            board[r][c] = Math.random() >= 0.5 ? 1 : 0
        }
    }
}

const life = async ( board = [], size = { h:10, w:30 } ) => {
    if( !board.length ) {
        board = new Array(size.h).fill(0).reduce((acc,row) => {
            acc.push( new Array(size.w).fill(0) )
            return acc
        },[])
    }

	//Seed the board
    seedRandom( board )

    let original_seed = JSON.stringify(board)
    let history = []
    let looped = 0
    let iterations = 0

    while( original_seed ) {
        printer( board, {
            Iterations:iterations++,
            History:history.length,
            Looped:looped
        })

        if( looped == 1 ) {
            console.log('\nLife has stalled out')
            break
        } else if( looped > 1 ) {
            console.log('\nLife got looped')
            break
        }

        let newBoard = step( board )
        let oldBoard = JSON.stringify(board)

        let found = history.indexOf(oldBoard)
        if( found >= 0 )
            looped = history.length - found

        board = newBoard
        history.push(oldBoard)
        if( history.length > 20 ) 
            history.splice(0,history.length-20)

        iterations++
        await new Promise(end => setTimeout(end, 100))
    }
        
    console.log('Game over')
}


life([], { h:10, w:30 })

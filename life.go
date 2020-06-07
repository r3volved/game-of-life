package main

import (
	"time"
	"fmt"
)

func printer ( board *[30][30]int ) {
	print("\033[H\033[2J")
	for _, col := range board {
		line := ""
		for _, val := range col {
			if val != 0 {
				line += "▉"	
			} else {
				line += " "
			}
		}
		fmt.Println(line)
	}
	time.Sleep(time.Second/10)
}

func checkSurround( board [30][30]int, row, col int ) int {
	neighbours := 0
	for r := row-1; r <= row+1; r++ {
		if r < 0 || r >= len(board) { continue }
		for c := col-1; c <= col+1; c++ {
			if c < 0 || c >= len(board[r]) { continue }
			if col == c && row == r { continue }
			if board[r][c] != 0 { neighbours++ }
		}
	}
	return neighbours
}

func checkCell( board [30][30]int, row, col int ) int {
	alive := board[row][col] != 0
	neighbours := checkSurround( board, row, col )

	if neighbours == 3 { return 1 }	
	if alive && neighbours == 2 { return 1 }
	return 0
}

func main() {	

	var board [30][30]int

	iterations := 1000

	//Seed the board
	board[10][10] = 1
	board[10][11] = 1
	board[11][9] = 1
	board[11][10] = 1
	board[12][10] = 1

	for i := 0; i <= iterations; i++ {
		printer( &board )
		var newBoard [30][30]int
		for row := 0; row < len(board); row++ {
            for col := 0; col < len(board[row]); col++ {
                newBoard[row][col] = checkCell( board, row, col )
            }
        }
        board = newBoard
	}

}




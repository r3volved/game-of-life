package main

import (
	"fmt"
	"math/rand"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

func clearScreen() {
	c := exec.Command("clear")
	c.Stdout = os.Stdout
	c.Run()
}

type Board struct {
	content [10][30]int
}

func (b Board) rows() [10][30]int {
	return b.content
}
func (b Board) cols(row int) [30]int {
	return b.content[row]
}
func (b Board) val(row, col int) int {
	return b.content[row][col]
}

func printer(board *Board, iterations int, looped int) {
	report := ""
	report += strings.Repeat("-", len(board.content[0])+2) + "\n"
	for _, col := range board.rows() {
		report += "|"
		for _, val := range col {
			if val == 0 {
				report += " "
			} else {
				report += "▮"
			}
		}
		report += "|\n"
	}
	report += strings.Repeat("-", len(board.content[0])+2) + "\n"
	report += "Iterations : " + strconv.Itoa(iterations) + "\n"
	if looped > 0 {
		report += "Looped : " + strconv.Itoa(looped) + "\n"
	}

	clearScreen()
	fmt.Println(report)
}

func checkSurround(board *Board, row, col int) int {
	neighbours := 0
	spaces := [3]int{-1, 0, 1}
	rowlength := len(board.rows())
	collength := len(board.cols(0))
	for _, r := range spaces {
		if r+row < 0 {
			r += rowlength
		}
		if r+row >= rowlength {
			r -= rowlength
		}
		for _, c := range spaces {
			if c == 0 && r == 0 {
				continue
			}
			if c+col < 0 {
				c += collength
			}
			if c+col >= collength {
				c -= collength
			}
			if board.val(r+row, c+col) > 0 {
				neighbours++
			}
		}
	}
	return neighbours
}

func checkCell(board *Board, row, col int) int {
	alive := board.val(row, col) != 0
	neighbours := checkSurround(board, row, col)

	if neighbours == 3 {
		return 1
	}
	if alive && neighbours == 2 {
		return 1
	}
	return 0
}

func step(board *Board) Board {
	newBoard := *board
	for row := 0; row < len(board.rows()); row++ {
		for col := 0; col < len(board.cols(row)); col++ {
			newBoard.content[row][col] = checkCell(board, row, col)
		}
	}
	return newBoard
}

func seedRandom(board *Board) {
	for row := 0; row < len(board.rows()); row++ {
		for col := 0; col < len(board.cols(row)); col++ {
			rand.Seed(time.Now().UnixNano())
			board.content[row][col] = rand.Intn(2)
		}
	}
}

func checkHistory(history []Board, board Board) int {
	found := -1
	for i, b := range history {
		if b == board {
			found = len(history) - i
			break
		}
	}
	return found - 1
}

func main() {

	iterations := 0
	looped := 0
	var board Board
	var history []Board

	//Seed the board
	seedRandom(&board)

	for {
		printer(&board, iterations, looped)

		if looped == 1 {
			fmt.Println("Life has stalled out")
			break
		} else if looped > 1 {
			fmt.Println("Life got looped")
			break
		}

		looped = checkHistory(history, board)

		board = step(&board)

		history = append(history, board)

		iterations++
		time.Sleep(time.Second / 20)

	}

	fmt.Println("Game Over")

}

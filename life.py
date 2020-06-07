import os
from time import sleep

def printer( board ):
    report = ""
    for row in board:
        for col in row:
            report += u"\u2588" if col > 0 else " "
        report += "\n"
    os.system('cls' if os.name=='nt' else 'clear')
    print( report )

def checkSurround( board, row, col ):
    neighbours = 0
    for r in range(row-1, row+2, 1):
        if r < 0 or r >= len(board) : continue
        for c in range(col-1, col+2, 1):
            if c < 0 or c >= len(board[r]) : continue
            if r == row and c == col : continue
            if board[r][c] > 0 : neighbours += 1
    return neighbours


def checkCell( board, row, col ):
    alive = board[row][col] > 0
    neighbours = checkSurround( board, row, col )

    if neighbours == 3 : return 1
    if alive and neighbours == 2 : return 1
    return 0

def step( board ):
    newBoard = []
    for row in range(len(board)):
        newBoard.append([])
        for col in range(len(board[row])):
            newBoard[row].append( checkCell( board, row, col ) )
    return newBoard


board = []
for row in range(30):
    board.append([])
    for col in range(30):
        board[row].append(0)

# Seed the board
board[10][10] = 1
board[10][11] = 1
board[11][9] = 1
board[11][10] = 1
board[12][10] = 1

for r in range(1000):
    printer( board )
    board = step( board )
    sleep(0.05)


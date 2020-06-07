import os
import md5
import json
import random
from time import sleep

def printer( board, options ):
    report = ("-" * (len(board[0])+2)) + "\n"
    for row in board:
        report += "|"
        for col in row:
            report += u"\u25AE" if col > 0 else " "
        report += "|"
        report += "\n"
    report += ("-" * (len(board[0])+2)) + "\n"
    for key in options:
        if options[key] > 0 :
            report += key + ' : ' + str(options[key]) + "\n"
    os.system('cls' if os.name=='nt' else 'clear')
    print( report )


def checkSurround( board, row, col ):
    neighbours = 0
    for r in range(row-1, row+2, 1):
        if r < 0 : r += len(board) #wrap board
        if r >= len(board) : r -= len(board) #wrap board
        for c in range(col-1, col+2, 1):
            if r == row and c == col : continue
            if c < 0 : c += len(board[r]) #wrap board
            if c >= len(board[r]) : c -= len(board[r]) #wrap board
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


def life( board = [], size = { "h":10, "w":10 } ):
    if len(board) == 0:
        for row in range(size["h"]):
            board.append([])
            for col in range(size["w"]):
                rnd = bool(random.getrandbits(1))
                board[row].append(rnd)

    iterations = 0
    looped = 0
    history = []
    while 1:
        options = { "Iterations":iterations, "History":len(history), "Looped":looped }
        printer( board, options )

        if looped == 1 :
            print('Life has stalled out')
            break
        elif looped > 1 : 
            print('Life got looped')
            break

        oldHash = md5.new()
        oldHash.update( json.dumps(board) )
        oldBoard = oldHash.hexdigest()

        board = step( board )

        newHash = md5.new()
        newHash.update( json.dumps(board) )
        newBoard = newHash.hexdigest()

        if newBoard in history:
            looped = history.index(newBoard) + 1

        #prepend newBoard
        history = [newBoard] + history
        if len(history) > 20 :
            history = history[0:20]

        iterations += 1
        sleep(0.025)
    
    print("Game over")

life([], { "h":10, "w":30 })


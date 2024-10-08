document.addEventListener('DOMContentLoaded', () => {
	const startButton = document.getElementById('Start')
	const resetButton = document.getElementById('Reset')
	const upButton = document.getElementById('up')
	const downButton = document.getElementById('down')
	const leftButton = document.getElementById('left')
	const rightButton = document.getElementById('right')

	startButton.addEventListener('click', initializeGame)
	resetButton.addEventListener('click', resetGame)
	upButton.addEventListener('click', () => handleButtonPress('ArrowUp'))
	downButton.addEventListener('click', () => handleButtonPress('ArrowDown'))
	leftButton.addEventListener('click', () => handleButtonPress('ArrowLeft'))
	rightButton.addEventListener('click', () => handleButtonPress('ArrowRight'))

	updateDisplay()
})

let board = []
let score = 0
let bestScore = 0

const initializeGame = () => {
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	]

	score = 0
	placeRandomTile()
	placeRandomTile()

	updateDisplay()
}

const placeRandomTile = () => {
	let emptyCells = []

	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			if (board[row][col] === 0) {
				emptyCells.push({ row, col })
			}
		}
	}

	if (emptyCells.length > 0) {
		const randomIndex = Math.floor(Math.random() * emptyCells.length)
		const { row, col } = emptyCells[randomIndex]
		board[row][col] = Math.random() < 0.9 ? 2 : 4
	}
}

const updateDisplay = () => {
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			const cellID = row * 4 + col + 1
			const cellElement = document.getElementById(cellID.toString())
			const value = board[row][col]

			console.log(`Updating cell ${cellID} with value ${value}`) // Debugging log
			cellElement.textContent = value === 0 ? '' : value
			cellElement.style.backgroundColor = getTileColor(value)
		}
	}
	document.querySelector('#score h2').textContent = score
	document.querySelector('#bestScore h2').textContent = bestScore
}

const resetGame = () => {
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	]

	score = 0
	updateDisplay()
}

const getTileColor = (value) => {
	switch (value) {
		case 2:
			return '#A4133C'
		case 4:
			return '#006494'
		case 8:
			return '#012966'
		case 16:
			return '#EE9B00'
		case 32:
			return '#BB3E03'
		case 64:
			return '#6E1423'
		case 128:
			return '#00B4D8'
		case 256:
			return '#FF477E'
		case 512:
			return '#2ED1B5'
		case 1024:
			return '#849669'
		case 2048:
			return '#415D43'
		default:
			return '#343A40'
	}
}

const handleButtonPress = (direction) => {
	let moved = false

	switch (direction) {
		case 'ArrowUp':
			moved = moveUp()
			break
		case 'ArrowDown':
			moved = moveDown()
			break
		case 'ArrowLeft':
			moved = moveLeft()
			break
		case 'ArrowRight':
			moved = moveRight()
			break
		default:
			console.log('Invalid direction')
	}

	if (moved) {
		console.log('Tiles moved, placing new tile...')
		placeRandomTile()
		updateDisplay()
		updateBestScore()
		if (checkForWin()) {
			alert('Congratulations! You reached 2048!')
		} else if (checkForTie()) {
			alert('Game Over! No more moves available.')
		}
	} else {
		console.log('No tiles moved')
	}
}

const moveUp = () => {
	let moved = false
	for (let col = 0; col < 4; col++) {
		let tiles = []
		for (let row = 0; row < 4; row++) {
			if (board[row][col] !== 0) {
				tiles.push(board[row][col])
			}
		}
		const mergedTiles = mergeTiles(tiles)
		for (let row = 0; row < 4; row++) {
			if (board[row][col] !== (mergedTiles[row] || 0)) {
				board[row][col] = mergedTiles[row] || 0
				moved = true
			} else {
				board[row][col] = mergedTiles[row] || 0
			}
		}
	}
	return moved
}

const moveDown = () => {
	let moved = false
	for (let col = 0; col < 4; col++) {
		let tiles = []
		for (let row = 3; row >= 0; row--) {
			if (board[row][col] !== 0) {
				tiles.push(board[row][col])
			}
		}
		const mergedTiles = mergeTiles(tiles)
		for (let row = 3; row >= 0; row--) {
			if (board[row][col] !== (mergedTiles[3 - row] || 0)) {
				board[row][col] = mergedTiles[3 - row] || 0
				moved = true
			} else {
				board[row][col] = mergedTiles[3 - row] || 0
			}
		}
	}
	return moved
}

const moveLeft = () => {
	let moved = false
	for (let row = 0; row < 4; row++) {
		let tiles = []
		for (let col = 0; col < 4; col++) {
			if (board[row][col] !== 0) {
				tiles.push(board[row][col])
			}
		}
		const mergedTiles = mergeTiles(tiles)
		for (let col = 0; col < 4; col++) {
			if (board[row][col] !== (mergedTiles[col] || 0)) {
				board[row][col] = mergedTiles[col] || 0
				moved = true
			} else {
				board[row][col] = mergedTiles[col] || 0
			}
		}
	}
	return moved
}

const moveRight = () => {
	let moved = false
	for (let row = 0; row < 4; row++) {
		let tiles = []
		for (let col = 3; col >= 0; col--) {
			if (board[row][col] !== 0) {
				tiles.push(board[row][col])
			}
		}
		const mergedTiles = mergeTiles(tiles)
		for (let col = 3; col >= 0; col--) {
			if (board[row][col] !== (mergedTiles[3 - col] || 0)) {
				board[row][col] = mergedTiles[3 - col] || 0
				moved = true
			} else {
				board[row][col] = mergedTiles[3 - col] || 0
			}
		}
	}
	return moved
}

const mergeTiles = (tiles) => {
	let merged = []
	for (let i = 0; i < tiles.length; i++) {
		if (tiles[i] === tiles[i + 1]) {
			const newValue = tiles[i] * 2
			merged.push(newValue)
			score += newValue // Update score when tiles are merged
			i++ // Skip the next tile since it has been merged
		} else {
			merged.push(tiles[i])
		}
	}
	return merged
}

const checkForWin = () => {
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			if (board[row][col] === 2048) {
				return true
			}
		}
	}
	return false
}

const checkForTie = () => {
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			if (board[row][col] === 0) {
				return false
			}
			if (col < 3 && board[row][col] === board[row][col + 1]) {
				return false
			}
			if (row < 3 && board[row][col] === board[row + 1][col]) {
				return false
			}
		}
	}
	return true
}

const updateBestScore = () => {
	if (score > bestScore) {
		bestScore = score
	}
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const width = 10
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const colors = [
        'url(images/blue_block.png)',
        'url(images/green_block.png)',
        'url(images/pink_block.png)',
        'url(images/purple_block.png)',
        'url(images/yellow_block.png)'
    ]
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]
    const tTetrominio = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
    ]
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]
    const tetrominoes = [lTetromino, zTetromino, tTetrominio, oTetromino, iTetromino]

    let squares = Array.from(document.querySelectorAll('.grid div'))
    let currentPosition = 4
    let currentRotation = 0
    let random = Math.floor(Math.random()*tetrominoes.length)
    let current = tetrominoes[random][currentRotation]
    let timerId
    let score = 0

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundImage = colors[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundImage = 'none'
        })
    }


    function control(event) {
        if (event.keyCode === 37 || event.keyCode == 65) {
            moveLeft()
        } else if (event.keyCode === 38 || event.keyCode == 87) {
            rotate()
        } else if (event.keyCode === 39 || event.keyCode == 68) {
            moveRight()
        }
    }

    document.addEventListener('keyup', control)

    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
            startButton.innerHTML = 'Start'
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            startButton.innerHTML = 'Pause'
        }
    })

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('block3') || squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[index + currentPosition].classList.add('taken'))
            random = Math.floor(Math.random() * tetrominoes.length)
            current = tetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            addScore()
            gameOver()
          }
    }

    function moveLeft() {
        undraw()
        const atLeft =  current.some(index => (currentPosition+index)%width===0)

        if (!atLeft) currentPosition --

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition ++
        }

        draw()
    }

    function moveRight() {
        undraw()
        const atRight = current.some(index => (currentPosition + index) % width === width -1)
        if (!atRight) currentPosition ++
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition --
        }
        draw()
    }

    function rotate() {
        undraw()
        currentRotation ++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = tetrominoes[random][currentRotation]
    draw()
    }
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundImage = 'none'
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over'
            clearInterval(timerId)
        }
    }
})
"use client"

import { useState, useEffect, useCallback } from "react"

interface Position {
  x: number
  y: number
}

interface Player {
  id: number
  position: Position
  currentPhotoId: number
}

interface Photo {
  id: number
  name: string
  url: string
  collected: boolean
}

// Layouts de labirinto otimizados para mobile (12x8 para melhor visualização)
const MAZE_LAYOUTS = [
  // Fase 1 - Labirinto simples
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  //Fase 2 - Labirinto em cruz
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Fase 3 - Labirinto complexo
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
]

export default function MobileGame() {
  // Bloquear scroll e zoom da página
  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"
    document.body.style.height = "100%"

    // Prevenir zoom
    const viewport = document.querySelector("meta[name=viewport]")
    if (viewport) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
    }

    return () => {
      document.body.style.overflow = "auto"
      document.body.style.position = "static"
      document.body.style.width = "auto"
      document.body.style.height = "auto"
    }
  }, [])

  // Dimensões otimizadas para Redmi Note 13 (392x851px)
  const MOBILE_WIDTH = 360
  const MOBILE_HEIGHT = 240
  const CELL_SIZE = 30
  const PLAYER_SIZE = 24

  const [player1, setPlayer1] = useState<Player>({
    id: 1,
    position: { x: CELL_SIZE + 5, y: CELL_SIZE + 5 },
    currentPhotoId: 0,
  })

  const [player2, setPlayer2] = useState<Player>({
    id: 2,
    position: { x: MOBILE_WIDTH - CELL_SIZE * 5, y: MOBILE_HEIGHT - CELL_SIZE * 2 },
    currentPhotoId: 1,
  })

  const [photos, setPhotos] = useState<Photo[]>([
    { id: 0, name: "Caçador", url: "/img/0.jpg", collected: true },
    { id: 1, name: "Saudades baby 💕", url: "/img/1.jpg", collected: false },
    { id: 2, name: "Dois sushizeiros hehe 💕", url: "/img/2.jpg", collected: false },
    { id: 3, name: "💕 Uma gatinha você em? 💕", url: "/img/3.jpg", collected: false },
    { id: 4, name: "💕 Um belo casal ^^", url: "/img/4.jpg", collected: false },
    { id: 5, name: "Essa é antiga em? ou classica? 💕", url: "/img/5.jpg", collected: false },
    { id: 6, name: "💕Essa você ta linda em? uiui💕", url: "/img/6.jpg", collected: false },
    { id: 7, name: "💕💕Essa nós estamos lindos em ksks", url: "/img/7.jpg", collected: false },
    { id: 8, name: "Um belo casal trajado hehe💕", url: "/img/8.jpg", collected: false },
    { id: 9, name: "💕Você e seu hobby favorito rsr", url: "/img/0.jpg", collected: false },
  ])

  const [gameStarted, setGameStarted] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const currentMaze = MAZE_LAYOUTS[currentPhase % MAZE_LAYOUTS.length]

  // Velocidades otimizadas para mobile
  const PLAYER1_SPEED = 15
  const PLAYER2_SPEED_BASE = difficulty === "easy" ? 25 : difficulty === "medium" ? 35 : 45
  const PLAYER2_THINK_INTERVAL = 200

  const collectedCount = photos.filter((photo) => photo.collected).length
  const totalPhotos = photos.length - 1

  // Verificar posição válida - versão corrigida
  const isValidPosition = useCallback(
    (x: number, y: number) => {
      // Verificar se está dentro dos limites da tela
      if (x < 0 || y < 0 || x + PLAYER_SIZE > MOBILE_WIDTH || y + PLAYER_SIZE > MOBILE_HEIGHT) {
        return false
      }

      // Verificar colisão com as paredes do labirinto
      // Verificar os 4 cantos do jogador
      const corners = [
        { x: x, y: y }, // canto superior esquerdo
        { x: x + PLAYER_SIZE - 1, y: y }, // canto superior direito
        { x: x, y: y + PLAYER_SIZE - 1 }, // canto inferior esquerdo
        { x: x + PLAYER_SIZE - 1, y: y + PLAYER_SIZE - 1 }, // canto inferior direito
      ]

      for (const corner of corners) {
        const gridX = Math.floor(corner.x / CELL_SIZE)
        const gridY = Math.floor(corner.y / CELL_SIZE)

        // Verificar se está dentro dos limites da grade
        if (gridX < 0 || gridX >= currentMaze[0].length || gridY < 0 || gridY >= currentMaze.length) {
          return false
        }

        // Verificar se há uma parede nesta posição
        if (currentMaze[gridY][gridX] === 1) {
          return false
        }
      }

      return true
    },
    [currentMaze, CELL_SIZE, PLAYER_SIZE, MOBILE_WIDTH, MOBILE_HEIGHT],
  )

  // Verificar colisão
  const checkCollision = useCallback((pos1: Position, pos2: Position) => {
    const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2))
    return distance < PLAYER_SIZE
  }, [])

  // Movimentar jogador 1 - versão corrigida
  const movePlayer1 = (direction: string) => {
    if (!gameStarted || gameWon) return

    setPlayer1((prev) => {
      const newPos = { ...prev.position }
      const moveSpeed = PLAYER1_SPEED

      switch (direction) {
        case "up":
          newPos.y = Math.max(0, newPos.y - moveSpeed)
          break
        case "down":
          newPos.y = Math.min(MOBILE_HEIGHT - PLAYER_SIZE, newPos.y + moveSpeed)
          break
        case "left":
          newPos.x = Math.max(0, newPos.x - moveSpeed)
          break
        case "right":
          newPos.x = Math.min(MOBILE_WIDTH - PLAYER_SIZE, newPos.x + moveSpeed)
          break
      }

      // Verificar se a nova posição é válida (não colide com paredes)
      if (isValidPosition(newPos.x, newPos.y)) {
        return { ...prev, position: newPos }
      }

      // Se não for válida, tentar movimento menor para suavizar
      const smallerMove = Math.floor(moveSpeed / 2)
      const smallerPos = { ...prev.position }

      switch (direction) {
        case "up":
          smallerPos.y = Math.max(0, smallerPos.y - smallerMove)
          break
        case "down":
          smallerPos.y = Math.min(MOBILE_HEIGHT - PLAYER_SIZE, smallerPos.y + smallerMove)
          break
        case "left":
          smallerPos.x = Math.max(0, smallerPos.x - smallerMove)
          break
        case "right":
          smallerPos.x = Math.min(MOBILE_WIDTH - PLAYER_SIZE, smallerPos.x + smallerMove)
          break
      }

      if (isValidPosition(smallerPos.x, smallerPos.y)) {
        return { ...prev, position: smallerPos }
      }

      // Se ainda não for válida, não mover
      return prev
    })
  }

  // IA do jogador 2 - versão corrigida
  useEffect(() => {
    if (!gameStarted || gameWon) return

    const movePlayer2AwayFromPlayer1 = () => {
      setPlayer2((prev) => {
        const dx = player1.position.x - prev.position.x
        const dy = player1.position.y - prev.position.y

        let bestDirection = ""
        let maxDistance = -1

        const directions = [
          { name: "up", dx: 0, dy: -PLAYER2_SPEED_BASE },
          { name: "down", dx: 0, dy: PLAYER2_SPEED_BASE },
          { name: "left", dx: -PLAYER2_SPEED_BASE, dy: 0 },
          { name: "right", dx: PLAYER2_SPEED_BASE, dy: 0 },
        ]

        for (const dir of directions) {
          let newX = prev.position.x + dir.dx
          let newY = prev.position.y + dir.dy

          // Limitar dentro da área do jogo
          newX = Math.max(0, Math.min(MOBILE_WIDTH - PLAYER_SIZE, newX))
          newY = Math.max(0, Math.min(MOBILE_HEIGHT - PLAYER_SIZE, newY))

          if (isValidPosition(newX, newY)) {
            const newDist = Math.sqrt(Math.pow(player1.position.x - newX, 2) + Math.pow(player1.position.y - newY, 2))

            if (newDist > maxDistance) {
              maxDistance = newDist
              bestDirection = dir.name
            }
          }
        }

        if (bestDirection) {
          const newPos = { ...prev.position }

          switch (bestDirection) {
            case "up":
              newPos.y = Math.max(0, newPos.y - PLAYER2_SPEED_BASE)
              break
            case "down":
              newPos.y = Math.min(MOBILE_HEIGHT - PLAYER_SIZE, newPos.y + PLAYER2_SPEED_BASE)
              break
            case "left":
              newPos.x = Math.max(0, newPos.x - PLAYER2_SPEED_BASE)
              break
            case "right":
              newPos.x = Math.min(MOBILE_WIDTH - PLAYER_SIZE, newPos.x + PLAYER2_SPEED_BASE)
              break
          }

          if (isValidPosition(newPos.x, newPos.y)) {
            return { ...prev, position: newPos }
          }
        }

        // Fallback: tentar movimento aleatório se não conseguir fugir
        const randomDirections = ["up", "down", "left", "right"]
        const shuffled = [...randomDirections].sort(() => 0.5 - Math.random())

        for (const dir of shuffled) {
          const newPos = { ...prev.position }
          const smallMove = Math.floor(PLAYER2_SPEED_BASE)

          switch (dir) {
            case "up":
              newPos.y = Math.max(0, newPos.y - smallMove)
              break
            case "down":
              newPos.y = Math.min(MOBILE_HEIGHT - PLAYER_SIZE, newPos.y + smallMove)
              break
            case "left":
              newPos.x = Math.max(0, newPos.x - smallMove)
              break
            case "right":
              newPos.x = Math.min(MOBILE_WIDTH - PLAYER_SIZE, newPos.x + smallMove)
              break
          }

          if (isValidPosition(newPos.x, newPos.y)) {
            return { ...prev, position: newPos }
          }
        }

        return prev
      })
    }

    const interval = setInterval(movePlayer2AwayFromPlayer1, PLAYER2_THINK_INTERVAL)
    return () => clearInterval(interval)
  }, [
    gameStarted,
    gameWon,
    isValidPosition,
    player1.position,
    PLAYER2_SPEED_BASE,
    MOBILE_WIDTH,
    MOBILE_HEIGHT,
    PLAYER_SIZE,
  ])

  // Verificar colisões e coletar fotos
  useEffect(() => {
    if (checkCollision(player1.position, player2.position)) {
      const currentPhoto = photos.find((photo) => photo.id === player2.currentPhotoId)

      if (currentPhoto && !currentPhoto.collected) {
        setPhotos((prev) =>
          prev.map((photo) => (photo.id === player2.currentPhotoId ? { ...photo, collected: true } : photo)),
        )
      }

      const uncollectedPhotos = photos.filter((photo) => photo.id !== 0 && !photo.collected)

      if (uncollectedPhotos.length > 0) {
        const nextPhoto = uncollectedPhotos[Math.floor(Math.random() * uncollectedPhotos.length)]
        setPlayer2((prev) => ({ ...prev, currentPhotoId: nextPhoto.id }))

        if (Math.random() < 0.4) {
          setCurrentPhase((prev) => (prev + 1) % MAZE_LAYOUTS.length)
        }
      }

      // Reposicionar jogadores
      setPlayer1((prev) => ({ ...prev, position: { x: 30, y: 30 } }))
      setPlayer2((prev) => ({ ...prev, position: { x: 300, y: 180 } }))
    }
  }, [player1.position, player2.position, checkCollision, photos])

  // Verificar vitória
  useEffect(() => {
    const nonPlayerPhotos = photos.filter((photo) => photo.id !== 0)
    if (nonPlayerPhotos.every((photo) => photo.collected)) {
      setGameWon(true)
    }
  }, [photos])

  const resetGame = () => {
    // Posições iniciais seguras (em células livres)
    const safeStartPos1 = { x: CELL_SIZE + 5, y: CELL_SIZE + 5 }
    const safeStartPos2 = { x: MOBILE_WIDTH - CELL_SIZE * 2, y: MOBILE_HEIGHT - CELL_SIZE * 2 }

    setPlayer1({ id: 1, position: safeStartPos1, currentPhotoId: 0 })
    setPlayer2({ id: 2, position: safeStartPos2, currentPhotoId: 1 })
    setPhotos((prev) => prev.map((photo) => ({ ...photo, collected: photo.id === 0 })))
    setCurrentPhase(0)
    setGameWon(false)
    setGameStarted(false)
  }

  const currentPlayer1Photo = photos.find((photo) => photo.id === player1.currentPhotoId)
  const currentPlayer2Photo = photos.find((photo) => photo.id === player2.currentPhotoId)

  // Controles de teclado
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!gameStarted || gameWon) return

      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          event.preventDefault()
          movePlayer1("up")
          break
        case "ArrowDown":
        case "s":
        case "S":
          event.preventDefault()
          movePlayer1("down")
          break
        case "ArrowLeft":
        case "a":
        case "A":
          event.preventDefault()
          movePlayer1("left")
          break
        case "ArrowRight":
        case "d":
        case "D":
          event.preventDefault()
          movePlayer1("right")
          break
      }
    },
    [gameStarted, gameWon],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress, gameStarted, gameWon])

  return (
    <div
      className="h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 flex flex-col items-center justify-center p-2 overflow-hidden touch-none select-none"
      style={{
        height: "100vh",
        // height: "100dvh",
        maxHeight: "-webkit-fill-available",
      }}
    >
      {/* Header compacto */}
      <div className="text-center mb-3 w-full">
        <h1 className="text-lg font-bold text-white mb-1">📸 Colete nossas fotos para completar o album! 💕</h1>
        <div className="text-purple-300 text-sm font-medium">
          {collectedCount}/{totalPhotos} fotos coletadas
        </div>
      </div>

      {/* Seletor de dificuldade */}
      <div className="mb-3 flex gap-2 justify-center">
        {["easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level as any)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              difficulty === level
                ? "bg-purple-500 text-white shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {level === "easy" ? "Fácil" : level === "medium" ? "Médio" : "Difícil"}
          </button>
        ))}
      </div>

      {/* Avatares dos jogadores */}
      <div className="flex gap-4 mb-3">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-1 rounded-full overflow-hidden border-2 border-purple-400 shadow-lg">
            {currentPlayer1Photo && (
              <img
                src={currentPlayer1Photo.url || "/placeholder.svg"}
                alt={currentPlayer1Photo.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="text-white font-bold text-xs">EuVicky</div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-1 rounded-full overflow-hidden border-2 border-indigo-400 shadow-lg">
            {currentPlayer2Photo && (
              <img
                src={currentPlayer2Photo.url || "/placeholder.svg"}
                alt={currentPlayer2Photo.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="text-white font-bold text-xs">LukGod3</div>
        </div>
      </div>

      {/* Área do jogo */}
      <div
        className="relative border-2 border-purple-400 rounded-xl overflow-hidden shadow-2xl bg-black mb-4"
        style={{ width: MOBILE_WIDTH, height: MOBILE_HEIGHT }}
      >
        {/* Renderizar labirinto */}
        {currentMaze.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`absolute ${cell === 1 ? "bg-slate-800 border border-purple-500/30" : "bg-black"}`}
              style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          )),
        )}

        {/* Jogador 1 */}
        <div
          className="absolute transition-all duration-150 rounded-full border-2 border-purple-400 shadow-lg z-10 overflow-hidden"
          style={{
            left: player1.position.x,
            top: player1.position.y,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
          }}
        >
          {currentPlayer1Photo && (
            <img
              src={currentPlayer1Photo.url || "/placeholder.svg"}
              alt={currentPlayer1Photo.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Jogador 2 */}
        <div
          className="absolute transition-all duration-200 rounded-full border-2 border-indigo-400 shadow-lg z-10 overflow-hidden"
          style={{
            left: player2.position.x,
            top: player2.position.y,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
          }}
        >
          {currentPlayer2Photo && (
            <img
              src={currentPlayer2Photo.url || "/placeholder.svg"}
              alt={currentPlayer2Photo.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Tela de início */}
        {!gameStarted && !gameWon && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
            <div className="text-center p-4 max-w-xs">
              <h2 className="text-white text-base font-bold mb-2">Hello Baby! 💕</h2>
              <p className="text-purple-300 text-sm mb-3">
                Este é um joguinho para demonstrar meu amor. Colete nossas fotos para completar o álbum!
              </p>
              <p className="text-gray-300 mb-4 text-xs">
                Dificuldade: {difficulty === "easy" ? "Fácil" : difficulty === "medium" ? "Médio" : "Difícil"}
              </p>
              <button
                onClick={() => setGameStarted(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-full transition-all shadow-lg active:scale-95"
              >
                Iniciar Caçada 🎯
              </button>
            </div>
          </div>
        )}

        {/* Tela de vitória */}
        {gameWon && (
      <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20 p-4">
      <div className="text-center max-w-xs max-h-[200px] overflow-y-auto p-2 rounded-lg border border-purple-400">
        <h2 className="text-purple-400 text-xs font-bold mb-2">Parabéns amor! 🎉</h2>
        <p className="text-white text-sm mb-2">
          Feliz dia dos namorados, rs obrigado por tudo baby, eu agradeço a Deus todos os dias por ter colocado
          uma pessoa incrível como você na minha vida 💕
        </p>
        <p className="text-purple-300 text-xs mb-3">
          Sei que às vezes tiro sua paciência, rsrs mas não é de propósito embora às vezes pareça kkk ...
        </p>
        <p className="text-purple-300 text-xs mb-3">
          te amo baby eu tenho certeza de que você é a mulher da minha vida
        </p>
        <p className="text-purple-300 text-xs mb-3">
          Estou ansiosíssimo para que possamos passar o resto da vida juntos. Que Deus nos abençoe sempre e guie
          nosso caminho.
        </p>
        <p className="text-gray-300 mb-4 text-xs">
          Todas as {totalPhotos} fotos foram coletadas! 📸
        </p>
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-full transition-all shadow-lg active:scale-95"
        >
          Jogar Novamente 🔄
        </button>
      </div>
    </div>
        )}
      </div>

      {/* Controles e álbum */}
      <div className="flex gap-6 items-center justify-center w-full max-w-sm">
        {/* Controles direcionais */}
        <div className="flex flex-col items-center">
          <div className="text-white font-bold mb-2 text-xs">Controles</div>
          <div className="flex flex-col items-center gap-1">
            <button
              onTouchStart={(e) => {
                e.preventDefault()
                movePlayer1("up")
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                movePlayer1("up")
              }}
              onClick={(e) => {
                e.preventDefault()
                movePlayer1("up")
              }}
              className="w-12 h-12 bg-purple-700 active:bg-purple-800 hover:bg-purple-600 text-white rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center text-lg font-bold touch-manipulation select-none"
              disabled={!gameStarted || gameWon}
            >
              ↑
            </button>
            <div className="flex gap-1">
              <button
                onTouchStart={(e) => {
                  e.preventDefault()
                  movePlayer1("left")
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  movePlayer1("left")
                }}
                onClick={(e) => {
                  e.preventDefault()
                  movePlayer1("left")
                }}
                className="w-12 h-12 bg-purple-700 active:bg-purple-800 hover:bg-purple-600 text-white rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center text-lg font-bold touch-manipulation select-none"
                disabled={!gameStarted || gameWon}
              >
                ←
              </button>
              <div className="w-12 h-12"></div>
              <button
                onTouchStart={(e) => {
                  e.preventDefault()
                  movePlayer1("right")
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  movePlayer1("right")
                }}
                onClick={(e) => {
                  e.preventDefault()
                  movePlayer1("right")
                }}
                className="w-12 h-12 bg-purple-700 active:bg-purple-800 hover:bg-purple-600 text-white rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center text-lg font-bold touch-manipulation select-none"
                disabled={!gameStarted || gameWon}
              >
                →
              </button>
            </div>
            <button
              onTouchStart={(e) => {
                e.preventDefault()
                movePlayer1("down")
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                movePlayer1("down")
              }}
              onClick={(e) => {
                e.preventDefault()
                movePlayer1("down")
              }}
              className="w-12 h-12 bg-purple-700 active:bg-purple-800 hover:bg-purple-600 text-white rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center text-lg font-bold touch-manipulation select-none"
              disabled={!gameStarted || gameWon}
            >
              ↓
            </button>
          </div>
        </div>

        {/* Álbum de fotos */}
        <div className="p-3 bg-black/50 rounded-lg border border-purple-500/30">
          <h3 className="text-white font-bold text-center mb-2 text-xs">🏆 Álbum</h3>
          <div className="grid grid-cols-3 gap-1">
            {photos
              .filter((photo) => photo.id !== 0)
              .map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => photo.collected && setSelectedPhoto(photo)}
                  className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                    photo.collected
                      ? "border-purple-400 bg-purple-600/20 shadow-lg hover:bg-purple-600/40 cursor-pointer"
                      : "border-gray-600 bg-gray-800 cursor-not-allowed"
                  }`}
                  disabled={!photo.collected}
                >
                  {photo.collected ? (
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={photo.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">?</span>
                  )}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Botões de controle do jogo */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white rounded-lg transition-all text-xs font-medium active:scale-95"
        >
          Reiniciar 🔄
        </button>
        <button
          onClick={() => setGameStarted(!gameStarted)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg transition-all text-xs font-medium active:scale-95"
          disabled={gameWon}
        >
          {gameStarted ? "Pausar ⏸️" : "Continuar ▶️"}
        </button>
      </div>

      {/* Popup de foto */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-purple-950 bg-opacity-60 rounded-lg max-w-sm w-full max-h-[80vh] overflow-hidden">
            <div className="relative">
              <img
                src={selectedPhoto.url || "/placeholder.svg"}
                alt={selectedPhoto.name}
                className="w-full h-auto max-h-[60vh] object-cover"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-4 text-center bg-opacity-45">
              <h3 className="text-lg font-bold  text-purple-200 text-opacity-90 mb-2">{selectedPhoto.name}</h3>

            </div>
          </div>
        </div>
      )}

      {/* Créditos */}
      <div className="mt-3 text-center text-gray-400 text-xs">
        <p>Feito com 💜 por @luc4sDevBr</p>
      </div>
    </div>
  )
}

// import Image from "next/image";
// import {Button} from "@nextui-org/button";
// import Link from "next/link";
// import { Linkedin, Github } from "lucide-react"
// import CarouselXP from "@/components/CarousselXP";

// export default function Home() {
//   return (
//     <main className="w-full h-screen">
//       <section className="w-full h-full flex-col flex items-center justify-start gap-16 bg-white">
//         <div className="w-auto">
//           <ul className="w-auto mt-5 flex items-center text-xl text-center gap-5">
           
//           </ul>
//         </div>
//         <div id="containerCentral" className="w-full h-3/4 md:w-3/4 md:items-end md:h-3/4 bg-slate-700 rounded-md p-2 flex flex-col md:flex-row items-center">
//           <div id="containerText" className="w-full h-full flex flex-col justify-center md:flex md:items-start md:w-full md:h-auto  items-center">
             
//             <div
//               id="containerText2"
//               className="w-full  md:w-1/2 p-4 md:p-10 text-left"
//             >
//               <h1 className="text-3xl font-bold text-teal-50">A Vida na Aldeia</h1>
//               <span className="text-sm text-white break-words">
//                 Em uma aldeia tranquila, cercada por colinas e um rio sereno, a vida seguia em harmonia com a natureza. As manhãs começavam com o canto dos pássaros e o aroma do pão fresco.
//               </span>
             
//             </div>
//             <div className="w-full flex p-4 gap-2 md:w-full md:p-10 md:flex md:justify-end md:items-end ">
//                 <Link className=" " href={"https://www.linkedin.com/in/lucas-conrado-784a571a1/"}>
//                   <Button className="">
//                     <Linkedin color="#ffffff"/>
//                   </Button>
//                 </Link>
//                 <Link className=" " href={"https://github.com/luc4sDevBr"}>
//                   <Button className="">
//                     <Github color="#ffffff"/>
//                   </Button>
//                 </Link>
//             </div>
//           </div>
//           <div
//             id="containerlOGO"
//             className="w-40 h-40 absolute bottom-5/7 flex md:w-40 md:h-40 md:absolute md:bottom-5/7 md:left-3/4 bg-gray-500 border-8 border-white rounded-full"
//           > </div>
       
//           <div
//             id="containerButtons"
//             className=" w-full h-20 bottom-10 absolute flex items-center md:w-1/2 md:h-20 md:absolute md:bottom-10 md:left-20 bg-gray-500 border-8 border-white rounded-full"
//           >
//             <div className="w-full justify-center">
//                 <ul className="w-auto flex items-center justify-evenly text-white font-light text-sm text-center gap-5 md:w-auto md:text-xl">
//                   <Link className=" " href={"/"}>
//                     <Button className="">
//                       <li>Sobre</li>
//                     </Button>
//                   </Link>
//                   <Link className=" " href={"/Experiencias"}>
//                     <Button className="">
//                       <li>Experiencias</li>
//                     </Button>
//                   </Link>
//                   <Link className=" " href={"/"}>
//                     <Button className="">
//                       <li>Trabalhos</li>
//                     </Button>
//                   </Link>
//                   <Link className=" " href={"/"}>
//                     <Button className="">
//                       <li>Contatos</li>
//                     </Button>
//                   </Link>
//                 </ul>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="w-full h-screen flex-col flex items-center justify-center bg-slate-600">
//         <CarouselXP />
//       </section>
//     </main>
//   );
// }

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

// Layouts de labirinto (0 = livre, 1 = parede)
const MAZE_LAYOUTS = [
  // Fase 1 - Labirinto simples
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Fase 2 - Labirinto em cruz
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Fase 3 - Labirinto complexo
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
]

export default function MiniGame() {
  const [player1, setPlayer1] = useState<Player>({
    id: 1,
    position: { x: 50, y: 50 },
    currentPhotoId: 0, // Jogador 1 sempre usa a mesma foto
  })

  const [player2, setPlayer2] = useState<Player>({
    id: 2,
    position: { x: 700, y: 450},
    currentPhotoId: 1, // Começa com a primeira foto do álbum
  })

  const [photos, setPhotos] = useState<Photo[]>([
    { id: 0, name: "Caçador", url: "/img/0.jpg", collected: true }, // Foto do jogador 1
    { id: 1, name: "Gato", url: "/img/1.jpg", collected: false },
    { id: 2, name: "Cachorro", url: "/img/2.jpg", collected: false },
    { id: 3, name: "Pássaro", url: "/img/3.jpg", collected: false },
    { id: 4, name: "Peixe", url: "/img/4.jpg", collected: false },
    { id: 5, name: "Borboleta", url: "/img/5.jpg", collected: false },
    { id: 6, name: "Abelha", url: "/img/6.jpg", collected: false },
    { id: 7, name: "Tartaruga", url: "/img/7.jpg", collected: false },
    { id: 8, name: "Coelho", url: "/img/8.jpg", collected: false },
    { id: 9, name: "Coelho", url: "/img/0.jpg", collected: false },
  ])

  const [gameStarted, setGameStarted] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")

  // Substituir as constantes de tamanho por um sistema mais responsivo
  const [screenSize, setScreenSize] = useState({ width: 350, height: 300 })

  useEffect(() => {
    const updateScreenSize = () => {
      const isMobile = window.innerWidth < 768
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (isMobile) {
        // Para mobile, usar quase toda a largura disponível
        const gameWidth = Math.min(viewportWidth - 16, 350)
        const gameHeight = Math.min(viewportHeight * 0.35, 300)
        setScreenSize({ width: gameWidth, height: gameHeight })
      } else {
        // Para desktop, manter tamanhos maiores
        setScreenSize({ width: 800, height: 550 })
      }
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    window.addEventListener("orientationchange", updateScreenSize)
    return () => {
      window.removeEventListener("resize", updateScreenSize)
      window.removeEventListener("orientationchange", updateScreenSize)
    }
  }, [])

  const isMobile = screenSize.width < 400
  const PLAYER1_SPEED = isMobile ? 20 : 50
  const PLAYER2_SPEED_BASE =
    difficulty === "easy" ? (isMobile ? 10 : 25) : difficulty === "medium" ? (isMobile ? 15 : 30) : isMobile ? 18 : 40

  const GAME_WIDTH = screenSize.width
  const GAME_HEIGHT = screenSize.height
  const PLAYER_SIZE = isMobile ? 20 : 40
  const CELL_SIZE = Math.floor(GAME_WIDTH / 16)

  const currentMaze = MAZE_LAYOUTS[currentPhase % MAZE_LAYOUTS.length]
  const collectedCount = photos.filter((photo) => photo.collected).length
  const totalPhotos = photos.length - 1// Excluindo a foto do jogador 1
  const PLAYER2_THINK_INTERVAL = 250

  // Verificar se uma posição é válida (não é parede)
  const isValidPosition = useCallback(
    (x: number, y: number) => {
      const gridX = Math.floor(x / CELL_SIZE+0.5)
      const gridY = Math.floor(y / CELL_SIZE+0.5)

      if (gridX < 0 || gridX >= currentMaze[0].length || gridY < 0 || gridY >= currentMaze.length) {
        return false
      }

      return currentMaze[gridY][gridX] === 0
    },
    [currentMaze, CELL_SIZE],
  )

  // Detectar colisão entre jogadores
  const checkCollision = useCallback(
    (pos1: Position, pos2: Position) => {
      const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2))
      return distance < PLAYER_SIZE
    },
    [PLAYER_SIZE],
  )

  // Atualizar a função movePlayer1 para usar proporções responsivas
  const movePlayer1 = (direction: string) => {
    if (!gameStarted || gameWon) return

    setPlayer1((prev) => {
      const newPos = { ...prev.position }
      const moveSpeed = PLAYER1_SPEED

      switch (direction) {
        case "up":
          newPos.y -= moveSpeed
          break
        case "down":
          newPos.y += moveSpeed
          break
        case "left":
          newPos.x -= moveSpeed
          break
        case "right":
          newPos.x += moveSpeed
          break
      }

      // Manter dentro dos limites proporcionais
      newPos.x = Math.max(0, Math.min(800 - 50, newPos.x))
      newPos.y = Math.max(0, Math.min(550 - 50, newPos.y))

      if (isValidPosition(newPos.x, newPos.y)) {
        return { ...prev, position: newPos }
      }

      return prev
    })
  }

  // IA do jogador 2 - tenta escapar do jogador 1
  useEffect(() => {
    if (!gameStarted || gameWon) return

    const movePlayer2AwayFromPlayer1 = () => {
      setPlayer2((prev) => {
        // Calcular a direção para se afastar do jogador 1
        const dx = player1.position.x - prev.position.x
        const dy = player1.position.y - prev.position.y

        // Determinar a direção oposta (para fugir)
        let bestDirection = ""
        let maxDistance = -1

        // Verificar todas as direções possíveis
        const directions = [
          { name: "up", dx: 0, dy: -PLAYER2_SPEED_BASE },
          { name: "down", dx: 0, dy: PLAYER2_SPEED_BASE },
          { name: "left", dx: -PLAYER2_SPEED_BASE, dy: 0 },
          { name: "right", dx: PLAYER2_SPEED_BASE, dy: 0 },
        ]

        // Priorizar direções que aumentam a distância do jogador 1
        for (const dir of directions) {
          const newX = prev.position.x + dir.dx
          const newY = prev.position.y + dir.dy

          if (isValidPosition(newX, newY)) {
            // Calcular nova distância se mover nesta direção
            const newDist = Math.sqrt(Math.pow(player1.position.x - newX, 2) + Math.pow(player1.position.y - newY, 2))

            // Se esta direção aumenta a distância mais que as anteriores
            if (newDist > maxDistance) {
              maxDistance = newDist
              bestDirection = dir.name
            }
          }
        }

        // Se encontrou uma direção válida
        if (bestDirection) {
          const newPos = { ...prev.position }

          switch (bestDirection) {
            case "up":
              newPos.y -= PLAYER2_SPEED_BASE
              break
            case "down":
              newPos.y += PLAYER2_SPEED_BASE
              break
            case "left":
              newPos.x -= PLAYER2_SPEED_BASE
              break
            case "right":
              newPos.x += PLAYER2_SPEED_BASE
              break
          }

          // Verificação final de validade
          if (isValidPosition(newPos.x, newPos.y)) {
            return { ...prev, position: newPos }
          }
        }

        // Se não encontrou direção boa, tenta movimento aleatório como fallback
        const randomDirections = ["up", "down", "left", "right"]
        const shuffled = [...randomDirections].sort(() => 2 - Math.random())

        for (const dir of shuffled) {
          const newPos = { ...prev.position }

          switch (dir) {
            case "up":
              newPos.y -= PLAYER2_SPEED_BASE
              break
            case "down":
              newPos.y += PLAYER2_SPEED_BASE
              break
            case "left":
              newPos.x -= PLAYER2_SPEED_BASE
              break
            case "right":
              newPos.x += PLAYER2_SPEED_BASE
              break
          }

          if (isValidPosition(newPos.x, newPos.y)) {
            return { ...prev, position: newPos }
          }
        }

        return prev // Se nenhum movimento for possível
      })
    }

    const interval = setInterval(movePlayer2AwayFromPlayer1, PLAYER2_THINK_INTERVAL)
    return () => clearInterval(interval)
  }, [gameStarted, gameWon, isValidPosition, player1.position, PLAYER2_SPEED_BASE])

  // Verificar colisões e coletar fotos
  useEffect(() => {
    if (checkCollision(player1.position, player2.position)) {
      const currentPhoto = photos.find((photo) => photo.id === player2.currentPhotoId)

      if (currentPhoto && !currentPhoto.collected) {
        // Coletar a foto atual
        setPhotos((prev) =>
          prev.map((photo) => (photo.id === player2.currentPhotoId ? { ...photo, collected: true } : photo)),
        )
      }

      // Encontrar próxima foto não coletada para o jogador 2
      const uncollectedPhotos = photos.filter((photo) => photo.id !== 0 && !photo.collected)

      if (uncollectedPhotos.length > 0) {
        const nextPhoto = uncollectedPhotos[Math.floor(Math.random() * uncollectedPhotos.length)]
        setPlayer2((prev) => ({ ...prev, currentPhotoId: nextPhoto.id }))

        // Mudar fase ocasionalmente
        if (Math.random() < 0.3) {
          setCurrentPhase((prev) => (prev + 1) % MAZE_LAYOUTS.length)
        }
      }

      // Reposicionar jogadores
      setPlayer1((prev) => ({ ...prev, position: { x: 50, y: 50 } }))
      setPlayer2((prev) => ({ ...prev, position: { x: 700, y: 500 } }))
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
    setPlayer1({ id: 1, position: { x: 50, y: 50 }, currentPhotoId: 0 })
    setPlayer2({ id: 2, position: { x: 700, y: 500 }, currentPhotoId: 1 })
    setPhotos((prev) => prev.map((photo) => ({ ...photo, collected: photo.id === 0 })))
    setCurrentPhase(0)
    setGameWon(false)
    setGameStarted(false)
  }

  const currentPlayer1Photo = photos.find((photo) => photo.id === player1.currentPhotoId)
  const currentPlayer2Photo = photos.find((photo) => photo.id === player2.currentPhotoId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 flex flex-col items-center justify-start p-2 overflow-x-hidden">
      {/* Header compacto para mobile */}
      <div className="text-center mb-2 w-full">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1">Busque nossas fotos</h1>
        <div className="text-gray-300 text-xs sm:text-sm md:text-base">
          {collectedCount}/{totalPhotos} fotos
        </div>
      </div>

      {/* Dificuldade mais compacta */}
      <div className="mb-2 flex gap-1 justify-center">
        {["easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level as any)}
            className={`px-2 py-1 rounded text-xs ${
              difficulty === level ? "bg-purple-300 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {level === "easy" ? "Fácil" : level === "medium" ? "Médio" : "Difícil"}
          </button>
        ))}
      </div>

      {/* Layout mobile-first */}
      <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-6xl">
        {/* Status dos jogadores - mais compacto */}
        <div className="flex gap-3 mb-2">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-1 rounded-full overflow-hidden border-2 border-purple-300">
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-1 rounded-full overflow-hidden border-2 border-indigo-600">
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

        {/* Arena responsiva */}
        <div
          className="relative border-2 border-white rounded-lg overflow-hidden shadow-2xl bg-black touch-none mb-2"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Renderizar labirinto com tamanhos responsivos */}
          {currentMaze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`absolute ${cell === 1 ? "bg-slate-900 border border-purple-300" : "bg-black"}`}
                style={{
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              />
            )),
          )}

          {/* Jogadores com tamanhos responsivos */}
          <div
            className="absolute transition-all duration-200 rounded-full border-2 md:border-4 border-purple-300 shadow-lg z-10 overflow-hidden"
            style={{
              left: player1.position.x * (GAME_WIDTH / 800) + (isMobile ? 2 : 5),
              top: player1.position.y * (GAME_HEIGHT / 550) + (isMobile ? 2 : 5),
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

          <div
            className="absolute transition-all duration-300 rounded-full border-2 md:border-4 border-indigo-600 shadow-lg z-10 overflow-hidden"
            style={{
              left: player2.position.x * (GAME_WIDTH / 800) + (isMobile ? 2 : 5),
              top: player2.position.y * (GAME_HEIGHT / 550) + (isMobile ? 2 : 5),
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

          {/* Overlays responsivos */}
          {!gameStarted && !gameWon && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
              <div className="text-center p-4">
                <h2 className="text-white text-lg md:text-2xl font-bold mb-2 md:mb-4">Hello Baby, este é um joguim pra demonstrar meu amor</h2>
                <h2 className="text-white text-lg md:text-2xl font-bold mb-2 md:mb-4">Colete nossas fotos para completar o album!</h2>
                <p className="text-gray-300 mb-2 md:mb-4 text-sm md:text-base">
                  Dificuldade: {difficulty === "easy" ? "Fácil" : difficulty === "medium" ? "Médio" : "Difícil"}
                </p>
                <button
                  onClick={() => setGameStarted(true)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-indigo-800 hover:bg-purple-950 text-white font-bold rounded-lg transition-colors text-sm md:text-base"
                >
                  Iniciar Caçada
                </button>
              </div>
            </div>
          )}

          {gameWon && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
              <div className="text-center p-4">
                <h2 className="text-purple-800 text-2xl md:text-3xl font-bold mb-2 md:mb-4">Parabéns amor,você completou o jogo!</h2>
                {/* Álbum compacto
                  <div className="p-3 bg-black bg-opacity-50 rounded-lg">
                    <h3 className="text-white font-bold text-center mb-2 text-sm">🏆 Álbum</h3>
                    <div className="grid grid-cols-3 gap-1">
                      {photos
                        .filter((photo) => photo.id !== 0)
                        .map((photo) => (
                          <div
                            key={photo.id}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded border-2 flex items-center justify-center ${
                              photo.collected ? "border-green-400 bg-green-900" : "border-gray-600 bg-gray-800"
                            }`}
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
                          </div>
                        ))}
                    </div>
                  </div> */}
                <p className="text-white text-lg md:text-xl mb-2 md:mb-4">Feliz dia dos namorados, rs obrigado por tudo baby, eu agradeço a Deus todos os dias por ter colocado uma pessoa incrivel como você na minha vida.</p>
                <p className="text-white text-lg md:text-xl mb-2 md:mb-4">Sei que as vezes tiro sua paciência, rsrsr nas não é de proposito embora as vezes pareça kkk ... </p>
                <p className="text-white text-lg md:text-xl mb-2 md:mb-4">te amo baby eu tenho certeza de que você é a mulher da minha vida</p>
                <p className="text-white text-lg md:text-xl mb-2 md:mb-4">Estou anciosissimo para que possamos passar o resto da vida juntos. que Deus nos abençoe sempre e guie nosso caminho.</p>
                <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                  Todas as {totalPhotos} fotos foram coletadas!
                </p>
                <button
                  onClick={resetGame}
                  className="px-4 md:px-6 py-2 md:py-3 bg-indigo-800 hover:bg-purple-950 text-white font-bold rounded-lg transition-colors text-sm md:text-base"
                >
                  Jogar Novamente
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controles e álbum lado a lado no mobile */}
        <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-center">
          {/* Controles maiores para mobile */}
          <div className="flex flex-col items-center">
            <div className="text-white font-bold mb-2 text-sm">Controles</div>
            <div className="flex flex-col items-center gap-1">
              <button
                onTouchStart={() => movePlayer1("up")}
                onMouseDown={() => movePlayer1("up")}
                className="w-14 h-14 sm:w-12 sm:h-12 bg-purple-950 active:bg-indigo-950 text-purple-300 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center text-xl font-bold touch-manipulation select-none"
                disabled={!gameStarted || gameWon}
              >
                ↑
              </button>
              <div className="flex gap-1">
                <button
                  onTouchStart={() => movePlayer1("left")}
                  onMouseDown={() => movePlayer1("left")}
                  className="w-14 h-14 sm:w-12 sm:h-12 bg-purple-950 active:bg-indigo-950 text-purple-300 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center text-xl font-bold touch-manipulation select-none"
                  disabled={!gameStarted || gameWon}
                >
                  ←
                </button>
                <div className="w-14 h-14 sm:w-12 sm:h-12"></div>
                <button
                  onTouchStart={() => movePlayer1("right")}
                  onMouseDown={() => movePlayer1("right")}
                  className="w-14 h-14 sm:w-12 sm:h-12 bg-purple-950 active:bg-indigo-950 text-purple-300 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center text-xl font-bold touch-manipulation select-none"
                  disabled={!gameStarted || gameWon}
                >
                  →
                </button>
              </div>
              <button
                onTouchStart={() => movePlayer1("down")}
                onMouseDown={() => movePlayer1("down")}
                className="w-14 h-14 sm:w-12 sm:h-12 bg-purple-950 active:bg-indigo-950 text-purple-300 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center text-xl font-bold touch-manipulation select-none"
                disabled={!gameStarted || gameWon}
              >
                ↓
              </button>
            </div>
          </div>

          {/* Álbum compacto */}
          <div className="p-3 bg-black bg-opacity-50 rounded-lg">
            <h3 className="text-white font-bold text-center mb-2 text-sm">🏆 Álbum</h3>
            <div className="grid grid-cols-3 gap-1">
              {photos
                .filter((photo) => photo.id !== 0)
                .map((photo) => (
                  <div
                    key={photo.id}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded border-2 flex items-center justify-center ${
                      photo.collected ? "border-purple-300 bg-indigo-600" : "border-gray-600 bg-gray-800"
                    }`}
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
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Botões de controle do jogo */}
        <div className="mt-2 flex gap-2">
          <button
            onClick={resetGame}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs"
          >
            Reiniciar
          </button>
          <button
            onClick={() => setGameStarted(!gameStarted)}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-400 text-white rounded-lg transition-colors text-xs"
            disabled={gameWon}
          >
            {gameStarted ? "Pausar" : "Continuar"}
          </button>
        </div>
      </div>
      <div className="mt-2 md:mt-4 text-center text-gray-300 text-xs md:text-sm max-w-md px-4">
        <p>@luc4sDevBr</p>

      </div>
    </div>
  )
}

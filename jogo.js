const sprites = new Image()
sprites.src = './sprites.png'

const sound_hit = new Audio()
sound_hit.src = './sounds/hit.wav'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

let frames = 0

const startGame = {
  sourceX: 134,
  sourceY: 0,
  largura: 174,
  altura: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenhar() {
    contexto.drawImage(
      sprites,
      startGame.sourceX, startGame.sourceY, // Coordenadas no sprite
      startGame.largura, startGame.altura,
      startGame.x, startGame.y, // Coordenadas no canvas
      startGame.largura, startGame.altura
    )
  }
}

const planoDeFundo = {
  sourceX: 390,
  sourceY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenhar() {
    contexto.fillStyle = '#70c5ce'
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.sourceX, planoDeFundo.sourceY, // Coordenadas no sprite
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y, // Coordenadas no canvas
      planoDeFundo.largura, planoDeFundo.altura
    )

    contexto.drawImage(
      sprites,
      planoDeFundo.sourceX, planoDeFundo.sourceY, // Coordenadas no sprite
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y, // Coordenadas no canvas
      planoDeFundo.largura, planoDeFundo.altura
    )
  }
}

const chao = {
  sourceX: 0,
  sourceY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  atualizar() {
    // logica para movimentar o chão infinitamente
    const movimentoDoChao = 1
    const repeteEm = chao.largura / 2
    const movimentacao = chao.x - movimentoDoChao

    chao.x = movimentacao % repeteEm
  },
  desenhar() {
    contexto.drawImage(
      sprites,
      chao.sourceX, chao.sourceY, // Coordenadas no sprite
      chao.largura, chao.altura,
      chao.x, chao.y, // Coordenadas no canvas
      chao.largura, chao.altura
    )

    contexto.drawImage(
      sprites,
      chao.sourceX, chao.sourceY, // Coordenadas no sprite
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y, // Coordenadas no canvas
      chao.largura, chao.altura
    )
  }
}

const canos = {
  largura: 52,
  altura: 400,
  chao: {
    sourceX: 0,
    sourceY: 169
  },
  ceu: {
    sourceX: 52,
    sourceY: 169
  },
  espaco: 80,
  desenhar() {
    canos.pares.forEach((par) => {
      const espacamentoEntreCanos = 90
      const yRandom = par.y
  
      // Cano ceu
      const canoCeuX = par.x
      const canoCeuY = yRandom
      contexto.drawImage(
        sprites,
        canos.ceu.sourceX, canos.ceu.sourceY, // Coordenadas no sprite
        canos.largura, canos.altura,
        canoCeuX, canoCeuY, // Coordenadas no canvas
        canos.largura, canos.altura
      )
  
      // Cano chao
      const canoChaoX = par.x
      const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom
      contexto.drawImage(
        sprites,
        canos.chao.sourceX, canos.chao.sourceY,
        canos.largura, canos.altura,
        canoChaoX, canoChaoY,
        canos.largura, canos.altura,
      )

      par.canoCeu = {
        x: canoCeuX,
        y: canos.altura + canoCeuY
      }
      par.canoChao = {
        x: canoChaoX,
        y: canoChaoY
      }
    })
  },
  colidiuComOBird(par) {
    const cabecaDoFlappy = flappyBird.y;
    const peDoFlappy = flappyBird.y + flappyBird.altura;
    
    if(flappyBird.x >= par.x) {
      if(cabecaDoFlappy <= par.canoCeu.y) {
        return true;
      }
      
      if(peDoFlappy >= par.canoChao.y) {
        return true;
      }
    }
    return false;
  },
  pares: [],
  atualizar() {
    const passou100Frames = frames % 100 === 0
    if (passou100Frames) {
      canos.pares.push({ 
        x: canvas.width, 
        y: -150 * (Math.random() + 1) // y: -350
      })
    }

    canos.pares.forEach((par) => {
      par.x += -2

      if (canos.colidiuComOBird(par)) {
        console.log("Colidiu")
        mudarParaTela(Tela.INICIO)
        flappyBird.respawn()
        canos.pares = []
        return
      }

      if (par.x < -canos.largura) {
        canos.pares.shift()
      }
    })

  }
}

const flappyBird = {
  sourceX: 0,
  sourceY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50 + 65,
  gravidade: .25,
  velocidade: 0,
  pulo: 4.6,
  respawn() {
    setTimeout(() => sound_hit.play(), 400)
    setTimeout(() => {
      flappyBird.x = 10
      flappyBird.y = 50
      flappyBird.velocidade = 0
    }, 1100)
  } ,
  colidu() {
    if (flappyBird.y >= chao.y - flappyBird.altura)
      return true
  },
  pular() {
    flappyBird.velocidade = -flappyBird.pulo
  },
  atualizar() {
    if (flappyBird.colidu()) {
      mudarParaTela(Tela.INICIO)
      flappyBird.respawn()
      return
    }

    flappyBird.velocidade += flappyBird.gravidade
    flappyBird.y += flappyBird.velocidade
  },
  movimentos: [
    { spriteX: 0, spriteY: 0 },
    { spriteX: 0, spriteY: 26 },
    { spriteX: 0, spriteY: 52 }
  ],
  frameAtual: 0,
  atualizarOFrameAtual() {
    const intervalo = 10
    const passouOIntervalo = frames % intervalo === 0

    if (passouOIntervalo) {
      const baseDoFrame = 1
      const incremento = baseDoFrame + flappyBird.frameAtual
      const baseRepeticao = flappyBird.movimentos.length
      flappyBird.frameAtual = incremento % baseRepeticao
    }
  },
  desenhar() {
    flappyBird.atualizarOFrameAtual()

    const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual]
    
    flappyBird.sourceX = spriteX
    flappyBird.sourceY = spriteY

    contexto.drawImage(
      sprites,
      flappyBird.sourceX, flappyBird.sourceY, // Coordenadas no sprite
      flappyBird.largura, flappyBird.altura,
      flappyBird.x, flappyBird.y, // Coordenadas no canvas
      flappyBird.largura, flappyBird.altura
    )
  }
}

// Tela

let telaAtiva = {}
function mudarParaTela(novaTela) {
  telaAtiva = novaTela
}

const Tela = {}

Tela.INICIO = {
  desenhar() {
    planoDeFundo.desenhar()
    flappyBird.desenhar()
    chao.desenhar()
    startGame.desenhar()
  },
  click() {
    mudarParaTela(Tela.JOGO)
  },
  atualizar() {
    chao.atualizar()
  }
}

Tela.JOGO = {
  desenhar() {
    planoDeFundo.desenhar()
    canos.desenhar()
    flappyBird.desenhar()
    chao.desenhar()
  },
  click() {
    flappyBird.pular()
  },
  atualizar() {
    flappyBird.atualizar()
    canos.atualizar()
    chao.atualizar()
  }
}

function loop() {
  telaAtiva.desenhar( )
  telaAtiva.atualizar()

  frames += 1

  requestAnimationFrame(loop)
}

canvas.addEventListener('click', () => {
  if(telaAtiva.click) {
    telaAtiva.click()
  }
})

// window.addEventListener('keyup', ({keyCode}) => {
//   if (keyCode === 32) {
//     telaAtiva.click( )
//   }
// })

mudarParaTela(Tela.INICIO)  
loop()

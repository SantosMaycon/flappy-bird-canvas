const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

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

const flappyBird = {
  sourceX: 0,
  sourceY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  gravidade: .25,
  velocidade: 0,
  atualizar() {
    flappyBird.velocidade += flappyBird.gravidade
    flappyBird.y += flappyBird.velocidade
    console.log(flappyBird.y)
  },
  desenhar() {
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
    chao.desenhar()
    flappyBird.desenhar()
    startGame.desenhar()
  },
  click() {
    mudarParaTela(Tela.JOGO)
  },
  atualizar() {
  }
}

Tela.JOGO = {
  desenhar() {
    planoDeFundo.desenhar()
    chao.desenhar()
    flappyBird.desenhar()
  },
  atualizar() {
    flappyBird.atualizar()
  }
}

function loop() {
  
  telaAtiva.desenhar()
  telaAtiva.atualizar()

  requestAnimationFrame(loop)
} 

window.addEventListener('click', () => {
  if(telaAtiva.click) {
    telaAtiva.click()
  }
})

mudarParaTela(Tela.INICIO)  
loop()


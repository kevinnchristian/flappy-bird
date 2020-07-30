console.log("[kevinnchristian] Flappy Bird");

let frames = 0;
const somDe_HIT = new Audio();
somDe_HIT.src = "./assets/efeitos/hit.wav";
const sprites = new Image();
sprites.src = "./assets/img/sprites.png";

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

// Desenhando background
const background = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = "#70c5ce"; // cor do fundo
    contexto.fillRect(0, 0, canvas.width, canvas.height); //de onde vai começar a pintar e o tamanho e largura

    contexto.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.largura, background.altura,
      background.x, background.y,
      background.largura, background.altura
    );

    contexto.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.largura, background.altura,
      background.x + background.largura, background.y,
      background.largura, background.altura
    );
  },
};

// Desenhando chão
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura
      );

      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x + chao.largura, chao.y,
        chao.largura, chao.altura
      );
    },
  };
  return chao;
};

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;  
  }

  return false;
}

// Desenhando flappy bird
function criaFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
      flappyBird.velocidade = - flappyBird.pulo;
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if(fazColisao(flappyBird, globais.chao)) {
        somDe_HIT.play();
        setTimeout(() => {
          mudaParaTela(Telas.INICIO);
        }, 500);
        return;
      }
  
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0 }, // asa pra cima
      { spriteX: 0, spriteY: 26 }, // asa no meio
      { spriteX: 0, spriteY: 52 }, // asa pra baixo
    ],
    frameAtual: 0,
    atualizaFrameAtual() {
      const intervaloDeFrames = 10;
      const passouIntervalo = frames % intervaloDeFrames === 0;

      if (passouIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha() {
      flappyBird.atualizaFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
      
      contexto.drawImage(
        sprites, // image, nossa imagem
        spriteX, spriteY, // sx, sy, Sprite X, Sprite Y, usou sprite para entender melhor o certo é source
        flappyBird.largura, flappyBird.altura, // sWidth, sHeight, tamanho do recorte na nossa imagem
        flappyBird.x, flappyBird.y, // dx, dy, Na onde queremos começar a desenhar no nosso canvas
        flappyBird.largura, flappyBird.altura // dWidth, dHeight, dentro do nosso canvas o tamanho da nossa imagem
      );
    },
  };
  return flappyBird;
}

// Desenhando tela inicial
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  },
};

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169
    },
    ceu: {
      spriteX: 52,
      spriteY: 169
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function(par){
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;

        // [Cano do Céu]
        const canoCeuX = par.x;
        const canoCeuY = yRandom;
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
  
        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        contexto.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
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
    temColisaoComFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if (globais.flappyBird.x >= par.x) {
        if (cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }
        if (peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }

      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1)
        });
      }

      canos.pares.forEach(function(par) {
        par.x = par.x -2;

        if(canos.temColisaoComFlappyBird(par)) {
          somDe_HIT.play();
          setTimeout(() => {
            mudaParaTela(Telas.INICIO);
          }, 200);
        }

        if (par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });
    }
  };
  return canos;
}

// Telas
// ---------------------------------------------------------- //
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
  
  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      background.desenha();
      globais.flappyBird.desenha();
      globais.chao.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
};
Telas.JOGO = {
  desenha() {
    background.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.flappyBird.atualiza();
  }
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1; 
  requestAnimationFrame(loop);
}

canvas.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
})

mudaParaTela(Telas.INICIO);
loop();
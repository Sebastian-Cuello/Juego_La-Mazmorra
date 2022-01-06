var canvas;
var ctx;
var FPS = 50;
//Tamaño de la ficha
var anchoF = 50;
var altoF = 50;
var tileMap;
var imagenAntorcha = [];
var enemigo = [];
var protagonista;
//Mapa
var escenario = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0],
  [0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0],
  [0, 0, 2, 0, 0, 0, 2, 2, 0, 2, 2, 2, 2, 0, 0],
  [0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0],
  [0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 1, 0, 0, 2, 0],
  [0, 2, 2, 2, 0, 0, 3, 0, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
//DIBUJADOR DEL ESCENARIO
function dibujaEscenario() {
  for (y = 0; y < escenario.length; y++) {
    for (x = 0; x < escenario[y].length; x++) {
      var tile = escenario[y][x];
      ctx.drawImage(tileMap, tile * 32, 0, 32, 32, anchoF * x, altoF * y, anchoF, altoF);
    }
  }
}
//CLASE ANTORCHA
var antorcha = function (x, y) {
  this.x = x;
  this.y = y;
  this.fotograma = 0;
  this.contador = 0;
  this.retraso = 10;
  this.cambiaFotograma = function () {
    if (this.fotograma < 3) {
      this.fotograma++;
    } else {
      this.fotograma = 0;
    }
  };
  this.dibuja = function () {
    if (this.contador < this.retraso) {
      this.contador++;
    } else {
      this.contador = 0;
      this.cambiaFotograma();
    }
    ctx.drawImage(tileMap, this.fotograma * 32, 64, 32, 32, anchoF * x, altoF * y, anchoF, altoF);
  };
};
//CLASE ENEMIGO
var malo = function (x, y) {
  this.x = x;
  this.y = y;
  this.retraso = 50;
  this.fotograma = 0;
  this.direccion = Math.floor(Math.random() * 4);
  this.dibuja = function () {
    ctx.drawImage(tileMap, 0, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
  };
  this.compruebaColision = function (x, y) {
    var colisiona = false;
    if (escenario[y][x] == 0) {
      colisiona = true;
    }
    return colisiona;
  };
  this.mueve = function () {
    protagonista.colisionEnemigo(this.x, this.y);
    if (this.contador < this.retraso) {
      this.contador++;
    } else {
      this.contador = 0;
      //ARRIBA
      if (this.direccion == 0) {
        if (this.compruebaColision(this.x, this.y - 1) == false) {
          this.y--;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }
      //ABAJO
      if (this.direccion == 1) {
        if (this.compruebaColision(this.x, this.y + 1) == false) {
          this.y++;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }
      //IZQUIERDA
      if (this.direccion == 2) {
        if (this.compruebaColision(this.x - 1, this.y) == false) {
          this.x--;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }
      //DERECHA
      if (this.direccion == 3) {
        if (this.compruebaColision(this.x + 1, this.y) == false) {
          this.x++;
        } else {
          this.direccion = Math.floor(Math.random() * 4);
        }
      }
    }
  };
};
//CLASE JUGADOR
var jugador = function () {
  // Posicion inicial del jugador
  this.x = 2;
  this.y = 8;
  this.llave = false;
  this.dibuja = function () {
    ctx.drawImage(tileMap, 32, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
  };

  this.colisionEnemigo = function (x, y) {
    if (this.x == x && this.y == y) {
      alert("Has muerto");
      this.x = 2;
      this.y = 8;
      this.llave = false;
      escenario[8][6] = 3;
    }
  };

  this.margenes = function (x, y) {
    var colision = false;
    if (escenario[y][x] == 0) {
      colision = true;
    }
    return (colision);
  };
  this.arriba = function () {
    if (this.margenes(this.x, this.y - 1) == false) {
      this.y--;
      this.logicaObjectos();
    }
  };
  this.abajo = function () {
    if (this.margenes(this.x, this.y + 1) == false) {
      this.y++;
      this.logicaObjectos();
    }
  };
  this.izquierda = function () {
    if (this.margenes(this.x - 1, this.y) == false) {
      this.x--;
      this.logicaObjectos();
    }
  };
  this.derecha = function () {
    if (this.margenes(this.x + 1, this.y) == false) {
      this.x++;
      this.logicaObjectos();
    }
  };
  this.victoria = function () {
    this.x = 2;
    this.y = 8;
    this.llave = false;
    escenario[8][6] = 3;
  };

  this.logicaObjectos = function () {
    var objecto = escenario[this.y][this.x];
    if (objecto == 3) {
      this.llave = true;
      escenario[this.y][this.x] = 2;
    }
    if (objecto == 1) {
      if (this.llave) {
        this.victoria();
        alert("Has ganado");
      } else {
        alert("Te falta la llave");
      }

    }
  };
};
//FUNCION INICIO
function inicializa() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  tileMap = new Image();
  tileMap.src = 'img/tilemap.png';

  //CREAMOS AL JUGADOR
  protagonista = new jugador();

  //CREAMOS LAS ANTORCHAS
  imagenAntorcha.push(new antorcha(0, 0));
  imagenAntorcha.push(new antorcha(14, 0));
  imagenAntorcha.push(new antorcha(0, 9));
  imagenAntorcha.push(new antorcha(14, 9));
  //CREAMOS LOS ENEMIGOS
  enemigo.push(new malo(3, 4));
  enemigo.push(new malo(9, 3));
  enemigo.push(new malo(7, 6));


  //LECTURA DEL TECLADO
  document.addEventListener('keydown', function (tecla) {

    if (tecla.keyCode == 38) {
      protagonista.arriba();
    }

    if (tecla.keyCode == 40) {
      protagonista.abajo();
    }

    if (tecla.keyCode == 37) {
      protagonista.izquierda();
    }

    if (tecla.keyCode == 39) {
      protagonista.derecha();
    }

  });
  setInterval(function () {
    principal();
  }, 1000 / FPS);
}
//Actualizo el fotograma
function borraCanvas() {
  canvas.width = 750;
  canvas.height = 500;
}

//BUCLE PRINCIPAL
function principal() {
  borraCanvas();
  dibujaEscenario();
  protagonista.dibuja();
  for (n = 0; n < imagenAntorcha.length; n++) {
    imagenAntorcha[n].dibuja();
  }
  for (c = 0; c < enemigo.length; c++) {
    enemigo[c].mueve();
    enemigo[c].dibuja();
  }
}


// Configuración del Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 1. Clase Ball con soporte para colores (Paso 6)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius > canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al salir
    }
}

// 2. Clase Paddle (Paso 6: Soporte de altura y color)
class Paddle {
    constructor(x, y, width, height, color, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 7;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// 3. Clase Game (Paso 6: Control de las 5 pelotas)
class Game {
    constructor() {
        // Generar 5 pelotas con diferente tamaño, color y velocidad (Paso 6)
        this.balls = [
            new Ball(canvas.width/2, canvas.height/2, 8, 4, 4, 'red'),
            new Ball(canvas.width/2, canvas.height/2, 12, -3, 5, 'cyan'),
            new Ball(canvas.width/2, canvas.height/2, 10, 5, -2, 'yellow'),
            new Ball(canvas.width/2, canvas.height/2, 15, -4, -4, 'lime'),
            new Ball(canvas.width/2, canvas.height/2, 7, 6, 3, 'magenta')
        ];

        // Paleta del jugador: Doble de alto (200px) y color naranja (Paso 6)
        this.paddle1 = new Paddle(10, canvas.height / 2 - 100, 15, 200, 'orange', true);
        
        // Paleta CPU: Normal (100px)
        this.paddle2 = new Paddle(canvas.width - 25, canvas.height / 2 - 50, 15, 100, 'white');
        
        this.keys = {};
        this.handleInput();
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        this.balls.forEach(ball => {
            ball.move();

            // Colisión con Paleta Jugador (Detecta todas las pelotas)
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y > this.paddle1.y && ball.y < this.paddle1.y + this.paddle1.height) {
                ball.speedX = Math.abs(ball.speedX);
            }

            // Colisión con Paleta CPU
            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y > this.paddle2.y && ball.y < this.paddle2.y + this.paddle2.height) {
                ball.speedX = -Math.abs(ball.speedX);
            }

            // Resetear si salen del canvas
            if (ball.x < 0 || ball.x > canvas.width) {
                ball.reset();
            }
        });

        // Movimiento del jugador
        if (this.keys['ArrowUp']) this.paddle1.move('up');
        if (this.keys['ArrowDown']) this.paddle1.move('down');

        // IA sigue a la pelota más cercana o a la primera del arreglo
        this.paddle2.autoMove(this.balls[0]);
    }

    handleInput() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    run() {
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Iniciar Juego
const game = new Game();
game.run();
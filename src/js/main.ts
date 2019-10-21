import Game from './Game';

const canvas = <HTMLCanvasElement>document.getElementById('game');

const game = new Game(canvas);
game.setSize(10, 10);
game.generateDimensions(5);
game.init();

function draw(): void {
    game.draw();
}

window.requestAnimationFrame(draw);

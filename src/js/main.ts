import Game from './Game';

const canvas = <HTMLCanvasElement>document.getElementById('game');

const game = new Game(canvas, 10, 10);
game.generateDimensions(5);
game.worldInfo = document.getElementById('currentWorld');
game.init();

function draw(): void {
    game.draw();
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

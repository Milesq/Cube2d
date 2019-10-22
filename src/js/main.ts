import Game from './Game';
import { portal, stone, grass, player } from './assets';

const canvas = <HTMLCanvasElement>document.getElementById('game');

const game = new Game(canvas, 10, 10);
game.generateDimensions(2);
game.worldInfo = document.getElementById('currentWorld');
game.init();

(async () => {
    await portal;
    await grass;
    await player;
    await stone;

    function draw(): void {
        game.draw();
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
})();

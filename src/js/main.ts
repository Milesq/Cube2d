import Game from './Game';
import { portal, stone, grass, player, backgroundSound } from './assets';

const canvas = document.getElementById('game') as HTMLCanvasElement;

const game = new Game(canvas, 10, 10);
game.generateDimensions(2);
game.worldInfo = document.getElementById('currentWorld');
game.init();

(async (): Promise<void> => {
    await portal;
    await grass;
    await player;
    await stone;
    backgroundSound.play();
    backgroundSound.volume /= 2;

    function draw(): void {
        game.draw();
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
})();

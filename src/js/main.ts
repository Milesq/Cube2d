import Swal from 'sweetalert2';
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
    // backgroundSound.play();
    backgroundSound.volume /= 2;

    function draw(): void {
        game.draw();

        if (!game.ended) window.requestAnimationFrame(draw);
        else {
            const WEIGHT = 5;
            const time = Math.round((new Date().getTime() - game.begTime) / 10) / 100;
            const score = (game.moves + Math.round(time) + game.jumpNum * WEIGHT) / 2 + WEIGHT;

            Swal.fire(
                'Good job!',
                `You won in ${time}, ${game.jumpNum} jumps and ${game.moves} moves!\n\nYour score: ${score}`,
                'success'
            );
        }
    }

    window.requestAnimationFrame(draw);
})();

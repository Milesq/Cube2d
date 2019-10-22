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

    async function draw(): Promise<void> {
        game.draw();

        if (!game.ended) window.requestAnimationFrame(draw);
        else {
            const WEIGHT = 5;
            const time = Math.round((new Date().getTime() - game.begTime) / 10) / 100;
            const score = (game.moves + Math.round(time) + game.jumpNum * WEIGHT) / 2 + WEIGHT;

            const bestScore: { score: number; nick: string } = JSON.parse(
                localStorage.getItem('best-score')
            ) || {
                score: 0,
                nick: ''
            };

            if (!(score > bestScore.score)) {
                const { value: nick } = await Swal.fire({
                    title: 'Best score!!! Congratulations!',
                    text: 'You achieve the highest score ever. Please lease your nick',
                    type: 'info',
                    input: 'text'
                });

                localStorage.setItem(
                    'best-score',
                    JSON.stringify({
                        score,
                        nick
                    })
                );

                Swal.fire(
                    'Good job! Your score: ' + score,
                    `You won in ${time}, ${game.jumpNum} jumps and ${game.moves} moves!`,
                    'success'
                );
            } else
                Swal.fire(
                    'Good job!' + score,
                    `You won in ${time}, ${game.jumpNum} jumps and ${game.moves} moves!
                    \n\n${bestScore.nick} achieve ${bestScore.score} points.`,
                    'success'
                );
        }
    }

    window.requestAnimationFrame(draw);
})();

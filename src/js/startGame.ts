import Swal from 'sweetalert2';
import Game from './Game';
import { portal, stone, grass, player, backgroundSound } from './assets';

export default function start(app: HTMLElement): void {
    const canvas = document.createElement('canvas');
    canvas.height = 600;
    canvas.width = 600;
    canvas.id = 'game';

    const worldInfo = document.createElement('div');
    worldInfo.className = 'current-world';

    app.appendChild(worldInfo);
    app.appendChild(canvas);

    const game = new Game(canvas, 10, 10);
    game.generateDimensions(3);
    game.worldInfo = worldInfo;

    (async function(): Promise<void> {
        game.init();

        await portal;
        await grass;
        await player;
        await stone;
        backgroundSound.play();
        backgroundSound.volume /= 3;

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
                    score: Infinity,
                    nick: ''
                };

                if (score < bestScore.score) {
                    // New best score
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
                } else {
                    Swal.fire(
                        'Good job! Your score: ' + score,
                        `You won in ${time}, ${game.jumpNum} jumps and ${game.moves} moves!
                    \n\n${bestScore.nick} achieved ${bestScore.score} points.`,
                        'success'
                    );
                }
            }
        }

        window.requestAnimationFrame(draw);
    })();
}

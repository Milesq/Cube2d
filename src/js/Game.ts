import { assert, randNot, series, rand } from './utils';
import { Board, draw } from './BoardDraw';
import Player from './Player';
import { teleportSound, winSound } from './assets';

export default class Game {
    player: Player;

    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private boards: Board[];
    private dimensionNum: number;
    private playerDimension: number;
    private lastDimensions: number[];

    private COLUMNS: number;
    private ROWS: number;
    private fieldSize: number;
    private portalAnimationPart: number;
    worldInfo: HTMLElement;
    ended: boolean;

    private xy(i: number): [number, number] {
        return [i % this.COLUMNS, Math.floor(i / this.COLUMNS)];
    }

    private i(x: number, y: number): number {
        return y * this.COLUMNS + x;
    }

    private randomBoard(): Board {
        const size = this.COLUMNS * this.ROWS;
        const newBoard: Board = [];

        for (let i = 0; i < size; ++i) {
            if (Math.random() < 0.6) newBoard.push('Blank');
            else if (Math.random() < 0.09) newBoard.push(-1);
            else newBoard.push('Wall');
        }

        return newBoard;
    }

    private updateInfo(): void {
        try {
            this.worldInfo.innerHTML = this.dimensionNum + 1 + '';
        } catch {}
    }

    constructor(_canvas: HTMLCanvasElement, cols: number, rows: number, _fieldSize = 60) {
        this.canvas = _canvas;
        this.ctx = _canvas.getContext('2d');
        this.ctx.font = 'bold 32px sans-serif';
        this.dimensionNum = 0;
        this.playerDimension = 0;
        this.lastDimensions = [];

        this.player = new Player(0, 0, this.ctx, _fieldSize);

        this.COLUMNS = cols;
        this.ROWS = rows;
        this.fieldSize = _fieldSize;
    }

    generateDimensions(num: number): void {
        assert(num > 1, 'Dimensions number must be greater than 2');
        this.boards = [];

        for (let i = 0; i < num; ++i) {
            this.boards.push(this.randomBoard());
        }

        const randDimension = rand(1, num);
        this.boards[randDimension][rand(0, this.COLUMNS * this.ROWS)] = 'Meta';
    }

    init(): void {
        const max = this.boards.length;

        this.boards = this.boards.map((board, dimNum) =>
            board.map(field => {
                if (field === -1) return randNot(dimNum, 0, max);

                return field;
            })
        );

        window.addEventListener('keydown', this.keydownHandler.bind(this));
        this.updateInfo();
        this.portalAnimationPart = 0;

        setInterval(() => {
            if (this.portalAnimationPart === 4) {
                this.portalAnimationPart = 0;
            } else ++this.portalAnimationPart;
        }, 1000 / 8);
    }

    draw(): void {
        // Clear
        this.ctx.fillStyle = 'rgb(58, 157, 35)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Drawing board
        this.boards[this.dimensionNum].forEach((field, i) => {
            const S = this.fieldSize;
            const [x, y] = this.xy(i);
            draw(this.ctx, S, x, y, field, this.portalAnimationPart);
        });

        // Drawing player
        if (this.playerDimension === this.dimensionNum) this.player.draw();
    }

    keydownHandler(ev: KeyboardEvent): void {
        const hotKeys = [...'p wsad[]', ...['Left', 'Right', 'Up', 'Down'].map(el => 'Arrow' + el)];

        const left = (): void => {
            if (this.playerDimension === this.dimensionNum && this.player.x > 0) {
                const type = this.boards[this.dimensionNum][
                    this.i(this.player.x - 1, this.player.y)
                ];

                if (type !== 'Wall') {
                    --this.player.x;
                }
            }
        };

        const right = (): void => {
            if (this.playerDimension === this.dimensionNum && this.player.x < this.COLUMNS - 1) {
                const type = this.boards[this.dimensionNum][
                    this.i(this.player.x + 1, this.player.y)
                ];

                if (type !== 'Wall') {
                    ++this.player.x;
                }
            }
        };

        const up = (): void => {
            if (this.playerDimension === this.dimensionNum && this.player.y > 0) {
                const type = this.boards[this.dimensionNum][
                    this.i(this.player.x, this.player.y - 1)
                ];

                if (type !== 'Wall') {
                    --this.player.y;
                }
            }
        };

        const down = (): void => {
            if (this.playerDimension === this.dimensionNum && this.player.y < this.ROWS - 1) {
                const type = this.boards[this.dimensionNum][
                    this.i(this.player.x, this.player.y + 1)
                ];

                if (type !== 'Wall') {
                    ++this.player.y;
                }
            }
        };

        const tp = (): void => {
            const type = this.boards[this.dimensionNum][this.i(this.player.x, this.player.y)];

            if (this.playerDimension === this.dimensionNum && typeof type === 'number') {
                teleportSound.play();
                this.playerDimension = type;
                this.lastDimensions.push(this.dimensionNum);
                this.dimensionNum = type;
            }
        };

        const prevDimension = (): void => {
            if (this.dimensionNum === 0) this.dimensionNum = this.boards.length - 1;
            else --this.dimensionNum;
        };

        const nextDimension = (): void => {
            if (this.dimensionNum === this.boards.length - 1) this.dimensionNum = 0;
            else ++this.dimensionNum;
        };

        const tpBack = (): void => {
            if (this.lastDimensions.length) {
                teleportSound.play();
                const prev = this.lastDimensions.pop();
                this.playerDimension = prev;
                this.dimensionNum = prev;
            }
        };

        const updateInfo = this.updateInfo.bind(this);

        const actions = {
            p: series(tpBack, updateInfo),
            ' ': series(tp, updateInfo),
            '[': series(prevDimension, updateInfo),
            ']': series(nextDimension, updateInfo),

            ArrowLeft: left,
            a: left,

            ArrowRight: right,
            d: right,

            ArrowUp: up,
            w: up,

            ArrowDown: down,
            s: down
        };

        if (hotKeys.find(key => key === ev.key)) actions[ev.key]();

        if (this.boards[this.dimensionNum][this.i(this.player.x, this.player.y)] === 'Meta') {
            this.win();
        }
    }

    protected win(): void {
        window.onkeydown = () => console.log('Won');
        winSound.play();
        this.ended = true;
    }
}

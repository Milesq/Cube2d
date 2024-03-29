import { assert, randNot, series, rand } from './utils';
import { Board, draw } from './BoardDraw';
import Player from './Player';
import { teleportSound, winSound, backgroundSound } from './assets';
import isValidBoard from './isValidBoard';

type Coords = Partial<{
    x: number;
    y: number;
}>;

type CreateMoveAction = (move: Coords) => () => void;
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
    jumpNum: number;
    moves: number;
    ended: boolean;

    private xy(i: number): [number, number] {
        return [i % this.COLUMNS, Math.floor(i / this.COLUMNS)];
    }

    private i(x: number, y: number): number {
        return y * this.COLUMNS + x;
    }

    private randomBoard(): Board {
        const size = this.COLUMNS * this.ROWS;
        const newBoard: Board = ['Blank'];

        for (let i = 1; i < size - 1; ++i) {
            if (Math.random() < 0.6) newBoard.push('Blank');
            else if (Math.random() < 0.09) newBoard.push(-1);
            else newBoard.push('Wall');
        }

        if (isValidBoard(newBoard)) return newBoard;
        else return this.randomBoard();
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
        this.jumpNum = 0;
        this.moves = 0;
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

    begTime: number;

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

        this.begTime = new Date().getTime();
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
        const hotKeys = [
            ...'pq wsad[]',
            ...['Left', 'Right', 'Up', 'Down'].map(el => 'Arrow' + el)
        ];
        // eslint-disable-next-line
        const createMoveAction: CreateMoveAction = move => () => {
            console.log(this.playerDimension, this.dimensionNum, this.player.x);
            if (this.playerDimension !== this.dimensionNum) return;

            const nextCoords = {
                x: this.player.x + (move.x || 0),
                y: this.player.y + (move.y || 0)
            };

            // eslint-disable-next-line
            const nextField = this.boards[this.dimensionNum][
                this.i(nextCoords.x, nextCoords.y)
            ];

            const currentField = this.boards[this.dimensionNum][
                this.i(this.player.x, this.player.y)
            ];

            if (nextField !== 'Wall' || currentField === 'Wall') {
                this.player.x = nextCoords.x;
                this.player.y = nextCoords.y;
                ++this.moves;
            }
        };

        const left = createMoveAction({ x: -1 });
        const right = createMoveAction({ x: 1 });
        const up = createMoveAction({ y: -1 });
        const down = createMoveAction({ y: 1 });

        const tp = (): void => {
            const type = this.boards[this.dimensionNum][this.i(this.player.x, this.player.y)];

            if (this.playerDimension === this.dimensionNum && typeof type === 'number') {
                if (localStorage.getItem('sounds') === null) {
                    teleportSound.play();
                }

                this.playerDimension = type;
                this.lastDimensions.push(this.dimensionNum);
                this.dimensionNum = type;
            }

            ++this.jumpNum;
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
                if (localStorage.getItem('sounds') === null) {
                    teleportSound.play();
                }

                const prev = this.lastDimensions.pop();
                this.playerDimension = prev;
                this.dimensionNum = prev;
            }

            ++this.jumpNum;
        };

        const takeToHome = (): void => {
            this.dimensionNum = this.playerDimension;
        };

        const updateInfo = this.updateInfo.bind(this);

        const actions = {
            q: series(takeToHome, updateInfo),
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
        if (localStorage.getItem('music') === null) {
            backgroundSound.volume = 0;
            winSound.play();
        }
        this.ended = true;
    }
}

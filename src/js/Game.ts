import { assert, rand } from './utils';
import { Board, fieldTypes } from './BoardTypes';

export default class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private boards: Board[];
    private dimensionNum: number;

    private COLUMNS: number;
    private ROWS: number;
    private fieldSize: number;

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

    constructor(_canvas: HTMLCanvasElement) {
        this.canvas = _canvas;
        this.ctx = _canvas.getContext('2d');
        this.dimensionNum = 0;
    }

    setSize(cols: number, rows: number, _fieldSize: number = 50): void {
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
    }

    init(): void {
        const max = this.boards.length;

        this.boards = this.boards.map(board =>
            board.map(field => {
                if (field === -1) return rand(0, max);

                return field;
            })
        );

        window.addEventListener('keydown', this.keydown_handler.bind(this));
    }

    draw(): void {
        this.boards[this.dimensionNum].forEach((field, i) => {
            const S = this.fieldSize;
            const [x, y] = this.xy(i);
            this.ctx.fillStyle = fieldTypes[field];
            this.ctx.fillRect(x * S, y * S, S, S);
        });
    }

    keydown_handler(ev: KeyboardEvent): void {
        const hotKeys = [...'wsad[]', ...['Left', 'Right', 'Up', 'Down'].map(el => 'Arrow' + el)];

        const left = () => {
            console.log('left');
        };

        const right = () => {
            console.log('right');
        };

        const up = () => {
            console.log('up');
        };

        const down = () => {
            console.log('down');
        };

        const prevDimension = () => {
            if (this.dimensionNum === 0) this.dimensionNum = this.boards.length - 1;
            else --this.dimensionNum;
        };

        const nextDimension = () => {
            if (this.dimensionNum === this.boards.length - 1) this.dimensionNum = 0;
            else ++this.dimensionNum;
        };

        const actions = {
            '[': prevDimension,
            ']': nextDimension,
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
    }
}

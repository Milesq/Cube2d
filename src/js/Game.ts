import { assert, rand } from './utils';
import { Board, fieldTypes } from './BoardTypes';

export default class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private board: Board;
    private boards: Board[];

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
        this.board = this.boards[0];
    }

    draw(): void {
        this.board.forEach((field, i) => {
            const S = this.fieldSize;
            const [x, y] = this.xy(i);
            this.ctx.fillStyle = fieldTypes[field];
            this.ctx.fillRect(x * S, y * S, S, S);
        });
    }
}

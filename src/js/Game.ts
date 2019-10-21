import { assert } from './utils';

type PortalTarget = number;
type Field = 'Wall' | PortalTarget | 'Blank';
type Board = Field[];

export default class Game {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private board: Board;
    private boards: Board[];

    private COLUMNS: number;
    private ROWS: number;

    private randomBoard(): Board {
        const size = this.COLUMNS * this.ROWS;
        const newBoard: Board = [];

        for (let i = 0; i < size; ++i) {
            if (Math.random() < 0.3) newBoard.push('Blank');
            else if (Math.random() < 0.09) newBoard.push(-1);
            else newBoard.push('Wall');
        }

        return newBoard;
    }

    constructor(_canvas: HTMLCanvasElement) {
        this.canvas = _canvas;
        this.ctx = _canvas.getContext('2d');
    }

    setSize(cols: number, rows: number): void {
        this.COLUMNS = cols;
        this.ROWS = rows;
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
        console.log(this.board);
    }
}

function rand(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

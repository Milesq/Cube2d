import { player } from './assets';

export default class Player {
    x: number;
    y: number;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly size: number;

    constructor(_x: number, _y: number, _ctx: CanvasRenderingContext2D, _size = 50) {
        this.x = _x;
        this.y = _y;
        this.ctx = _ctx;
        this.size = _size;
    }

    async draw(): Promise<void> {
        const S = this.size;
        this.ctx.drawImage(await player, 0, 0, 12, 12, this.x * S, this.y * S, 48, 48);
    }
}

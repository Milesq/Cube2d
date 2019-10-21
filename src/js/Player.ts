export default class Player {
    x: number;
    y: number;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly size: number;

    constructor(_x: number, _y: number, _ctx: CanvasRenderingContext2D, _size: number = 50) {
        this.x = _x;
        this.y = _y;
        this.ctx = _ctx;
        this.size = _size;
    }

    draw(): void {
        this.ctx.fillStyle = 'rgb(255, 255, 255)';

        const S = this.size;
        this.ctx.fillRect(this.x * S, this.y * S, S, S);
    }
}

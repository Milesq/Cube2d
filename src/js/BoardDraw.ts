import { stone } from './assets';

export type PortalTarget = number;
export type Field = 'Wall' | PortalTarget | 'Blank';
export type Board = Field[];

export const draw = async (
    ctx: CanvasRenderingContext2D,
    S: number,
    x: number,
    y: number,
    field: Field
) => {
    if (field === 'Wall') {
        ctx.drawImage(await stone, x * S, y * S);
    } else if (field === 'Blank') {
        ctx.fillStyle = 'rgb(58, 157, 35)';
        ctx.fillRect(x * S, y * S, S, S);
    }
};

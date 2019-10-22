import { stone, portal, grass } from './assets';

export type PortalTarget = number;
export type Field = 'Wall' | PortalTarget | 'Meta' | 'Blank';
export type Board = Field[];

export const draw = async (
    ctx: CanvasRenderingContext2D,
    S: number,
    x: number,
    y: number,
    field: Field,
    type: number
): Promise<void> => {
    if (field === 'Wall') {
        ctx.drawImage(await stone, x * S, y * S);
    } else if (field === 'Blank') {
        ctx.drawImage(await grass, x * S, y * S);
    } else {
        ctx.drawImage(await portal, 32 * type, 0, 32, 32, x * S, y * S, 60, 60);
    }
};

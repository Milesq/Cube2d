import { rand } from "./utils";

export type PortalTarget = number;
export type Field = 'Wall' | PortalTarget | 'Blank';
export type Board = Field[];

const colors = {
    Wall: [255, 0, 0],
    Blank: [0, 255, 0]
};

function isValid(x: string): x is keyof typeof colors {
    return true;
}

export const fieldTypes = new Proxy({}, {
    get(_, field: string) {
        if (!isValid(field)) throw Error('...');

        const color = colors[field];
        if (color) {
            const [R, G, B] = color;
            return `rgb(${R}, ${G}, ${B})`;
        }

        return `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`;
    }
});

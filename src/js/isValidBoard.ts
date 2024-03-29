import { Board } from './BoardDraw';

export default (board: Board): boolean => {
    const portalCount = board.filter(field => typeof field === 'number').length;

    return portalCount >= 3 && portalCount <= 6;
};

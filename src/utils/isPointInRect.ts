type Point = {
    X: number;
    Y: number;
};

export function isPointInRect(point: Point, rect: { min: Point; max: Point }): boolean {
    if (point.X >= rect.min.X && point.X <= rect.max.X && point.Y >= rect.min.Y && point.Y <= rect.max.Y) {
        return true;
    }
    return false;
}

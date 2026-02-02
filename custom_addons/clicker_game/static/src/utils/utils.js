
export function choose(array) {
    if (!array.length) {
        return null;
    }
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

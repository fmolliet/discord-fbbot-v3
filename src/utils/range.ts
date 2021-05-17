export default function range(start : number , end: number ) : Array<number> { 
    if(start === end) {
        return [start];
    }
    return [start, ...range(start + 1, end)];
}
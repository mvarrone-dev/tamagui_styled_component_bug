declare type DebounceSettings = {
    leading?: boolean;
};
export declare function debounce<A extends Function>(func: A, wait?: number, leading?: boolean): A & {
    cancel: Function;
};
export declare function useDebounce<A extends (...args: any) => any | undefined | null, DebouncedFn extends A & {
    cancel: () => void;
}>(fn: A, wait: number, options?: DebounceSettings, mountArgs?: any[]): DebouncedFn;
export declare function useDebounceValue<A>(val: A, amt?: number): A;
export {};
//# sourceMappingURL=useDebounce.d.ts.map
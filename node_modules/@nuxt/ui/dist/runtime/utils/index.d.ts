export declare const defuTwMerge: <Source extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
}, Defaults extends ({
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} | (number | boolean | any[] | Record<never, any> | null | undefined))[]>(source: Source, ...defaults: Defaults) => import("defu").Defu<Source, Defaults>;
export declare const hexToRgb: (hex: string) => string | null;
export declare const getSlotsChildren: (slots: any) => any;

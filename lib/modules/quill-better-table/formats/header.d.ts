export default Header;
declare const Header_base: any;
declare class Header extends Header_base {
    [x: string]: any;
    static create(value: any): any;
    static formats(domNode: any): {
        value: number;
    };
    format(name: any, value: any): void;
    optimize(context: any): void;
    cache: {};
}
declare namespace Header {
    export const blotName: string;
    export const tagName: string[];
}

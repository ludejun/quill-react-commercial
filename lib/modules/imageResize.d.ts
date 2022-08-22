export default ImageResize;
declare class ImageResize {
    constructor(quill: any, options?: {});
    quill: any;
    options: {
        modules: string[];
        overlayStyles: {
            position: string;
            boxSizing: string;
            border: string;
        };
        handleStyles: {
            position: string;
            height: string;
            width: string;
            backgroundColor: string;
            border: string;
            boxSizing: string;
            opacity: string;
        };
        displayStyles: {
            position: string;
            padding: string;
            textAlign: string;
            backgroundColor: string;
            color: string;
            border: string;
            boxSizing: string;
            opacity: string;
            cursor: string;
        };
        toolbarStyles: {
            position: string;
            top: string;
            right: string;
            left: string;
            height: string;
            minWidth: string;
            textAlign: string;
            color: string;
            boxSizing: string;
            cursor: string;
        };
        toolbarButtonStyles: {
            display: string;
            width: string;
            height: string;
            background: string;
            border: string;
            verticalAlign: string;
        };
        toolbarButtonSvgStyles: {
            fill: string;
            stroke: string;
            strokeWidth: string;
        };
    };
    moduleClasses: string[];
    modules: any[];
    initializeModules: () => void;
    onUpdate: () => void;
    removeModules: () => void;
    handleClick: (evt: any) => void;
    show: (img: any) => void;
    img: any;
    showOverlay: () => void;
    overlay: HTMLDivElement;
    hideOverlay: () => void;
    repositionElements: () => void;
    hide: () => void;
    setUserSelect: (value: any) => void;
    checkImage: (evt: any) => void;
}

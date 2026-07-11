export interface MapHandle {
    //findParcel(code: string): Promise<void>;
    selectMelkByCodeNosazi(code: string): Promise<void>;
    highlightMelkByCodeNosazi(codes: string[]): Promise<void>;
    clearGraphics(): void;
    goHome(): void;
    zoomIn(): void;
    zoomOut(): void;
    toggleBasemap(): void;
}

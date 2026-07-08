export interface MapHandle {
    //findParcel(code: string): Promise<void>;
    selectMelkByCodeNosazi(code: string): Promise<void>;
    highlightMelkByCodeNosazi(codes: string[]): Promise<void>;
}

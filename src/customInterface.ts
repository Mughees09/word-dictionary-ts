    //-------------------------------------------------Interface-----------------------------------------------//
    
    export interface IWord {
        id?: number;
        word: string;
        meaningInEnglish?: string;
        meaningInUrdu?: string;
        similarWords?: string[];
        summaryOfWord?: string;
        authorOfWord?: string;
    }
    
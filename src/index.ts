
    //-------------------------------------------------Imports-----------------------------------------------//

    import { IWord } from "./customInterface";
    import { FileStorage } from "./fileSystem";

    //-------------------------------------------------Class----------------------------------------------//
   

class WordDictionary {

    //-------------------------------------------------Storage-----------------------------------------------//
    
    private words!: Array<IWord>

    //-------------------------------------------------Constructor----------------------------------------------//

    constructor() {
        this.words = []
    }

    //---------------------------------------------------Methods------------------------------------------------//



    // Fetch Word details

    public async fetchWordDetails(word: string): Promise<IWord | null> {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const apiWord = data[0];

               
                const wordDetails: IWord = {
                    word: apiWord.word,
                    meaningInEnglish: apiWord.meanings[0]?.definitions[0]?.definition || '',
                    meaningInUrdu: '', 
                    similarWords: apiWord.meanings[0]?.definitions[0]?.synonyms || [],
                    summaryOfWord: apiWord.origin || '', 
                    authorOfWord: '', 
                };
                
                console.log("wordDetails: ",wordDetails)
                return wordDetails;
            }

            return null; // Word not found in the API response
        } catch (error) {
            console.error('Error fetching word details:', error);
            return null;
        }
    }



    // Insert Word

    public insertWord(wordDetails: Partial<IWord> | IWord): void {
        console.log("Entered word is: ", wordDetails);
        const generatedId = Math.floor(Math.random() * 20) + 1;
    
        // Push the word and its properties to the array
        wordDetails.id = generatedId;
        this.words.push(wordDetails as IWord); // Cast to IWord
        console.log("generatedId: ", generatedId, "this.words: ", this.words);
    }
    
    
    
    // Insert Multiple Words

    // Update Single Word
    public updateWord(id: number, updatedWord: Partial<IWord> | null): IWord | null | undefined {
        
        let wordToUpdate = this.words.find((item) => item.id === id);
        if (wordToUpdate) {
            wordToUpdate =  Object.assign(wordToUpdate, updatedWord);
            console.log('Updated Word:', wordToUpdate);
        } else {
            console.error("Word not found!");
        }
       
        
        return wordToUpdate 
    }

    // Get All Words And Display in Table 

    public getAllWords(): IWord[] {
       return this.words;
    }
  
    // Get Word By Id

    public getWordById(id: number): IWord | null {
        console.log("id: ", id );
    
        const word = this.words.find((item) => item.id === id);
    
        console.log("word: ", word);
    
        return word ? word : null;
    }
    

    // Search Word By Id

    public searchWord(value: string | number | boolean): Array<IWord> {
        const word = this.words.filter((item) => {
            return Object.values(item).some((e) => {
                if (typeof e === "string" || typeof e === "number" || typeof e === "boolean") {
                    const stringValue = String(e).toLowerCase();
                    const searchValue = String(value).toLowerCase();
                    return stringValue.includes(searchValue);
                }
                return false;
            });
        });
        
        console.log("word: ", word);
        
        return word
        
    }


    // Delete Word

    public deleteWordById(id: number): IWord[] | null {
        console.log("id: ", id );
    
        const index = this.words.findIndex((item) => item.id === id);
        
        const deletedWord =  this.words.splice(index, 1)

        console.log("word: ", deletedWord);
    
        return deletedWord ? deletedWord : null;
    }

}






// Word Dictionary

let words = new WordDictionary();

// File Storage

const wordsFs = new FileStorage<IWord>("dictionary.json");


// Insert Word From Input

async function insertFromInput(word:string): Promise<void> {
    // Fetch Details
    const wordDetails:Partial<IWord> | null = await words.fetchWordDetails(word);
    
    if (wordDetails) {
        // Insert the word with details into the dictionary
        words.insertWord(wordDetails);
        wordsFs.writeData(wordDetails);
        console.log('Word inserted:', wordDetails);
    } else {
        console.log('Word not found or error fetching details.');
    }
}



// Get Word / All Words From Backend

 function getFromBackend(id?:number) {
  
    let wordsRetrieved: IWord | IWord[] | null = null;
    
    if (!id) {
        wordsRetrieved = words.getAllWords();
        console.log("All Words: ", wordsRetrieved);
    } else {
        wordsRetrieved = words.getWordById(id);
        console.log("Word By Id: ", wordsRetrieved);
    }
    
}



// Update Word By ID In The Backend

 async function updateWordById(id:number, wordToInsert:string): Promise<void> {
  
    console.log("insertedId: ", id);
    if (!id) {
        console.error("No Id Provided!")
    }
    
    // Fetching word details from the API
    let updatedWord: Partial<IWord> | null = await words.fetchWordDetails(wordToInsert);
    
    words.updateWord(id,updatedWord);
    wordsFs.writeData(updatedWord, id);
    
}


// Delete Word By ID In The Backend

function deleteWordById(id:number){
    
    console.log("insertedId: ", id);
    const deletedWord: IWord[] | null = words.deleteWordById(id);
    console.log("deletedWord: ", deletedWord);
    
}

// Delete Word By ID In The Backend

function searchWord(input: string | number | boolean){
    
    console.log("valueToSearch: ", input);
    const word: Array<IWord> | null = words.searchWord(input);
    console.log("matchingWords: ", word);
    
}


// Array of words

const wordsToInsert = [
    "Esoteric",
    "Pernicious",
    "Ephemeral",
    "Serendipity",
    "Obfuscate",
    "Idiosyncratic",
    "Epistemology",
    "Quintessential",
    "Mellifluous",
    "Sycophant",
    "Discombobulate",
    "Antediluvian",
    "Sanguine",
    "Vicissitude",
    "Reticent",
    "Perspicacious",
    "Auspicious",
    "Disparate",
    "Ostentatious",
    "Ubiquitous"
];

// Turn Selector

const rand1 = Math.floor(Math.random() * 10) + 1;

const rand2 = Math.floor(Math.random() * 10) + 1;

// Updated Word

const updatedWord = "computer";

// Insertion

wordsToInsert.forEach(word => {
    insertFromInput(word);
});

// Get Words

getFromBackend();



// if(rand1 > rand2){
//     // Search Word
    
//     searchWord("Epistemology");
// }else if(rand1 === rand2){
//     // Delete Word
    
//     deleteWordById(rand2);

// }else{
//     // Update Word
    
//     updateWordById(rand1,updatedWord);
    
// }



    
    updateWordById(19,updatedWord);
    




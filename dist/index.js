"use strict";
//-------------------------------------------------Imports-----------------------------------------------//
Object.defineProperty(exports, "__esModule", { value: true });
const fileSystem_1 = require("./fileSystem");
//-------------------------------------------------Class----------------------------------------------//
class WordDictionary {
    //-------------------------------------------------Storage-----------------------------------------------//
    words;
    //-------------------------------------------------Constructor----------------------------------------------//
    constructor() {
        this.words = [];
    }
    //---------------------------------------------------Methods------------------------------------------------//
    // Fetch Word details
    async fetchWordDetails(word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const apiWord = data[0];
                const wordDetails = {
                    word: apiWord.word,
                    meaningInEnglish: apiWord.meanings[0]?.definitions[0]?.definition || '',
                    meaningInUrdu: '',
                    similarWords: apiWord.meanings[0]?.definitions[0]?.synonyms || [],
                    summaryOfWord: apiWord.origin || '',
                    authorOfWord: '',
                };
                console.log("wordDetails: ", wordDetails);
                return wordDetails;
            }
            return null; // Word not found in the API response
        }
        catch (error) {
            console.error('Error fetching word details:', error);
            return null;
        }
    }
    // Insert Word
    insertWord(wordDetails) {
        console.log("Entered word is: ", wordDetails);
        const generatedId = Math.floor(Math.random() * 20) + 1;
        // Push the word and its properties to the array
        wordDetails.id = generatedId;
        this.words.push(wordDetails); // Cast to IWord
        console.log("generatedId: ", generatedId, "this.words: ", this.words);
    }
    // Insert Multiple Words
    // Update Single Word
    updateWord(id, updatedWord) {
        let wordToUpdate = this.words.find((item) => item.id === id);
        if (wordToUpdate) {
            wordToUpdate = Object.assign(wordToUpdate, updatedWord);
            console.log('Updated Word:', wordToUpdate);
        }
        else {
            console.error("Word not found!");
        }
        return wordToUpdate;
    }
    // Get All Words And Display in Table 
    getAllWords() {
        return this.words;
    }
    // Get Word By Id
    getWordById(id) {
        console.log("id: ", id);
        const word = this.words.find((item) => item.id === id);
        console.log("word: ", word);
        return word ? word : null;
    }
    // Search Word By Id
    searchWord(value) {
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
        return word;
    }
    // Delete Word
    deleteWordById(id) {
        console.log("id: ", id);
        const index = this.words.findIndex((item) => item.id === id);
        const deletedWord = this.words.splice(index, 1);
        console.log("word: ", deletedWord);
        return deletedWord ? deletedWord : null;
    }
}
// Word Dictionary
let words = new WordDictionary();
// File Storage
const wordsFs = new fileSystem_1.FileStorage("dictionary.json");
// Insert Word From Input
async function insertFromInput(word) {
    // Fetch Details
    const wordDetails = await words.fetchWordDetails(word);
    if (wordDetails) {
        // Insert the word with details into the dictionary
        words.insertWord(wordDetails);
        wordsFs.writeData(wordDetails);
        console.log('Word inserted:', wordDetails);
    }
    else {
        console.log('Word not found or error fetching details.');
    }
}
// Get Word / All Words From Backend
function getFromBackend(id) {
    let wordsRetrieved = null;
    if (!id) {
        wordsRetrieved = words.getAllWords();
        console.log("All Words: ", wordsRetrieved);
    }
    else {
        wordsRetrieved = words.getWordById(id);
        console.log("Word By Id: ", wordsRetrieved);
    }
}
// Update Word By ID In The Backend
async function updateWordById(id, wordToInsert) {
    console.log("insertedId: ", id);
    if (!id) {
        console.error("No Id Provided!");
    }
    // Fetching word details from the API
    let updatedWord = await words.fetchWordDetails(wordToInsert);
    words.updateWord(id, updatedWord);
    wordsFs.writeData(updatedWord, id);
}
// Delete Word By ID In The Backend
function deleteWordById(id) {
    console.log("insertedId: ", id);
    const deletedWord = words.deleteWordById(id);
    console.log("deletedWord: ", deletedWord);
}
// Delete Word By ID In The Backend
function searchWord(input) {
    console.log("valueToSearch: ", input);
    const word = words.searchWord(input);
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
updateWordById(19, updatedWord);

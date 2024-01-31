"use strict";
//-------------------------------------------------Imports-----------------------------------------------//
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorage = void 0;
const fs = __importStar(require("fs"));
//-------------------------------------------------Class-----------------------------------------------//
class FileStorage {
    filename = '';
    constructor(filename) {
        this.filename = filename;
    }
    readData() {
        try {
            if (fs.existsSync(this.filename)) {
                const data = fs.readFileSync(this.filename, 'utf8');
                if (data.trim() === "") {
                    return [];
                }
                return JSON.parse(data);
            }
        }
        catch (error) {
            console.error("Error reading file:", error);
        }
        return [];
    }
    isDuplicateData(existingData, newData) {
        if (existingData && existingData.length > 0) {
            return existingData.some(item => JSON.stringify(item) === JSON.stringify(newData));
        }
        return false;
    }
    findData(existingData, id) {
        if (existingData && existingData.length > 0) {
            const wordToUpdate = existingData.find(item => item.id === id);
            let index;
            if (wordToUpdate) {
                index = existingData.indexOf(wordToUpdate);
                return index;
            }
            else {
                return -1;
            }
        }
        return -1;
    }
    writeData(data, id) {
        try {
            const existingData = this.readData();
            console.log("EDATA:", existingData);
            if (data) {
                if (id) {
                    const index = this.findData(existingData, id);
                    console.log("index:", index);
                    console.log("Before item at that index:", existingData[index]);
                    existingData[index] = data;
                    console.log("After item at that index:", existingData[index]);
                }
                if (!this.isDuplicateData(existingData, data)) {
                    console.log("DATA:", data);
                    existingData.push(data);
                    const dataOfArray = JSON.stringify(existingData, null, 2) + '\n';
                    fs.writeFileSync(this.filename, dataOfArray);
                    console.log("Data written successfully.");
                }
                else {
                    console.log("Data already exists. Skipping write operation.");
                }
            }
        }
        catch (error) {
            console.error("Error writing data:", error);
        }
    }
}
exports.FileStorage = FileStorage;

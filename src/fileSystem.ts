    //-------------------------------------------------Imports-----------------------------------------------//
    
    import * as fs from 'fs';
    import { IWord } from './customInterface';
    //-------------------------------------------------Class-----------------------------------------------//
    
    
    
    export class FileStorage<T> {
        private readonly filename: string = '';
    
        constructor(filename: string) {
            this.filename = filename;
        }
    
        private readData(): T[] {
            try {
                if (fs.existsSync(this.filename)) {
                    const data = fs.readFileSync(this.filename, 'utf8');
                    if (data.trim() === "") {
                        return [];
                    }
                    return JSON.parse(data) as T[];
                }
            } catch (error) {
                console.error("Error reading file:", error);
            }
            return [];
        }
    
        
    
        private isDuplicateData(existingData: Partial<T>[], newData: Partial<T>): boolean {
            if (existingData && existingData.length > 0) {
                return existingData.some(item => JSON.stringify(item) === JSON.stringify(newData));
            }
            return false;
        }
        
        private findData<T extends IWord>(existingData: Partial<T>[], id: number): number  {
            if (existingData && existingData.length > 0) {
                const wordToUpdate = existingData.find(item => item.id === id);

                let index; 
                if (wordToUpdate) {
                    index = existingData.indexOf(wordToUpdate)
                    return index
                } else {
                    return -1;
                }
            }
            return -1;
        }
        
        
        
        public writeData(data: Partial<T> | null, id?:number): void {
            try {
                const existingData: Partial<T>[] = this.readData();
                console.log("EDATA:", existingData);
                if(data){
                    if(id){
                    const index = this.findData(existingData,id);

                    console.log("index:",index);
                    console.log("Before item at that index:",existingData[index]);
                    
                    existingData[index] = data;
                    console.log("After item at that index:",existingData[index]);
                        
                    }
                    if (!this.isDuplicateData(existingData, data)) {
                        console.log("DATA:", data);
                        existingData.push(data);
                        
                        const dataOfArray = JSON.stringify(existingData, null, 2) + '\n';
                        fs.writeFileSync(this.filename, dataOfArray);
                        console.log("Data written successfully.");
                    } else {
                        console.log("Data already exists. Skipping write operation.");
                    }
                }
            } catch (error) {
                console.error("Error writing data:", error);
            }
        }
        
        
    
    }
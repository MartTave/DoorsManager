import { readFileSync } from "fs"
import { join } from "path"

const defaultFolder = "../Frontend/www/"

export function serveFile(filePath:string):string {
    // This regex match a filename
    let fileContent = readFileSync(join(__dirname, defaultFolder, filePath)).toString()
    const arr = fileContent.match(/^{{ ([^\n]+.html) }}/)
    if (arr === null) {
        // This file has no parent
        return fileContent
    } else {
        // This file has a parent -> need to load and fill it
        let parentContent = serveFile(arr[1])
        const regex = /{% start ([A-z_]+) %}/g
        const currReg = "{% start <> %}([\\s\\S]+){% end <> %}"
        const parentReg = "{% <> %}"
        let match
        while(match = regex.exec(fileContent)) {
            const tagName = match[1]
            // This regex is to find the block to fill in the parent
            const currentRegex = new RegExp(currReg.replace(/<>/g, tagName), 'g')
            const childRes = currentRegex.exec(fileContent)
            if (childRes === null) {
                console.log("Something went very wrong...")
                break
            }
            const childContent = childRes[1]
            // This regex is to find the destination in the parent
            const currentParentReg = new RegExp(parentReg.replace(/<>/g, tagName), "g")
            parentContent = parentContent.replace(currentParentReg, childContent)
            console.log(parentContent)
        }
        parentContent = parentContent.replace(/{% [A-z_]+ %}/g, '')
        return parentContent
    }
}

serveFile("Dashboard.html")
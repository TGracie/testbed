const fs = require('fs')
const path = require('path')

// get program args
let args = process.argv
// filepath is last item
const filepath = args[2]

if (filepath) {
    createDirectory()
    let files = fs.readdirSync(`${filepath}`)

    let groupedList = files.reduce((acc, currentFile) => {
        let filename = path.basename(currentFile, '.txt')
        let keyname = ""

        if (hasSuffix(filename)) {
            keyname = filename.substring(0, filename.length - 3)
        } else {
            keyname = filename
        }

        if (!acc[keyname]) {
            acc[keyname] = []
        }
        acc[keyname].push(currentFile)
        return acc
    }, {})

    let keys = Object.keys(groupedList)

    // reduce to only dupes
    let onlydupes = keys.reduce((acc, currentKey) => {
        let count = groupedList[currentKey].length
        if (count > 1) {
            if (!acc[currentKey]) {
                acc[currentKey] = []
            }
            acc[currentKey] = acc[currentKey].concat(groupedList[currentKey])
        }

        return acc
    }, {})
    
    let dupeKeys = Object.keys(onlydupes)
    dupeKeys.forEach(key => {
        // get list of filenames
        onlydupes[key].forEach(filename => {
            if (filename.includes(").")) {
                moveFile(filename)
            }
        });
    });

} else {
    console.error("No filepath supplied")
}

function hasSuffix(filename) {
    return filename.endsWith(")")
}

function moveFile(filename) {
    const currentPath = path.join(__dirname, filepath, filename)
    const destinationPath = path.join(__dirname, "dupes", filename)

    fs.rename(currentPath, destinationPath, function (err) {
        if (err) {
            throw err
        } else {
            console.log("Successfully moved the file!");
        }
    });
}

function createDirectory() {
    fs.mkdir(path.join(__dirname, "dupes"), (err) => {
        if (err) {
            console.error(err)
        }
        console.log('created directory successfully')
    })
}
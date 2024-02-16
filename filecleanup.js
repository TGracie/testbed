const fs = require('fs')
const path = require('path')

// get program args
args = process.argv
// filepath is last item
filepath = args[2]

if (filepath) {
    files = fs.readdirSync(`${filepath}`)

    let groupedList = files.reduce((acc, currentFile) => {
        filename = path.basename(currentFile, '.txt')
        keyname = ""

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

    keys = Object.keys(groupedList)

    // reduce to only dupes
    let onlydupes = keys.reduce((acc, currentKey) => {
        count = groupedList[currentKey].length
        if (count > 1) {
            if (!acc[currentKey]) {
                acc[currentKey] = []
            }
            acc[currentKey] = acc[currentKey].concat(groupedList[currentKey])
        }

        return acc
    }, {})

    dupeKeys = Object.keys(onlydupes)
    dupeKeys.forEach(key => {
        // get list of filenames
        onlydupes[key].forEach(filename => {
            if (filename.includes(").")) {
                // move this file
                fs.rename(filename, `../dupes/${filename}`, () => {
                    console.log("file moved?")
                })
            }
            
        });
        
    });

    // console.log(onlydupes)

    fs.mkdir(path.join(__dirname, "dupes"), (err) => {
        if (err) {
            // return console.error(err)
        }
        console.log('created directory successfully')
    })

} else {
    console.error("No filepath supplied")
}


function hasSuffix(filename) {
    return filename.endsWith(")")
}
// console.log(args)

// once finished running
// read map[filename][list of filenames]
// if length of values is greater than 1
//  move all but 1 to dupes directory
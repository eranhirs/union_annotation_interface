function escapeRegExp(string) {
    // See https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function findAllInText(textToSearchFor, textToSearchIn) {
    /*
    finds all ranges of `textToSearchFor` in `textToSearchIn`.
    See https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript
    */

    let ranges = []

    // Searching for "" doesn't make sense & stuck the browser
    if (textToSearchFor != "") {
        const regex = new RegExp(`${escapeRegExp(textToSearchFor)}`, "gi");
        let result;
        while ( result = regex.exec(textToSearchIn) ) {
            ranges.push([result.index, result.index + textToSearchFor.length]);
        }
    }

    return ranges
}


function phraseToWords(phrase) {
    /*
    Very naive split of phrases to words (should work well when text is tokenized)
    */

    return phrase.split(" ")
}


export { findAllInText, phraseToWords };
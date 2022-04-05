function findAllInText(textToSearchFor, textToSearchIn) {
    /*
    finds all ranges of `textToSearchFor` in `textToSearchIn`.
    See https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript
    */

    let ranges = []

    // Searching for "" doesn't make sense & stuck the browser
    if (textToSearchFor != "") {
        const regex = new RegExp(`[ ,]?${textToSearchFor}[ .]?`, "gi");
        let result;
        while ( result = regex.exec(textToSearchIn) ) {
            ranges.push([result.index + 1, result.index + textToSearchFor.length + 1]);
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
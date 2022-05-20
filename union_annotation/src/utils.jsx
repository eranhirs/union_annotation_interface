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
        // Regex explanation: \W indicates not a word , and we also want to catch cases where it is at the beginning or end of the sentence.
        const regex = new RegExp(`(^|\\W)${escapeRegExp(textToSearchFor)}(\\W|$)`, "gi");
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

    const wordsWithRanges = []
    const words = phrase.trim().split(" ")
    
    // Add indices to each word by counting word lengths
    let start_index = 0
    for (const word of words) {
        wordsWithRanges.push({
            "word": word,
            "range": [start_index, start_index + word.length]
        })
        start_index += word.length + 1
    }

    return wordsWithRanges
}


export { findAllInText, phraseToWords };
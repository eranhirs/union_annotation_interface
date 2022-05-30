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
        // Regex explanation: We are searching for complete words, so \W is used to indicate a character which is not an alpha letter , and we also want to catch cases where it is at the beginning or end of the sentence.
        const regex = new RegExp(`(^|\\W)${escapeRegExp(textToSearchFor)}(\\W|$)`, "gi");
        let result;
        while ( result = regex.exec(textToSearchIn) ) {
            // The +1 is because of the \W, we shouldn't add +1 if it's the beginning of a sentence
            const startIndex = result.index == 0 ? 0 : result.index + 1
            ranges.push([startIndex, startIndex + textToSearchFor.length]);
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
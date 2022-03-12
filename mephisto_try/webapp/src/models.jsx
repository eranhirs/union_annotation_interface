class SubmissionData {
    constructor(chosenSentenceId, highlightedPhrases, mergedText, feedbackText) {
        this.chosenSentenceId = chosenSentenceId;
        this.highlightedPhrases = highlightedPhrases;
        this.mergedText = mergedText;
        this.feedbackText = feedbackText;
    }
}

class ExampleData {
    constructor(exampleTitle, sentence1Text, sentence2Text, chosenSentenceId, highlightedPhrases, mergedSentenceText, step2Extra, step3Extra, step4Extra) {
        this.exampleTitle = exampleTitle;
        this.sentence1Text = sentence1Text;
        this.sentence2Text = sentence2Text;
        this.chosenSentenceId = chosenSentenceId;
        this.highlightedPhrases = highlightedPhrases;
        this.mergedSentenceText = mergedSentenceText;
        this.step2Extra = step2Extra;
        this.step3Extra = step3Extra;
        this.step4Extra = step4Extra;
    }
}


export { SubmissionData, ExampleData };
class SubmissionData {
    constructor(chosenSentenceId, highlightedPhrases, mergedText, feedbackText) {
        this.chosenSentenceId = chosenSentenceId;
        this.highlightedPhrases = highlightedPhrases;
        this.mergedText = mergedText;
        this.feedbackText = feedbackText;
    }
}

export { SubmissionData };
class SubmissionData {
    constructor(chosenSentenceId, highlightedPhrases, mergedText, feedbackText, taskData, skipped=false) {
        this.chosenSentenceId = chosenSentenceId;
        this.highlightedPhrases = highlightedPhrases;
        this.mergedText = mergedText;
        this.feedbackText = feedbackText;
        this.taskData = taskData;
        this.skipped = skipped;
    }
}

class ExampleData {
    constructor(exampleId, exampleTitle, sentence1Text, sentence2Text, chosenSentenceId, highlightedSentenceId, highlightedPhrases, highlightedPhrasesCopy, mergedHighlightedPhrases, mergedSentenceText, step1Extra, step2Extra, step3Extra, step4Extra, allowedLastStep) {
        this.exampleId = exampleId;
        this.exampleTitle = exampleTitle;
        this.sentence1Text = sentence1Text;
        this.sentence2Text = sentence2Text;
        this.chosenSentenceId = chosenSentenceId;
        this.highlightedSentenceId = highlightedSentenceId;
        this.highlightedPhrases = highlightedPhrases; // Consecutive highlights (step 3)
        this.highlightedPhrasesCopy = highlightedPhrasesCopy; // Broken per word (step 4)
        this.mergedHighlightedPhrases = mergedHighlightedPhrases; // To highlight stuff on the merged sentence
        this.mergedSentenceText = mergedSentenceText;
        this.step1Extra = step1Extra;
        this.step2Extra = step2Extra;
        this.step3Extra = step3Extra;
        this.step4Extra = step4Extra;
        this.allowedLastStep = allowedLastStep;
    }
}


export { SubmissionData, ExampleData };
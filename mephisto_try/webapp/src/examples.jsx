import React, { useState } from 'react';

// Example 1
const exampleTitle = "Simple example"
const sentence1Text = "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle."
const sentence2Text = "Robbers crash 4x4 into store , grabbing jewelry and watches , before setting car ablaze."
const chosenSentenceId = 1
const highlightedPhrases = ["crash 4x4 into store"]
const mergedSentenceText = "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle."
const step2Extra = "In this example, we chose Sentence 1."
const step3Extra = <section> In this example:
    <dl className="row">
        <dt className="col-sm-3">* "Robbers"</dt>
        <dd className="col-sm-9">Conveys the same information as "thieves" in sentence 1, do not highlight.</dd>

        <dt className="col-sm-3">* "crash 4x4 into store"</dt>
        <dd className="col-sm-9">New information, do highlight.</dd>

        <dt className="col-sm-3">* "grabbing jewelry and watches , before setting car ablaze."</dt>
        <dd className="col-sm-9">Conveys exactly the same information as sentence 1, do not highlight.</dd>
    </dl>
</section>
const step4Extra = <section>In this example, we add "crash 4x4 into store". Note how we slightly rephrased "crashed" to "crashing". Rephrasing is allowed if necessary.</section>

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

const example1 = new ExampleData(exampleTitle, sentence1Text, sentence2Text, chosenSentenceId, highlightedPhrases, mergedSentenceText, step2Extra, step3Extra, step4Extra);

const exampleTitle2 = "Example #2 - Entailment example";
const example2 = new ExampleData(exampleTitle2, sentence1Text, sentence2Text, chosenSentenceId, highlightedPhrases, mergedSentenceText, step2Extra, step3Extra, step4Extra);

const exampleTitle3 = "Example #3 - Contradiction example";
const example3 = new ExampleData(exampleTitle3, sentence1Text, sentence2Text, chosenSentenceId, highlightedPhrases, mergedSentenceText, step2Extra, step3Extra, step4Extra);


const examples = [
    example1,
    // example2,
    // example3
]

export { examples };
import React, { useState, useRef, useEffect } from 'react';
import { readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction, contradictingInformationDescription, newInformationDescription, entailmentDescription, entailingInformationDescription, fullMatchDescription, partialMatchDescription, noMatchDescription } from './texts.jsx';
import { Sentence } from './sentence.jsx'
import { Directions } from "./core_components.jsx";
import { Modal } from 'bootstrap';
import { findAllInText, phraseToWords } from '../utils.jsx';


function ReadSentencesStep({ taskData, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;
    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} />
    
    return (
        <div className="row">
            <div className="col-12 fs-5">
                <Directions title="Step 1">
                    Make sure you read the instructions and examples above. <br/><br/>
                    {readSentencesStepInstruction}
                </Directions>
            </div>
            <div className="col-12">
                <section>
                    {sentence1}
                    {sentence2}
                </section>
            </div>
        </div>
    )
}

function ChooseSentenceStep({ taskData, setStep, setAllowedStep, chosenSentenceId, setChosenSentenceId, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    function chooseSentence(chosenSentenceId) {
        setAllowedStep(4); 
        setStep(3);
        setChosenSentenceId(chosenSentenceId);
    }

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} onClick={() => chooseSentence(1)} highlighted={chosenSentenceId==1} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} onClick={() => chooseSentence(2)} highlighted={chosenSentenceId==2} />

    return (
        <div className="row">
            <div className="col-12 fs-5">
                <Directions title="Step 2">
                    {chooseSentenceStepInstruction}
                </Directions>
            </div>
            <div className="col-md-12">
                {sentence1}
            </div>
            <div className="col-md-12">
                {sentence2}
            </div>
        </div>
    )
}

function HighlightPhrasesStep({ taskData, chosenSentenceId, highlightedSentenceId, highlightedPhrases, setHighlightedPhrases, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={chosenSentenceId==1} highlighted={chosenSentenceId==1} highlightedPhrases={highlightedPhrases} useIndicesForHighlight={chosenSentenceId != 1} setHighlightPhrase={setHighlightPhrase} readOnly={isExample} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={chosenSentenceId==2} highlighted={chosenSentenceId==2} highlightedPhrases={highlightedPhrases} useIndicesForHighlight={chosenSentenceId != 2} setHighlightPhrase={setHighlightPhrase} readOnly={isExample} />

    function setHighlightPhrase(textParts) {
        const highlightedPhrases = []
        for (const textPart of textParts) {
            if (textPart.isHighlighted) {
                highlightedPhrases.push({
                    "phrase": textPart.text,
                    "start": textPart.start,
                    "end": textPart.end,
                    "sentenceId": highlightedSentenceId
                })
            }
        }
        setHighlightedPhrases(highlightedPhrases)
    }

    function removeHighlightedPhrase(highlightedPhraseObject) {
        setHighlightedPhrases(highlightedPhrases.filter(object => object != highlightedPhraseObject))
    }

    const trashIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>
    
    const highlightedPhrasesListComponent = <section className="highlighted-phrases-list">Highlighted phrases: {highlightedPhrases.length > 0 && highlightedPhrases.map(function(object, i) {
            return <span className="highlighted-phrase-list-component highlight " onClick={() => removeHighlightedPhrase(object)}>{object['phrase']} <span className="trash-icon">{trashIcon}</span></span>
        }).reduce((prev, curr) => [prev, ", ", curr])}</section>


    return (
        <div className="row">
            <div className="col-12 fs-5">
                <Directions title="Step 3">
                    {highlightPhrasesStepInstruction}
                </Directions>
            </div>
            <div className="col-12">
                {sentence1}
                {!isExample && chosenSentenceId != 1 && highlightedPhrasesListComponent}
                {sentence2}
                {!isExample && chosenSentenceId != 2 && highlightedPhrasesListComponent}                
            </div>
        </div>
    )
}


function MergeSentencesStep({ taskData, mergedText, setMergedText, highlightedPhrases, mergedHighlightedPhrases, chosenSentenceId, feedbackText, setFeedbackText, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    function markHighlightedPhrasesAsMerged(mergedText, highlightedPhrases) {
        /*
        To encourage the user to use all highlighted phrases, we change the color of those that were already used.
        This function identifies which word of the highlighted phrases were used.
        */

        // Copy highlighted phrases to not change it
        const highlightedPhrasesCopy = JSON.parse(JSON.stringify(highlightedPhrases));

        for (const highlightedPhrase of highlightedPhrasesCopy) {
            const words = phraseToWords(highlightedPhrase['phrase'])
            let foundWordsCount = 0
            for (const word of words) {
                const anyFound = findAllInText(word, mergedText).length > 0;
                if (anyFound) {
                    foundWordsCount += 1
                }
            }

            const percentFound = foundWordsCount / words.length
            if (percentFound >= 1.0) {
                highlightedPhrase['className'] = 'full-highlight'
                highlightedPhrase['tooltip'] = fullMatchDescription
            } else if (percentFound > 0) {
                highlightedPhrase['className'] = 'partial-highlight'
                highlightedPhrase['tooltip'] = partialMatchDescription
            } else {
                highlightedPhrase['className'] = 'yellow-highlight'
                highlightedPhrase['tooltip'] = noMatchDescription                
            }
        }
        
        return highlightedPhrasesCopy
    }

    const highlightedPhrasesCopy = markHighlightedPhrasesAsMerged(mergedText, highlightedPhrases)

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={true} highlighted={chosenSentenceId==1} highlightedPhrases={highlightedPhrasesCopy} useIndicesForHighlight={chosenSentenceId != 1} mergedText={mergedText} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={true} highlighted={chosenSentenceId==2} highlightedPhrases={highlightedPhrasesCopy} useIndicesForHighlight={chosenSentenceId != 2} mergedText={mergedText} />

    const mergedSentenceTextArea = <section>
        <h5 className="card-title">Merged sentence</h5>
        <textarea
            onChange={(e) => setMergedText(e.target.value)}
            placeholder="Please complete here the merged sentence"
            value={mergedText}
        />
    </section>

    const mergedSentenceHighlightable = <Sentence title="Merged sentence" text={mergedText} disabled={false} highlighted={false} useIndicesForHighlight={true} highlightedPhrases={mergedHighlightedPhrases} setHighlightPhrase={() => {}} readOnly={true} />

    const feedbackTextComponent = <section>
            <h5 className="card-title">Feedback (optional)</h5>
            <textarea
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Please provide here feedback about the task"
            value={feedbackText} />
        </section>

    return (
        <div className="row merge-sentences-step" key={highlightedPhrases}>
            <div className="col-12 fs-5">
                <Directions title="Step 4">
                    {mergeSentencesStepInstruction}
                </Directions>
                {!isExample && <dl className="row">
                    <dt className="col-sm-2">Write one sentence</dt>
                    <dd className="col-sm-10">There should be exactly one sentence in the merged text, and related information should be adjacent in content and structure.</dd>

                    <dt className="col-sm-2">Avoid repetition</dt>
                    <dd className="col-sm-10">
Each piece of information should appear only once in the merged sentence.
<br/>Choose the more specific phrasing when there is a repetition.
<br/>However, repeat common knowledge (for example, keep both "France” and “Paris").</dd>

                    <dt className="col-sm-2">Avoid paraphrasing</dt>
                    <dd className="col-sm-10">To the extent possible, the merged sentence should preserve the original wording of the information.</dd>
                    
                    <dt className="col-sm-2">Skip if necessary</dt>
                    <dd className="col-sm-10">Please use the Skip button if you cannot merge, for example if one sentence disagrees with another.</dd>
                </dl>}
            </div>
            <div className="col-12">
                {sentence1}
                {sentence2}
                {!isExample && mergedSentenceTextArea}
                {isExample && mergedSentenceHighlightable}
                {!isExample && feedbackTextComponent}
            </div>
        </div>
    )
}

export { ReadSentencesStep, ChooseSentenceStep, HighlightPhrasesStep, MergeSentencesStep };

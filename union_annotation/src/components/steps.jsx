import React, { useState, useRef, useEffect } from 'react';
import { readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction, contradictingInformationDescription, newInformationDescription, entailmentDescription, entailingInformationDescription, fullMatchDescription, partialMatchDescription, noMatchDescription } from './texts.jsx';
import { Sentence } from './sentence.jsx'
import { Directions } from "./core_components.jsx";
import { Modal } from 'bootstrap';
import { findAllInText, phraseToWords } from '../utils.jsx';
import { trashIcon } from './icons.jsx';
import { HighlightTooltip } from './highlight_tooltip.jsx';


function ReadSentencesStep({ taskData, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;
    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} />
    
    return (
        <div className="row">
            <div className="col-12 fs-5">
                <Directions title="Step 1">
                    {!isExample && <span>Please read the instructions and examples, you can see them by clicking the instructions button below. <br/><br/></span>}
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
    
    const highlightedPhrasesListComponent = <section className="highlighted-phrases-list">Highlighted phrases: {highlightedPhrases.length > 0 && highlightedPhrases.map(function(object, i) {
            return <span className="highlighted-phrase-list-component highlight " onClick={() => removeHighlightedPhrase(object)}><HighlightTooltip text={<span>{object['phrase']} <span className="trash-icon">{trashIcon}</span></span>} tooltipText="Click to delete the highlight" /></span>
        }).reduce((prev, curr) => [prev, ", ", curr])}</section>


    return (
        <div className="row">
            <div className="col-12 fs-5">
                <Directions title="Step 3">
                    {!isExample && <span>Make sure you read the elaborated instructions for the highlight step (Step 3), you can open them using the instructions button below. <br/><br/></span>}
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


function MergeSentencesStep({ taskData, mergedText, setMergedText, highlightedPhrases, mergedHighlightedPhrases, chosenSentenceId, feedbackText, setFeedbackText, skipped, setSkipped, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={true} highlighted={chosenSentenceId==1} highlightedPhrases={highlightedPhrases} useIndicesForHighlight={chosenSentenceId != 1} mergedText={mergedText} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={true} highlighted={chosenSentenceId==2} highlightedPhrases={highlightedPhrases} useIndicesForHighlight={chosenSentenceId != 2} mergedText={mergedText} />

    const mergedSentenceTextArea = <section>
        <h5 className="card-title">Merged sentence</h5>
        {!skipped && <textarea
            onChange={(e) => setMergedText(e.target.value)}
            placeholder="Please complete here the merged sentence"
            value={mergedText}
            disabled={skipped}
        />}
        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={skipped} onClick={() => setSkipped(!skipped)} />
        <label className="form-check-label" htmlFor="flexCheckDefault">&nbsp;Skip: These two sentences have contradicting information, or are too different to create a coherent merged sentence (provide feedback instead)</label>
    </section>

    const mergedSentenceHighlightable = <Sentence title="Merged sentence" text={mergedText} disabled={false} highlighted={false} useIndicesForHighlight={true} highlightedPhrases={mergedHighlightedPhrases} setHighlightPhrase={() => {}} readOnly={true} />

    const feedbackTextComponent = <section className="feedback-component">
            <h5 className="card-title">Feedback {!skipped ? "(optional)" : ""}</h5>
            <textarea
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Please provide here feedback about the task"
            value={feedbackText} />
        </section>

    return (
        <div className="row merge-sentences-step" key={highlightedPhrases}>
            <div className="col-12 fs-5">
                <Directions title="Step 4">
                {!isExample && <span>Please read the elaborated instructions for the merge step (Step 4), you can see them by clicking the instructions button below. <br/><br/></span>}
                    {mergeSentencesStepInstruction}
                </Directions>
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

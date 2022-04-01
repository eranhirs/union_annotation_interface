import React, { useState, useRef, useEffect } from 'react';
import { readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction, contradictingInformationDescription, newInformationDescription, entailmentDescription, entailingInformationDescription } from './texts.jsx';
import { Sentence } from './sentence.jsx'
import { Directions } from "./core_components.jsx";
import { Modal } from 'bootstrap';


function ReadSentencesStep({ taskData, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;
    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} />
    
    return (
        <div className="row">
            {!isExample && <div className="col-12">
                <Directions title="Step 1">
                    Make sure you read the instructions and examples above. <br/><br/>
                    {readSentencesStepInstruction}
                </Directions>
            </div>}
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

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} onClick={() => chooseSentence(1)} chosenSentence={chosenSentenceId==1} disabled={chosenSentenceId==1} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} onClick={() => chooseSentence(2)} chosenSentence={chosenSentenceId==2} disabled={chosenSentenceId==2} />

    return (
        <div className="row">
            {!isExample && <div className="col-12">
                <Directions title="Step 2">
                    {chooseSentenceStepInstruction}
                </Directions>
            </div>}
            <div className="col-md-12">
                {sentence1}
            </div>
            <div className="col-md-12">
                {sentence2}
            </div>
        </div>
    )
}

function HighlightPhrasesStep({ taskData, chosenSentenceId, highlightedPhrases, setHighlightedPhrases, onContradiction = null, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={chosenSentenceId==1} highlight={chosenSentenceId!=1} chosenSentence={chosenSentenceId==1} highlightedPhrases={highlightedPhrases} setHighlightPhrase={setHighlightPhrase} isExample={isExample} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={chosenSentenceId==2} highlight={chosenSentenceId!=2} chosenSentence={chosenSentenceId==2} highlightedPhrases={highlightedPhrases} setHighlightPhrase={setHighlightPhrase} isExample={isExample} />

    function setHighlightPhrase(highlightedPhrase, start, end) {
        const highlightedPhrasesTexts = highlightedPhrases.map(phraseObj => phraseObj['phrase'])
        if (highlightedPhrase.trim() != "" && !highlightedPhrasesTexts.includes(highlightedPhrase)) {
            setHighlightedPhrases([...highlightedPhrases, {
                "phrase": highlightedPhrase,
                "start": start,
                "end": end
            }])            
        }
    }

    function removeHighlightedPhrase(highlightedPhraseObject) {
        setHighlightedPhrases(highlightedPhrases.filter(object => object != highlightedPhraseObject))
    }

    const highlightedPhrasesListComponent = <section>Highlighted phrases: {highlightedPhrases.length > 0 && highlightedPhrases.map(function(object, i) {
            return <mark className="yellow highlighted-phrase-list-component" onClick={() => removeHighlightedPhrase(object)}>{object['phrase']}</mark>
        }).reduce((prev, curr) => [prev, ", ", curr])}</section>


    return (
        <div className="row">
            {!isExample && <div className="col-12">
                <Directions title="Step 3">
                    {highlightPhrasesStepInstruction}
                </Directions>
            </div>}
            <div className="col-12">
                {sentence1}
                {chosenSentenceId != 1 && highlightedPhrasesListComponent}
                {sentence2}
                {chosenSentenceId != 2 && highlightedPhrasesListComponent}                
            </div>
        </div>
    )
}


function MergeSentencesStep({ taskData, mergedText, setMergedText, highlightedPhrases, chosenSentenceId, feedbackText, setFeedbackText, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={true} chosenSentence={chosenSentenceId==1} highlightedPhrases={highlightedPhrases} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={true} chosenSentence={chosenSentenceId==2} highlightedPhrases={highlightedPhrases} />

    const mergedSentenceComponent = <section>
        <h5 className="card-title">Merged sentence</h5>
        <textarea
            onChange={(e) => setMergedText(e.target.value)}
            placeholder="Please complete here the merged sentence"
            value={mergedText}
        />
    </section>

    const feedbackTextComponent = <section>
            <h5 className="card-title">Feedback (optional)</h5>
            <textarea
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Please provide here feedback about the task"
            value={feedbackText} />
        </section>

    return (
        <div className="row merge-sentences-step">
            {!isExample && <div className="col-12">
                <Directions title="Step 4">
                    {mergeSentencesStepInstruction}
                </Directions>
            </div>}
            <div className="col-12">
                {sentence1}
                {sentence2}
                {mergedSentenceComponent}
                {/* <Sentence title="Merged sentence" text={mergedText} readOnly={false} setText={setMergedText}></Sentence> */}
                {!isExample && feedbackTextComponent}
            </div>
        </div>
    )
}

export { ReadSentencesStep, ChooseSentenceStep, HighlightPhrasesStep, MergeSentencesStep };

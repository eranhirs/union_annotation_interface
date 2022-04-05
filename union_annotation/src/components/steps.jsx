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
            {!isExample && <div className="col-12 fs-5">
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

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} onClick={() => chooseSentence(1)} highlighted={chosenSentenceId==1} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} onClick={() => chooseSentence(2)} highlighted={chosenSentenceId==2} />

    return (
        <div className="row">
            {!isExample && <div className="col-12 fs-5">
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

function HighlightPhrasesStep({ taskData, chosenSentenceId, highlightedSentenceId, highlightedPhrases, setHighlightedPhrases, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={chosenSentenceId==1} highlighted={chosenSentenceId==1} highlightedPhrases={highlightedPhrases.filter(obj => obj['sentenceId'] == 1)} setHighlightPhrase={setHighlightPhrase} readOnly={isExample} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={chosenSentenceId==2} highlighted={chosenSentenceId==2} highlightedPhrases={highlightedPhrases.filter(obj => obj['sentenceId'] == 2)} setHighlightPhrase={setHighlightPhrase} readOnly={isExample} />

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
            return <span className="highlighted-phrase-list-component highlight" onClick={() => removeHighlightedPhrase(object)}>{object['phrase']}</span>
        }).reduce((prev, curr) => [prev, ", ", curr])}</section>


    return (
        <div className="row">
            {!isExample && <div className="col-12 fs-5">
                <Directions title="Step 3">
                    {highlightPhrasesStepInstruction}
                </Directions>
            </div>}
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

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={true} highlighted={chosenSentenceId==1} highlightedPhrases={highlightedPhrases.filter(obj => obj['sentenceId'] == 1)} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={true} highlighted={chosenSentenceId==2} highlightedPhrases={highlightedPhrases.filter(obj => obj['sentenceId'] == 2)} />

    const mergedSentenceTextArea = <section>
        <h5 className="card-title">Merged sentence</h5>
        <textarea
            onChange={(e) => setMergedText(e.target.value)}
            placeholder="Please complete here the merged sentence"
            value={mergedText}
        />
    </section>

    const mergedSentenceHighlightable = <Sentence title="Merged sentence" text={mergedText} disabled={false} highlighted={false} highlightedPhrases={mergedHighlightedPhrases} setHighlightPhrase={() => {}} readOnly={true} />

    const feedbackTextComponent = <section>
            <h5 className="card-title">Feedback (optional)</h5>
            <textarea
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Please provide here feedback about the task"
            value={feedbackText} />
        </section>

    return (
        <div className="row merge-sentences-step">
            {!isExample && <div className="col-12 fs-5">
                <Directions title="Step 4">
                    {mergeSentencesStepInstruction}
                </Directions>
                Here are some detailed guidelines:
                <dl className="row">
                    <dt className="col-sm-3">Write one sentence</dt>
                    <dd className="col-sm-9">The merged text should be exactly one sentence, and related pieces of information should be close by in content and structure.</dd>

                    <dt className="col-sm-3">Avoid repetition</dt>
                    <dd className="col-sm-9">The merged sentence should contain each piece of information only once. In the case where one piece of information is more specific than the other, choose the more specific one.</dd>

                    <dt className="col-sm-3">Avoid paraphrasing</dt>
                    <dd className="col-sm-9">The merged sentence should contain the original phrasing of the information. However, it is ok to paraphase if necessary, for example in order to avoid repetition.</dd>
                    
                    <dt className="col-sm-3">Skip disagreement</dt>
                    <dd className="col-sm-9">If a merge is not possible because one sentence disagrees with the other, please explain the disagreement in the feedback and submit an empty merged sentence.</dd>
                </dl>                
            </div>}
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

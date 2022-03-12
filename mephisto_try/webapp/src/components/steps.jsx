import React, { useState, useRef, useEffect } from 'react';
import { readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction, contradictingInformationDescription, newInformationDescription, entailmentDescription, entailingInformationDescription } from './texts.jsx';
import { Sentence } from './sentence.jsx'
import { Directions } from "./core_components.jsx";


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
            {/* <div className="col-md-1">
                {<input className="form-check-input sentence-radiobox" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={() => chooseSentence(1)} checked={chosenSentenceId == 1} />}
                <button type="button" className="btn btn-primary step-button sentence-radiobox" onClick={() => chooseSentence(1)}>Choose 1</button>
            </div>*/}
            <div className="col-md-12">
                {sentence1}
            </div>
            {/* <div className="col-md-1">
                <button type="button" className="btn btn-primary step-button sentence-radiobox" onClick={() => chooseSentence(2)}>Choose 2</button>
            </div> */}
            <div className="col-md-12">
                {sentence2}
            </div>
        </div>
    )
}

function HighlightPhrasesStep({ taskData, chosenSentenceId, highlightedPhrases, setHighlightedPhrases, onContradiction = null, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    const modalRef = useRef(null);
    const [ highlightModal, setHighlightModal ] = useState(null);
    const [ highlightCandidate, setHighlightCandidate ] = useState(null);

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={chosenSentenceId==1} highlight={chosenSentenceId!=1} chosenSentence={chosenSentenceId==1} highlightedPhrases={highlightedPhrases} highlightModal={highlightModal} setHighlightCandidate={setHighlightCandidate} isExample={isExample} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={chosenSentenceId==2} highlight={chosenSentenceId!=2} chosenSentence={chosenSentenceId==2} highlightedPhrases={highlightedPhrases} highlightModal={highlightModal} setHighlightCandidate={setHighlightCandidate} isExample={isExample} />

    useEffect(() => {
        if (myModal == null) {
            var myModal = new bootstrap.Modal(modalRef.current)
            setHighlightModal(myModal);
        }
    }, [])

    function highlightPhrase(highlightedPhrase, highlightType) {
        setHighlightedPhrases([...highlightedPhrases, {
            "phrase": highlightedPhrase,
            "type": highlightType
        }])

        if (highlightType == "contradicting") {
            onContradiction(highlightedPhrase);
        }
    }

    const highlightedPhrasesListComponent = highlightedPhrases.length > 0 && <section>Highlighted phrases: {highlightedPhrases.map(function(object, i) {
            return <mark className="yellow">{object['phrase']}</mark>
        }).reduce((prev, curr) => [prev, ", ", curr])}</section>


    const highlightPhraseModalComponent = <div className="modal fade" ref={modalRef} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">Highlight span</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    You highlighted the span <mark className="yellow">{highlightCandidate}</mark> , please classify it to one of the following categories:
                    <div className="list-group highlight-classification-list-group">
                        <a href="#" className="list-group-item list-group-item-action" data-bs-dismiss="modal" onClick={() => highlightPhrase(highlightCandidate, "new")}>
                            <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">New Information</h5>
                            </div>
                            <p className="mb-1">{newInformationDescription}</p>
                        </a>
                        <a href="#" className="list-group-item list-group-item-action" data-bs-dismiss="modal" onClick={() => highlightPhrase(highlightCandidate, "entailing")}>
                            <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">Entailing Information</h5>
                            </div>
                            <p className="mb-1">{entailingInformationDescription}</p>
                        </a>
                        <a href="#" className="list-group-item list-group-item-action" data-bs-dismiss="modal" onClick={() => highlightPhrase(highlightCandidate, "contradicting")}>
                            <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">Contradicting Information</h5>
                            </div>
                            <p className="mb-1">{contradictingInformationDescription}</p>
                            <small className="text-muted">Choosing this will automatically complete the HIT, because we would like to skip examples with contradicting information.</small>
                        </a>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
                </div>
            </div>
        </div>

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
            {highlightPhraseModalComponent}
        </div>
    )
}


function MergeSentencesStep({ taskData, mergedText, setMergedText, highlightedPhrases, chosenSentenceId, feedbackText, setFeedbackText, isExample = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={true} chosenSentence={chosenSentenceId==1} highlightedPhrases={highlightedPhrases} highlight={true} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={true} chosenSentence={chosenSentenceId==2} highlightedPhrases={highlightedPhrases} highlight={true} />

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

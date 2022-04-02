import React, { useState, useRef, useEffect } from 'react';
import { Instructions } from "./instructions.jsx";
import { examples } from "./../examples.jsx";
import { SubmissionData } from '../models.jsx';
import { ChooseSentenceStep, HighlightPhrasesStep, MergeSentencesStep, ReadSentencesStep } from './steps.jsx';
import { Modal } from 'bootstrap';

function Task({ taskData, isOnboarding, onSubmit, onError }) {
    const { sentence1Text, sentence2Text } = taskData;
    const [step, setStep] = useState(1);
    const [allowedStep, setAllowedStep] = useState(2);
    const [chosenSentenceId, setChosenSentenceId] = useState(null);
    const [highlightedPhrases, setHighlightedPhrases] = useState([]);
    const lastStep = 4;

    const [ mergedText, setMergedText ] = useState("");
    const [ feedbackText, setFeedbackText ] = useState("");    

    function setChosenSentenceIdAnResetNextSteps(currSentenceId) {
        if (currSentenceId != chosenSentenceId) {
            setChosenSentenceId(currSentenceId)

            // Reset highlighted phrases
            setHighlightedPhrases([])

            // Set merged text to the current sentence id
            const { sentence1Text, sentence2Text } = taskData;
            const startingSentenceText = currSentenceId == 1 ? sentence1Text : sentence2Text
            setMergedText(startingSentenceText)
        }
    }

    const submissionData = new SubmissionData(chosenSentenceId, highlightedPhrases, mergedText, feedbackText, taskData );

    const modalRef = useRef(null);
    const [ submitValidationModal, setSubmitValidationModal ] = useState(null);

    useEffect(() => {
        if (myModal == null) {
            var myModal = new Modal(modalRef.current)
            setSubmitValidationModal(myModal);
        }
    }, [])

    // Validation
    const isMergedTextEmpty = mergedText.trim() == "";
    const isMergedSentenceUnchanged = mergedText == sentence1Text || mergedText == sentence2Text
    const isFeedbackEmpty = feedbackText.trim() == ""
    let isSubmitDisabled = isFeedbackEmpty && (isMergedTextEmpty || isMergedSentenceUnchanged)

    function onSubmitClicked(submissionData) {
        if (isMergedTextEmpty || isMergedSentenceUnchanged) {
            submitValidationModal.toggle()
        } else {
            onSubmit(submissionData)
        }
    }

    const submitValidationModalComponent = <div className="modal fade" ref={modalRef} id="submitValidationModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="submitValidationModelLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="submitValidationModelLabel">Submit {isSubmitDisabled ? "error" : "warning"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {isMergedTextEmpty && <section>You are trying to submit an empty merged sentence, are you sure?</section>}
                {isMergedSentenceUnchanged && <section>You are trying to submit the original sentence without adding any information to it. This is possible only if the information in one sentence completely contains the information in the other sentence. Are you sure you want to submit?</section>}
                {isSubmitDisabled && <section><br/>Submit disabled. While this use case is allowed, you have to provide feedback explaining your decision.</section>}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => onSubmit(submissionData)} disabled={isSubmitDisabled}>Submit anyway</button>
            </div>
            </div>
        </div>
    </div>

    // we are highlighting the other than the chosen sentence
    const highlightedSentenceId = chosenSentenceId == 1 ? 2 : 1

    return (
        <div>
            <Instructions examples={examples}></Instructions>
            <div className="container actual-task">
                {step == "1" && <ReadSentencesStep taskData={taskData} />}
                {step == "2" && <ChooseSentenceStep taskData={taskData} setStep={setStep} setAllowedStep={setAllowedStep} chosenSentenceId={chosenSentenceId} setChosenSentenceId={setChosenSentenceIdAnResetNextSteps} />}
                {step == "3" && <HighlightPhrasesStep taskData={taskData} chosenSentenceId={chosenSentenceId} highlightedSentenceId={highlightedSentenceId} highlightedPhrases={highlightedPhrases} setHighlightedPhrases={setHighlightedPhrases} />}
                {step == "4" && <MergeSentencesStep taskData={taskData} mergedText={mergedText} setMergedText={setMergedText} highlightedPhrases={highlightedPhrases} chosenSentenceId={chosenSentenceId} feedbackText={feedbackText} setFeedbackText={setFeedbackText} />}

                <div className="row">
                    <div className="col-12">
                        <div className="btn-group steps-btn-group" role="group" aria-label="Basic radio toggle button group">
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked={step == 1 ? "true" : ""} disabled={allowedStep >= 1 ? "" : "true"} onClick={() => setStep(1)} />
                            <label className="btn btn-outline-primary" for="btnradio1">1</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked={step == 2 ? "true" : ""} disabled={allowedStep >= 2 ? "" : "true"} onClick={() => setStep(2)} />
                            <label className="btn btn-outline-primary" for="btnradio2">2</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autocomplete="off" checked={step == 3 ? "true" : ""} disabled={allowedStep >= 3 ? "" : "true"} onClick={() => setStep(3)} />
                            <label className="btn btn-outline-primary" for="btnradio3">3</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio4" autocomplete="off" checked={step == 4 ? "true" : ""} disabled={allowedStep >= 4 ? "" : "true"} onClick={() => setStep(4)} />
                            <label className="btn btn-outline-primary" for="btnradio4">4</label>                        
                        </div>       
                        {step == lastStep &&  <button type="button" className="btn btn-primary step-button submit-button" onClick={() => onSubmitClicked(submissionData)}>Submit</button>}      
                    </div>
                </div>
                {submitValidationModalComponent}
            </div>
        </div>
    );
}

export { Task };
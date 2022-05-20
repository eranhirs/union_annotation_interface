import React, { useState, useRef, useEffect } from 'react';
import { Instructions } from "./instructions.jsx";
import { examples } from "./../examples.jsx";
import { SubmissionData } from '../models.jsx';
import { ChooseSentenceStep, HighlightPhrasesStep, MergeSentencesStep, ReadSentencesStep } from './steps.jsx';
import { Modal } from 'bootstrap';
import { StepsComponent } from './steps_component.jsx';
import { InstructionsModal } from './instructions_modal.jsx';
import { questionMarkIcon, sendIcon } from './icons.jsx';
import { QuestionMarkTooltip } from './question_mark_tooltip.jsx';
import { HighlightTooltip } from './highlight_tooltip.jsx';
import { fullMatchDescription, highlightTooltip, noMatchDescription } from './texts.jsx';
import { findAllInText, phraseToWords } from '../utils.jsx';

function Task({ taskData, isOnboarding, onSubmit, onError }) {
    const { sentence1Text, sentence2Text } = taskData;
    const [step, setStep] = useState(1);
    const [allowedStep, setAllowedStep] = useState(2);
    const [chosenSentenceId, setChosenSentenceId] = useState(null);
    const [highlightedPhrases, setHighlightedPhrases] = useState([]);
    const [skipped, setSkipped] = useState(false);
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

    function onSubmitWithLog(submissionData) {
        console.log(submissionData)
        onSubmit(submissionData)
    }

    const submissionData = new SubmissionData(chosenSentenceId, highlightedPhrases, mergedText, feedbackText, taskData, skipped );

    const modalRef = useRef(null);
    const [ submitValidationModal, setSubmitValidationModal ] = useState(null);

    const skipModalRef = useRef(null);
    const [ skipValidationModal, setSkipValidationModal ] = useState(null);

    useEffect(() => {
        if (myModal == null) {
            var myModal = new Modal(modalRef.current)
            setSubmitValidationModal(myModal);
        }
        if (skipModal == null) {
            var skipModal = new Modal(skipModalRef.current)
            setSkipValidationModal(skipModal);
        }
    }, [])


    function markHighlightedPhrasesAsMerged(mergedText, highlightedPhrases) {
        /*
        To encourage the user to use all highlighted phrases, we change the color of those that were already used.
        This function identifies which word of the highlighted phrases were used.
        */

        // Copy highlighted phrases to not change it
        const highlightedPhrasesCopy = JSON.parse(JSON.stringify(highlightedPhrases));

        // Split highlighted phrases to words so we can color each word separately
        const highlightedPhrasesSplitToWords = []

        for (const highlightedPhrase of highlightedPhrasesCopy) {
            const words = phraseToWords(highlightedPhrase['phrase'])
            for (const wordWithRange of words) {
                const word = wordWithRange['word'];
                const range = wordWithRange['range'];
                const anyFound = findAllInText(word, mergedText).length > 0;

                // Create a copy not to change the original highlighted phrase
                const newHighlightedPhrase = JSON.parse(JSON.stringify(highlightedPhrase));
                newHighlightedPhrase.start = highlightedPhrase.start + range[0]
                newHighlightedPhrase.end = highlightedPhrase.start + range[1]

                newHighlightedPhrase['phrase'] = word
                if (anyFound) {
                    newHighlightedPhrase['className'] = 'full-highlight'
                    newHighlightedPhrase['tooltip'] = fullMatchDescription
                    newHighlightedPhrase['status'] = 'integrated'
                } else {
                    newHighlightedPhrase['className'] = 'yellow-highlight'
                    newHighlightedPhrase['status'] = 'not-integrated'
                }

                highlightedPhrasesSplitToWords.push(newHighlightedPhrase);
            }

        }
        
        return highlightedPhrasesSplitToWords
    }

    const highlightedPhrasesCopy = markHighlightedPhrasesAsMerged(mergedText, highlightedPhrases)

    const highlightsNotIntegrated = highlightedPhrasesCopy.filter((highlightedPhrases) => highlightedPhrases['status'] == 'not-integrated')

    // Validation
    const isMergedTextEmpty = !skipped && mergedText.trim() == "";
    const isMergedSentenceUnchanged = !skipped && (mergedText == sentence1Text || mergedText == sentence2Text)
    const isAllHighlightsIntegrated = !skipped && highlightsNotIntegrated.length > 0
    const isFeedbackEmpty = feedbackText.trim() == ""
    const isSubmitDisabled = isFeedbackEmpty && (isMergedTextEmpty || isMergedSentenceUnchanged || skipped)
    const shouldShowValidationModal = isMergedTextEmpty || isMergedSentenceUnchanged || isAllHighlightsIntegrated


    const submitValidationModalComponent = <div className="modal fade" ref={modalRef} id="submitValidationModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="submitValidationModelLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="submitValidationModelLabel">Submit {isSubmitDisabled ? "error" : "warning"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {skipped && <section>You are trying to skip creating a merged sentence.</section>}
                {isMergedTextEmpty && <section>You are trying to submit an empty merged sentence. If you believe you should skip creating a merged sentence, please use the skip checkbox instead. <br/><br/></section>}
                {isMergedSentenceUnchanged && <section>You are trying to submit the base sentence without adding any information to it from the other sentence. This is possible only if the information in the former completely contains the information in the latter. <br/><br/></section>}
                {isAllHighlightsIntegrated && <section>Some of your highlights could not be found in the merged sentence (colored {highlightTooltip}). You should remove unused highlights and avoid rephrasing if possible. <br/><br/></section>}
                {isSubmitDisabled && <section>Submit disabled. While this use case is allowed, you have to provide feedback explaining your decision.</section>}
                {!isSubmitDisabled && <section>You can submit, but please carefully read the instructions beforehand if you are uncertain about this warning.</section>}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => onSubmitWithLog(submissionData)} disabled={isSubmitDisabled}>Submit {sendIcon}</button>
            </div>
            </div>
        </div>
    </div>


    const skipValidationModalComponent = <div className="modal fade" ref={skipModalRef} id="skipValidationModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="skipValidationModelLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="skipValidationModelLabel">Submit {isSubmitDisabled ? "error" : "warning"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {isFeedbackEmpty && <section>Please add feedback to explain why are you skipping this example.</section>}
                {!isFeedbackEmpty && <section>You are about to skip this task. This is encouraged if you can't merge the two sentences and have provided proper feedback.</section>}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => onSubmitWithLog(submissionData)} disabled={isFeedbackEmpty}>Skip</button>
            </div>
            </div>
        </div>
    </div>

    function onSubmitClicked(submissionData, skip=false) {
        if (skip == false) {
            // submissionData.skipped = false;
            if (shouldShowValidationModal) {
                submitValidationModal.toggle()
            } else {
                onSubmitWithLog(submissionData)
            }
        } else {
            // submissionData.skipped = true;            
            skipValidationModal.toggle()
        }
    }

    function onInstructionsClicked() {
        instructionsModal.toggle()
    }

    

    // we are highlighting the other than the chosen sentence
    const highlightedSentenceId = chosenSentenceId == 1 ? 2 : 1

    const [ instructionsModal, setInstructionsModal ] = React.useState(null);

    return (
        <div>
            <InstructionsModal examples={examples} instructionsModal={instructionsModal} setInstructionsModal={setInstructionsModal} />
            <div className="container actual-task">
                {step == "1" && <ReadSentencesStep taskData={taskData} />}
                {step == "2" && <ChooseSentenceStep taskData={taskData} setStep={setStep} setAllowedStep={setAllowedStep} chosenSentenceId={chosenSentenceId} setChosenSentenceId={setChosenSentenceIdAnResetNextSteps} />}
                {step == "3" && <HighlightPhrasesStep taskData={taskData} chosenSentenceId={chosenSentenceId} highlightedSentenceId={highlightedSentenceId} highlightedPhrases={highlightedPhrases} setHighlightedPhrases={setHighlightedPhrases} />}
                {step == "4" && <MergeSentencesStep taskData={taskData} mergedText={mergedText} setMergedText={setMergedText} highlightedPhrases={highlightedPhrasesCopy} chosenSentenceId={chosenSentenceId} feedbackText={feedbackText} setFeedbackText={setFeedbackText} skipped={skipped} setSkipped={setSkipped} />}

                <div className="row">
                    <div className="col-4">
                        {<button type="button" className="btn btn-secondary step-button instructions-button" onClick={() => onInstructionsClicked()}>Instructions {<QuestionMarkTooltip tooltipText={"Click to see instructions and examples"}/>}</button>}
                    </div>
                    <div className="col-4">
                        <StepsComponent step={step} setStep={setStep} allowedStep={allowedStep} componentId="task" />
                    </div>
                    <div className="col-4">
                        {step == lastStep &&  <button type="button" className="btn btn-primary step-button submit-button" onClick={() => onSubmitClicked(submissionData)}>
                            <HighlightTooltip text={<span>Submit {sendIcon}</span>} tooltipText="Submit HIT" />
                        </button>}
                        {/* {step == lastStep &&  <button type="button" className="btn btn-secondary step-button submit-button" onClick={() => onSubmitClicked(submissionData, true)}>
                            <HighlightTooltip text={<span>Skip {sendIcon}</span>} tooltipText="Submit HIT, but skip the merge step if the sentences are unrelated" />
                        </button>} */}
                    </div>
                </div>
                {submitValidationModalComponent}
                {skipValidationModalComponent}
            </div>
        </div>
    );
}

export { Task };
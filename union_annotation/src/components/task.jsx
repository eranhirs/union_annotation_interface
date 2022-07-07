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
import { InstructionsButton, SkipButton, SubmitButton } from './buttons.jsx';
import { FeedbackComponent } from './feedback_component.jsx';
import { Alert } from 'react-bootstrap';

function Task({ taskData, isOnboarding, onSubmit, onError }) {
    const { sentence1Text, sentence2Text } = taskData;
    const [step, setStep] = useState(1);
    let [allowedStep, setAllowedStep] = useState(taskData['mergedSentenceText'] ? 4 : 2);
    const [chosenSentenceId, setChosenSentenceId] = useState(taskData['chosenSentenceId'] || null);
    const [highlightedPhrases, setHighlightedPhrases] = useState(taskData['highlightedPhrases'] || null);
    const [skipped, setSkipped] = useState(false);
    const lastStep = 4;

    const [ mergedText, setMergedText ] = useState(taskData['mergedSentenceText'] || "");
    const [ feedbackText, setFeedbackText ] = useState(taskData['feedbackText'] || "");
    // When retagging, original annotator is used to show who annotated
    const [ originalAnnotator, setOriginalAnnotator ] = useState(taskData['originalAnnotator']);
    const [ originalAnnotationIteration, setOriginalAnnotationIteration ] = useState(taskData['annotationIteration']);
    const [ reviewStatus, setReviewStatus ] = useState(taskData['reviewStatus']);
    const [ originalSkip, setOriginalSkip ] = useState(taskData['skipped']);

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
    const highlightsWithoutStartOrEndExist = highlightedPhrasesCopy.filter((highlightPhrases) => isNaN(highlightPhrases['start']) || isNaN(highlightPhrases['end']))
    const noHighlights = highlightedPhrasesCopy.length === 0
    const mergedSentenceUnchanged = mergedText == sentence1Text || mergedText == sentence2Text

    // Validation
    const isMergedTextEmpty = !skipped && mergedText.trim() == "";
    const isMergedSentenceUnchanged = !skipped && mergedSentenceUnchanged
    const isAllHighlightsIntegrated = !skipped && highlightsNotIntegrated.length > 0
    const isAllHighlightsWithStartAndEnd = !skipped && highlightsWithoutStartOrEndExist.length > 0
    const isSentenceChangedButNoHighlights = !skipped && noHighlights && !mergedSentenceUnchanged
    const isFeedbackEmpty = feedbackText.trim() == ""
    const isSubmitDisabled = isFeedbackEmpty && (isMergedTextEmpty || isMergedSentenceUnchanged || isSentenceChangedButNoHighlights || isAllHighlightsWithStartAndEnd || skipped)
    const shouldShowValidationModal = isMergedTextEmpty || isMergedSentenceUnchanged || isSentenceChangedButNoHighlights || isAllHighlightsIntegrated || isAllHighlightsWithStartAndEnd


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
                {isSentenceChangedButNoHighlights && <section>You made changes to the base sentence but you didn't use the highlighting tool, please go back to Step 3. <br/><br/></section>}
                {isAllHighlightsIntegrated && <section>Some of your highlights could not be found in the merged sentence (colored {highlightTooltip}). You should remove unused highlights, unless you think we couldn't find them automatically (for example, if you rephrased the highlighted word). <br/><br/></section>}
                {isAllHighlightsWithStartAndEnd && <section>Some highlights are malformed, please go to step 3, delete the highlights and make the same highlights again. <br/><br/></section>}
                {isSubmitDisabled && <section>Submit disabled. While this use case is allowed, you have to provide feedback explaining your decision.</section>}
                {!isSubmitDisabled && <section>You can submit, but please carefully read the instructions beforehand if you are uncertain about this warning.</section>}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
                <SubmitButton onSubmitWithLog={onSubmitWithLog} submissionData={submissionData} isSubmitDisabled={isSubmitDisabled} />
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
                {isFeedbackEmpty && <section>
                    Please explain in details why this example should be skipped.
                </section>}
                {!isFeedbackEmpty && <section>You are about to skip this example.</section>}
                <div className="row"><FeedbackComponent skipped={true} feedbackText={feedbackText} setFeedbackText={setFeedbackText} />                    </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
                <SkipButton onSubmitWithLog={onSubmitWithLog} submissionData={submissionData} isSkipDisabled={isFeedbackEmpty}/>
            </div>
            </div>
        </div>
    </div>

    function onSubmitClicked(submissionData, skip=false) {
        if (skip == false) {
            submissionData.skipped = false;  // Update because submission is already initialized
            setSkipped(false);  // Update in case submission changes (e.g., feedback added)
            if (shouldShowValidationModal) {
                submitValidationModal.toggle()
            } else {
                onSubmitWithLog(submissionData)
            }
        } else {
            submissionData.skipped = true;  // Update because submission is already initialized
            setSkipped(true);  // Update in case submission changes (e.g., feedback added)
            skipValidationModal.toggle()
        }
    }

    function onInstructionsClicked() {
        instructionsModal.toggle()
    }

    if (allowedStep == 4 && isAllHighlightsWithStartAndEnd) {
        allowedStep = 3
    }
    

    // we are highlighting the other than the chosen sentence
    const highlightedSentenceId = chosenSentenceId == 1 ? 2 : 1

    const [ instructionsModal, setInstructionsModal ] = React.useState(null);
    const [ showReadInstructions, setShowReadInstructions ] = useState(true);

    return (
        <div>
            <InstructionsModal examples={examples} instructionsModal={instructionsModal} setInstructionsModal={setInstructionsModal} />
            <div className="container actual-task">
                {step == "1" && <ReadSentencesStep taskData={taskData} showReadInstructions={showReadInstructions} setShowReadInstructions={setShowReadInstructions} onInstructionsClicked={onInstructionsClicked} />}
                {step == "2" && <ChooseSentenceStep taskData={taskData} setStep={setStep} setAllowedStep={setAllowedStep} chosenSentenceId={chosenSentenceId} setChosenSentenceId={setChosenSentenceIdAnResetNextSteps} />}
                {step == "3" && <HighlightPhrasesStep taskData={taskData} chosenSentenceId={chosenSentenceId} highlightedSentenceId={highlightedSentenceId} highlightedPhrases={highlightedPhrases} setHighlightedPhrases={setHighlightedPhrases}  showReadInstructions={showReadInstructions} setShowReadInstructions={setShowReadInstructions}  />}
                {step == "3" && isAllHighlightsWithStartAndEnd && <Alert variant="danger">Please delete and recreate the highlights.</Alert>}
                {step == "4" && <MergeSentencesStep taskData={taskData} mergedText={mergedText} setMergedText={setMergedText} highlightedPhrases={highlightedPhrasesCopy} chosenSentenceId={chosenSentenceId} feedbackText={feedbackText} setFeedbackText={setFeedbackText} skipped={skipped} setSkipped={setSkipped}  showReadInstructions={showReadInstructions} setShowReadInstructions={setShowReadInstructions}  />}

                <div className="row">
                    <div className="col-4">
                        <InstructionsButton onInstructionsClicked={onInstructionsClicked} classNames="step-button" showQuestionMark={true} />
                    </div>
                    <div className="col-4">
                        <StepsComponent step={step} setStep={setStep} allowedStep={allowedStep} componentId="task" />
                    </div>
                    <div className="col-4">
                        <SubmitButton onSubmitWithLog={onSubmitClicked} submissionData={submissionData} isSubmitDisabled={step != lastStep} classNames="step-button" />
                        <SkipButton onSubmitWithLog={onSubmitClicked} submissionData={submissionData} isSkipDisabled={false} classNames="step-button" />
                        {/* {step == lastStep &&  <button type="button" className="btn btn-secondary step-button submit-button" onClick={() => onSubmitClicked(submissionData, true)}>
                            <HighlightTooltip text={<span>Skip {sendIcon}</span>} tooltipText="Submit HIT, but skip the merge step if the sentences are unrelated" />
                        </button>} */}
                    </div>
                </div>
                {submitValidationModalComponent}
                {skipValidationModalComponent}
                <div className="row">
                    <div className="annotated-by-text">{originalAnnotator ? `Previously annotated by: ${originalAnnotator}` : ""}</div>
                    <div className="annotated-by-text">{originalAnnotationIteration ? `Annotation iteration: ${originalAnnotationIteration}` : ""}</div>
                    <div className="annotated-by-text">{reviewStatus ? `Review status: ${reviewStatus}` : ""}</div>
                    <div className="annotated-by-text">{originalSkip != undefined ? `Was previously skipped: ${originalSkip}` : ""}</div>

                </div>

            </div>
        </div>
    );
}

export { Task };
import { HighlightTooltip } from "./highlight_tooltip";
import { QuestionMarkTooltip } from "./question_mark_tooltip";
import { skipButtonTooltip } from "./texts";

const React = require("react");
const { sendIcon } = require("./icons");

function SubmitButton({onSubmitWithLog, submissionData, isSubmitDisabled, classNames=""}) {
    let tooltipText = "Submit HIT"
    if (isSubmitDisabled) {
        tooltipText = "You need to reach the last step before you can submit"
    }

    const submitDisabledClassName = isSubmitDisabled ? "submit-disabled" : ""

    return <button type="button" className={`btn btn-primary submit-button ${submitDisabledClassName} ${classNames}`} data-bs-dismiss="modal" onClick={() => onSubmitWithLog(submissionData)} disabled={isSubmitDisabled}>
        <HighlightTooltip text={<span className="tooltip-available">Submit {sendIcon}</span>} tooltipText={tooltipText} />
    </button>
}

function SkipButton({onSubmitWithLog, submissionData, isSkipDisabled, classNames=""}) {

    return <button type="button" className={`btn btn-primary submit-button ${classNames}`} data-bs-dismiss="modal" onClick={() => onSubmitWithLog(submissionData, true)} disabled={isSkipDisabled}>
        <HighlightTooltip text={<span>Skip {sendIcon}</span>} tooltipText={skipButtonTooltip} />
    </button>
}

function InstructionsButton({ onInstructionsClicked, classNames="", showQuestionMark=false }) {
    return <button type="button" className={`btn btn-secondary instructions-button ${classNames}`} onClick={() => onInstructionsClicked()}>Instructions {showQuestionMark && <QuestionMarkTooltip tooltipText={"Click to see instructions and examples"}/>}</button>
}


export { SubmitButton, SkipButton, InstructionsButton };
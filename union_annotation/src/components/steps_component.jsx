import * as React from "react";
import { HighlightTooltip } from "./highlight_tooltip";

function StepsComponent({step, setStep, allowedStep, componentId, isExample=false, onStepClickedCallback=null}) {

    function onStepClicked(stepId) {
        setStep(stepId);

        if (onStepClickedCallback != null) {
            onStepClickedCallback()
        }
    }

    function createStepCheckbox(stepId) {
        const isDisabled = allowedStep < stepId;
        return <input type="radio" className="btn-check" name={`${componentId}-btnradio`} id={`${componentId}-btnradio${stepId}`} autocomplete="off" checked={step == stepId ? "true" : ""} disabled={isDisabled ? "true" : ""} onClick={() => onStepClicked(stepId)} />
    }

    function createStep(stepId) {
        const isDisabled = allowedStep < stepId;

        let tooltipText = `This button is disabled because you haven't completed the previous steps`
        if (isExample) {
            tooltipText = `This button is disabled because in this example you should skip`
        }
        const stepText = `${stepId}`
        
        let stepLabel = stepText
        if (isDisabled) {
            stepLabel = <HighlightTooltip text={stepText} tooltipText={tooltipText} />
        }
        return <label className="btn btn-outline-primary step-label" for={`${componentId}-btnradio${stepId}`}>{stepLabel}</label>
    }


    return <div className={`btn-group steps-btn-group`} role="group" aria-label="Switch steps">
        {createStepCheckbox(1)}
        {createStep(1)}

        {createStepCheckbox(2)}
        {createStep(2)}

        {createStepCheckbox(3)}
        {createStep(3)}

        {createStepCheckbox(4)}
        {createStep(4)}
    </div>
}

export { StepsComponent };
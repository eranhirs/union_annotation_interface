import React, { useState } from 'react';
import { readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction } from './texts.jsx';
import { ChooseSentenceStep, HighlightPhrasesStep, MergeSentencesStep, ReadSentencesStep } from './steps.jsx';
import { StepsComponent } from './steps_component.jsx';
import { HighlightTooltip } from './highlight_tooltip.jsx';

function ListGroupItem({ currStep, step, itemId, onClick }) {
    const activeClass = currStep == step ? "active " : ""

    return (
        <a className={`list-group-item list-group-item-action ${activeClass}`} id={`list-step-${itemId}-list`} data-bs-toggle="list" href={`#list-step-${itemId}`} role="tab" aria-controls="list-step-{itemId}" onClick={() => onClick(step)}>Step {step}</a>
    )
}

function ListItem({ currStep, step, itemId, children }) {
    const activeClass = currStep == step ? "show active " : ""

    return (
        <div className={`tab-pane fade ${activeClass}`} id={`list-step-${itemId}`} role="tabpanel" aria-labelledby={`list-step-${itemId}-list`}>{children}</div>
    )
}

function Example({ exampleId, exampleData }) {
    const [step, setStep] = useState(1);
    const lastStep = 4;    
    const { mergedSentenceText, step2Extra, step3Extra, step4Extra } = exampleData;

    const questionMarkIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
    </svg>      

    const quesitonMarkWithTooltip = <HighlightTooltip text={<small className="text-muted">{questionMarkIcon}</small>} tooltipText={"Click on the numbers to see all the subsequent steps."}></HighlightTooltip>

    return (
        <section className="example">
            {step == 1 && <p className="fs-5">These are the steps you should take to create the merged sentence: {quesitonMarkWithTooltip}</p>}
            {/* <div className="row">
                <div className="col-12 fs-5">
                    <div className="tab-content" id="nav-tabContent">
                        <ListItem currStep={step} step={"1"} itemId={`${exampleId}_1`}>
                            {readSentencesStepInstruction}
                        </ListItem>
                        <ListItem currStep={step} step={"2"} itemId={`${exampleId}_2`}>
                            {chooseSentenceStepInstruction}
                        </ListItem>
                        <ListItem currStep={step} step={"3"} itemId={`${exampleId}_3`}>
                            {highlightPhrasesStepInstruction}
                        </ListItem>
                        {step4Extra != null && <ListItem currStep={step} step={"4"} itemId={`${exampleId}_4`}>
                            {mergeSentencesStepInstruction}
                        </ListItem>}
                    </div>
                </div>
            </div> */}
            {step == 1 && <ReadSentencesStep taskData={exampleData} isExample={true} />}
            {step == 2 && <ChooseSentenceStep taskData={exampleData} setStep={() => {}} setAllowedStep={() => {}} chosenSentenceId={exampleData.chosenSentenceId} setChosenSentenceId={() => {}} isExample={true} />}
            {step == 3 && <HighlightPhrasesStep taskData={exampleData} chosenSentenceId={exampleData.chosenSentenceId} highlightedSentenceId={exampleData.highlightedSentenceId} highlightedPhrases={exampleData.highlightedPhrases} setHighlightedPhrases={() => {}} isExample={true} />}
            {step == 4 && <MergeSentencesStep taskData={exampleData} mergedText={mergedSentenceText} setMergedText={() => {}} highlightedPhrases={exampleData.highlightedPhrases} mergedHighlightedPhrases={exampleData.mergedHighlightedPhrases} chosenSentenceId={exampleData.chosenSentenceId} feedbackText={null} setFeedbackText={() => {}} isExample={true} />}

            {step == 2 && <div className="step-extra fs-5">{step2Extra}</div>}
            {step == 3 && <div className="step-extra fs-5">{step3Extra}</div>}
            {step == 4 && <div className="step-extra fs-5">{step4Extra}</div>}            
            <StepsComponent step={step} setStep={setStep} allowedStep={lastStep} componentId={exampleId} />
        </section>
    );
}

export { Example };

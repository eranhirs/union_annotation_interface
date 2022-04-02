import React, { useState } from 'react';
import { readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction } from './texts.jsx';
import { ChooseSentenceStep, HighlightPhrasesStep, MergeSentencesStep, ReadSentencesStep } from './steps.jsx';

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
    const [step, setStep] = useState("1");
    const { mergedSentenceText, step2Extra, step3Extra, step4Extra } = exampleData;

    return (
        <section className="example">
            <p>These are the steps you should take to create the merged sentence:</p>
            <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                        <ListGroupItem currStep={step} step={"1"} itemId={`${exampleId}_1`} onClick={setStep} />
                        <ListGroupItem currStep={step} step={"2"} itemId={`${exampleId}_2`} onClick={setStep} />
                        <ListGroupItem currStep={step} step={"3"} itemId={`${exampleId}_3`} onClick={setStep} />
                        {step4Extra != null && <ListGroupItem currStep={step} step={"4"} itemId={`${exampleId}_4`} onClick={setStep} />}
                    </div>
                </div>
                <div className="col-8">
                    <div className="tab-content" id="nav-tabContent">
                        <ListItem currStep={step} step={"1"} itemId={`${exampleId}_1`}>
                            {readSentencesStepInstruction}
                        </ListItem>
                        <ListItem currStep={step} step={"2"} itemId={`${exampleId}_2`}>
                            {chooseSentenceStepInstruction}
                            <br /><br />{step2Extra}
                        </ListItem>
                        <ListItem currStep={step} step={"3"} itemId={`${exampleId}_3`}>
                            {highlightPhrasesStepInstruction}
                            <br /><br />{step3Extra}
                        </ListItem>
                        {step4Extra != null && <ListItem currStep={step} step={"4"} itemId={`${exampleId}_4`}>
                            {mergeSentencesStepInstruction}

                            <br /><br />{step4Extra}
                        </ListItem>}
                    </div>
                </div>
            </div>
            {step == "1" && <ReadSentencesStep taskData={exampleData} isExample={true} />}
            {step == "2" && <ChooseSentenceStep taskData={exampleData} setStep={() => {}} setAllowedStep={() => {}} chosenSentenceId={exampleData.chosenSentenceId} setChosenSentenceId={() => {}} isExample={true} />}
            {step == "3" && <HighlightPhrasesStep taskData={exampleData} chosenSentenceId={exampleData.chosenSentenceId} highlightedSentenceId={exampleData.highlightedSentenceId} highlightedPhrases={exampleData.highlightedPhrases} setHighlightedPhrases={() => {}} isExample={true} />}
            {step == "4" && <MergeSentencesStep taskData={exampleData} mergedText={mergedSentenceText} setMergedText={() => {}} highlightedPhrases={exampleData.highlightedPhrases} chosenSentenceId={exampleData.chosenSentenceId} feedbackText={null} setFeedbackText={() => {}} isExample={true} />}
        </section>
    );
}

export { Example };

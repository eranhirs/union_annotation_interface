import React, { useState } from 'react';
import { Directions } from "./core_components.jsx";
import { Example } from './example.jsx';
import { contradictingInformationDescription, elaboratedDescription, entailingInformationDescription, fullHighlightTooltip, fullMatchDescription, highlightTooltip, newInformationDescription, partialHighlightTooltip, shortDescription } from './texts.jsx';


function ExamplesAccordion({ examples, accordionId }) {
  return (
    <div className="accordion" id={`accordionFlushExample${accordionId}`}>
      {
        examples.map(function (object, i) {
          const uniqueExampleId = `${accordionId}-${i}`

          return <div className="accordion-item">
            <h2 className="accordion-header" id={`flushHeading${uniqueExampleId}`}>
              <button className="accordion-button collapsed fs-5" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse-${uniqueExampleId}`} aria-expanded="false" aria-controls={`flush-collapse-${uniqueExampleId}`}>
                Click here to view {object['exampleTitle'].toLowerCase()}
              </button>
            </h2>
            <div id={`flush-collapse-${uniqueExampleId}`} className="accordion-collapse collapse" aria-labelledby={`flushHeading${uniqueExampleId}`} data-bs-parent={`#accordionFlushExample${accordionId}`}>
              <div className="accordion-body">
                <Example exampleId={String(i)} exampleData={object} />
              </div>
            </div>
          </div>
        })
      }
    </div>
  )
}

function Instructions({ examples }) {

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Directions title="Introduction">
                {shortDescription}
              </Directions>
            </div>

            <div className="col-12">
              <ExamplesAccordion examples={[examples[0]]} accordionId={1} />
            </div>
            <div className='col-12'>
              <Directions title="Elaborated instructions">
              <h4>Step 3 (Highlight step)</h4>
              <dl className="row instructions-list">
              
              <dt className="col-sm-2">Highlight only new or more specific information</dt>
              <dd className="col-sm-10">Do not highlight information already mentioned in the previous sentence, unless it is more specific. Since natural language makes it is easier to identify such subtle issues, it makes sense to create the merged sentence and then go back and check if you actually used everything that is highlighted (ideally, all highlights should turn their color from {highlightTooltip} to {fullHighlightTooltip}).</dd>

              </dl>

              <h4>Step 4 (Merge step)</h4>
            When writing the merged sentence, order the information in the sentence in a coherent stand-alone manner (as if the sentence would have been written from scratch). Avoid being distracted by the original split and ordering of information in the two original sentences.
            If needed, you may <span className="fw-bold">minimally</span> adjust the phrasing of the sentence to create a coherent merged sentence. Highlights will change colors ({highlightTooltip}, {partialHighlightTooltip} or {fullHighlightTooltip}) to help you merge all of the information.
<br/>
            <dl className="row instructions-list">
              
                    <dt className="col-sm-2">Write one sentence</dt>
                    <dd className="col-sm-10">The merged text should consist of a single sentence, and you should order the information in a coherent stand-alone manner as if the sentence would have been written from scratch.</dd>

                    <dt className="col-sm-2">Avoid repetition</dt>
                    <dd className="col-sm-10">
Each piece of information should appear only once in the merged sentence.
<br/>Choose the more specific phrasing when there is a repetition.</dd>

                    <dt className="col-sm-2">Avoid paraphrasing</dt>
                    <dd className="col-sm-10">To the extent possible, the merged sentence should preserve the original wording of the information.</dd>
                    
                    <dt className="col-sm-2">Skip if necessary</dt>
                    <dd className="col-sm-10">Please use the Skip button if you cannot merge, for example, if one sentence disagrees with another, or if they refer to completely unrelated events.</dd>
                </dl>


              </Directions>
            </div>
          </div>

          {/* <div className="col-12">
            <Directions title="">
              {elaboratedDescription}
              </Directions>              
          </div> */}


        </div>
      </section>
    </div>
  );
}

export { Instructions };

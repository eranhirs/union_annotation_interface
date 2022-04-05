import React, { useState } from 'react';
import { Directions } from "./core_components.jsx";
import { Example } from './example.jsx';
import { contradictingInformationDescription, elaboratedDescription, entailingInformationDescription, newInformationDescription, shortDescription } from './texts.jsx';


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
              <Directions title="Instructions">
                {shortDescription}
              </Directions>
            </div>

            <div className="col-12">
              <ExamplesAccordion examples={[examples[0], examples[1]]} accordionId={1} />
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

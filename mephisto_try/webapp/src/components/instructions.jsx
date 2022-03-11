import React, { useState } from 'react';
import { Directions } from "./core_components.jsx";
import { Example } from './example.jsx';

function Instructions({ examples }) {  
  
    return (
      <div>
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <Directions title="Instructions">
                  In this task you will merge the information of two sentences into one sentence. <br />
                  More specifically, all of the information conveyed in each sentence should appear in the merged sentence.
                </Directions>
              </div>
            </div>
            
            <div className="row">
                <div className="col-12">
                    <div className="accordion" id="accordionFlushExample">
                        {
                            examples.map(function(object, i) {
                                return <div className="accordion-item">
                                    <h2 className="accordion-header" id={`flush-heading${i}`}>
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${i}`} aria-expanded="false" aria-controls={`flush-collapse${i}`}>
                                            {object['exampleTitle']}
                                        </button>
                                    </h2>
                                    <div id={`flush-collapse${i}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${i}`} data-bs-parent="#accordionFlushExample">
                                        <div className="accordion-body">
                                            <Example exampleId={String(i)} exampleData={object} />
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
export { Instructions };
import React, { useState } from 'react';

const readSentencesStepInstruction = "Read both sentences below.";
const chooseSentenceStepInstruction = "Choose one of two sentences you would like to start with. Ideally, choose the one that is more detailed than the other.";
const highlightPhrasesStepInstruction = "Highlight the information you would like to integrate (either because the information is missing or has better phrasing).";
const mergeSentencesStepInstruction = "Add the spans you highlighted from the previous sentence into the new sentence and submit.";

export { readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction };

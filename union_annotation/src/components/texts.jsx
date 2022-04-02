import React, { useState } from 'react';

/* Initial instructions */
const shortDescription = "In this task, you will merge the information from two sentences into one sentence. More specifically, all of the information conveyed in each sentence should appear in the merged sentence.";
const elaboratedDescription = " In the merge process, you should highlight differences between the sentences.";

/* Steps instructions */
const readSentencesStepInstruction = "Read and make sure you understand both sentences below.";
const chooseSentenceStepInstruction = "Choose one of the two sentences you would like to start with. Ideally, choose the one that is more detailed than the other.";
const highlightPhrasesStepInstruction = "Highlight the information you would like to integrate. You should integrate all information that is missing from the other sentence, or has more specific phrasing.";
const mergeSentencesStepInstruction = "Add the spans you highlighted from the previous sentence into the new sentence and submit.";

/* Highlights descriptions */
const newInformationDescription = "Information conveyed in one sentence and not in the other sentence (adds to text).";
const entailingInformationDescription = "Information conveyed in one sentence and is more specific than the other sentence (replaces previous text).";
const contradictingInformationDescription = "Information conveyed in one sentence and contradicts the information conveyed in the other sentence.";

export { shortDescription, elaboratedDescription, readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction, newInformationDescription, entailingInformationDescription, contradictingInformationDescription };

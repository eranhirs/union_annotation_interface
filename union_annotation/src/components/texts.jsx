import React, { useState } from 'react';

/* Initial instructions */
const shortDescription = "In this task, you will be presented with two sentences that overlap in information. You are tasked to highlight the differences between the two sentences and then merge them into one sentence. More specifically, all of the information conveyed in each sentence should be contained in the merged sentence without redundancies.";
const elaboratedDescription = " In the merge process, you should highlight differences between the sentences.";

/* Steps instructions */
const readSentencesStepInstruction = "Read and make sure you understand both sentences below.";
const chooseSentenceStepInstruction = "Choose one of the two sentences you would like to start with. You will be using this sentence as an anchor for the merged sentence, meaning that you will add or replace information from the other sentence on top of this one. Ideally, choose the one that is more detailed than the other.";
const highlightPhrasesStepInstruction = "Highlight the information you would like to integrate. You should integrate all information that is missing from the sentence you chose previously, or has more specific phrasing.";
const mergeSentencesStepInstruction = "Add the spans you highlighted from the previous sentence into the new sentence and submit.";

/* Highlights descriptions */
const newInformationDescription = "Information conveyed in one sentence and not in the other sentence (adds to text).";
const entailingInformationDescription = "Information conveyed in one sentence and is more specific than the other sentence (replaces previous text).";
const contradictingInformationDescription = "Information conveyed in one sentence and contradicts the information conveyed in the other sentence.";

/* Tooltips */
const fullMatchDescription = "The color changes to green when you integrate all of the phrase into the merged sentence"
const partialMatchDescription = "The color changes to blue when you integrate some of the phrase into the merged sentence"


export { shortDescription, elaboratedDescription, readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction, newInformationDescription, entailingInformationDescription, contradictingInformationDescription, fullMatchDescription, partialMatchDescription };

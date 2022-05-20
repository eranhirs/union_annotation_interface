import React, { useState } from 'react';
import { HighlightTooltip } from './highlight_tooltip';

/* Initial instructions */
const shortDescription = "In this task, you will be presented with two sentences that overlap in information, and you are tasked to merge the information of the two into a single sentence. More specifically, all of the information conveyed in each sentence should be contained in the merged sentence without redundancies. During this process, you first choose one sentence as a starting point and then highlight information that is new or has more specific wording in the other sentence. Lastly, using the chosen base sentence, add the highlighted information to create the merged sentence.";

const elaboratedDescription = " In the merge process, you should highlight differences between the sentences.";

/* Tooltips */
const noMatchDescription = "Yellow indicates you highlighted a phrase, but it is not contained by the merged sentence"
const partialMatchDescription = "Blue indicates only some of the phrase you highlighted is contained by the merged sentence"
const fullMatchDescription = "Green indicates all of the phrase you highlighted is contained by the merged sentence"
const repetitionWarningDescription = "This word is highlighted to emphasize that it exists in both sentences, such repetition should only be used if necessary"

/* Steps instructions */
const readSentencesStepInstruction = "Read and make sure you understand both sentences below.";
const chooseSentenceStepInstruction = "From the two sentences, choose the base sentence you would like to start with. You will be using this sentence as a basis for the merged sentence, meaning that you will add or replace information from the other sentence on top of this one. Ideally, choose the one that is more detailed than the other.";
const highlightPhrasesStepInstruction = "In the other sentence, highlight the information you would like to integrate. You should integrate all information that is missing from the sentence you chose previously, or replace overlapping information with more specific phrasing from the other sentence.";

const highlightTooltip = <span className="highlight"><HighlightTooltip text="yellow" tooltipText={noMatchDescription} /></span>
const partialHighlightTooltip = <span className="highlight partial-highlight"><HighlightTooltip text="blue" tooltipText={partialMatchDescription} /></span>
const fullHighlightTooltip =  <span className="highlight full-highlight"><HighlightTooltip text="green" tooltipText={fullMatchDescription} /></span>
const mergeSentencesStepInstruction = <span>Add the spans you highlighted from the previous sentence into the base sentence to create the new union sentence. If needed, you may <span className="fw-bold">minimally</span> adjust the phrasing of the sentence to create a coherent merged sentence. Highlights will change colors ({highlightTooltip}, {partialHighlightTooltip} or {fullHighlightTooltip}) to help you merge all of the information, hover over them to get an explanation of each color.</span>;

/* Highlights descriptions */
const newInformationDescription = "Information conveyed in one sentence and not in the other sentence (adds to text).";
const entailingInformationDescription = "Information conveyed in one sentence and is more specific than the other sentence (replaces previous text).";
const contradictingInformationDescription = "Information conveyed in one sentence and contradicts the information conveyed in the other sentence.";



export { shortDescription, elaboratedDescription, readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction, newInformationDescription, entailingInformationDescription, contradictingInformationDescription, fullMatchDescription, noMatchDescription, partialMatchDescription, repetitionWarningDescription};

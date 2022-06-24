import React, { useState } from 'react';
import { fullHighlightTooltip, fullMatchDescription, highlightTooltip, noMatchDescription, partialMatchDescription } from './components/texts.jsx';
import { ExampleData } from './models.jsx';

// Example 1
const example1Step3Extra = <section>
    Highlights explanation:
    <br/> a. The information that <span className="data-citation">Robbers crash 4x4 into store</span> is new information and should be highlighted.
    <br/> b. The information that <span className="data-citation">Robbers</span> were <span className="data-citation">grabbing jewelry and watches , before setting car ablaze</span>, conveys the same information included in sentence 1, and should <span className="fw-bold">not</span> be highlighted.
    <br/><br/>
    We should notice a few things:
    <br/>a. You might think that <span className="data-citation">Robbers</span> and <span className="data-citation">store</span> were already mentioned in Sentence 1 and hence are not new. However, we are highlighting pieces of information and not words: the information that the <span className="data-citation">Robbers</span> were those that crashed is new, and the fact that the crash was <span className="data-citation">into store</span> is new, so they are part of the highlight.
    Hypothetically, if both sentences mentioned a <span className="data-citation">big store</span> instead of simply mentioning a <span className="data-citation">store</span>, we would not highlight the word <span className="data-citation">big</span>, because this is not part of the new crash information.
    <br/>b. The word <span className="data-citation">store</span> is also highlighted in sentence 1 to help you notice that this word is not new. However, the word <span className="data-citation">thieves</span> was not highlighted in sentence 1, because we are using exact match and we don't catch everything.
</section>


const example1 = new ExampleData(
    "1",
    "example",
    "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
    "Robbers crash 4x4 into store , grabbing jewelry and watches , before setting car ablaze.",
    1,
    2,
    [
        { "phrase": "Robbers crash 4x4 into store", "start": 0, "end": 28 }
    ],
    [
        { "phrase": "Robbers", "start": 0, "end": 7, "tooltip": noMatchDescription },
        { "phrase": "crash", "start": 8, "end": 13, "tooltip": noMatchDescription },
        { "phrase": "4x4", "start": 14, "end": 17, "className": "full-highlight", "tooltip": fullMatchDescription },
        { "phrase": "into", "start": 18, "end": 22, "className": "full-highlight", "tooltip": fullMatchDescription },
        { "phrase": "store", "start": 23, "end": 28, "className": "full-highlight", "tooltip": fullMatchDescription }
    ],
    [
        // { "phrase": "crashing", "start": 6, "end": 14, "tooltip": noMatchDescription },
        // { "phrase": "4x4", "start": 15, "end": 18, "className": "full-highlight", "tooltip": fullMatchDescription },
        // { "phrase": "into", "start": 19, "end": 23, "className": "full-highlight", "tooltip": fullMatchDescription },
        // { "phrase": "store", "start": 24, "end": 29, "className": "full-highlight", "tooltip": fullMatchDescription }
        // { "phrase": "crashing 4x4 into store", "start": 6, "end": 29, "className": "full-highlight", "tooltip": fullMatchDescription }
    ],
    "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
    null,    
    "In this example, we chose Sentence 1.",
    example1Step3Extra,
    <span>In this example, we attached <span className="data-citation">crashing 4x4 into store</span> into the description of the thieves actions.<br/><br/>
    We should notice a few things:
    <br/> a. The words that were copied as-is are now {fullHighlightTooltip}.
    <br/> b. The word <span className="data-citation">crash</span> was rephrased to <span className="data-citation">crashing</span>, which is why it is still {highlightTooltip}. You should rephrase only if necessary to make the sentence grammatical or fluent.
    <br/> c. The word <span className="data-citation">Robbers</span> was not used, because it doesn't provide new information over <span className="data-citation">thieves</span>.
    <br/><br/>The system will raise a warning if it sees {highlightTooltip} highlights, but it is safe to ignore under the circumstances above.
    </span>,
    4,
    false,
    "Some feedback text",
    "eran",
    "master_set_1",
    "example"
);

// Example 2

const example2Step3Extra = <section> In this example:
    <dl className="row">
        <dt className="col-sm-4">* <span className="data-citation">H-P announced that it will buy</span></dt>
        <dd className="col-sm-8">Conveys the same information as sentence 1, do <span className="fw-bold">not</span> highlight.</dd>

        <dt className="col-sm-4">* <span className="data-citation">the outsourcing services company</span></dt>
        <dd className="col-sm-8">This is new information, you should highlight it.</dd>


        <dt className="col-sm-4">* <span className="data-citation">for $ 13.9 billion</span></dt>
        <dd className="col-sm-8">This is more specific than <span className="data-citation">nearly $14 billion</span>, so you should highlight it and replace it in the text.</dd>
    </dl>
</section>


const example2 = new ExampleData(
    "2",
    "example",
    "H-P announced that it will buy the outsourcing services company for $ 13.9 billion .",
    "Earlier this month Hewlett-Packard unveiled a bid of nearly $ 14 billion to purchase EDS .",
    2,
    1,
    [
        { "phrase": "the outsourcing services company", "start": 31, "end": 63, "sentenceId": 1 },
        { "phrase": "for $ 13.9 billion", "start": 64, "end": 82, "sentenceId": 1 }
    ],
    [
        { "phrase": "the outsourcing services company", "start": 31, "end": 63, "sentenceId": 1 },
        { "phrase": "for $ 13.9 billion", "start": 64, "end": 82, "sentenceId": 1 }
    ],
    [
        { "phrase": "the outsourcing services company", "start": 86, "end": 118, "className": "full-highlight", "tooltip": fullMatchDescription },
        { "phrase": "of $ 13.9 billion", "start": 50, "end": 67, "className": "full-highlight", "tooltip": fullMatchDescription }
    ],
    "Earlier this month Hewlett-Packard unveiled a bid of $ 13.9 billion to purchase EDS , the outsourcing services company .",
    null,    
    "In this example, we chose Sentence 2.",
    example2Step3Extra,
    'In this example, we replace "nearly $ 14 billion" with "$ 13.9 billion". Also, we add "the outsourcing services company".',
    null,
    null,
    null,
    null,
    null,

);

// Example 3

const example3Step3Extra = <section> In this example:
    <dl className="row">
        <dt className="col-sm-3">* <span className="data-citation">of 13</span></dt>
        <dd className="col-sm-9">This phrase contradicts with the <span className="data-citation">of 12</span> phrase in the other sentence. Such contradicting examples will automatically end the task, so there is no need to continue further.</dd>
    </dl>
</section>


const example3 = new ExampleData(
    "3",
    "a contradiction example",
    "Video of Brooklyn Mother of 13 Zurana Horton shot and killed in a gang shooting was revealed Thursday .",
    "A shocking video released for the first time Thursday captures the moment a Brooklyn mother of 12 was killed in a gang shootout as she picked her daughter up from school .",
    2,
    1,
    [
        { "phrase": "of 13", "start": 25, "end": 30, "sentenceId": 1 }
    ],
    [
        { "phrase": "of 13", "start": 25, "end": 30, "sentenceId": 1 }
    ],
    null,
    null,
    "In this example, we chose Sentence 2.",
    example3Step3Extra,
    null
);

// Example 4

const example4 = new ExampleData(
    "4",
    "example",
    "Libby was indicted in October on five counts of perjury, making false statements and obstruction of justice in the course of Special Counsel Patrick Fitzgerald's investigation into the leak of Plame's identity to the media.",
    "The newspaper reported that Woodward told prosecutor Patrick Fitzgerald, who is investigating the leak of Plame's identity, that the official talked to him about Plame in mid-June 2003.",
    null,
    null,
    null,
    null,
    null,
    null,
    "In this example, both sentences refer to \"Patrick Fitzgerald\" and the \"leak of Plame's identity\", but the first talks about Libby's indiciment and the second talks about Woodward. It is impossible to create a coherent and comprehensible union, which means you should use the skip button.",
    null,
    null,
    null,
    1
);

// Example 5

const example5 = new ExampleData(
    "5",
    "example",
    "T - Mobile continues to add to its growing line - up of 4G LTE devices by partnering with BlackBerry to bring customers the BlackBerry Q10 .",
    "T - Mobile today announced that the BlackBerry Q10 will be added to its growing 4G LTE smartphone portfolio .",
    1,
    2,
    [
        {
            "phrase": "T - mobile today announced", "start": 0, "end": 26
        }
    ],
    [
        {
            "phrase": "T", "start": 0, "end": 1, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "-", "start": 2, "end": 3, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "Mobile", "start": 4, "end": 10, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "today", "start": 11, "end": 16, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "announced", "start": 17, "end": 27, "className": "full-highlight", "tooltip": fullMatchDescription
        }
    ],
    [],
    "T - Mobile today announced that it continues to add to its growing line - up of 4G LTE devices by partnering with BlackBerry to bring customers the BlackBerry Q10 .",
    null,
    "In this example, we chose Sentence 1.",
    <span>
        We should notice a few things:
        <br/>a. At first glance, it seems we should highlight <span className="data-citation">4G LTE smartphone portfolio</span>, because it is more specific than <span className="data-citation">4G LTE devices</span>. However, Sentence 1 later mentions BlackBerry which is more specific than smartphone, so the phrase <span className="data-citation">4G LTE smartphone portfolio</span> doesn't actually add new information to the base sentence and highlighting it would be a mistake.
        <br/>b. <span className="data-citation">T - mobile</span> is also highlighted, even though it is already mentioned in Sentence 1. Highlighting only <span className="data-citation">today announced</span> would be a mistake, because the fact that T-mobile announced is new (we are highlighting information, not words).
        <br/>c. <span className="data-citation">that the blackberry Q10 ...</span> is not highlighted. It is not new, and it is a separated clause from the announcement, so it should <b>not</b> be highlighted.
    </span>,
    null,
    4
);

// Example 6

const example6 = new ExampleData(
    "6",
    "example",
    "A savvy band of jewel thieves , armed with guns and some posing as women , have struck in the heart of the city 's golden triangle of luxury shops , stealing more than e85 million worth of diamonds , rings and watches from a posh Harry Winston boutique .",
    "Three or four robbers burst into the store on ritzy Avenue Montaigne near the Champs-Elysees late Thursday afternoon and stole watches , rings and necklaces .",
    1,
    2,
    [
        {
            "phrase": "Three or four robbers", "start": 0, "end": 21
        },
        {
            "phrase": "on ritzy Avenue Montaigne near the Champs-Elysees late Thursday afternoon", "start": 43, "end": 106
        },
        {
            "phrase": "necklaces", "start": 147, "end": 156
        }
    ],
    [
        {
            "phrase": "Three", "start": 0, "end": 5, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "or", "start": 6, "end": 8, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "four", "start": 9, "end": 13, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "robbers", "start": 14, "end": 21, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "on", "start": 43, "end": 45, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "ritzy", "start": 46, "end": 51, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "Avenue", "start": 52, "end": 58, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "Montaigne", "start": 59, "end": 68, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "near", "start": 69, "end": 73, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "the", "start": 74, "end": 77, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "Champs-Elysees", "start": 78, "end": 92, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "late", "start": 93, "end": 97, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "Thursday", "start": 98, "end": 106, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "afternoon", "start": 107, "end": 116, "className": "full-highlight", "tooltip": fullMatchDescription
        },
        {
            "phrase": "necklaces", "start": 147, "end": 156, "className": "full-highlight", "tooltip": fullMatchDescription
        }
    ],
    [],
    "A savvy band of three or four jewel robbers , armed with guns and some posing as women , have struck in the heart of the city 's golden triangle of luxury shops , on ritzy Avenue Montaigne near the Champs-Elysees late Thursday afternoon, stealing more than e85 million worth of diamonds , necklaces, rings and watches from a posh Harry Winston boutique.",
    null,
    "In this example, we chose Sentence 1.",
    null,
    <span>
        We should notice a few things about the merged sentence:
        <br/>a. <span className="data-citation">Three or four robbers</span> is new and is attached to the description of the band.
        <br/>b. <span className="data-citation">on ritzy Avenue ...</span> is attached to the <span className="data-citation">city's golden triangle of luxury shops</span> in such a way that the description of the location is adjacent. Attaching it to the end of the sentence would be considered incoherent.
        <br/>c. <span className="data-citation">necklaces</span> is a new item attached to the list of stolen items. This is allowed only because it seems both sentences describe a list of the same stolen items.
    </span>,
    4
);


const examples = [
    example1,
    example2,
    example3,
    example4,
    example5,
    example6,
]

export { examples };
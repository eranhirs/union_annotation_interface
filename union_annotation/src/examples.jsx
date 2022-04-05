import React, { useState } from 'react';
import { ExampleData } from './models.jsx';

// Example 1
const example1Step3Extra = <section> In this example:
    <dl className="row">
        <dt className="col-sm-4">* "Robbers"</dt>
        <dd className="col-sm-8">Conveys the same information as "thieves" in sentence 1, do <span className="fw-bold">not</span> highlight.</dd>

        <dt className="col-sm-4">* "crash 4x4 into store"</dt>
        <dd className="col-sm-8">This is new information, you should highlight it.</dd>

        <dt className="col-sm-4">* "grabbing jewelry and watches , before setting car ablaze."</dt>
        <dd className="col-sm-8">Conveys exactly the same information as sentence 1, do <span className="fw-bold">not</span> highlight.</dd>
    </dl>
</section>


const example1 = new ExampleData(
    "example #1",
    "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
    "Robbers crash 4x4 into store , grabbing jewelry and watches , before setting car ablaze.",
    1,
    2,
    [{ "phrase": "crash 4x4 into store", "start": 8, "end": 28, "sentenceId": 2 }],
    [{ "phrase": "crashing 4x4 into store", "start": 6, "end": 29 }],    
    "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
    "In this example, we chose Sentence 1.",
    example1Step3Extra,
    'In this example, we add "crash 4x4 into store". Note how we slightly rephrased "crash" to "crashing", please rephrase only if necessary.'
);

// Example 2

const example2Step3Extra = <section> In this example:
    <dl className="row">
        <dt className="col-sm-4">* "H-P announced that it will buy"</dt>
        <dd className="col-sm-8">Conveys the same information as sentence 1, do <span className="fw-bold">not</span> highlight.</dd>

        <dt className="col-sm-4">* "the outsourcing services company"</dt>
        <dd className="col-sm-8">This is new information, you should highlight it.</dd>


        <dt className="col-sm-4">* "for $ 13.9 billion"</dt>
        <dd className="col-sm-8">This is more specific than "nearly $14 billion", so you should highlight it and replace it in the text.</dd>
    </dl>
</section>


const example2 = new ExampleData(
    "example #2",
    "H-P announced that it will buy the outsourcing services company for $ 13.9 billion .",
    "Earlier this month Hewlett-Packard unveiled a bid of nearly $ 14 billion to purchase EDS .",
    2,
    1,
    [
        { "phrase": "the outsourcing services company", "start": 31, "end": 63, "sentenceId": 1 },
        { "phrase": "for $ 13.9 billion", "start": 64, "end": 82, "sentenceId": 1 }
    ],
    [
        { "phrase": "the outsourcing services company", "start": 86, "end": 118 },
        { "phrase": "of $ 13.9 billion", "start": 50, "end": 67 }
    ],    
    "Earlier this month Hewlett-Packard unveiled a bid of $ 13.9 billion to purchase EDS , the outsourcing services company .",
    "In this example, we chose Sentence 2.",
    example2Step3Extra,
    'In this example, we replace "nearly $ 14 billion" with "$ 13.9 billion". Also, we add "the outsourcing services company".'
);

// Example 3

const example3Step3Extra = <section> In this example:
    <dl className="row">
        <dt className="col-sm-3">* "of 13"</dt>
        <dd className="col-sm-9">This phrase contradicts with the "of 12" phrase in the other sentence. Such contradicting examples will automatically end the task, so there is no need to continue further.</dd>
    </dl>
</section>


const example3 = new ExampleData(
    "a contradiction example",
    "Video of Brooklyn Mother of 13 Zurana Horton shot and killed in a gang shooting was revealed Thursday .",
    "A shocking video released for the first time Thursday captures the moment a Brooklyn mother of 12 was killed in a gang shootout as she picked her daughter up from school .",
    2,
    1,
    [
        { "phrase": "of 13", "start": 25, "end": 30, "sentenceId": 1 }
    ],
    null,
    "In this example, we chose Sentence 2.",
    example3Step3Extra,
    null
);


const examples = [
    example1,
    example2,
    example3
]

export { examples };
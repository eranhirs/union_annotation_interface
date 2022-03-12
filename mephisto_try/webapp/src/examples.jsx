import React, { useState } from 'react';
import { ExampleData } from './models.jsx';

// Example 1
const example1Step3Extra = <section> In this example:
    <dl className="row">
        <dt className="col-sm-3">* "Robbers"</dt>
        <dd className="col-sm-9">Conveys the same information as "thieves" in sentence 1, do not highlight.</dd>

        <dt className="col-sm-3">* "crash 4x4 into store"</dt>
        <dd className="col-sm-9">New information, do highlight.</dd>

        <dt className="col-sm-3">* "grabbing jewelry and watches , before setting car ablaze."</dt>
        <dd className="col-sm-9">Conveys exactly the same information as sentence 1, do not highlight.</dd>
    </dl>
</section>


const example1 = new ExampleData(
    "a simple example",
    "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
    "Robbers crash 4x4 into store , grabbing jewelry and watches , before setting car ablaze.",
    1,
    [{ "phrase": "crash 4x4 into store" }],
    "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
    "In this example, we chose Sentence 1.",
    example1Step3Extra,
    'In this example, we add "crash 4x4 into store". Note how we slightly rephrased "crash" to "crashing". Rephrasing is allowed if necessary.'
);

// Example 2

const example2Step3Extra = <section> In this example:
    <dl className="row">
        <dt className="col-sm-3">* "H-P announced Tuesday that it will buy"</dt>
        <dd className="col-sm-9">Conveys the same information as sentence 1, do not highlight.</dd>

        <dt className="col-sm-3">* "the outsourcing services company"</dt>
        <dd className="col-sm-9">New information, do highlight.</dd>


        <dt className="col-sm-3">* "for $ 13.9 billion"</dt>
        <dd className="col-sm-9">Entailing information, because $ 13.9 billion is more specific than nearly $ 14 billion, do highlight.</dd>
    </dl>
</section>


const example2 = new ExampleData(
    "an entailment example",
    "H-P announced Tuesday that it will buy the outsourcing services company for $ 13.9 billion .",
    "Earlier this month Hewlett-Packard unveiled a bid of nearly $ 14 billion to purchase EDS .",
    2,
    [{ "phrase": "$ 13.9 billion" }, { "phrase": "the outsourcing services company" }],
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
    [{ "phrase": "of 13" }],
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
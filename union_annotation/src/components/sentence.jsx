import React, { useState, useRef } from 'react';
import { HighlightWithinTextarea, Selection } from 'react-highlight-within-textarea';
import { ReactSelectHighlight } from './react_select_highlight';

const Sentence = ({ title, text, disabled = false, readOnly = true, onClick = null, highlightedPhrases = [], setHighlightPhrase = null }) => {

    const onChange = (textParts) => {
        if (!readOnly) {
            setHighlightPhrase(textParts)
        }
    }

    const inputRef = useRef(null);

    return (
        <section key={highlightedPhrases} className={`sentence ${onClick != null ? "clickable " : " "}`}>
            <h5 className="card-title">{title}</h5>
            <div className={`input-group highlight-within-text-area-container ${disabled ? "disabled " : " "}`} onClick={() => onClick ? onClick() : " "} ref={inputRef}>
                <ReactSelectHighlight text={text} onChange={onChange} highlightedPhrases={highlightedPhrases} readOnly={disabled || readOnly} />
            </div>
        </section>
    );
}

export { Sentence };

import React, { useState, useRef } from 'react';
import { HighlightWithinTextarea, Selection } from 'react-highlight-within-textarea';

const Sentence = ({ title, text, setText = null, chosenSentence = false, disabled = false, readOnly = true, highlight = false, onClick = null, highlightedPhrases = [], highlightModal = null, setHighlightCandidate = null, isExample = false }) => {
    const [value, setValue] = useState(text);
    const [selection, setSelection] = useState(undefined);

    const onChange = (newValue, newSelection) => {
        if (!disabled && !readOnly) {
            setValue(newValue);
            if (setText) {
                setText(newValue);
            }
        }

        if (highlight) {
            // Handle bug where selection is not deleted
            if (!selection || selection.start != newSelection.start || selection.end != newSelection.end) {
                setSelection(newSelection);

                const { start, end } = newSelection.anchor > newSelection.focus ? { start: newSelection.focus, end: newSelection.anchor } : { start: newSelection.anchor, end: newSelection.focus }
                const highlightedPhrase = value.substr(start, end - start);
                if (highlightedPhrase.trim() != "" && !highlightedPhrases.includes(highlightedPhrase)) {
                    setHighlightCandidate(highlightedPhrase)
                    highlightModal.toggle();
                }
                // inputRef.current.focus();
            }
        }

        return value;
    }

    const inputRef = useRef(null);
    const highlightAll = { "highlight": /./gi, "className": "yellow" };
    const highlightSpecific = highlightedPhrases.map(function (object, i) { return { "highlight": object, "className": "yellow" } })

    return (
        <section className={`sentence ${onClick != null ? "clickable " : " "}`}>
            <h5 className="card-title">{title}</h5>
            <div className={`input-group highlight-within-text-area-container ${disabled ? "disabled " : " "} ${highlight ? "highlight " : " "}`} onClick={() => onClick ? onClick() : " "} ref={inputRef}>
                {/* TODO: Consider replacing with http://garysieling.github.io/jquery-highlighttextarea/ */}
                <HighlightWithinTextarea
                    highlight={chosenSentence ? highlightAll : highlightSpecific}
                    selection={selection}
                    placeholder=""
                    value={value}
                    onChange={onChange}
                />
            </div>
        </section>
    );
}

export { Sentence };

import React, { useState, useRef, useEffect } from 'react';

class TextPart {
    constructor(start, end, text, isHighlighted) {
        this.start = start;
        this.end = end;
        this.text = text;
        this.isHighlighted = isHighlighted;
    }
}

function ReactSelectHighlight({ text, onChange, highlightedPhrases = null, readOnly = false }) {

    let initialTextParts = [new TextPart(0, text.length, text, false)];
    if (highlightedPhrases !== null) {
        for (const highlightedPhrase of highlightedPhrases) {
            initialTextParts = selectionToHiglightedObjects(highlightedPhrase['start'], highlightedPhrase['end'], initialTextParts)
        }
    }
    const [highlightedObjects, setHighlightedObjects] = useState(initialTextParts);

    // Use ref to container to make sure the selection is of the correct element
    const highlightableContainerRef = useRef(null);    

    function selectionToHiglightedObjects(start, end, textParts) {
        /*
        Add a selection to existing textParts
        */

        const selectedText = text.substr(start, end - start)

        const newHighlightedObject = new TextPart(start, end, selectedText, true)

        const higlightedObjectsToRemove = [];
        const higlightedObjectsToAdd = [];            
        for (const highlightedObject of textParts) {
            const intersecting = highlightedObject.start <= newHighlightedObject.end && highlightedObject.end >= newHighlightedObject.start

            // If intersecting, combine the ranges
            if (intersecting) {
                if (highlightedObject.isHighlighted) {
                    higlightedObjectsToRemove.push(highlightedObject);
                    const newStart = Math.min(highlightedObject.start, newHighlightedObject.start);
                    const newEnd = Math.max(highlightedObject.end, newHighlightedObject.end);
                    newHighlightedObject.start = newStart
                    newHighlightedObject.end = newEnd
                    newHighlightedObject.text = text.substr(newStart, newEnd - newStart)
                } else {
                    higlightedObjectsToRemove.push(highlightedObject);
                    const startOffset = newHighlightedObject.start - highlightedObject.start
                    if (startOffset > 0) {
                        const newStart = highlightedObject.start
                        const newEnd = highlightedObject.start + startOffset
                        const newText = text.substr(newStart, newEnd - newStart);
                        
                        higlightedObjectsToAdd.push(new TextPart(newStart, newEnd, newText, false))
                    }

                    const endOffset = highlightedObject.end - newHighlightedObject.end;
                    if (endOffset > 0) {
                        const newStart = newHighlightedObject.end
                        const newEnd = newHighlightedObject.end + endOffset
                        const newText = text.substr(newHighlightedObject.end, newEnd - newStart);

                        higlightedObjectsToAdd.push(new TextPart(newStart, newEnd, newText, false))
                    }
                }
            }
        }

        // If not intersecting with anything, just add the range
        const filteredHighlightedObjects = textParts.filter(highlightedObject => !higlightedObjectsToRemove.includes(highlightedObject))
        const newHighlightedObjects = [...filteredHighlightedObjects, ...higlightedObjectsToAdd, newHighlightedObject]
        newHighlightedObjects.sort((a, b) => a.start - b.start)

        return newHighlightedObjects
    }

    function checkSelection(e) {
        if (readOnly !== true) {
            const selection = window.getSelection()
            const range = selection.getRangeAt(0);

            // Make sure the selection is of the correct element
            const isValidSelection = highlightableContainerRef.current == range.startContainer.parentElement.parentElement

            if (isValidSelection) {
                const selectedText = selection.toString();

                if (selectedText != "") {
                    // Take into consideration that the selection started from a span (startContainer) which has an offset compared to the full text
                    const selectedTextPartStart = parseInt(range.startContainer.parentElement['dataset']['start'])
                    const absoluteSelectionStart = selectedTextPartStart + range.startOffset
                    // endOffset will be wrong if it ends in another text, so better use selection length
                    const absoluteSelectionEnd = absoluteSelectionStart + selectedText.length

                    const newHighlightedObjects = selectionToHiglightedObjects(absoluteSelectionStart, absoluteSelectionEnd, highlightedObjects)

                    // Update internally the highlighted objects
                    setHighlightedObjects(newHighlightedObjects)

                    // Allow for externally updating the highlighted objects
                    onChange(newHighlightedObjects)
                }
            }
        }
        return true;
    }

    function textPartsToHTML(textParts) {
        const items = []
        for (const textPart of textParts) {
            let textPartIdx = 0
            for (const char of textPart.text) {
                items.push(<span className={`${textPart.isHighlighted ? "highlight" : ""} highlightable`} data-start={textPart.start + textPartIdx} data-idx={textPartIdx}>
                    {char}
                </span>)
                textPartIdx += 1
            }
        }
        return items
    }
    
    function catchMouseUpEverywhere() {
        /*
        Catch when mouse up is outside of the element, more about it here:
        https://stackoverflow.com/questions/11533098/how-to-catch-mouse-up-event-outside-of-element
        */

        const handleMouseUp = (event) => {
            document.removeEventListener('mouseup', handleMouseUp);
            checkSelection()          
        };
        
        document.addEventListener('mouseup', handleMouseUp);
    }

    return (
        <section key={highlightedPhrases} ref={highlightableContainerRef} className={`highlightable-container ${readOnly ? '' : 'highlightable'}`} onMouseDown={catchMouseUpEverywhere} onDoubleClick={checkSelection} onMouseUpCapture={checkSelection}>
            {textPartsToHTML(highlightedObjects)}
        </section>
    )
}

export { ReactSelectHighlight };
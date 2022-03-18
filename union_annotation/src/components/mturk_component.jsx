import React, { useState, useRef, useEffect } from 'react';

function MTurkComponent({ defaultTaskData, children }) {
    const taskData = window.taskData !== undefined ? window.taskData : defaultTaskData;

    const childrenWithMturkProps = React.cloneElement(children, { taskData: taskData, onSubmit: onSubmit })
    const assignmentID = window.turkGetParam('assignmentId', "");
    const workerId = window.turkGetParam('workerId', "");
    const turkSubmitTo = decodeURIComponent(window.turkGetParam('turkSubmitTo', ""));
    const isPreview = assignmentID === "ASSIGNMENT_ID_NOT_AVAILABLE"

    function onSubmit(data) {
        if (isPreview) {
            alert("ERROR - you need to first accept the hit to submit it")
        } else {
            const form = document.createElement("form")
            form.method = "POST";
            form.action = `${turkSubmitTo}/mturk/externalSubmit`
            data['workerId'] = workerId
            data['assignmentId'] = assignmentID
            for (const key in data) {
                // Based on https://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit
                const hiddenField = document.createElement("input")
                hiddenField.type = "hidden";
                hiddenField.name = key;
                hiddenField.value = JSON.stringify(data[key]);
                form.appendChild(hiddenField);
            }
            HTMLFormElement.prototype.submit.call(form);
            document.body.appendChild(form);
            form.submit()
              
            alert(JSON.stringify(data))
        }
    }

    return (
        <section>{childrenWithMturkProps}</section>
    )
}

export default MTurkComponent;
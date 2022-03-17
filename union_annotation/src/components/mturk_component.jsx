import React, { useState, useRef, useEffect } from 'react';

function MTurkComponent({ defaultTaskData, children }) {
    const taskData = window.taskData !== undefined ? window.taskData : defaultTaskData;

    function onSubmit(data) {
        alert(JSON.stringify(data))
    }

    const childrenWithMturkProps = React.cloneElement(children, { taskData: taskData, onSubmit: onSubmit })

    return (
        childrenWithMturkProps
    )
}

export default MTurkComponent;
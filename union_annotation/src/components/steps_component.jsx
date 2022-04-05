function StepsComponent({step, setStep, allowedStep, componentId}) {
    return <div className={`btn-group steps-btn-group`} role="group" aria-label="Switch steps">
        <input type="radio" className="btn-check" name={`${componentId}-btnradio`} id={`${componentId}-btnradio1`} autocomplete="off" checked={step == 1 ? "true" : ""} disabled={allowedStep >= 1 ? "" : "true"} onClick={() => setStep(1)} />
        <label className="btn btn-outline-primary" for={`${componentId}-btnradio1`}>1</label>

        <input type="radio" className="btn-check" name={`${componentId}-btnradio`} id={`${componentId}-btnradio2`} autocomplete="off" checked={step == 2 ? "true" : ""} disabled={allowedStep >= 2 ? "" : "true"} onClick={() => setStep(2)} />
        <label className="btn btn-outline-primary" for={`${componentId}-btnradio2`}>2</label>

        <input type="radio" className="btn-check" name={`${componentId}-btnradio`} id={`${componentId}-btnradio3`} autocomplete="off" checked={step == 3 ? "true" : ""} disabled={allowedStep >= 3 ? "" : "true"} onClick={() => setStep(3)} />
        <label className="btn btn-outline-primary" for={`${componentId}-btnradio3`}>3</label>

        <input type="radio" className="btn-check" name={`${componentId}-btnradio`} id={`${componentId}-btnradio4`} autocomplete="off" checked={step == 4 ? "true" : ""} disabled={allowedStep >= 4 ? "" : "true"} onClick={() => setStep(4)} />
        <label className="btn btn-outline-primary" for={`${componentId}-btnradio4`}>4</label>
    </div>
}

export { StepsComponent };
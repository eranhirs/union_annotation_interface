import React from "react";
import ReactDOM from "react-dom";
import {
  LoadingScreen,
} from "./components/core_components.jsx";
import { useMephistoTask, ErrorBoundary } from "mephisto-task";
import { Instructions } from "./components/instructions.jsx";
import { Task } from "./components/task.jsx";
import { examples } from "./examples.jsx";

/* ================= Application Components ================= */

function MainApp() {
  const {
    blockedReason,
    blockedExplanation,
    isPreview,
    isLoading,
    initialTaskData,
    handleSubmit,
    handleFatalError,
    isOnboarding,
  } = useMephistoTask();

  if (blockedReason !== null) {
    return (
      <section className="hero is-medium is-danger">
        <div class="hero-body">
          <h2 className="title is-3">{blockedExplanation}</h2>{" "}
        </div>
      </section>
    );
  }
  if (isPreview) {
    return (
      <section className="hero is-medium is-link">
        <div class="hero-body">
          <div className="title is-3">
              In this task you will merge the information of two sentences into one sentence. <br />
              More specifically, all of the information conveyed in each sentence should appear in the merged sentence.
          </div>
        </div>
      </section>
    );
  }
  if (isLoading || !initialTaskData) {
    return <LoadingScreen />;
  }
  if (isOnboarding) {
    return <Instructions
      taskData={initialTaskData}
      onSubmit={handleSubmit}
      isOnboarding={isOnboarding}
      onError={handleFatalError}
      examples={examples}
    />
  }

  return (
    <div>
      <ErrorBoundary handleError={handleFatalError}>
        <Task
          taskData={initialTaskData}
          onSubmit={handleSubmit}
          isOnboarding={isOnboarding}
          onError={handleFatalError}
        />
      </ErrorBoundary>
    </div>
  );
}

ReactDOM.render(<MainApp />, document.getElementById("app"));

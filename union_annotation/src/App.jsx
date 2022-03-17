import * as React from 'react';
import './App.css';
// import MTurkFormComponent from './components/MTurkFormComponent';
import { examples } from "./examples.jsx";
import { Instructions } from "./components/instructions.jsx";

function App() {
  return (
    <Instructions examples={examples}></Instructions>
  );
}

export default App;

// import React from "react";
// import ReactDOM from "react-dom";
// import {
//   LoadingScreen,
// } from "./components/core_components.jsx";
// import { useMephistoTask, ErrorBoundary } from "mephisto-task";
// import { Instructions } from "./components/instructions.jsx";
// import { Task } from "./components/task.jsx";

// import { shortDescription } from "./components/texts.jsx";

// /* ================= Application Components ================= */

// function MainApp() {
//   const {
//     blockedReason,
//     blockedExplanation,
//     isPreview,
//     isLoading,
//     initialTaskData,
//     handleSubmit,
//     handleFatalError,
//     isOnboarding,
//   } = useMephistoTask();

//   if (blockedReason !== null) {
//     return (
//       <section className="hero is-medium is-danger">
//         <div class="hero-body">
//           <h2 className="title is-3">{blockedExplanation}</h2>{" "}
//         </div>
//       </section>
//     );
//   }
//   if (isPreview) {
//     return (
//       <Instructions examples={examples}></Instructions>
//     );
//   }
//   if (isLoading || !initialTaskData) {
//     return <LoadingScreen />;
//   }
//   if (isOnboarding) {
//     return <Instructions
//       taskData={initialTaskData}
//       onSubmit={handleSubmit}
//       isOnboarding={isOnboarding}
//       onError={handleFatalError}
//       examples={examples}
//     />
//   }

//   return (
//     <div>
//       <ErrorBoundary handleError={handleFatalError}>
//         <Task
//           taskData={initialTaskData}
//           onSubmit={handleSubmit}
//           isOnboarding={isOnboarding}
//           onError={handleFatalError}
//         />
//       </ErrorBoundary>
//     </div>
//   );
// }

// ReactDOM.render(<MainApp />, document.getElementById("app"));

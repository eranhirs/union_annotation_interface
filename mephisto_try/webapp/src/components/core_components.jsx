import React, { useState } from 'react';

function LoadingScreen() {
  return <Directions>Loading...</Directions>;
}

function Directions({ title, children }) {
  return (
    <section>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  );
}


  export { LoadingScreen, Directions };

self.onmessage = function (event) {
  const { userCode, setupCode, drawCode } = event.data;
  
  // Sanitize and validate the user code (basic example, consider more robust solutions)
  if (!userCode || typeof userCode !== 'string') {
    self.postMessage({ error: 'Invalid user code.' });
    return;
  }
  
  // Create a sandboxed environment
  const allowedMethods = ['createCanvas', 'background', 'lights', 'noStroke', 'orbitControl', 'push', 'pop', 'scale', 'sphere', 'translate', 'fill', 'stroke', 'rect', 'ellipse'];
  const p5 = { ...allowedMethods.reduce((obj, method) => ({ ...obj, [method]: (...args) => { /* Implement safe methods or log usage */ } }), {}) };

  // Define the user's setup and draw functions
  const executeUserCode = new Function('p', `
    ${userCode}
    if (typeof setup === 'function') setup();
    if (typeof draw === 'function') draw();
  `);

  try {
    executeUserCode.call(p5);
  } catch (error) {
    self.postMessage({ error: 'Error executing user code.', details: error.message });
    return;
  }
  
  self.postMessage({ success: true });
};

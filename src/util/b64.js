function js2b64(serializable) {
  return new Buffer(JSON.stringify(serializable), 'utf8').toString('base64');
}

function b642js(base64String) {
  return JSON.parse(new Buffer(base64String, 'base64').toString('utf8'));
}

export { js2b64, b642js };

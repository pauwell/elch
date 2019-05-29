const fs = require('fs');
const strip = require('strip-comments');

// Options.
const bundlePath = 'dist/elch.js';
const encoding = 'utf-8';

// Open bundle and remove all comments.
var currentBundle = fs.readFileSync(bundlePath, encoding);
var newBundle = strip(currentBundle);
fs.writeFileSync(bundlePath, newBundle, encoding);

// Finish.
console.log('Comments removed from bundle!');

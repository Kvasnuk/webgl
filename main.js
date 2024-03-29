const vertexShaderText = [
  'precision mediump float;',
  '',
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  '',
  'void main()',
  '{',
  ' fragColor = vertColor;',
  ' gl_Position = vec4(vertPosition, 0.0, 1.0);',
  '}',
].join('\n');

const fragmentShaderText = [
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  ' gl_FragColor = vec4(fragColor, 1.0);',
  '}',
].join('\n');

const InitDemo = function() {
  const canvas = document.getElementById('triangle');
  var gl = canvas.getContext('webgl');

  if(!gl) {
    console.log('WebGL not supported, falling back on experimental');
    gl = canvas.getContext('experimental-webgl');
  }

  if(!gl) {
    console.log('Your browser does not support WebGL');
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// create shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('Error compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }
  gl.compileShader(fragmentShader);
  if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('Error compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('Error validating program', gl.getProgramInfoLog(program));
    return;
  }

// Create buffer
  const triangleVertices =
    [//x, y        // R, G, B
      0.0,0.5,      1.0, 1.0, 0.0,
      -0.5, -0.5,   0.7, 0.0, 1.0,
      0.5,-0.5,     0.1, 1.0, 0.6
  ];

  const triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
gl.vertexAttribPointer(
  positionAttribLocation, // attrib location
  2, // number of elements
  gl.FLOAT, //type of elements
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex
  0 // offset from beginning of a single vertex to this attribute
);
  gl.vertexAttribPointer(
    colorAttribLocation, // attrib location
    3, // number of elements
    gl.FLOAT, //type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT,  // offset from beginning of a single vertex to this attribute
  );

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

//Main render loop
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
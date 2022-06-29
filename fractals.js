var canvas, m, gl, mouseDown, step, center, centerLoc, scale, scaleLoc, factor, factorLoc, isJulia, isJuliaLoc, c, cLoc, clickPos;

window.onload = function init() {
	// Initialization
    canvas = document.getElementById("gl-canvas");
    m = document.getElementById("fractalType");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    mouseDown = false;
    step = 0.1;
    center = vec2(0.0, 0.0);
    scale = 1.0;
    factor = 1.0;
    isJulia = false;
    c = vec2(0,0);

    // Add event listeners
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    document.getElementById("slide").addEventListener("input", onSlide);
	m.addEventListener("change", onFractalTypeSelect);
    document.getElementById("up").addEventListener("click", onUpButtonClick);
    document.getElementById("down").addEventListener("click", onDownButtonClick);
    document.getElementById("left").addEventListener("click", onLeftButtonClick);
    document.getElementById("right").addEventListener("click", onRightButtonClick);
    document.getElementById("zoomIn").addEventListener("click", onZoomInButtonClick);
    document.getElementById("zoomOut").addEventListener("click", onZoomOutButtonClick);
    if (canvas.addEventListener){
    	// IE9, Chrome, Safari, Opera
    	canvas.addEventListener("mousewheel", onMouseWheel, false);
    	//Firefox
    	canvas.addEventListener("DOMMouseScroll", onMouseWheel, false);
    }

    // Vertices
    var vertices = [
        vec2(-1.0,1.0),
        vec2(-1.0,-1.0),
        vec2(1.0,1.0),
        vec2(1.0,-1.0)
    ];

    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Get uniform variable locations
    centerLoc = gl.getUniformLocation(program, "center");
    scaleLoc = gl.getUniformLocation(program, "scale");
    factorLoc = gl.getUniformLocation(program, "factor");
    isJuliaLoc = gl.getUniformLocation(program, "isJulia");
    cLoc = gl.getUniformLocation(program, "c");

    // Render
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.uniform2fv(centerLoc, center);
    gl.uniform1f(scaleLoc, scale);
    gl.uniform1f(factorLoc, factor);
    gl.uniform1i(isJuliaLoc, isJulia);
    gl.uniform2fv(cLoc, c);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function onMouseDown(event){
    //center[0] and center[1] (dX and dY) are added at the end in order to save the last translation
    //(otherwise we reset to the origin every mouse down event)
    clickPos = vec2((-1+2*event.offsetX/canvas.width)/scale+center[0], (-1+2*(canvas.height-event.offsetY)/canvas.height)/scale+center[1]);
    mouseDown = true;
    console.log("[Mouse Down] clickPos: ("+clickPos+") center: ("+center+")"); //DEBUG
}

function onMouseUp(event){
    mouseDown = false;
    console.log("[Mouse Up]"); //DEBUG
}

function onMouseMove(event){
    if (mouseDown){
        center = vec2(clickPos[0] - (-1+2*event.offsetX/canvas.width)/scale, clickPos[1] - (-1+2*(canvas.height-event.offsetY)/canvas.height)/scale);
        render();
        console.log("[Mouse Move] center: ("+center+")"); //DEBUG
    }
}

function onSlide(event){
	factor = event.target.value;
	render();
	console.log("[Slide] factor: "+factor); //DEBUG
}

function onKeyDown(event){
    switch (event.keyCode){
        case 81:
            scale += step;
            render();
            console.log("[Key Down - Q] scale: "+scale); //DEBUG
            break;
        case 65:
            if (scale > step){
                scale -= step;
                render();
            }
            console.log("[Key Down - A] scale: "+scale); //DEBUG
            break;
        default:
            console.log("[Key Down - "+event.keyCode+"]"); //DEBUG
            break;
    }
}

function onFractalTypeSelect(event){
    switch (m.selectedIndex){
        case 0:
			isJulia = false;
            console.log("[Menu Entry 0] isJulia: "+isJulia+" c: "+c); //DEBUG
            render();
            break;
        case 1:
			isJulia = true;
			c = vec2(-0.4, 0.6);
            console.log("[Menu Entry 1] isJulia: "+isJulia+" c: "+c); //DEBUG
			render();
            break;
        case 2:
			isJulia = true;
			c = vec2(0.285, 0);
            console.log("[Menu Entry 2] isJulia: "+isJulia+" c: "+c); //DEBUG
			render();
            break;
        case 3:
			isJulia = true;
			c = vec2(0.285, 0.01);
			console.log("[Menu Entry 3] isJulia: "+isJulia+" c: "+c); //DEBUG
			render();
            break;
        case 4:
			isJulia = true;
			c = vec2(-0.8, 0.156);
            console.log("[Menu Entry 4] isJulia: "+isJulia+" c: "+c); //DEBUG
			render();
            break;
        case 5:
			isJulia = true;
			c = vec2(0.8, 0.0);
            console.log("[Menu Entry 5] isJulia: "+isJulia+" c: "+c); //DEBUG
			render();
            break;
    }
}

function onUpButtonClick(event){
	center = vec2(center[0], center[1] + step/scale);
	render();
	console.log("[Up Button] center: ("+center+")"); //DEBUG
}

function onDownButtonClick(event){
	center = vec2(center[0], center[1] - step/scale);
	render();
	console.log("[Down Button] center: ("+center+")"); //DEBUG
}

function onLeftButtonClick(event){
	center = vec2(center[0] - step/scale, center[1]);
	render();
	console.log("[Left Button] center: ("+center+")"); //DEBUG
}

function onRightButtonClick(event){
	center = vec2(center[0] + step/scale, center[1]);
	render();
	console.log("[Right Button] center: ("+center+")"); //DEBUG
}

function onZoomInButtonClick(event){
	scale += step;
    render();
    console.log("[Zoom In Button] scale: "+scale); //DEBUG
}


function onZoomOutButtonClick(event){
	if (scale > step){
        scale -= step;
        render();
    }
    console.log("[Zoom In Button] scale: "+scale); //DEBUG
}

function onMouseWheel(event){
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	if (delta > 0){
		//Zoom in
		scale += step;
	} else {
		//Zoom out
		if (scale > step){
	        scale -= step;
	    }
	}
	render();
    console.log("[Mouse Wheel] scale: "+scale); //DEBUG
}

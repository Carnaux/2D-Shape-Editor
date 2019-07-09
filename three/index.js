var group = new THREE.Group();
var scene, camera, renderer;

function initThree(){

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(120,120,120)");
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	orbit = new THREE.OrbitControls( camera, renderer.domElement);
    
	camera.position.z = 5;

	scene.add(group);
	animate();
}

function animate() {
    requestAnimationFrame( animate );
    orbit.update();
    render();
};

function render(){
    renderer.render( scene, camera );
}

function loadSVG(){

	group.scale.multiplyScalar( 0.005 );
			group.position.x = -2;
			group.position.y = 1;
			group.scale.y *= - 1;

	var data = window.sessionStorage.svgData;
	
	var loader = new THREE.SVGLoader();

	var parsed = loader.parse(data)
	console.log(parsed)
	var paths = parsed.paths;

	for ( var i = 0; i < paths.length; i ++ ) {

		var path = paths[ i ];

		var material = new THREE.MeshBasicMaterial( {
			color: path.color,
			side: THREE.DoubleSide,
			depthWrite: false
		} );

		var shapes = path.toShapes( true );

		for ( var j = 0; j < shapes.length; j ++ ) {

			var shape = shapes[ j ];
			var geometry = new THREE.ShapeBufferGeometry( shape );
			var mesh = new THREE.Mesh( geometry, material );
			
			group.add( mesh );

		}
	}		

	initThree();
}


window.onload = loadSVG;
import * as THREE from 'three';

export default class Application {
	private scene = new THREE.Scene;
	private camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
	private renderer = new THREE.WebGLRenderer();
	private sceneHandler = new SceneHandler(this.scene);
	
	// https://threejs.org/docs/index.html

	constructor(el: HTMLElement) {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		el.appendChild(this.renderer.domElement);

		const ent = new MyCube();
		//this.camera.lookAt(ent.getRenderObject().position);
		this.camera.position.set(0,0,30);
		this.camera.lookAt(new THREE.Vector3(0,0,0));
		
		this.sceneHandler.add(ent);
		
		const lineob = new MyLines();
		//this.sceneHandler.add(lineob);
		ent.getRenderObject().add(lineob.getRenderObject());
		this.camera.lookAt(lineob.getRenderObject().position);
		
		this.animate();
	}
	private animate() {
		this.sceneHandler.tick();
		requestAnimationFrame(() => { this.animate(); });
		this.renderer.render(this.scene, this.camera);
	}
}
class SceneHandler {
	private scene: THREE.Scene;
	private entities: Entity[] = [];
	constructor(scene: THREE.Scene) {
		this.scene = scene;
	}
	public add(entity: Entity) {
		this.entities.push(entity);
		this.scene.add(entity.getRenderObject());
	}
	public tick() {
		for (var entity of this.entities) {
			entity.tick();
		}
	}
}
class Entity {
	protected mesh: THREE.Object3D;
	public tick(): void {
		
	}
	public getRenderObject(): THREE.Object3D {
		return this.mesh;
	}
}
class MyCube extends Entity {
	constructor() {
		super();
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		this.mesh = new THREE.Mesh(geometry, material);
	}
	public tick() {
		this.mesh.rotation.x += 0.1;
		this.mesh.rotation.y += 0.1;
	}
}
class MyLines extends Entity {
	constructor() {
		super();
		var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
		geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
		geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
		this.mesh = new THREE.Line(geometry, material);
	}
}

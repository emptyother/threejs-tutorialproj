import * as THREE from 'three';

import imageurl from './texture/test.png';

export default class Application {
	private scene = new THREE.Scene;
	private camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
	private renderer = new THREE.WebGLRenderer();
	private sceneHandler = new SceneHandler(this.scene);

	// https://threejs.org/docs/index.html

	constructor(el: HTMLElement) {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		el.appendChild(this.renderer.domElement);

		const ent = new RotatingCube();
		const lineob = new MyLines();
		const light = new MyLight();
		const sceneLight = new SceneLight();

		this.sceneHandler.add(ent);
		this.sceneHandler.add(lineob);
		this.sceneHandler.add(light);
		this.sceneHandler.add(sceneLight);
		//ent.getRenderObject().add(lineob.getRenderObject());

		//this.camera.lookAt(ent.getRenderObject().position);
		this.camera.position.set(0, 0, 20);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		//this.camera.lookAt(lineob.getRenderObject().position);

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
	private renderedObject: THREE.Object3D;
	public tick(): void {

	}
	public getRenderObject(): THREE.Object3D {
		return this.renderedObject;
	}
	protected setRenderObject(obj: THREE.Object3D): THREE.Object3D {
		this.renderedObject = obj;
		return this.renderedObject;
	}
}
class RotatingCube extends Entity {
	constructor() {
		super();
		var texture = new THREE.TextureLoader().load(imageurl);
		var geometry = new THREE.BoxGeometry(5, 5, 5);
		var material = new THREE.MeshPhongMaterial({
			map: texture
		});
		this.setRenderObject(new THREE.Mesh(geometry, material));
	}
	public tick() {
		this.getRenderObject().rotation.x += 0.02;
		this.getRenderObject().rotation.y += 0.02;
	}
}
class MyLines extends Entity {
	constructor() {
		super();
		var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
		geometry.vertices.push(new THREE.Vector3(0, 10, 0));
		geometry.vertices.push(new THREE.Vector3(10, 0, 0));
		this.setRenderObject(new THREE.Line(geometry, material));
	}
}
class MyLight extends Entity {
	constructor() {
		super();
		this.setRenderObject(new THREE.PointLight(0xffffff, 1, 100));
		this.getRenderObject().position.set(20, 10, 0);
	}
}
class SceneLight extends Entity {
	constructor() {
		super();
		this.setRenderObject(new THREE.AmbientLight(0x404040, 0.1));
	}
}

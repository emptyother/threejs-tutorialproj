import * as THREE from 'three';

export default class Application {
	private scene = new THREE.Scene;
	private camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	private renderer = new THREE.WebGLRenderer();
	private sceneHandler = new SceneHandler(this.scene);

	constructor(el: HTMLElement) {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		el.appendChild(this.renderer.domElement);

		this.camera.position.z = 4;
		const ent = new MyCube();
		this.camera.lookAt(ent.getMesh().position);
		
		this.sceneHandler.add(ent);
		//TODO: https://threejs.org/docs/index.html#manual/introduction/Drawing-lines
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
		this.scene.add(entity.getMesh());
	}
	public tick() {
		for (var entity of this.entities) {
			if (entity.tick) {
				entity.tick();
			}
		}
	}
}
interface Entity {
	tick(): void;
	getMesh(): THREE.Mesh;
}
class MyCube implements Entity {
	private mesh: THREE.Mesh;
	constructor() {
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		this.mesh = new THREE.Mesh(geometry, material);
	}
	public getMesh(): THREE.Mesh {
		return this.mesh;
	}
	public tick() {
		this.mesh.rotation.x += 0.1;
		this.mesh.rotation.y += 0.1;
	}
}

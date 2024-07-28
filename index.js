import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 16);
const material = new THREE.MeshStandardMaterial({
	map: loader.load("./textures/00_earthmap1k.jpg"),
});

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);

const earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);

const star = getStarfield({ numStars: 2000 });
scene.add(star);

// const hemiLight = new THREE.HemisphereLight();
// scene.add(hemiLight);
const lightMat = new THREE.MeshBasicMaterial({
	map: loader.load("./textures/03_earthlights1k.jpg"),
	blending: THREE.AdditiveBlending,
});
const lightMesh = new THREE.Mesh(geometry, lightMat);
scene.add(lightMesh);

const cloudsMat = new THREE.MeshBasicMaterial({
	map: loader.load("./textures/05_earthcloudmaptrans.jpg"),
	transparent: true,
	opacity: 0.5,
	blending: THREE.AdditiveBlending,
});
const CloudsMesh = new THREE.Mesh(geometry, cloudsMat);
CloudsMesh.scale.setScalar(1.001);
scene.add(CloudsMesh);

const fresnalMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnalMat);
glowMesh.scale.setScalar(1.009);
earthGroup.add(glowMesh);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.000002;

function animate() {
	requestAnimationFrame(animate);
	earthMesh.rotation.y += 0.002;
	lightMesh.rotation.y += 0.002;
	CloudsMesh.rotation.y += 0.0025;
	glowMesh.rotation.y += 0.002;
	renderer.render(scene, camera);
	controls.update();
}

animate();

function handleWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

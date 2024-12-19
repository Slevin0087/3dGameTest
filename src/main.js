console.log('начало');
import * as BABYLON from 'babylonjs';
import './styles.css'
// import restart from './assets/restartBlue.png';
// import sand from './assets/sand.jpg';
// import './assets/skybox_nx.jpg';
// import './assets/skybox_ny.jpg';
// import './assets/skybox_nz.jpg';
// import './assets/skybox_px.jpg';
// import './assets/skybox_py.jpg';
// import './assets/skybox_pz.jpg';
// import bascetBall from './assets/ballTexture.png';

//DOM элементы
const canvas = window.document.getElementById('canvas');
const restartBtn = window.document.getElementById('restart-btn');
restartBtn.src = './assets/restartBlue.png';

//создание движка BABYLON
const engine = new BABYLON.Engine(canvas, true);
// console.log('engine:', engine);

//создание сцены
const scene = new BABYLON.Scene(engine);
//создание физики в сцене
scene.enablePhysics();

scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);

//создание неба и земли
// const defaultEnvironment = scene.createDefaultEnvironment();

//создание камеры                                             расположение камеры
const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 1.2, -4.5), scene);

//поворот камеры по указанным позициям
camera.setTarget(new BABYLON.Vector3(-0.2, -1, 22));

//создание света
const light = new BABYLON.PointLight('light', new BABYLON.Vector3(10, 1, -10), scene);
//якрость света
light.intensity = 0.5;



//создание генератора теней
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

// //создание куба
// const box = new BABYLON.Mesh.CreateBox('box', 2, scene);
// box.rotation.x = -0.2;
// box.rotation.y = -0.4;

// //создание платформы
// const platform = new BABYLON.MeshBuilder.CreateBox('box', {
//   width: 10,
//   height: 10,
//   depth: 0,
//   wrap: true,
// }, scene);

// //создание материала платформы
// const boxMaterial = new BABYLON.StandardMaterial('material', scene);
// // boxMaterial.emissiveColor = new BABYLON.Color3(0, 0.58, 0.86);
// boxMaterial.emissiveTexture = new BABYLON.Texture(sand);
// platform.material = boxMaterial;

// создание земли
const ground = new BABYLON.MeshBuilder.CreateGround('ground', {
  width: 5,
  height: 5,
  depth: 10,
}, scene);

// создание материала земли
const groundMaterial = new BABYLON.StandardMaterial('material', scene);
groundMaterial.emissiveTexture = new BABYLON.Texture('./assets/sand.jpg');
ground.material = groundMaterial;
ground.receiveShadows = true;
ground.physicsImpostor = new BABYLON.PhysicsImpostor(
  ground,
  BABYLON.PhysicsImpostor.BoxImpostor,
  {
    mass: 0,
  },
  scene
)
//создание моря и неба
const skyBox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);

//создание материала для неба
const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.disableLighting = true;
// skyboxMaterial.emissiveTexture = new BABYLON.CubeTexture(seaAndSky);
skyBox.infiniteDistance = true;

//Далее мы применяем к нему нашу специальную текстуру неба.
//Эта текстура должна быть подготовлена ​​как скайбокс, в специальном каталоге,
//названном в нашем примере «skybox»:
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/skybox', scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyBox.material = skyboxMaterial;

//создание мяча
const ball = new BABYLON.MeshBuilder.CreateSphere('sphere', {
  diameter: 0.5,
}, scene)

//позиция мяча
ball.position.y = 1.5;
// ball.position.z = 3;

//создание текстуры мяча
const ballMaterial = new BABYLON.StandardMaterial('material', scene);
ballMaterial.emissiveTexture = new BABYLON.Texture('./assets/ballTexture.png');
ball.material = ballMaterial;
shadowGenerator.getShadowMap().renderList.push(ball)
ball.physicsImpostor = new BABYLON.PhysicsImpostor(
  ball,
  BABYLON.PhysicsImpostor.SphereImpostor,
  {
    mass: 0.5,
    restitution: 2
  },
  scene
);

engine.runRenderLoop(() => {
  scene.render();
});

// обработчики клика по экрану
const EventsNameArr = ['touchstart', 'click'];
EventsNameArr.forEach(eventName => {
  window.addEventListener(eventName, () => {
    console.log(eventName);
    // ball.rotation.x += 0.1;
    switch (eventName) {
      case 'touchstart':
        console.log('touchstart');

        ball.physicsImpostor.applyImpulse(
          new BABYLON.Vector3(0, 0, 1),
          ball.getAbsolutePosition(),
          // ball.position.y = 2
        );
        break;
      case 'click':
        console.log('click');
        ball.physicsImpostor.applyImpulse(
          new BABYLON.Vector3(1, 0, 0),
          ball.getAbsolutePosition()
        );
        break;
      // case 'touchend':
      //   console.log('touchend');
      //   ball.physicsImpostor.applyImpulse(
      //     new BABYLON.Vector3(2, 0, 0),
      //     ball.getAbsolutePosition()
      //   );
      default:
        throw new Error('error');
    }
  });
})

//обрабочтик кнопки рестарт
restartBtn.addEventListener('click', () => window.location.reload());
// window.addEventListener('click', () => {
//   box.rotation.x += 0.1;
// });

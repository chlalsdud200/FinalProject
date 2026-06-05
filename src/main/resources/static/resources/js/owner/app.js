// 1. 지도 초기화 (한국 중심)
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json', // 무료 타일 스타일
    center: [129.0756, 35.1796], // 부산항 좌표
    zoom: 12,
    pitch: 60, // 지도를 눕혀서 3D 느낌 강조
    antialias: true
});

// 2. Three.js 레이어 설정
const modelOrigin = [129.0756, 35.1796]; // 선박 시작 위치
const modelAltitude = 0;
const modelRotate = [Math.PI / 2, 0, 0];

const customLayer = {
    id: '3d-ship-layer',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        // 조명 추가
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, -70, 100).normalize();
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040));

        // 배 모델 (간단한 선박 모양)
        const geometry = new THREE.BoxGeometry(20, 50, 20); // 크기는 미터 단위 시뮬레이션
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.ship = new THREE.Mesh(geometry, material);
        this.scene.add(this.ship);

        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });
        this.renderer.autoClear = false;
    },
    render: function (gl, matrix) {
        // 지도의 위치에 맞춰 Three.js 모델 좌표 변환
        const rotationX = new THREE.Matrix4().makeRotationTranslation(
            new THREE.Vector3(0, 0, 0), 
            new THREE.Quaternion().setFromEuler(new THREE.Euler(modelRotate[0], modelRotate[1], modelRotate[2])),
            new THREE.Vector3(1, 1, 1)
        );

        // 실제 선박 위치(위경도) 반영 업데이트 로직 필요
        // ... (좌표 변환 로직)

        this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        map.triggerRepaint();
    }
};

map.on('style.load', () => {
    map.addLayer(customLayer);
});
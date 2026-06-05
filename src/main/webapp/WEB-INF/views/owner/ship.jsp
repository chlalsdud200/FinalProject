<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>실시간 선박 위치 관제 - 정교한 선박 모델</title>
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
    <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
    <link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
    <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
        #status { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 8px; font-family: 'Malgun Gothic', sans-serif; z-index: 1; border: 1px solid #444; }
        .info-val { color: #00ffcc; font-weight: bold; }
    </style>
</head>
<body>
<div id="status">
    <strong style="font-size: 1.1em; color: #ffcc00;">Vessel Monitoring System</strong><br>
    <small>ID: GEMINI-CARGO-01</small><hr>
    위치: <span id="pos-info" class="info-val">계산 중...</span><br>
    방향: <span id="bearing-info" class="info-val">0°</span>
</div>
<div id="map"></div>

<script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
    }
</script>

<script type="module">
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    // 1. 설정 및 경로 데이터
    const seaPath = [
        [129.0650, 35.0750], [129.0800, 35.0850], [129.1000, 35.0800], 
        [129.1200, 35.0950], [129.1400, 35.1050]
    ];

    let currentPathIndex = 0;
    let shipLngLat = [...seaPath[0]];
    let shipBearing = 0;
    const moveSpeed = 0.00003; 

    // 2. 지도 생성
    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://demotiles.maplibre.org/style.json',
        center: [129.09, 35.08],
        zoom: 14,
        pitch: 65,
        antialias: true
    });

    // 3. 선박 이동 로직
    function updateShipPosition() {
        const target = seaPath[currentPathIndex + 1];
    if (!target) {
        currentPathIndex = 0;
        shipLngLat = [...seaPath[0]];
        return;
    }

    const dx = target[0] - shipLngLat[0];
    const dy = target[1] - shipLngLat[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < moveSpeed) {
        currentPathIndex++;
    } else {
        // [중요 수정] dx, dy의 순서를 바꾸거나 오프셋을 조정하여 
        // 지도의 Bearing 시스템(북쪽 0도, 시계방향+)과 Three.js를 일치시킵니다.
        // Math.atan2(dx, dy)는 12시 방향을 0도로 잡는 방식입니다.
        const angle = Math.atan2(dx, dy) * (180 / Math.PI);
        shipBearing = angle;

        shipLngLat[0] += (dx / distance) * moveSpeed;
        shipLngLat[1] += (dy / distance) * moveSpeed;
    }

        document.getElementById('pos-info').innerText = `\${shipLngLat[0].toFixed(4)}, \${shipLngLat[1].toFixed(4)}`;
        document.getElementById('bearing-info').innerText = Math.round(`\${shipBearing}`) + "°";
    }

    // 4. Custom 3D Layer
    const customLayer = {
        id: '3d-ship-layer',
        type: 'custom',
        renderingMode: '3d',
onAdd: function (map, gl) {
            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();

            const sun = new THREE.DirectionalLight(0xffffff, 3.5);
            sun.position.set(50, 100, 50);
            this.scene.add(sun);
            this.scene.add(new THREE.AmbientLight(0xffffff, 1.0));

            this.shipGroup = new THREE.Group();
            this.scene.add(this.shipGroup);

            const shipContainer = new THREE.Group();

            // (1) 선체(Hull) 생성 (앞부분이 뾰족한 Shape)
            const hullShape = new THREE.Shape();
            hullShape.moveTo(0, 40); // 선수 (앞)
            hullShape.bezierCurveTo(15, 30, 15, -20, 10, -40); // 우측
            hullShape.lineTo(-10, -40); // 선미 (뒤)
            hullShape.bezierCurveTo(-15, -20, -15, 30, 0, 40); // 좌측

            const extrudeSettings = { depth: 10, bevelEnabled: true, bevelThickness: 2, bevelSize: 2 };
            const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
            const hullMat = new THREE.MeshPhongMaterial({ color: 0x222222 }); 
            const hull = new THREE.Mesh(hullGeo, hullMat);
            
            // 선체를 수평으로 눕힘
            hull.position.z = -10; 
            shipContainer.add(hull);

            // (2) 선실(Cabin)
            const cabinGeo = new THREE.BoxGeometry(12, 20, 15);
            const cabinMat = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
            const cabin = new THREE.Mesh(cabinGeo, cabinMat);
            cabin.position.set(0, -25, 12); 
            shipContainer.add(cabin);

            // (3) 굴뚝(Funnel)
            const funnelGeo = new THREE.CylinderGeometry(2, 2, 8);
            const funnelMat = new THREE.MeshPhongMaterial({ color: 0xff3300 });
            const funnel = new THREE.Mesh(funnelGeo, funnelMat);
            funnel.rotation.x = Math.PI / 2;
            funnel.position.set(0, -25, 22);
            shipContainer.add(funnel);

            // --- [핵심 해결 방법] 모델 자체를 회전시킴 ---
            // Three.js 좌표계 상에서 앞(Front)으로 정렬
            // 만약 배가 여전히 옆으로 간다면 아래 숫자를 Math.PI / 2 또는 -Math.PI / 2 등으로 조정하세요.
            // 현재 shape 기준으로는 Y축 양의 방향으로 이미 정렬되어 있지만, 
            // 만약 4시 방향을 보고 있다면 모델을 -Math.PI / 2 만큼 회전시켜 보정할 수 있습니다.
            shipContainer.rotation.z = Math.PI / 2; // -90도 회전
            // ------------------------------------------

            this.shipGroup.add(shipContainer);

            this.renderer = new THREE.WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true
            });
            this.renderer.autoClear = false;
        },
render: function (gl, matrix) {
            if (!this.renderer) return;

            const mercator = maplibregl.MercatorCoordinate.fromLngLat(shipLngLat, 0);
            const shipScale = mercator.meterInMercatorCoordinateUnits() * 8.0;

            const translateM = new THREE.Matrix4().makeTranslation(mercator.x, mercator.y, mercator.z);
            const scaleM = new THREE.Matrix4().makeScale(shipScale, shipScale, shipScale);
            
            // MapLibre Bearing(시계방향 +)과 Three.js 회전 방향 동기화
            // 만약 배 머리가 진행방향과 90도 틀어져 있다면 뒤에 + Math.PI / 2 등을 더해 보정합니다.
            const rotationM = new THREE.Matrix4().makeRotationZ(-(shipBearing) * Math.PI / 180 + Math.PI);

            const l = translateM.multiply(rotationM).multiply(scaleM);
            this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix).multiply(l);

            this.renderer.resetState();
            this.renderer.render(this.scene, this.camera);
            map.triggerRepaint();
        }
    };

    map.on('style.load', () => {
        map.addLayer(customLayer);
        setInterval(updateShipPosition, 1);
    });
</script>
</body>
</html>
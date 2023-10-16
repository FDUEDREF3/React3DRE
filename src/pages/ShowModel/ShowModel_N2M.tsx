import {  } from 'antd';
import React from 'react';
import { useLocation } from 'react-router';
import * as THREE from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Status from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'



// shaders
const RenderVertShader = `
in vec3 position;
in vec2 uv;

out vec2 vUv;
out vec3 rayDirection;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform vec3 cameraPosition;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    rayDirection = (modelMatrix * vec4( position, 1.0 )).rgb - cameraPosition;
}
`;

const RenderFragShader_template = `
precision highp float;

layout(location = 0) out vec4 pc_FragColor;

in vec2 vUv;
in vec3 rayDirection;

uniform int mode;

uniform highp sampler2D tDiffuse;
uniform highp sampler2D tSpecular;

uniform highp sampler2D weightsZero;
uniform highp sampler2D weightsOne;

float inputFetch(vec4 f0, vec3 viewdir, int j) {
    float input_value = 0.0;
    if (j < 4) {
        input_value = (j == 0) ? viewdir.r : ((j == 1) ? viewdir.g : ((j == 2) ? viewdir.b : f0.r));
    } else {
        input_value = (j == 4) ? f0.g : ((j == 5) ? f0.b : f0.a);
    }
    // if (abs(input_value) < 0.1 / 255.0) {
    //     input_value = 0.0;
    // }
    return input_value;
}

vec3 evaluateNetwork(vec4 f0, vec3 viewdir) {

    // NUM_CHANNELS_ZERO (input_dim) is hard-coded as 6
    // NUM_CHANNELS_ONE (hidden_dim) can vary, but should be divisible by 4
    // NUM_CHANNELS_TWO (output_dim) is hard-coded as 3
    
    vec4 v;
    mat4 w;

    // first layer: 6 --> NUM_CHANNELS_ONE

    vec4 result_one[NUM_CHANNELS_ONE / 4];

    v = vec4(
        inputFetch(f0, viewdir, 0),
        inputFetch(f0, viewdir, 1),
        inputFetch(f0, viewdir, 2),
        inputFetch(f0, viewdir, 3)
    );

    for (int i = 0; i < NUM_CHANNELS_ONE; i += 4) {
        w = mat4(
            texelFetch(weightsZero, ivec2(0, i), 0),
            texelFetch(weightsZero, ivec2(0, i + 1), 0),
            texelFetch(weightsZero, ivec2(0, i + 2), 0),
            texelFetch(weightsZero, ivec2(0, i + 3), 0)
        );
        result_one[i / 4] += v * w;
    }

    v = vec4(
        inputFetch(f0, viewdir, 4),
        inputFetch(f0, viewdir, 5),
        0.0,
        0.0
    );

    for (int i = 0; i < NUM_CHANNELS_ONE; i += 4) {
        w = mat4(
            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i), 0),
            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 1), 0),
            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 2), 0),
            texelFetch(weightsZero, ivec2(0, NUM_CHANNELS_ONE + i + 3), 0)
        );
        result_one[i / 4] += v * w;
    }

    // second layer: NUM_CHANNELS_ONE --> 3

    vec3 result;

    for (int i = 0; i < NUM_CHANNELS_ONE / 4; i++) {
        v = max(result_one[i], 0.0); // relu
        w = mat4(
            texelFetch(weightsOne, ivec2(0, i * 3), 0),
            texelFetch(weightsOne, ivec2(0, i * 3 + 1), 0),
            texelFetch(weightsOne, ivec2(0, i * 3 + 2), 0),
            vec4(0.0) // padding
        );
        result += (v * w).xyz;
    }

    // sigmoid
    return 1.0 / (1.0 + exp(-result)); 
}

void main() {    
    vec4 diffuse = texture( tDiffuse, vUv );
    if (mode == 1) { // diffuse
        pc_FragColor.rgb = diffuse.rgb;
    } else {
        vec4 specular = texture( tSpecular, vUv );
        if (mode == 2) { // specular
            pc_FragColor.rgb = evaluateNetwork(specular, normalize(rayDirection));
        } else { // full
            pc_FragColor.rgb = clamp(diffuse.rgb + evaluateNetwork(specular, normalize(rayDirection)), 0.0f, 1.0f);
        }
    }
    pc_FragColor.a = 1.0;
}
`;

function createNetworkWeightTexture(network_weights) {
    let width = network_weights.length;
    let height = network_weights[0].length;
    
    let weightsData = new Float32Array(width * height);
    for (let co = 0; co < height; co++) {
        for (let ci = 0; ci < width; ci++) {
            let index = co * width + ci; // column-major
            let weight = network_weights[ci][co];
            weightsData[index] = weight;
        }
    }
    
    let width_pad = width + (4 - width % 4); // make divisible by 4
    let weightsData_pad = new Float32Array(width_pad * height);
    for (let j = 0; j < width_pad; j += 4) {
        for (let i = 0; i < height; i++) {
            for (let c = 0; c < 4; c++) {
                if (c + j >= width) { 
                    weightsData_pad[j * height + i * 4 + c] = 0.0; // zero padding
                } else {
                    weightsData_pad[j * height + i * 4 + c] = weightsData[j + i * width + c];
                }
            }
        }
    }

    let texture = new THREE.DataTexture(weightsData_pad, 1, width_pad * height / 4, THREE.RGBAFormat, THREE.FloatType);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
}

function createViewDependenceFunctions(network_weights) {
  
    let channelsZero = network_weights['net.0.weight'].length;
    let channelsOne = network_weights['net.1.weight'].length;
    let channelsTwo = network_weights['net.1.weight'][0].length;
  
    console.log('[INFO] load MLP: ', channelsZero, channelsOne)
  
    let RenderFragShader = RenderFragShader_template.replace(new RegExp('NUM_CHANNELS_ZERO', 'g'), channelsZero);
    RenderFragShader = RenderFragShader.replace(new RegExp('NUM_CHANNELS_ONE', 'g'), channelsOne);
    RenderFragShader = RenderFragShader.replace(new RegExp('NUM_CHANNELS_TWO', 'g'), channelsTwo);
  
    return RenderFragShader;
  }
  


const ShowModel_N2M: React.FC = () => {
    let container, params, progressBar, progress, scene, camera, renderer, controls, stats, configs, sceneRef;

    const location = useLocation();
    params = new URLSearchParams(location.search);
    const path = params.get('path');
    console.log(path)
    const scene_names = params.getAll('scene');

    // global config
    configs = {
        bg_color: (params.get('bg_color') === null) ? 0xffffff : parseInt(params.get('bg_color')), // default is white
        H: parseInt(params.get('H')) || Math.floor(0.95 * window.innerHeight),
        W: parseInt(params.get('W')) || Math.floor(0.99 * window.innerWidth),
        fovy: parseInt(params.get('fovy')) || 60,
        near: parseFloat(params.get('near')) || 0.01,
        far: parseFloat(params.get('far')) || 100,
        cameraState: params.get('cameraState'),
    };

    function render() {
        renderer.setRenderTarget( null );
        renderer.render( scene, camera );
    }
    
    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        render();
        stats.update();
    }
    
    function initProgressBar(name, length) {
        progressBar = document.getElementById('progressBar');
        progress[name] = new Array(length * 3).fill('🔴');
        progressBar.innerText = Object.keys(progress).map(key => progress[key].join('')).join('|');
    }
    
    function updateProgressBar(name, index) {
        progressBar = document.getElementById('progressBar');
        progress[name][index] = '🟢';
        progressBar.innerText = Object.keys(progress).map(key => progress[key].join('')).join('|');
    }

    function init() {

        console.log("[INFO] initialize...");
    
        // init webgl
        if ( WebGL.isWebGL2Available() === false ) {
            document.body.appendChild( WebGL.getWebGL2ErrorMessage() );
            return;
        }
    
        // return error message if conf is empty
        if (Object.keys(scene_names).length === 0) {
            let e = document.createElement('p');
            e.style.cssText = 'text-align: center; font-size: 28px;'
            e.innerHTML = "<b>Please provide at least one scene as URL parameters:</b> \
            <br> ?scene=trial_lego/mesh_stage1/ \
            ";
            document.body.appendChild(e);
            return;
        }
    
        // create renderer
        container = document.getElementById('container');
    
        renderer = new THREE.WebGLRenderer({
            powerPreference: 'high-performance',
            precision: 'mediump',
        });
    
        renderer.setPixelRatio( 1 );
        renderer.setSize( configs.W, configs.H );
        renderer.domElement.classList.add("renderer");
        container.appendChild( renderer.domElement );
    
        stats = new Stats();
        container.appendChild( stats.dom );
    
        // create camera
        camera = new THREE.PerspectiveCamera( configs.fovy, configs.W / configs.H, configs.near, configs.far);
        camera.position.y = 2.0;
        camera.position.z = 3.464;
        camera.up.set(0, 0, 1);
    
        
        controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;
        // controls.screenSpacePanning = true;
    
        // create scene
        scene = new THREE.Scene();
        sceneRef = {};
    
        console.log(configs.bg_color);
        scene.background = new THREE.Color(configs.bg_color); // white background
        
        // window.addEventListener( 'resize', onWindowResize, false );
        
        // create GUI
        const gui = new GUI();
        
        gui.addColor(configs, 'bg_color').onChange(v => {
            scene.background = new THREE.Color(v);
        });
        gui.add(configs, 'H', 64, Math.max(configs.H, 1024)).onChange(v => {
            camera.aspect = configs.W / v;
            camera.updateProjectionMatrix();
            renderer.setSize( configs.W, v );
            render();
        });
        gui.add(configs, 'W', 64, Math.max(configs.W, 1024)).onChange(v => {
            camera.aspect = v / configs.H;
            camera.updateProjectionMatrix();
            renderer.setSize( v, configs.H );
            render();
        });
        gui.add(configs, 'fovy', 0.001, 180).onChange(v => {
            camera.fov = v;
            camera.updateProjectionMatrix();
            render();
        });
        gui.add(configs, 'near', 0.001, 10).onChange(v => {
            camera.near = v;
            camera.updateProjectionMatrix();
            render();
        });
        gui.add(configs, 'far', 0.001, 1000).onChange(v => {
            camera.far = v;
            camera.updateProjectionMatrix();
            render();
        });
        
        // load camera pose
        if (configs['cameraState'] !== null) {
            camera.matrix.fromArray(JSON.parse(configs['cameraState']));
            camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);
            camera.updateProjectionMatrix();
            controls.update();
        }
        
        // separate config per scene
        scene_names.forEach((name, index) => {
            configs[name] = {
                renderMode: parseInt(params.get(name + '.renderMode')) || 0, // rendering mode: 0 = normal, 1 = diffuse, 2 = specular.
                pos_x: parseFloat(params.get(name + '.pos_x')) || 0,
                pos_y: parseFloat(params.get(name + '.pos_y')) || 0,
                pos_z: parseFloat(params.get(name + '.pos_z')) || 0,
                scale_x: parseFloat(params.get(name + '.scale_x')) || 1,
                scale_y: parseFloat(params.get(name + '.scale_y')) || 1,
                scale_z: parseFloat(params.get(name + '.scale_z')) || 1,
                rot_x: parseFloat(params.get(name + '.rot_x')) || 0,
                rot_y: parseFloat(params.get(name + '.rot_y')) || 0,
                rot_z: parseFloat(params.get(name + '.rot_z')) || 0,
            };
            const folder = gui.addFolder(name);
            folder.add(configs[name], 'renderMode', {normal: 0, diffuse: 1, specular: 2}).onChange(v => {
                sceneRef[name].forEach((object, index) => {
                    object.traverse(function (child) {
                        if (child.type == 'Mesh') {
                            child.material.uniforms['mode']['value'] = v;
                        }
                    });
                });
            });
            folder.add(configs[name], 'pos_x', -10, 10).onChange(v => {sceneRef[name].forEach((object, index) => {object.position.x = v;})});
            folder.add(configs[name], 'pos_y', -10, 10).onChange(v => {sceneRef[name].forEach((object, index) => {object.position.y = v;})});
            folder.add(configs[name], 'pos_z', -10, 10).onChange(v => {sceneRef[name].forEach((object, index) => {object.position.z = v;})});
            folder.add(configs[name], 'scale_x', 0, 5).onChange(v => {sceneRef[name].forEach((object, index) => {object.scale.x = v;})});
            folder.add(configs[name], 'scale_y', 0, 5).onChange(v => {sceneRef[name].forEach((object, index) => {object.scale.y = v;})});
            folder.add(configs[name], 'scale_z', 0, 5).onChange(v => {sceneRef[name].forEach((object, index) => {object.scale.z = v;})});
            folder.add(configs[name], 'rot_x', 0, 360).onChange(v => {sceneRef[name].forEach((object, index) => {object.rotation.x = v / 180 * Math.PI;})});
            folder.add(configs[name], 'rot_y', 0, 360).onChange(v => {sceneRef[name].forEach((object, index) => {object.rotation.y = v / 180 * Math.PI;})});
            folder.add(configs[name], 'rot_z', 0, 360).onChange(v => {sceneRef[name].forEach((object, index) => {object.rotation.z = v / 180 * Math.PI;})});
            folder.close(); // collapsed by default
        });
    
        configs['save config URL'] = () => {
            // construct a URL string that repeat current configs
            let base =  window.location.href.split('?')[0];
            function unwrap(x, prefix='') {
                let res = [];
                for (const key of Object.keys(x)) {
                    // leave out default values
                    if ((key.includes('pos') && x[key] === 0) || (key.includes('scale') && x[key] === 1) || (key.includes('rot') && x[key] === 0) || (key === 'renderMode' && x[key] === 0)) continue;
                    res.push(prefix + key + '=' + String(x[key]));
                }
                return res.join('&');
            }
            let res = [];
            for (const key of Object.keys(configs)) {
                if ((key == 'save config URL') || (key === 'fovy' && configs[key] === 60) || (key === 'near' && configs[key] === 0.01) || (key === 'far' && configs[key] === 100) || (key === 'bg_color' && configs[key] === 0xffffff)) { continue; }
                else if (key == 'cameraState') { res.push('cameraState=' + JSON.stringify(camera.matrix.toArray())); }
                else if (configs[key].constructor == Object) {
                    res.push('scene='+key);
                    res.push(unwrap(configs[key], key+'.'));
                } else {
                    res.push(key + '=' + String(configs[key]));
                }
            }
            prompt("Copy to clipboard: Ctrl+C, Enter", base + '?' + res.join('&'));
        };
        gui.add(configs, 'save config URL');
    
        // load all scenes async
        let promises = [];
        progress = {};
    
        scene_names.forEach((name, index) => {
            promises.push(fetch(path+name+'/mlp.json').then(response => { return response.json(); }).then(network_weights => {
    
                console.log("[INFO] loading:", name);
    
                // check bound, load all meshes
                let bound = network_weights['bound'];
                let cascade = network_weights['cascade'];
                
                initProgressBar(name, cascade);
                sceneRef[name] = [];
    
                for (let cas = 0; cas < cascade; cas++) {
    
                    // load feature texture
                    let tex0 = new THREE.TextureLoader().load(path+name+'/feat0_'+cas.toString()+'.jpg', object => {
                        console.log('[INFO] loaded diffuse tex:', name, cas);
                        updateProgressBar(name, cas * 3 + 1);
                    });
                    let tex1 = new THREE.TextureLoader().load(path+name+'/feat1_'+cas.toString()+'.jpg', object => {
                        console.log('[INFO] loaded specular tex:', name, cas);
                        updateProgressBar(name, cas * 3 + 2);
                    });
    
                    tex0.magFilter = THREE.NearestFilter;
                    tex0.minFilter = THREE.NearestFilter;
                    tex1.magFilter = THREE.NearestFilter;
                    tex1.minFilter = THREE.NearestFilter;
                
                    // load MLP
                    let RenderFragShader = createViewDependenceFunctions(network_weights);
                    let weightsTexZero = createNetworkWeightTexture(network_weights['net.0.weight']);
                    let weightsTexOne = createNetworkWeightTexture(network_weights['net.1.weight']);
    
                    let newmat = new THREE.RawShaderMaterial({
                        side: THREE.DoubleSide,
                        vertexShader: RenderVertShader,
                        fragmentShader: RenderFragShader,
                        uniforms: {
                            mode: { value: configs[name].renderMode },
                            tDiffuse: { value: tex0 },
                            tSpecular: { value: tex1 },
                            weightsZero: { value: weightsTexZero },
                            weightsOne: { value: weightsTexOne },
                        },
                        glslVersion: THREE.GLSL3
                    });
                
                    // load obj
                    new OBJLoader().load(path+name+'/mesh_'+cas.toString()+'.obj', object => {
                        object.traverse(function (child) {
                            if (child.type == 'Mesh') {
                                child.material = newmat;
                            }
                        });
                        console.log('[INFO] loaded mesh:', name, cas);
                        updateProgressBar(name, cas * 3);
                        object.position.set(configs[name].pos_x, configs[name].pos_y, configs[name].pos_z);
                        object.scale.set(configs[name].scale_x, configs[name].scale_y, configs[name].scale_z);
                        object.rotation.set(configs[name].rot_x / 180 * Math.PI, configs[name].rot_y / 180 * Math.PI, configs[name].rot_z / 180 * Math.PI);
                        sceneRef[name].push(object);
                        scene.add(object);
                    });
                }
            }));
        });
        
        Promise.all(promises).then(response => {
            console.log("[INFO] start animation!");
            animate();
        });
    
    }
    init();


    return (
        <div>
            <div id="container" style={{display: 'flex',
        justifyContent: 'center',
        alignItems: ' center',}}></div>
            <div id="progressBar" style={{textAlign: 'center'}}> </div>

        </div>
    );
};
   


export default ShowModel_N2M;

// using var to work around a WebGL bug
var canvas = document.getElementById('canvas'); // eslint-disable-line

const pxRatio = Math.max(Math.floor(window.devicePixelRatio) || 1, 2);
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const gl = canvas.getContext('webgl', {antialiasing: false});

// 设置WebGL上下文的背景为透明
gl.clearColor(0.0, 0.0, 0.0, 0.0); // 设置为透明背景

const wind = window.wind = new WindGL(gl);
wind.numParticles = 65536;
window._AMapSecurityConfig = {
    securityJsCode: 'e79fdfeb8f3900bed9104231dbf608e6',
};

// 初始化高德地图
let amap;

function initAmap() {
    // 初始化地图
    amap = new AMap.Map('amap-container', {
        zoom: 4, // 设置地图缩放级别
        center: [116.397428, 39.90923], // 设置地图中心点
        features: ['bg', 'point', 'road'], // 显示背景、标注、道路
        viewMode: '3D', // 是否开启3D视图
        zooms: [3, 18], // 设置缩放级别范围
        dragEnable: true, // 启用拖拽
        doubleClickZoom: true, // 启用双击放大
        keyboardEnable: true, // 启用键盘操作
        scrollWheel: true // 启用滚轮缩放
    });

    const satelliteLayer = new AMap.TileLayer.Satellite();
    satelliteLayer.setMap(amap); // 显示卫星图层

    // 获取缩放按钮元素（确保DOM已加载）
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');

    if (zoomInBtn && zoomOutBtn) {
        // 添加缩放事件监听器
        zoomInBtn.addEventListener('click', () => {
            amap.zoomIn(); // 高德地图放大
        });

        zoomOutBtn.addEventListener('click', () => {
            amap.zoomOut(); // 高德地图缩小
        });
    } else {
        console.error('缩放按钮元素未找到，请检查HTML中是否存在对应ID的元素');
    }

    // 监听地图缩放事件，同步调整风场canvas
    amap.on('zoomchange', () => {
        // 地图缩放时，调整canvas大小以匹配地图
        updateCanvasSize();
    });

    // 监听地图移动事件，同步风场canvas
    amap.on('moveend', () => {
        // 地图移动结束时，调整canvas大小以匹配地图
        updateCanvasSize();
    });

    // 监听地图拖拽事件，同步风场canvas
    amap.on('dragend', () => {
        // 地图拖拽结束时，调整canvas大小以匹配地图
        updateCanvasSize();
    });
}

// 更新canvas大小以匹配地图容器
function updateCanvasSize() {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
        canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);

        if (window.wind) {
            window.wind.resize();
        }
    }
}

// 初始化地图
if (typeof AMap !== 'undefined') {
    initAmap();
} else {
    console.error('高德地图API未加载');
}

// 添加风场canvas的拖拽功能，通过监听canvas上的鼠标事件来控制地图移动
let isDragging = false;
let lastMouseX = null;
let lastMouseY = null;

// 鼠标按下事件
function handleMouseDown(e) {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    canvas.style.cursor = 'grabbing';
}

// 鼠标移动事件
function handleMouseMove(e) {
    if (!isDragging || !amap) return;

    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;

    // 使用高德地图的panBy方法移动地图 - 反向移动以实现正确的拖拽效果
    amap.panBy(deltaX, deltaY);

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
}

// 鼠标释放事件
function handleMouseUp() {
    isDragging = false;
    canvas.style.cursor = 'default';
}

// 绑定鼠标事件到canvas
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mouseup', handleMouseUp);

// 添加滚轮事件监听器，用于缩放
canvas.addEventListener('wheel', function (e) {
    e.preventDefault(); // 阻止默认的滚轮行为

    // 根据滚轮方向进行缩放
    if (e.deltaY < 0) {
        // 向上滚动，放大
        amap.zoomIn();
    } else {
        // 向下滚动，缩小
        amap.zoomOut();
    }
});

// 同时也支持触摸事件（移动端）
function handleTouchStart(e) {
    if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        e.preventDefault();
    }
}

function handleTouchMove(e) {
    if (!isDragging || !amap || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMouseX;
    const deltaY = touch.clientY - lastMouseY;

    // 反向移动以实现正确的拖拽效果
    amap.panBy(deltaX, deltaY);

    lastMouseX = touch.clientX;
    lastMouseY = touch.clientY;

    e.preventDefault();
}

function handleTouchEnd() {
    isDragging = false;
}

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);

// 防止在canvas上进行默认的拖拽行为
canvas.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
});

function frame() {
    if (wind.windData) {
        wind.draw();
    }
    requestAnimationFrame(frame);
}
frame();

// 移除默认的dat.GUI控制面板，使用中文数据面板

const windFiles = {
    0: '2025062701'
};

const meta = {
    'retina resolution': true
};

// 设置retina分辨率
if (pxRatio !== 1) {
    updateRetina();
}

// 初始化风场数据
updateWind(0);

// 不再使用dat.GUI控制面板，所有控制功能都在中文数据面板中

function updateRetina() {
    const ratio = meta['retina resolution'] ? pxRatio : 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    wind.resize();
}
function updateWind(name) {
    getJSON('/data/wind_data/wrf_data/' + windFiles[name] + '.json', function (windData) {
        if (windData) {
            const windImage = new Image();
            windData.image = windImage;
            windImage.src = '/data/wind_data/wrf_data/' + windFiles[name] + '.png';
            windImage.onload = function () {
                wind.setWind(windData);
            };
            windImage.onerror = function () {
                console.error('PNG图像加载失败:', windImage.src);
            };
        } else {
            console.error('风场数据加载失败，无法显示可视化');
        }
    });
}

function updateWindData(dataInfo) {
    // 确保路径以'/'开头以适应绝对路径
    const jsonPath = dataInfo.path.startsWith('/') ? dataInfo.path : '/' + dataInfo.path;
    const pngPath = dataInfo.path.startsWith('/') ? dataInfo.path : '/' + dataInfo.path;

    getJSON(jsonPath + '.json', function (windData) {
        if (windData) {
            const windImage = new Image();
            windData.image = windImage;
            windImage.src = pngPath + '.png';
            windImage.onload = function () {
                wind.setWind(windData);
                console.log('风场数据更新成功:', dataInfo.name);
            };
            windImage.onerror = function () {
                console.error('PNG图像加载失败:', windImage.src);
            };
        } else {
            console.error('风场数据加载失败，无法显示可视化');
        }
    });
}

function getJSON(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('get', url, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(xhr.response);
        } else {
            console.error('加载失败:', url, '状态码:', xhr.status);
            callback(null); // 不抛出异常，而是传递null
        }
    };
    xhr.onerror = function () {
        console.error('网络请求失败:', url);
        callback(null);
    };
    xhr.send();
}

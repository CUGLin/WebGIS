var baseLayerGroups =null;
var selectedCountry = "All";

//创建地图对象
const map = L.map('mapid', {
    center: [30, 114],
    zoom: 4,
    zoomControl: false,
});

//创建比例尺控件
L.control.scale({
    metric : true,
    imperial: false,
    position: 'bottomright'
}).addTo(map);

//创建缩放控件
L.control.zoom({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
    position: 'bottomright' 
}).addTo(map);


//添加图层图底
const TianDiTu_NormalCanvas = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
    key: '21ab8645b7a4e33db43a3766d94eef14',
    attribution: '地图数据 &copy; <a href="https://www.tianditu.gov.cn/">天地图</a>,<a href="http://datav.aliyun.com/tools/atlas/">DATAV.GeoAtlas</a> ',
    maxZoom: 18,
    minZoom: 1,
})

const TianDiTu_NormalAnnotion = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
    key: '21ab8645b7a4e33db43a3766d94eef14',
    attribution: '地图数据 &copy; <a href="https://www.tianditu.gov.cn/">天地图</a>,<a href="http://datav.aliyun.com/tools/atlas/">DATAV.GeoAtlas</a> ',
    maxZoom: 18,
    minZoom: 1,
})

const TianDiTu_SatelliteCanvas = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
    key: '21ab8645b7a4e33db43a3766d94eef14',
    attribution: '地图数据 &copy; <a href="https://www.tianditu.gov.cn/">天地图</a>,<a href="http://datav.aliyun.com/tools/atlas/">DATAV.GeoAtlas</a> ',
    maxZoom: 18,
    minZoom: 1,
})

const TianDiTu_SatelliteAnnotion = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
    key: '21ab8645b7a4e33db43a3766d94eef14',
    attribution: '地图数据 &copy; <a href="https://www.tianditu.gov.cn/">天地图</a>,<a href="http://datav.aliyun.com/tools/atlas/">DATAV.GeoAtlas</a> ',
    maxZoom: 18,
    minZoom: 1,
})

const Google_NormalCanvas = L.tileLayer.chinaProvider('Google.Normal.Map', {
    attribution: 'Map data &copy; 2019 Google',
    maxZoom: 18,
    minZoom: 1,
})

const Google_StaelliteCanvas = L.tileLayer.chinaProvider('Google.Satellite.Map', {
    attribution: 'Map data &copy; 2019 Google',
    maxZoom: 18,
    minZoom: 1,
})

const Google_StaelliteAnnotion = L.tileLayer.chinaProvider('Google.Satellite.Annotion', {
    attribution: 'Map data &copy; 2019 Google',
    maxZoom: 18,
    minZoom: 1,
})

const NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
    attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
    bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
    minZoom: 1,
    maxZoom: 8,
    format: 'jpg',
    time: '',
    tilematrixset: 'GoogleMapsCompatible_Level'
}).addTo(map);

const TianDiTu_Normal = L.layerGroup([TianDiTu_NormalCanvas, TianDiTu_NormalAnnotion]);
const TianDiTu_Satellite = L.layerGroup([TianDiTu_SatelliteCanvas, TianDiTu_SatelliteAnnotion]);
const Google_Normal = L.layerGroup([Google_NormalCanvas]);
const Google_Staellite = L.layerGroup([Google_StaelliteCanvas, Google_StaelliteAnnotion]);

baseLayerGroups = {
    "NASAGIBS_ViirsEarthAtNight2012":NASAGIBS_ViirsEarthAtNight2012,
    "TianDiTu_Normal":TianDiTu_Normal,
    "TianDiTu_Satellite":TianDiTu_Satellite,
    "Google_Normal":Google_Normal,
    "Google_Staellite":Google_Staellite,
}


$("#selector3").change(function(event){
    // 获取所选option的value值
    var selectedBaseLayer = event.target.value;
    // console.log(selectedBaseLayer);
    for (key in baseLayerGroups){
        map.removeLayer(baseLayerGroups[key]);
    }
    baseLayerGroups[selectedBaseLayer].addTo(map);
})

/*
*显示全国贫困县的函数
*/ 
function showAllData() {

function getColor(d) {
    return d > 66 ? '#a63603' : // 一级：人口 > 66
        d > 37 ? '#e6550d' : // 二级：人口在37到66之间
        d > 20 ? '#fd8d3c' : // 三级：人口在20到37之间
        d > 10 ? '#fdbe85' : // 四级：人口在10到20之间
        d > 0 ? '#feedde' : // 五级：人口在0到10之间
        '#ffffff'; // 六级：人口为0
}

function style_all(feature) {   //分级统计图样式设置
    return {
        fillColor: getColor(province[feature.properties.name]),
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.8
    };
};

var geojsonLayer = new L.GeoJSON.AJAX("Data/中华人民共和国.json",{
    style:style_all,    //设置样式
    onEachFeature: function (feature, layer) {
        var latlng=layer.getBounds().getCenter();  //获取几何中心，作为注记锚点
        L.marker(latlng, {
            icon: L.divIcon({
                className: 'polygonLabel',    //设置类名，用于样式控制
                html: feature.properties.name,  //注记内容
                iconSize: [100, 20],   //注记放置空间
            }),
            interactive:false,      //忽视鼠标事件
        }).addTo(map);
        layer.on({      //监听鼠标事件
            mouseover: highlightFeature,//鼠标悬停
            mouseout: resetHighlight,   //鼠标移出
            click: zoomToFeature,       //鼠标单击
        });
    }
}).addTo(map);

/*
*高亮显示处理函数
*/
function highlightFeature(e) {  //鼠标悬停事件处理函数
    var layer = e.target;   //获取鼠标悬停目标
    layer.setStyle({
        weight: 3,
        color: 'blue',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();   //IE、Opera、Microsoft Edge浏览器不适用
    };
    info.update(layer.feature.properties);
};

//恢复原始状态
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    info.update();
};

//缩放到选中区域
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
};

//增加标题及各城市人口信息显示控件
var info = L.control();  // 设置位置为左下角
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); //创建一个类名为"info"的div元素
    this.update();
    return this._div;
};
// 更新内容
info.update = function (props) {
    this._div.innerHTML = '<h4>全国各省市国家级贫困县分布</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + province[props.name] + ' 个'
        : '鼠标移动到各个省份即可查看');
};
info.addTo(map);


var legend = L.control({position: 'bottomleft'});  //图例位置
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        divTitle=L.DomUtil.create('div', 'title'),  //图例二字作为标题
        divInfo=L.DomUtil.create('div', 'legend'),
        grades = [-1,1, 10, 20, 37, 66]; //和getColor( )函数分级设色一一对应
    divTitle.innerHTML='<b>图例（贫困县个数）</b>';
    div.appendChild(divTitle);
    //循环人口分级数组，在每个颜色块后面添加一个标注表示对应的人口数量范围
    for (var i = 0; i < grades.length; i++) {
        divInfo.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            (grades[i]+1)+ (grades[i + 1] ? '&ndash;' + grades[i + 1]+ '<br>' : '+');
    }
    div.appendChild(divInfo);
    return div;
};
legend.addTo(map);

// 绘制右侧D3图表的控件
var d3ChartControl = L.control({ position: 'topright' });

d3ChartControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'd3-chart-container');
    div.style.width = '300px';
    div.style.height = '500px';
    div.style.backgroundColor = 'rgba(255,255,255,0.8)'; // 透明背景
    div.style.padding = '0'; // 无内边距
    div.style.overflowY = 'auto';

    var title = L.DomUtil.create('h2', 'title', div); // 标题居中
    title.innerHTML = '各省贫困县数量分布';
    title.style.textAlign = 'center'; // 标题文本居中
    title.style.margin = '10px 0'; // 标题与图表之间的距离

    var svg = d3.select(div)
        .append("svg")
        .attr("width", 300)
        .attr("height", 440)

    drawChart(svg, province);

    return div;
};
 
d3ChartControl.addTo(map);

function drawChart(svg, provinceData) {
    const data = Object.entries(provinceData).map(([province, count]) => ({ province, count }));

    const margin = { top: 20, right: 5, bottom: 30, left: 100 }, // 调整边距
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count) * 1.1])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.sort((a, b) => b.count - a.count).map(d => d.province))
        .range([0, height])
        .padding(0.1);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(x).ticks(5);
    const yAxis = d3.axisLeft(y);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("dx", "0em")
        .attr("dy", "0.5em")
        .style("fill", "#000")
        .attr("transform", "translate(0,10)"); // 移动文字位置以避免重叠

    g.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .attr("dx", "-0.5em")
        .attr("dy", "0.2em")
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .style("fill", "#000");

    const bars = g.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar");

    bars.append("rect")
        .attr("y", d => y(d.province))
        .attr("height", y.bandwidth() * 0.78)
        .attr("x", 0)
        .attr("width", d => x(0))
        .style("fill", "#fd8d3c")
        .transition()
        .duration(1000)
        .attr("width", d => x(d.count))
        .attr("rx", 4);

    bars.append("text")
        .attr("x", d => x(d.count) + 5)
        .attr("y", d => y(d.province) + y.bandwidth() / 2 + 5)
        .text(d => d.count)
        .style("font-size", "12px")
        .style("fill", "#000");
}
}

/*
*显示安徽省贫困县的函数
*/ 
function showAnhuiData() {

    map.setView([31.86,117.28] , 7);

    function getColor(d) {
        return d > 4 ? '#a63603' : // 一级：县个数 > 5
            d > 3 ? '#e6550d' : // 二级：县个数在4
            d > 0 ? '#fd8d3c' : // 三级：县个数1在3到之间
            '#ffffff'; // 六级：县个数为0
    }
    
    function style_all(feature) {   //分级统计图样式设置
        return {
            fillColor: getColor(anhui[feature.properties.name]),
            weight: 1,
            opacity: 1,
            color: 'black',
            dashArray: '3',
            fillOpacity: 0.8
        };
    };
    
    
    var geojsonLayer = new L.GeoJSON.AJAX("Data/安徽省.json",{
        style:style_all,    //设置样式
        onEachFeature: function (feature, layer) {
            var latlng=layer.getBounds().getCenter();  //获取几何中心，作为注记锚点
            L.marker(latlng, {
                icon: L.divIcon({
                    className: 'polygonLabel',    //设置类名，用于样式控制
                    html: feature.properties.name,  //注记内容
                    iconSize: [100, 20],   //注记放置空间
                }),
                interactive:false,      //忽视鼠标事件
            }).addTo(map);
            layer.on({      //监听鼠标事件
                mouseover: highlightFeature,//鼠标悬停
                mouseout: resetHighlight,   //鼠标移出
                click: zoomToFeature,       //鼠标单击
            });
        }
    }).addTo(map);
    
    /*
    *高亮显示处理函数
    */
    function highlightFeature(e) {  //鼠标悬停事件处理函数
        var layer = e.target;   //获取鼠标悬停目标
        layer.setStyle({
            weight: 3,
            color: 'blue',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();   //IE、Opera、Microsoft Edge浏览器不适用
        };
        info.update(layer.feature.properties);
    };
    
    //恢复原始状态
    function resetHighlight(e) {
        geojsonLayer.resetStyle(e.target);
        info.update();
    }
    
    //缩放到选中区域
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }
    
    //增加标题及各城市人口信息显示控件
    var info = L.control();  // 设置位置为左下角
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); //创建一个类名为"info"的div元素
        this.update();
        return this._div;
    };
    // 更新内容
    info.update = function (props) {
        this._div.innerHTML = '<h4>安徽省各市国家级贫困县分布</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + anhui[props.name] + ' 个'
            : '鼠标移动到各个城市即可查看');
    };
    info.addTo(map);
    
    
    var legend = L.control({position: 'bottomleft'});  //图例位置
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            divTitle=L.DomUtil.create('div', 'title'),  //图例二字作为标题
            divInfo=L.DomUtil.create('div', 'legend'),
            grades = [-1,1,3,4]; //和getColor( )函数分级设色一一对应
        divTitle.innerHTML='<b>图例（贫困县个数）</b>';
        div.appendChild(divTitle);
        //循环人口分级数组，在每个颜色块后面添加一个标注表示对应的人口数量范围
        for (var i = 0; i < grades.length; i++) {
            divInfo.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                (grades[i]+1)+ (grades[i + 1] ? '&ndash;' + grades[i + 1]+ '<br>' : '+');
        }
        div.appendChild(divInfo);
        return div;
    };
    legend.addTo(map);

// 绘制右侧D3图表的控件
var d3ChartControl = L.control({ position: 'topright' });

d3ChartControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'd3-chart-container');
    div.style.width = '300px';
    div.style.height = '500px';
    div.style.backgroundColor = 'rgba(255,255,255,0.8)'; // 透明背景
    div.style.padding = '0'; // 无内边距
    div.style.overflowY = 'auto';

    var title = L.DomUtil.create('h2', 'title', div); // 标题居中
    title.innerHTML = '安徽省各地级市数量分布';
    title.style.textAlign = 'center'; // 标题文本居中
    title.style.margin = '10px 0'; // 标题与图表之间的距离

    var svg = d3.select(div)
        .append("svg")
        .attr("width", 300)
        .attr("height", 440);

    drawChart(svg, anhui);

    return div;
};

d3ChartControl.addTo(map);

function drawChart(svg, anhuiData) {
    const data = Object.entries(anhuiData).map(([province, count]) => ({ province, count }));

    const margin = { top: 20, right: 5, bottom: 30, left: 100 }, // 调整边距
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count) * 1.1])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.sort((a, b) => b.count - a.count).map(d => d.province))
        .range([0, height])
        .padding(0.1);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(x).ticks(5);
    const yAxis = d3.axisLeft(y);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("dx", "0em")
        .attr("dy", "0.5em")
        .style("fill", "#000")
        .attr("transform", "translate(0,10)"); // 移动文字位置以避免重叠

    g.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .attr("dx", "-0.5em")
        .attr("dy", "0.2em")
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .style("fill", "#000");

    const bars = g.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar");

    bars.append("rect")
        .attr("y", d => y(d.province))
        .attr("height", y.bandwidth() * 0.78)
        .attr("x", 0)
        .attr("width", d => x(0))
        .style("fill", "#fd8d3c")
        .transition()
        .duration(1000)
        .attr("width", d => x(d.count))
        .attr("rx", 4);

    bars.append("text")
        .attr("x", d => x(d.count) + 5)
        .attr("y", d => y(d.province) + y.bandwidth() / 2 + 5)
        .text(d => d.count)
        .style("font-size", "12px")
        .style("fill", "#000");
}

}

// 为第一个添加选项
for (var key in province) {
    const optionElement = document.createElement("option");
    optionElement.textContent = key;
    optionElement.value = province[key];
    $("#selector1").append(optionElement);
}

// showAllData();
$("#selector1").change(function (event) {
    // 获取所选 option 的 value 值
    selectedCountry = event.target.value;

    // 判断是否选择了 "全国"
    if (selectedCountry === "全国") {
        // 显示所有数据
        showAllData();

    }
    if(selectedCountry === "安徽省"){
        showAnhuiData();
    }



});




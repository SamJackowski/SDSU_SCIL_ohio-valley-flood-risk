//==================================================================================================
// SCIL Data Viewer
//
// This map showcases Poverty, Median Income, Flood Risk Data, and other Socioeconomic Data
// For the 6 main states in the Ohio River Valley Region: Indiana, Illinois, Ohio, Pennsylvania,
// Kentucky, and West Virginia
// Risk data sourced from the FEMA NRI Table (https://www.fema.gov/about/openfema/data-sets/national-risk-index-data)
// Socioeconomic data sourced from US Census Bureau (Tables S1701 and B19013)
// By Sam Jackowski
//==================================================================================================

// Datasets: Name, Column Name, Scale, Colors, Unit of measure

var DATASETS = [
  {
    label:  'Inland Flood Risk Score',
    column: 'IFLD_RISKS',
    scale:  [0, 20, 40, 60, 80],
    ramp:   ['#eff3ff','#bdd7e7','#6baed6','#2171b5','#084594'],
    unit:   'score (0–100)',
  },
  {
    label:  'Inland Flood Expected Annual Loss',
    column: 'IFLD_EALS',
    scale:  [0, 10, 25, 50, 75],
    ramp:   ['#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'],
    unit:   'score (0–100)',
  },
  {
    label:  'Overall Risk Score',
    column: 'RISK_SCORE',
    scale:  [0, 20, 40, 60, 80],
    ramp:   ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'],
    unit:   'score (0–100)',
  },
  {
    label:  'Social Vulnerability Score',
    column: 'SOVI_SCORE',
    scale:  [0, 20, 40, 60, 80],
    ramp:   ['#f7f7f7','#cccccc','#969696','#636363','#252525'],
    unit:   'score (0–100)',
  },
  {
    label:  'Community Resilience Score',
    column: 'RESL_SCORE',
    scale:  [0, 20, 40, 60, 80],
    ramp:   ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc'],
    unit:   'score (0–100, higher = more resilient)',
  },
  {
    label:  'Median Household Income ($)',
    column: 'MEDIAN_INCOME',
    scale:  [0, 40000, 55000, 70000, 90000],
    ramp:   ['#d73027','#fc8d59','#fee090','#91bfdb','#4575b4'],
    unit:   '$ median household income',
  },
  {
    label:  'Poverty Rate (%)',
    column: 'POVERTY_RATE',
    scale:  [0, 10, 15, 20, 30],
    ramp:   ['#ffffcc','#c7e9b4','#7fcdbb','#1d91c0','#0c2c84'],
    unit:   '% below poverty line',
  },
  {
    label:  'Median Home Value ($)',
    column: 'MEDIAN_HOME_VALUE',
    scale:  [0, 100000, 175000, 250000, 350000],
    ramp:   ['#d73027','#fc8d59','#fee090','#91bfdb','#4575b4'],
    unit:   '$ median home value',
  },
];

// Global Variables
var activeDataset = DATASETS[0];
var mapInstance, geojsonLayer, infoControl, legendControl;
var cursorTip;
var cityLabelsLayer;
var cityLabelsVisible = true;

// Major cities in Ohio Valley Region
var CITIES = [
  { name: 'Chicago', lat: 41.8781, lng: -87.6298, size: 'large' },
  { name: 'Indianapolis', lat: 39.7684, lng: -86.1581, size: 'large' },
  { name: 'Columbus', lat: 39.9612, lng: -82.9988, size: 'large' },
  { name: 'Cincinnati', lat: 39.1031, lng: -84.5120, size: 'large' },
  { name: 'Louisville', lat: 38.2527, lng: -85.7585, size: 'large' },
  { name: 'Pittsburgh', lat: 40.4406, lng: -79.9959, size: 'large' },
  { name: 'Cleveland', lat: 41.4993, lng: -81.6944, size: 'large' },
  { name: 'Toledo', lat: 41.6528, lng: -83.5379, size: 'medium' },
  { name: 'Akron', lat: 41.0814, lng: -81.5190, size: 'medium' },
  { name: 'Dayton', lat: 39.7589, lng: -84.1916, size: 'medium' },
  { name: 'Lexington', lat: 38.0406, lng: -84.5037, size: 'medium' },
  { name: 'Charleston', lat: 38.3498, lng: -81.6326, size: 'medium' },
  { name: 'Huntington', lat: 38.4192, lng: -82.4452, size: 'medium' },
  { name: 'Evansville', lat: 37.9716, lng: -87.5711, size: 'medium' },
  { name: 'Fort Wayne', lat: 41.0793, lng: -85.1394, size: 'medium' },
  { name: 'South Bend', lat: 41.6764, lng: -86.2520, size: 'medium' },
  { name: 'Erie', lat: 42.1292, lng: -80.0851, size: 'medium' },
  { name: 'Youngstown', lat: 41.0998, lng: -80.6495, size: 'medium' },
  { name: 'Canton', lat: 40.7989, lng: -81.3784, size: 'medium' },
  { name: 'Bloomington', lat: 39.1653, lng: -86.5264, size: 'medium' },
  { name: 'Lafayette', lat: 40.4167, lng: -86.8753, size: 'medium' },
  { name: 'Muncie', lat: 40.1934, lng: -85.3864, size: 'medium' },
  { name: 'Bowling Green', lat: 36.9685, lng: -86.4808, size: 'medium' },
  { name: 'Wheeling', lat: 40.0640, lng: -80.7209, size: 'small' },
  { name: 'Parkersburg', lat: 39.2667, lng: -81.5615, size: 'small' },
  { name: 'Peoria', lat: 40.6936, lng: -89.5890, size: 'small' },
  { name: 'Owensboro', lat: 37.7742, lng: -87.1117, size: 'small' },
  { name: 'Rockford', lat: 42.2711, lng: -89.0940, size: 'small' },
  { name: 'Aurora', lat: 41.7606, lng: -88.3201, size: 'small' },
  { name: 'Joliet', lat: 41.5250, lng: -88.0817, size: 'small' },
  { name: 'Lima', lat: 40.7426, lng: -84.1052, size: 'small' },
  { name: 'Morgantown', lat: 39.6295, lng: -79.9559, size: 'small' },
  { name: 'Carbondale', lat: 37.7273, lng: -89.2168, size: 'small' }
];


document.addEventListener('DOMContentLoaded', function () {
  // Cursor tooltip reference
  cursorTip = document.getElementById('cursor-tooltip');

  // Move tooltip with mouse
  document.getElementById('mapid').addEventListener('mousemove', function(e) {
    cursorTip.style.left = (e.clientX + 14) + 'px';
    cursorTip.style.top  = (e.clientY - 10) + 'px';
  }); 
  
  // Create map centered on Ohio Valley
// after map creation
mapInstance = L.map('mapid').setView([38.5, -83.5], 6);

mapInstance.createPane('tractsPane');
mapInstance.createPane('riverPane');
mapInstance.createPane('cityPane');

mapInstance.getPane('tractsPane').style.zIndex = 400;
mapInstance.getPane('riverPane').style.zIndex = 650;
mapInstance.getPane('cityPane').style.zIndex = 700;
  

  // Add basemap
  L.tileLayer('https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
  }).addTo(mapInstance);

  // Info box
  infoControl = L.control({ position: 'topright' });
  infoControl.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  infoControl.update = function (props) {
    var val  = props ? props[activeDataset.column] : null;
    var name = props ? (props.NAME || props.COUNTY || props.GEOID || '?') : null;
    var state = props ? (props.STATEABBRV || '') : '';

    this._div.innerHTML =
      '<h4>' + activeDataset.label + '</h4>' +
      (props
        ? '<b>' + name + (state ? ', ' + state : '') + '</b><br>' +
          (val != null && val !== '' && val !== -9999
            ? Number(val).toLocaleString()
            : 'No data') +
          '<br><span class="unit">' + activeDataset.unit + '</span>'
        : 'Hover over a tract');
  };
  infoControl.addTo(mapInstance);

  // Legend
  legendControl = L.control({ position: 'bottomright' });
  legendControl.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info legend');
    updateLegend(this._div);
    return this._div;
  };
  legendControl.addTo(mapInstance);

  // Dropdown
  var select = document.getElementById('categorySelect');

  DATASETS.forEach(function (ds, i) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.textContent = ds.label;
    select.appendChild(opt);
  });

  select.addEventListener('change', function () {
    activeDataset = DATASETS[parseInt(this.value)];
    refreshMap();
  });

  // Load GeoJSON
  fetch('OhioValleyTractAndDataSImplified.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      geojsonLayer = L.geoJson(data, {
        pane: 'tractsPane', // <-- ADDED
        style: styleFeature,
        onEachFeature: onEachFeature,
      }).addTo(mapInstance);
    })
    .catch(function (err) {
      console.error('Failed to load GeoJSON:', err);
    });

  // Load Ohio River
  var riverLayer;
  fetch('ohio_river.geojson')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      riverLayer = L.geoJson(data, {
        pane: 'riverPane', // <-- ADDED
        style: {
          color: '#00c3ff',
          weight: 5,
          opacity: 1,
        }
      }).addTo(mapInstance);
    });

  // Add city labels
  addCityLabels();

  // City toggle button
  document.getElementById('cityToggle').addEventListener('click', function() {
    cityLabelsVisible = !cityLabelsVisible;
    this.textContent = cityLabelsVisible ? '🏙️ HIDE CITIES' : '🏙️ SHOW CITIES';
    this.classList.toggle('inactive');
    updateCityLabelsVisibility();
  });

});

// Style
function getColor(value) {
  var breaks = activeDataset.scale;
  var ramp   = activeDataset.ramp;
  if (value == null || value === '' || isNaN(Number(value)) || Number(value) < 0) {
    return '#2a2a2a';
  }
  var v = Number(value);
  for (var i = breaks.length - 1; i >= 0; i--) {
    if (v > breaks[i]) return ramp[i];
  }
  return ramp[0];
}

function styleFeature(feature) {
  return {
    fillColor:   getColor(feature.properties[activeDataset.column]),
    weight:      0.4,
    opacity:     1,
    color:       '#0a0a14',
    fillOpacity: 0.56,
  };
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout:  resetHighlight,
  });
}

// Map Interaction

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({ weight: 2, color: '#00d2ff', fillOpacity: 0.95 });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) layer.bringToFront();
  infoControl.update(layer.feature.properties);

  // Show value next to cursor
  var val = layer.feature.properties[activeDataset.column];
  if (cursorTip && val != null && val !== '' && Number(val) >= 0) {
    cursorTip.textContent = Number(val).toLocaleString();
    cursorTip.style.display = 'block';
  }
}

function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
  infoControl.update();
  if (cursorTip) cursorTip.style.display = 'none';
}

// Update Map
function refreshMap() {
  if (!geojsonLayer) return;
  if (cursorTip) cursorTip.style.display = 'none'; 
  geojsonLayer.eachLayer(function (layer) {
    geojsonLayer.resetStyle(layer);
  });
  infoControl.update();
  updateLegend(legendControl._div);
}

function updateLegend(div) {
  var breaks = activeDataset.scale;
  var ramp   = activeDataset.ramp;
  var html   = '<strong>' + activeDataset.label + '</strong><br>' +
               '<small>' + activeDataset.unit + '</small><br><br>';
  for (var i = breaks.length - 1; i >= 0; i--) {
    var from = breaks[i];
    var to   = breaks[i + 1];
    html +=
      '<i style="background:' + ramp[i] + '"></i> ' +
      from.toLocaleString() + (to != null ? '&ndash;' + to.toLocaleString() : '+') + '<br>';
  }
  div.innerHTML = html;
}

// City Labels Functions
function addCityLabels() {
  cityLabelsLayer = L.layerGroup();
  
  CITIES.forEach(function(city) {
    // Create custom icon based on city size
    var iconSize = city.size === 'large' ? [8, 8] : city.size === 'medium' ? [6, 6] : [4, 4];
    var fontSize = city.size === 'large' ? 14 : city.size === 'medium' ? 12 : 10;
    
    var cityIcon = L.divIcon({
      className: 'city-label',
      html: '<div class="city-marker city-' + city.size + '"></div>' +
            '<div class="city-name" style="font-size: ' + fontSize + 'px;">' + city.name + '</div>',
      iconSize: [100, 40],
      iconAnchor: [50, 0]
    });
    
    var marker = L.marker([city.lat, city.lng], {
      icon: cityIcon,
      interactive: false,
      pane: 'cityPane'
    });
    
    marker.addTo(cityLabelsLayer);
  });
  
  cityLabelsLayer.addTo(mapInstance);
}

function updateCityLabelsVisibility() {
  if (cityLabelsVisible) {
    cityLabelsLayer.addTo(mapInstance);
  } else {
    mapInstance.removeLayer(cityLabelsLayer);
  }
}

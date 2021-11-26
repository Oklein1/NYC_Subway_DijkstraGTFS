const mapContainer = d3.select("#map");

// determine width and height
const width = mapContainer.node().offsetWidth,
  height = mapContainer.node().offsetHeight,
  padding = 20;
console.log(height, width)

// create and append a new SVG element to the map div
svg = mapContainer
  .append("svg")
  .attr("width", width - padding)
  .attr("height", height - padding)
  .style("top", 40) // 40 pixels from the top
  .style("left", 30); // 30 pixels from the left

// request our data files and reference with variables

const stationGeoJson = d3.json("./data/stops.geojson");
const routeGeoJson = d3.json("./data/routes.geojson");
const borough = d3.json("./data/boroughs.geojson");

Promise.all([stationGeoJson, routeGeoJson, borough]).then(data => {
  const [station, route, borough] = data;
  drawMap(station, route, borough);

  //inputs

  const startInput = document.getElementById("start-input");
  const endInput = document.getElementById("end-input");
  dropDownMenuStops(station.features, startInput);
  dropDownMenuStops(station.features, endInput);

  function dropDownMenuStops(stops, input) {
    const stopOptions = stops
      .map(stop => {
        const { stop_id, stop_name, trains } = stop.properties;

        return {
          id: stop_id,
          name: `${stop_name}; ${trains}`
        };
      })
      .sort();

    stopOptions.forEach(stop => {
      const optionObj = document.createElement("option");
      optionObj.textContent = stop.name;
      optionObj.value = stop.id;
      input.appendChild(optionObj);
    });
  }

  let prevStartId = null;
  let prevEndId = null;

  startInput.addEventListener("change", e => {
    const stop_id = e.target.value;
    if (prevStartId) d3.select(`#stop-${prevStartId}`).style("fill", "none");
    prevStartId = stop_id;

    const stopPoint = d3.select(`#stop-${stop_id}`);

    stopPoint.style("fill", "yellow");
  });

  endInput.addEventListener("change", e => {
    const stop_id = e.target.value;
    if (prevStartId) d3.select(`#stop-${prevEndId}`).style("fill", "none");
    prevEndId = stop_id;

    const stopPoint = d3.select(`#stop-${stop_id}`);

    stopPoint.style("fill", "red");
  });

  const submitButton = document.getElementById("submit-input");
  const errorText = document.getElementById("error");

  submitButton.addEventListener("click", () => {
    errorText.innerText = "";

    if (prevStartId === prevEndId) {
      errorText.innerText = "Same Station";
      return;
    }

    //find LngLat of start and end
    const startLngLat = station.features.find(stop => {
      const { stop_id } = stop.properties;
      return stop_id === prevStartId;
    }).geometry.coordinates;

    const endLngLat = station.features.find(stop => {
      const { stop_id } = stop.properties;
      return stop_id === prevEndId;
    }).geometry.coordinates;

    console.log(startLngLat, endLngLat);
    
    
  
    
  });
});

// ----------// ----------// ----------//

//     FUNCTIONS

function drawMap(station, route, borough) {
  //const colors = getColorAndGroup(route, 'c')
  //const groups = getColorAndGroup(route, 'g')

  // projection
  const projection = d3
    .geoConicConformal()
    .parallels([40 + 40 / 60, 41 + 2 / 60])
    .rotate([74, 0])
    .fitSize([width, height], station);

  // path generator
  const path = d3.geoPath().projection(projection);

  function handleZoom(e) {
    console.log("zoom");
    svg.selectAll("path").attr("transform", e.transform);
    svg.selectAll("circle")
      .attr("r", 5 / e.transform.k)
      .attr("transform", e.transform);
    // stations.attr("r", 1);
    routes.style("stroke-width", 2 / e.transform.k);
  }

  let zoom = d3.zoom().on("zoom", handleZoom);
  svg.call(zoom);

  const boroughs = svg
    .append("g") // append group of elem to svg
    .selectAll("path")
    .data(borough.features)
    .join("path") // not generating path elements
    .attr("d", path)
    .classed("boroughs", true); // give each path elem a class name

  const routes = svg
    .append("g") // append group of elem to svg
    .selectAll("path")
    .data(route.features)
    .join("path") // not generating path elements
    .attr("d", path)
    .classed("route", true) // give each path elem a class name
    .style("stroke", function(d) {
      return d.properties.color;
    })
    .style("stroke-width", 2);

  //console.log(routes)

  const stations = svg
    .append("g")
    .selectAll("path")
    .data(station.features)
    .join('circle')
    .attr('cx', d => {
        p = d.properties
        d.position = projection([p.stop_lon, p.stop_lat]);
        return d.position[0];
      })
    .attr('cy', d => {
        return d.position[1];
      })
    .attr('r', 5)
    // .join("path")
    // .attr("d", path)
    // .attr("r", 50)
    .attr("id", d => `stop-${d.properties.stop_id}`)
    .attr("class", "station");

  // visual affordance, dynamic tooltip
  const tooltip = d3
    .select(".container-fluid")
    .append("div")
    .attr(
      "class",
      "my-tooltip bg-warning text-white py-1 px-2 rounded position-absolute invisible"
    );

  mapContainer.on("mouseover", event => {
    //console.log(event)
    tooltip
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 30 + "px");
  });

  // applies event listeners to our polygons for user interaction
  stations
    .on("mouseover", (event, d) => {
      // when mousing over an element
      d3.select(event.currentTarget)
        .classed("hover", true)
        .raise(); // select it, add a class name, and bring to front
      tooltip.classed("invisible", false).html(
        //console.log(d.properties)
        `<center><strong>${d.properties.stop_name}</strong>
            <br>
            ${d.properties.trains} trains available</center>`
      ); // make tooltip visible and update info
    })
    .on("mouseout", (event, d) => {
      // when mousing out of an element
      d3.select(event.currentTarget).classed("hover", false); // remove the class from the polygon
      tooltip.classed("invisible", true); // hide the element
    });
}

function getColorAndGroup(routes, color_or_group) {
  // color === 'c'
  // group === 'g'
  colors = [];
  groups = [];
  let feat = routes.features;

  feat.map(item => {
    let prop = item.properties;
    let color = prop.color;
    let group = prop.group;

    if (!colors.includes(color)) {
      colors.push(color);
    } else if (!groups.includes(group)) {
      groups.push(group);
    }
  });

  if (color_or_group === "c") {
    return colors;
  } else if (color_or_group === "g") {
    return groups;
  } else {
    console.log('use either "c" for color or "g" for group');
  }
}

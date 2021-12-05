// const to_from_stops_promise = d3.csv("./data/to_from_stop_ids.csv");
// const stop_ids_promise = d3.csv("./data/stop_ids.csv");



// Promise.all([stop_ids_promise, to_from_stops_promise]).then(data => {
//     const [stop_id, to_from_stops] = data;
//     //console.log(to_from_stops)

//     const network = to_from_stops.reduce((network, item) => {
//         network[item['fstop']] = {[item['tstop']]: 1}

//         return network
//     }, {})
//     //console.log(network)

//     const startNode = '101S'
//     const endNode = '139S'

//     const testProblem = {...network, start: {[startNode]: 0}, finish : {}}
//     testProblem[endNode]['finish'] = 0

//     //console.log(dijkstra(testProblem));
//     //console.log(stop_id)
//     getStopInfoFromPath(dijkstra(testProblem).path, stop_id)
// })

// FUNCTIONS
function getStopInfoFromPath(nodes, stops) {
    const filteredForStops = stops.filter(row => nodes.includes(row.fstop_id))
    //console.log(filteredForStops)
    const sortedStops = filteredForStops.sort((a,b) => nodes.indexOf(a.fstop_id) - nodes.indexOf(b.fstop_id))
    
    return sortedStops
}



// example
const problem = {
    start: {
        A: 5,
        B: 2
    },
    A: {
        C: 4,
        D: 2
    },
    B: {
        A: 8,
        D: 7
    },
    C: {
        D: 6,
        finish: 3
    },
    D: {
        finish: 1
    },
    finish: {}
};

const lowestCostNode = (costs, processed) => {
    return Object.keys(costs).reduce((lowest, node) => {
        if (lowest === null || costs[node] < costs[lowest]) {
            if (!processed.includes(node)) {
                lowest = node;
            }
        }
        return lowest;
    }, null);
};

// function that returns the minimum cost and path to reach Finish
const dijkstra = (graph) => {

    // track lowest cost to reach each node
    const costs = Object.assign({
        finish: Infinity
    }, graph.start);

    // track paths
    const parents = {
        finish: null
    };
    for (let child in graph.start) {
        parents[child] = 'start';
    }

    // track nodes that have already been processed
    const processed = [];

    let node = lowestCostNode(costs, processed);

    while (node) {
        let cost = costs[node];
        let children = graph[node];
        for (let n in children) {
            let newCost = cost + children[n];
            if (!costs[n]) {
                costs[n] = newCost;
                parents[n] = node;
            }
            if (costs[n] > newCost) {
                costs[n] = newCost;
                parents[n] = node;
            }
        }
        processed.push(node);
        node = lowestCostNode(costs, processed);
    }

    let optimalPath = ['finish'];
    let parent = parents.finish;
    while (parent) {
        optimalPath.push(parent);
        parent = parents[parent];
    }
    optimalPath.reverse();

    const results = {
        distance: costs.finish,
        path: optimalPath
    };

    return results;
};

//console.log(dijkstra(problem));
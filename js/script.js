import helpers from './helper.js';

// let scaleColor = d3.scaleOrdinal() 
//   .domain([1,2,3,4,5])
//   .range(["#845EC2",  
//   "#D65DB1",  
//   "#FF6F91", 
//   "#FF9671" ,
//   "#FFC75F" 
// ]);

//Color blind friendly
let scaleColor = d3.scaleOrdinal() 
  .domain([5,4,3,2,1])
  .range(["#648FFF",  
  "#785EF0",  
  "#DC267F", 
  "#FE6100" ,
  "#FFB000" 
]);

// import * as helper from './helper.js';     





const globalApplicationState = {
    brushed_data: [],
    brushed: false,
    base: null,
    stimulated: null,
    base_runs: [],
    base_treatments: [],
    stim_runs: [],
    stim_treatments: [],
    motifs: [],
    selected_comparison: "none",
    selected_motif: "none",
    scaleColor: scaleColor,
    min_RNA: 2,
    min_DNA: 2
  };



let all_data = d3.csv("./data/current_runs.csv")
let sequences = d3.csv("./data/sequences.csv")

console.log("After reading data")
console.log("all_data", all_data)

let tooltip = d3.select("body")
  .attr("id", "tooltip")
  .append("div")
  .style("opacity", 0)
  .attr("id", "tool_tip_div")
  .attr("class", "tooltip")
  .style("position", "absolute")


Promise.all([all_data, sequences]).then( data =>
    {

      // console.log("t2", t)
        console.log("all data", data[0])
        let columns = Object.keys(data[0][0])


        let base_runs = []
        let base_treatments = []
        let stim_runs = []
        let stim_treatments = []
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].startsWith("logFC__")){
            let cur_comp = columns[i]
            console.log("CUR COMP", cur_comp)

            cur_comp = cur_comp.replace("logFC__", "")
            cur_comp = cur_comp.replace(".csv", "")

            let base_treatment = cur_comp.split("_vs_")[0].split("__")[0]
            let base_run = cur_comp.split("_vs_")[0].split("__")[1]

            let stim_treatment = cur_comp.split("_vs_")[1].split("__")[0]
            let stim_run = cur_comp.split("_vs_")[1].split("__")[1]

            base_runs.push(base_run)
            base_treatments.push(base_treatment)
            stim_runs.push(stim_run)
            stim_treatments.push(stim_treatment)

            globalApplicationState.base_runs.push(base_run)
            globalApplicationState.base_treatments.push(base_treatment)
            globalApplicationState.stim_runs.push(stim_run)
            globalApplicationState.stim_treatments.push(stim_treatment)
          }
        }

           
        // console.log("Here I am")
        // console.log(helper.test())

        let volcano = new Volcano(data[0], globalApplicationState, helpers)
        let alpha = new Alpha(data[0], globalApplicationState, volcano, helpers)
        let info = new Info(data[0], data[1], globalApplicationState, volcano, alpha, helpers)

        volcano.set_info(info)
        volcano.set_alpha(alpha)

        alpha.set_info(info)


    });







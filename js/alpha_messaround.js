//A fresh copy


class Alpha{
    constructor(all_data,globalApplicationState,volcano){

        //**********************************************************************************************
        //                                  CONSTANTS FOR CHART SIZE
        //**********************************************************************************************
        this.WIDTH = 500
        this.HEIGHT = 500
        this.MARGIN = 40
        
        //**********************************************************************************************
        //                                  GENERAL SET UP 
        //**********************************************************************************************
        this.globalApplicationState = globalApplicationState
        
        this.all_data = all_data

        this.volcano = volcano
        this.alpha_div = d3.select("#alpha-div") 

        

        let margin = { top: 10, right: 30, bottom: 50, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        this.alphaSvg = this.alpha_div.append("svg")
        .attr('id', 'alpha_svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr('id', 'drawing_g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")



        let x = d3.scaleLinear().domain([0, 15]).range([0, width]);

        d3.select("#drawing_g")
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        this.alphaSvg
        .append("text")
        .attr("id", "base_label")
        .attr("transform","translate(" + width / 2 + " ," + (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Base Alpha");



        let y = d3.scaleLinear().domain([0, 15]).range([height, 0]);
        d3.select("#drawing_g")
        .append("g").call(d3.axisLeft(y));
        //Add y-axis label:
        this.alphaSvg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0 - height / 2)
        .style("text-anchor", "middle")
        .text("Poverty Rate");



        let circles =  d3.select("#drawing_g")
                 .selectAll("circle")
                 .data(this.all_data, function(d){
                                       return d["architecture"];
                                        });

        let bname = "statistic__Serum_Free__run1"
        let sname = "statistic__Dexamethasone__run1"

        circles
            .enter()
            .append("circle")
            .attr("cy", function (d) {
                return y(d[sname]);
            })
            .attr("cx", function (d) {
                return x(d[bname]);
            })
            .attr("r", 2);
        




        //**********************************************************************************************
        //                                 SELECTORS
        //**********************************************************************************************

    
        d3.select("#select-base")
        .selectAll('myOptions')
        .data(["(Select basal treatment)"])
        .enter()
        .append('option')
        .text(function (d) { return d; }) 
        .attr("value", function (d) { return d; }) 
        // Stimulated
        d3.select("#select-stimulated")
        .selectAll('myOptions')
        .data(["(Select stimulated treatment)"])
        .enter()
        .append('option')
        .text(function (d) { return d; }) 
        .attr("value", function (d) { return d; }) 


        //*************************************** 
        // Add all other 
        //***************************************

        //For getting unique values for base a stimulated
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
          
        this.bases = []
        console.log(this.globalApplicationState.base_treatments)
        for (let i = 0; i < this.globalApplicationState.base_treatments.length; i++) {
            let curTreatment = this.globalApplicationState.base_treatments[i] + "\t(" + this.globalApplicationState.base_runs[i] + ")"
            console.log(curTreatment)
            this.bases.push(curTreatment)
        }
        this.bases = this.bases.filter(onlyUnique)

        this.stims = []
        console.log(this.globalApplicationState.stim_treatments)
        for (let i = 0; i < this.globalApplicationState.stim_treatments.length; i++) {
            let curTreatment = this.globalApplicationState.stim_treatments[i] + "\t(" + this.globalApplicationState.stim_runs[i] + ")"
            console.log(curTreatment)
            this.stims.push(curTreatment)
        }
        this.stims = this.stims.filter(onlyUnique)



        // Select Base
        d3.select("#select-base")
            .selectAll('myOptions')
            .data(this.bases)
            .enter()
            .append('option')
            .text(function (d) { return d; }) 
            .attr("value", function (d) { return d; }) 

        // Select Stimulated
        d3.select("#select-stimulated")
            .selectAll('myOptions')
            .data(this.stims)
            .enter()
            .append('option')
            .text(function (d) { return d; }) 
            .attr("value", function (d) { return d; }) 

        
        //*************************************** 
        // Add listeners
        //***************************************

        const that = this

        d3.select("#select-stimulated").on("change", function(d) {
            var selectedOption = d3.select(this).property("value")
            if (selectedOption === "(Select stimulated treatment)"){
                that.globalApplicationState.stimulated = null
            }
            else{
                that.globalApplicationState.stimulated = selectedOption
            }
            that.updateOptions(selectedOption, "stimulated")
            that.drawAlphaScatter()
            that.volcano.drawVolcano()
        })

        d3.select("#select-base").on("change", function(d) {
            
            var selectedOption = d3.select(this).property("value")
            if (selectedOption === "(Select basal treatment)"){
                that.globalApplicationState.base = null
            }
            else{
                that.globalApplicationState.base = selectedOption
            }
            that.updateOptions(selectedOption, "base")
            that.drawAlphaScatter()
            that.volcano.drawVolcano()
        })

        //**********************************************************************************************
        //                                      INITIAL SCATTER
        //**********************************************************************************************

        //*************************************** 
        // Get inititial min and max for scales (Will change upon selection)
        //***************************************

        // this.min =  0
        // this.max =  5

       

        // //TRY1.2
        // this.x_scale = d3.scaleLinear()
        // .domain([this.min, this.max]).nice()
        // .range([this.MARGIN, this.WIDTH - this.MARGIN])
        // // console.log("x scale range", [this.MARGIN_LEFT, this.WIDTH - this.MARGIN_RIGHT])
        // this.y_scale = d3.scaleLinear()
        // .domain([this.min, this.max]).nice()
        // .range([this.HEIGHT - this.MARGIN, this.MARGIN])
        // // .range([this.HEIGHT - this.MARGIN, 0])

        // this.xAxis = g => g
        // .attr("transform", `translate(0,${this.HEIGHT- this.MARGIN })`)
        // .call(d3.axisBottom(this.x_scale))
        // this.yAxis = g => g
        // .attr("transform", `translate(${this.MARGIN },0)`)
        // .call(d3.axisLeft(this.y_scale))


        // console.log("SHould be last x pixel", this.x_scale(5))

        // this.points = this.alphaSvg.append('g')

        // this.x_axis = this.alphaSvg.append('g').call(this.xAxis)
        // this.y_axis = this.alphaSvg.append('g').call(this.yAxis)


       






        // this.alphaSvg.append('g')
        // .attr('id','brush-layer')
        // .call(d3.brush().on("start brush end", brushed))

        // function brushed({selection}){
        //     if(selection){
                
        //         const [[x0, y0], [x1, y1]] = selection;
        //         //WORKING
        //         let brushed_data = that.points.selectAll('circle').filter(d => 
        //             x0 <= that.x_scale(d[that.base_name]) 
        //             && that.x_scale(d[that.base_name]) < x1 
        //             && y0 <= that.y_scale(d[that.stim_name]) 
        //             && that.y_scale(d[that.stim_name]) < y1)
        //         .data()
        //         .map(d => d.architecture)
        //         that.volcano.brushVolcano(brushed_data, true)
        //         that.points.selectAll('circle')
        //         .style('fill', d => {
        //             if ( x0 <= that.x_scale(d[that.base_name]) 
        //             && that.x_scale(d[that.base_name]) < x1 
        //             && y0 <= that.y_scale(d[that.stim_name]) 
        //             && that.y_scale(d[that.stim_name]) < y1){
        //                 return("red")
        //             }
        //             else{
        //                 return('grey')
        //             }
        //         })
              
        //     }
        //     else{
        //         that.volcano.brushVolcano(null, false)

        //         that.points.selectAll('circle')
        //         .style('fill','grey')
        //     }
            
        // }
 
    }

    drawAlphaScatter(){

        if (this.globalApplicationState.base != null && this.globalApplicationState.stimulated != null){

            //Remove everything before drawing again
            this.points
                .selectAll('circle')
                .remove()

            let base_run = this.globalApplicationState.base.split("\t(")[1].replace(")", "")
            let base_treatment = this.globalApplicationState.base.split("\t(")[0]

            let stim_run = this.globalApplicationState.stimulated.split("\t(")[1].replace(")", "")
            let stim_treatment = this.globalApplicationState.stimulated.split("\t(")[0]

            this.stim_name = "statistic__"+stim_treatment+"__"+stim_run
            this.base_name = "statistic__"+base_treatment+"__"+base_run

            this.globalApplicationState.selected_comparison = base_treatment+"__"+base_run+"_vs_"+stim_treatment+"__"+stim_run

            console.log("this.base_name", this.base_name)
            console.log("this.stim_name", this.stim_name)

            
            let max_base =  d3.max(this.all_data.map(d => d[this.base_name]))
            let max_stim =  d3.max(this.all_data.map(d => d[this.stim_name]))

            let max = d3.max([max_base, max_stim])
            console.log("max", max)

            this.x_scale = d3.scaleLinear()
            .domain([this.min, max]).nice()
            .range([this.MARGIN, this.WIDTH - this.MARGIN])

            this.y_scale = d3.scaleLinear()
            .domain([this.min, max]).nice()
            .range([this.HEIGHT - this.MARGIN , this.MARGIN])
           

            this.x_axis.selectAll('g').remove()
            this.y_axis.selectAll('g').remove()

            this.x_axis = this.alphaSvg.append('g').call(this.xAxis)
            this.y_axis = this.alphaSvg.append('g').call(this.yAxis)

            d3.select("#base_label")
            .text("YOOOOOOOO")


            this.points
                .selectAll('circle')
                .data(this.all_data)
                .join('circle')
                // .attr('cx', (d)=> this.x_scale(d[this.base_name]))
                // .attr('cy', (d)=> this.y_scale(d[this.stim_name]))
                .attr("transform", d => `translate(${this.x_scale(d[this.base_name])},${this.y_scale(d[this.stim_name])})`)

                .attr('r', 2)
                .style('fill', 'grey')
                .style('stroke', 'black')
                .style('stroke-width', .2)
                .style('opacity', .5)
        }

        else{
            this.globalApplicationState.selected_comparison = "none"
            this.points
                .selectAll('circle')
                .remove()
        }

    }

    updateOptions(option, selected_column){
        //Also check if option is 'select ...'
        //If it's select filter so all valid options are present
        if (selected_column == "base"){
            console.log("time to filter stimulated options")
        }
        if (selected_column == "stimulated"){
            console.log("time to filter base options")
        }
    }
       
   
}
class Alpha{
    constructor(all_data,globalApplicationState,volcano){

        //**********************************************************************************************
        //                                  CONSTANTS FOR CHART SIZE
        //**********************************************************************************************
        this.WIDTH = 500
        this.HEIGHT = 500
        this.MARGIN = 40
        this.HEADER_AXIS_HEIGHT = 30
        this.MARGIN_BOTTOM = 50
        this.MARGIN_LEFT = 50
        this.MARGIN_RIGHT = 50
        this.MARGIN_TOP = 50
        
        //**********************************************************************************************
        //                                  GENERAL SET UP 
        //**********************************************************************************************
        this.globalApplicationState = globalApplicationState
        
        this.all_data = all_data

        this.volcano = volcano
        this.alpha_div = d3.select("#alpha-div") 

        this.alphaSvg = this.alpha_div.append("svg")
        .attr('id', 'alpha_svg')
        .attr('width', this.WIDTH)
        .attr('height', this.HEIGHT)


        this.vis = this.alphaSvg.append("g").attr("id", "scatter_vis")
        this.x_axis = this.vis.append("g").attr("id", "x_axis")
        this.y_axis = this.vis.append("g").attr("id", "y_axis")
        this.points = this.vis.append("g").attr("id", "points")





        //**********************************************************************************************
        //                                 SELECTORS
        //**********************************************************************************************

        //*************************************** 
        // Add "(select option)"
        //***************************************

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

        this.min =  0
        this.max =  5

        //ORIGINAL
        // this.x_scale = d3.scaleLinear()
        // .domain([this.min, this.max]).nice()
        // .range([this.MARGIN_LEFT, this.WIDTH - this.MARGIN_RIGHT])
        // console.log("x scale range", [this.MARGIN_LEFT, this.WIDTH - this.MARGIN_RIGHT])
        // this.y_scale = d3.scaleLinear()
        // .domain([this.min, this.max]).nice()
        // .range([this.HEIGHT - this.MARGIN_BOTTOM, this.MARGIN_TOP])
        // console.log("y scale range", [this.HEIGHT - this.MARGIN_BOTTOM, this.MARGIN_TOP])
        // this.xAxis = g => g
        // .attr("transform", `translate(0,${this.HEIGHT - this.MARGIN_BOTTOM })`)
        // .call(d3.axisBottom(this.x_scale))
        // this.yAxis = g => g
        // .attr("transform", `translate(${this.MARGIN_LEFT},0)`)
        // .call(d3.axisLeft(this.y_scale))

       


     
        //TRY1.2
        let x_scale = d3.scaleLinear()
        .domain([this.min, this.max]).nice()
        .range([this.MARGIN, this.WIDTH - this.MARGIN])
        // console.log("x scale range", [this.MARGIN_LEFT, this.WIDTH - this.MARGIN_RIGHT])
        let y_scale = d3.scaleLinear()
        .domain([this.min, this.max]).nice()
        .range([this.HEIGHT - this.MARGIN, this.MARGIN])
        // .range([this.HEIGHT - this.MARGIN, 0])

        this.x_axis
        .attr("transform", `translate(0,${this.HEIGHT- this.MARGIN })`)
        .call(d3.axisBottom(x_scale))
        this.y_axis
        .attr("transform", `translate(${this.MARGIN },0)`)
        .call(d3.axisLeft(y_scale))

        //Try 2
        // let scaleX = d3.scaleLinear()
        // .domain([this.min, this.max])
        // .range([0, this.WIDTH - 2*this.MARGIN]);
        // let scaleY = d3.scaleLinear()
        // .domain([this.min, this.max])
        // .range([this.HEIGHT - 40, 0]);

        // let axisX = d3.axisBottom(scaleX);
        // let axisY = d3.axisLeft(scaleY);

        // this.x_axis = this.alphaSvg.append('g')
        // .call(axisX)
        // .attr("transform", `translate(40, ${this.HEIGHT - this.MARGIN - this.MARGIN})`);
    
        // this.y_axis = this.alphaSvg.append('g')
        // .call(axisY)
        // .attr("transform", `translate(40, 0)`);



        // console.log("SHould be last x pixel", this.x_scale(5))
// 
        // this.points = this.alphaSvg.append('g')

        // this.x_axis = this.alphaSvg.append('g').call(this.xAxis)
        // this.y_axis = this.alphaSvg.append('g').call(this.yAxis)

        this.alphaSvg.append('g')
        .attr('id','brush-layer')
        .call(d3.brush().on("start brush end", brushed))

        function brushed({selection}){
            if(selection){
                
                const [[x0, y0], [x1, y1]] = selection;
                //WORKING
                let brushed_data = that.points.selectAll('circle').filter(d => 
                    x0 <= that.x_scale(d[that.base_name]) 
                    && that.x_scale(d[that.base_name]) < x1 
                    && y0 <= that.y_scale(d[that.stim_name]) 
                    && that.y_scale(d[that.stim_name]) < y1)
                .data()
                .map(d => d.architecture)
                that.volcano.brushVolcano(brushed_data, true)
                that.points.selectAll('circle')
                .style('fill', d => {
                    if ( x0 <= that.x_scale(d[that.base_name]) 
                    && that.x_scale(d[that.base_name]) < x1 
                    && y0 <= that.y_scale(d[that.stim_name]) 
                    && that.y_scale(d[that.stim_name]) < y1){
                        return("red")
                    }
                    else{
                        return('grey')
                    }
                })
              
            }
            else{
                that.volcano.brushVolcano(null, false)

                that.points.selectAll('circle')
                .style('fill','grey')
            }
            
        }
 
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
            
            let max_base =  d3.max(this.all_data.map(d => d[this.base_name]))
            let max_stim =  d3.max(this.all_data.map(d => d[this.stim_name]))

            let max = d3.max([max_base, max_stim])
            console.log("max", max)

            // this.x_scale = d3.scaleLinear()
            // .domain([this.min, max]).nice()
            // .range([this.MARGIN_LEFT, this.WIDTH - this.MARGIN_RIGHT])


            // this.y_scale = d3.scaleLinear()
            // .domain([this.min, max]).nice()
            // .range([this.HEIGHT - this.MARGIN_BOTTOM, this.MARGIN_TOP])

            // this.x_scale = d3.scaleLinear()
            // .domain([this.min, max]).nice()
            // .range([this.MARGIN, this.WIDTH - this.MARGIN ])


            // this.y_scale = d3.scaleLinear()
            // .domain([this.min, max]).nice()
            // .range([this.HEIGHT - this.MARGIN , this.MARGIN])


            // this.x_scale
            // .domain([this.min, max]).nice()
            // // .range([this.MARGIN, this.WIDTH - this.MARGIN ])


            // this.y_scale 
            // .domain([this.min, max]).nice()
            // // .range([this.HEIGHT - this.MARGIN , this.MARGIN])
       
            // let pointMark = this.vis.attr("transform", `translate(${this.MARGIN}, ${this.MARGIN})`);



            let x_scale = d3.scaleLinear()
            .domain([this.min, max]).nice()
            .range([this.MARGIN, this.WIDTH - this.MARGIN])
            // console.log("x scale range", [this.MARGIN_LEFT, this.WIDTH - this.MARGIN_RIGHT])
            let y_scale = d3.scaleLinear()
            .domain([this.min, max]).nice()
            .range([this.HEIGHT - this.MARGIN, this.MARGIN + this.MARGIN])
                
                    

            // this.x_axis.selectAll('g').remove()
            // this.y_axis.selectAll('g').remove()

            // this.x_axis = this.alphaSvg.append('g').call(this.xAxis)
            // this.y_axis = this.alphaSvg.append('g').call(this.yAxis)


          


            this.points
                .selectAll('circle')
                .data(this.all_data)
                .enter()
                .append('circle')
                .attr('cx', (d)=> x_scale(d[this.base_name]))
                .attr('cy', (d)=> y_scale(d[this.stim_name]))
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
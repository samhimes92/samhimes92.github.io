class Heat{
    constructor(all_data,globalApplicationState){


        //**********************************************************************************************
        //                                      CONSTANTS 
        //**********************************************************************************************
        this.WIDTH = 1200 
        this.HEIGHT = 500
        this.MARGIN = 50

        //**********************************************************************************************
        //                                  GENERAL SET UP 
        //**********************************************************************************************
        this.globalApplicationState = globalApplicationState
        this.all_data = all_data
        this.heat_div = d3.select("#heat-div") 

        this.heatSvg = this.heat_div.append("svg")
        .attr('id', 'heat_svg')
        .attr('width', this.WIDTH)
        .attr('height', this.HEIGHT)
        // .attr("transform", `translate(10,70)`) //Move below the header div
        .style("background-color", "#98d1f7")



    }
}
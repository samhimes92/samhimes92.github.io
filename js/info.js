class Info{
    constructor(all_data,sequence_data, globalApplicationState,volcano,alpha){

        //**********************************************************************************************
        //                                  CONSTANTS FOR CHART SIZE
        //**********************************************************************************************
        this.WIDTH = 1050
        this.HEIGHT = 250
        this.NUM_DEC = 2
        this.MARGIN_TEXT_LEFT = 25
        this.MARGIN_TEXT_TOP = 50 
        this.MARGIN_BETWEEN_TEXT = 25
        this.TOOL_TIP_TIME_OUT = 500
        this.TOOL_TIP_DELAY = 750
        
        this.globalApplicationState = globalApplicationState
        this.all_data = all_data
        this.sequence_data = sequence_data


        this.alpha = alpha
        this.volcano = volcano
        this.info_div = d3.select("#info-div") 
        this.selected_architecture = "none"

        this.searchBar = document.getElementById("searchBar");
        this.datalist = document.createElement("datalist");
        this.datalist.id = "searchOptions";

        document.getElementById('searchBar').value = '';
        document.getElementById('searchBarBase').value = '';
        document.getElementById('searchBarStim').value = '';


        this.infoSvg = this.info_div.append("svg")
        .attr('id', 'alpha_svg')
        .attr('width', this.WIDTH)
        .attr('height', this.HEIGHT)

        this.infoSvg.append("text")
        .attr("id", "architecture_text")
        .attr("y", this.MARGIN_TEXT_TOP + this.MARGIN_BETWEEN_TEXT * 0)
        .attr("x", this.MARGIN_TEXT_LEFT)
        .text("Architecture: ")

        this.infoSvg.append("text")
        .attr("id", "fc_text")
        .attr("y", this.MARGIN_TEXT_TOP + this.MARGIN_BETWEEN_TEXT * 1)
        .attr("x", this.MARGIN_TEXT_LEFT)
        .text("Log 2 Fold Change: ")

        this.infoSvg.append("text")
        .attr("id", "fdr_text")
        .attr("y", this.MARGIN_TEXT_TOP + this.MARGIN_BETWEEN_TEXT * 2)
        .attr("x", this.MARGIN_TEXT_LEFT)
        .text("FDR: ")

        this.infoSvg.append("text")
        .attr("id", "basal_text")
        .attr("y", this.MARGIN_TEXT_TOP + this.MARGIN_BETWEEN_TEXT * 3)
        .attr("x", this.MARGIN_TEXT_LEFT)
        .text("Basal Alpha: ")

        this.infoSvg.append("text")
        .attr("id", "stimulated_text")
        .attr("y", this.MARGIN_TEXT_TOP + this.MARGIN_BETWEEN_TEXT * 4)
        .attr("x", this.MARGIN_TEXT_LEFT)
        .text("Stimulated Alpha: ")

        this.infoSvg.append("text")
        .attr("id", "n_barcodes_text")
        .attr("y", this.MARGIN_TEXT_TOP + this.MARGIN_BETWEEN_TEXT * 5)
        .attr("x", this.MARGIN_TEXT_LEFT)
        .text("Number of Barcodes: ")

        const that = this
        document.getElementById("filter_button").addEventListener("click", function() {
            let selected_motif = that.searchBar.value
            that.alpha.drawAlphaScatter(selected_motif)
            that.volcano.drawVolcano(selected_motif)
            d3.select("#control_check").property('checked', false)
            d3.select("#top_check").property('checked', false)

        });

        document.getElementById("show_button").addEventListener("click", function() {
            that.alpha.drawAlphaScatter()
            that.volcano.drawVolcano()
            d3.select("#control_check").property('checked', false)
            d3.select("#top_check").property('checked', false)

        });

        document.getElementById("copy-button").addEventListener("click", function(event) {
            that.copyClicked(event, "sequence")
            setTimeout(() => {
                d3.select(".info-tooltip").style("opacity", 0);
              }, that.TOOL_TIP_TIME_OUT)
        });

        document.getElementById("copy-button-top").addEventListener("click", function(event) {
            that.copyClicked(event, "primer_top")
            setTimeout(() => {
                d3.select(".info-tooltip").style("opacity", 0);
              }, that.TOOL_TIP_TIME_OUT)
        });

        document.getElementById("copy-button-bottom").addEventListener("click", function(event) {
            that.copyClicked(event, "primer_bottom")
            setTimeout(() => {
                d3.select(".info-tooltip").style("opacity", 0);
              }, that.TOOL_TIP_TIME_OUT)
        });

        document.getElementById('searchBar').addEventListener('click', function(){
            document.getElementById('searchBar').value = '';
        })

        
        //***********************************************************************
        //                       Add tool tips for each button/component
        //***********************************************************************        
        
        d3.selectAll('.control_check_group').on("mouseover", (event, d) => {
            d3.select(".tooltip")
                .html("Toggle on to see negative controls.<br><br>Negative controls include <br>Spacer and Scramble architectures.")
                .style("left", `${event.pageX + 30}px`)
                .style("top", `${event.pageY - 10}px`)
                .transition()
                .delay(this.TOOL_TIP_DELAY)
                .style("opacity", 1)
          })
          .on("mousemove", (event, d) => {
            d3.select(".tooltip")
              .style("left", `${event.pageX + 30}px`)
              .style("top", `${event.pageY - 10}px`)
          })
          .on("mouseleave", (event, d) => {
            d3.select(".tooltip")
            .style("opacity", 0)
            .style("left", "-300px")
            .style("top", "-300px")
          })

        d3.selectAll('.top_check_group').on("mouseover", (event, d) => {
            d3.select(".tooltip")
                .html("Toggle on to see top N motifs.<br><br>The top group had the motif with the<br>highest absolute log 2 fold change.\
                <br>The second group had the motif with the<br>second highest absolute log 2 fold change. \
                <br>etc.")
                .style("left", `${event.pageX + 30}px`)
                .style("top", `${event.pageY - 10}px`)
                .transition()
                .delay(this.TOOL_TIP_DELAY)
                .style("opacity", 1)
          })
          .on("mousemove", (event, d) => {
            d3.select(".tooltip")
              .style("left", `${event.pageX + 30}px`)
              .style("top", `${event.pageY - 10}px`)
          })
          .on("mouseleave", (event, d) => {
            d3.select(".tooltip")
            .style("opacity", 0)
            .style("left", "-300px")
            .style("top", "-300px")
          })


        d3.select('#copy-button').on("mouseover", (event, d) => {
            d3.select(".tooltip")
                .html("Click to copy the TRE unit sequence. <br>The sequence does not include the promoter. ")
                .style("left", `${event.pageX + 30}px`)
                .style("top", `${event.pageY - 10}px`)
                .transition()
                .delay(this.TOOL_TIP_DELAY)
                .style("opacity", 1)
          })
          .on("mousemove", (event, d) => {
            d3.select(".tooltip")
              .style("left", `${event.pageX + 30}px`)
              .style("top", `${event.pageY - 10}px`)
          })
          .on("mouseleave", (event, d) => {
            d3.select(".tooltip")
            .style("opacity", 0)
            .style("left", "-300px")
            .style("top", "-300px")
          })

          d3.select('#copy-button').on("mouseover", (event, d) => {
            d3.select(".tooltip")
                .html("Click to copy the TRE unit sequence. <br>The sequence does not include the promoter. ")
                .style("left", `${event.pageX + 30}px`)
                .style("top", `${event.pageY - 10}px`)
                .transition()
                .delay(this.TOOL_TIP_DELAY)
                .style("opacity", 1)
          })
          .on("mousemove", (event, d) => {
            d3.select(".tooltip")
              .style("left", `${event.pageX + 30}px`)
              .style("top", `${event.pageY - 10}px`)
          })
          .on("mouseleave", (event, d) => {
            d3.select(".tooltip")
            .style("opacity", 0)
            .style("left", "-300px")
            .style("top", "-300px")
          })


          d3.selectAll('.oligo_group').on("mouseover", (event, d) => {
            d3.select(".tooltip")
                .html("Click to copy the oligonucleotide sequence for <br>cloning into TRE pGL4.R plasmids")
                .style("left", `${event.pageX + 30}px`)
                .style("top", `${event.pageY - 10}px`)
                .transition()
                .delay(this.TOOL_TIP_DELAY)
                .style("opacity", 1)
          })
          .on("mousemove", (event, d) => {
            d3.select(".tooltip")
              .style("left", `${event.pageX + 30}px`)
              .style("top", `${event.pageY - 10}px`)
          })
          .on("mouseleave", (event, d) => {
            d3.select(".tooltip")
            .style("opacity", 0)
            .style("left", "-300px")
            .style("top", "-300px")
          })

        
   
    }

   
      
    showTooltip(text, x, y) {
        const tooltip = d3.select(".info-tooltip");
        tooltip.style("opacity", 1)
          .html(text)
          .style("left", `${x}px`)
          .style("top", `${y}px`);
      }

    copyClicked(event, type){
        let textToCopy = ""
        let tooltipText = ""
        if (this.selected_architecture === "none"){
            textToCopy = "No Architecture Selected"
            tooltipText = "No Architecture Selected";
        }
        else{
            let motif = this.selected_architecture.split(",")[0]
            let spacer = this.selected_architecture.split(",")[1]
            let scramble = this.selected_architecture.split(",")[2]
            let architecture = motif + ","+ spacer + "," + scramble
            let selected_architecture = this.sequence_data.filter(function(d){return d.architecture=== architecture;})

    
            if (selected_architecture.length != 1){
                textToCopy = "Unable to copy sequence"
                tooltipText = "Error: Invalid Architecture";
            }
            else{
                textToCopy = this.sequence_data.filter(function(d){return d.architecture=== architecture;})[0][type]
                tooltipText = "Copied";

            }
        }
        const that = this
        navigator.clipboard.writeText(textToCopy).then(function() {
            console.log("Text copied!");
            that.showTooltip(tooltipText,   event.pageX - 700,  event.pageY - 700);
        }, function(err) {
            that.showTooltip("Error: Unable to Copy", event.pageX, event.pageY);
            console.error("Unable to copy text: ", err);
        });
    }

    
   updateSearchOptions() {
    const that = this
    let options = []
    if (this.globalApplicationState.base != null && this.globalApplicationState.stimulated != null){

        //Get options as []
        options = this.globalApplicationState.motifs

        }
    else{
        options = []
        this.searchBar.value = ""

    }

    // Clear existing options
    while (this.datalist.firstChild) {
        this.datalist.removeChild(this.datalist.firstChild);
    }

    // Add new options
    options.forEach(function(option) {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        that.datalist.appendChild(optionElement);
    });

    this.searchBar.appendChild(this.datalist);  

    }

    click(row){
        let fc_name = "logFC__" + this.globalApplicationState.selected_comparison
        let fdr_name = "fdr__" + this.globalApplicationState.selected_comparison
        let n_barcodes_name = "n_barcodes__" + this.globalApplicationState.selected_comparison
        let base_treatment = this.globalApplicationState.selected_comparison.split("_vs_")[0].split("__")[0]
        let base_run = this.globalApplicationState.selected_comparison.split("_vs_")[0].split("__")[1]
        let stimulated_treatment = this.globalApplicationState.selected_comparison.split("_vs_")[1].split("__")[0]
        let stimulated_run = this.globalApplicationState.selected_comparison.split("_vs_")[1].split("__")[1]
        let base_alpha_name = "alpha__" + base_treatment + "__" + base_run
        let stim_alpha_name = "alpha__" + stimulated_treatment + "__" + stimulated_run

        this.globalApplicationState.selected_motif = row.architecture.split(":")[0]
        this.searchBar.value = row.architecture.split(":")[0]
        
        this.infoSvg.select("#architecture_text").text("Architecture: " + row.architecture)
        this.infoSvg.select("#fdr_text").text("FDR: " + row[fdr_name])
        this.infoSvg.select("#fc_text").text("Log 2 Fold Change: " + (+row[fc_name]).toFixed(this.NUM_DEC))
        this.infoSvg.select("#basal_text").text("Basal Alpha: " + (+row[base_alpha_name]).toFixed(this.NUM_DEC))
        this.infoSvg.select("#stimulated_text").text("Stimulated Alpha: " + (+row[stim_alpha_name]).toFixed(this.NUM_DEC))
        this.infoSvg.select("#n_barcodes_text").text("Number of Barcodes: " + row[n_barcodes_name])
        this.selected_architecture = row.architecture
    }

    clear(){
        this.infoSvg.select("#architecture_text").text("Architecture: ")
        this.infoSvg.select("#fdr_text").text("FDR: ")
        this.infoSvg.select("#fc_text").text("Log 2 Fold Change: ")
        this.infoSvg.select("#basal_text").text("Basal Alpha: ")
        this.infoSvg.select("#stimulated_text").text("Stimulated Alpha: ")
        this.infoSvg.select("#n_barcodes_text").text("Number of Barcodes: ")
        this.selected_architecture = "none"
    }


}
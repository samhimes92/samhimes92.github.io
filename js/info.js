class Info{
    constructor(all_data,sequence_data, globalApplicationState,volcano,alpha,h){

        //**********************************************************************************************
        //                                  CONSTANTS FOR CHART SIZE
        //**********************************************************************************************
        this.WIDTH = 600
        this.HEIGHT = 250
        this.NUM_DEC = 2
        this.MARGIN_TEXT_LEFT = 25
        this.MARGIN_TEXT_TOP = 15
        this.MARGIN_BETWEEN_TEXT = 25
        this.TOOL_TIP_TIME_OUT = 500
        this.TOOL_TIP_DELAY = 4000
        

        this.SLIDER_MARGIN_LEFT = 25
        this.RNA_SLIDER_TRANSLATE = 150
        this.DNA_SLIDER_TRANSLATE = 200

        
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
        .attr('id', 'info_svg')
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
        .attr("id", "stimulated_text")
        .attr("y", this.MARGIN_TEXT_TOP + this.MARGIN_BETWEEN_TEXT * 3)
        .attr("x", this.MARGIN_TEXT_LEFT)
        .text("Stimulated Alpha: ")
        .style('fill', '#00429d')

        this.infoSvg.append("text")
        .attr("id", "basal_text")
        .attr("y", this.MARGIN_TEXT_TOP + this.MARGIN_BETWEEN_TEXT * 4)
        .attr("x", this.MARGIN_TEXT_LEFT)
        .text("Basal Alpha: ")
        .style('fill', '#6C4343')




        // Create a scale for the slider
        this.barcode_scale = d3.scaleLinear()
            .domain([0, 100]) 
            .range([0, 300]);

        // // Create the second slider element
        // var slider_rna = this.infoSvg
        //     .append("g")
        //     .attr("transform", `translate(${this.SLIDER_MARGIN_LEFT},${this.RNA_SLIDER_TRANSLATE})`);

        // this.rna_dots = this.infoSvg
        // .append("g")
        // .attr("transform", `translate(${this.SLIDER_MARGIN_LEFT},${this.RNA_SLIDER_TRANSLATE})`);

        // // Add a slider track for the second slider
        // slider_rna.append("line")
        //     .attr("class", "track")
        //     .attr("x1", this.barcode_scale.range()[0])
        //     .attr("x2", this.barcode_scale.range()[1])
        //     .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        //     .attr("class", "track-inset")
       
        // // Create the handle for the second slider
        // var handle_rna = slider_rna.insert("circle")
        //     .attr("class", "handle")
        //     .attr("r", 4)
        //     .attr("cx", 8)

        // var drag_rna = d3.drag()
        //     .on("start", function() {
        //         handle_rna.raise().classed("active", true);
        //         handle_rna.style("cursor", "grab")
        //     })
        //     .on("drag", function(event) {
        //         var xPos = event.x;
        //         handle_rna.style("cursor", "grabbing")
        //         xPos = Math.max(0, Math.min(that.barcode_scale.range()[1], xPos-that.SLIDER_MARGIN_LEFT));
        //         handle_rna.attr("cx", xPos);
        //         var sliderValue = that.barcode_scale.invert(xPos);
        //         that.globalApplicationState.min_RNA = sliderValue
        //     })
        //     .on("end", function() {
        //         handle_rna.style("cursor", "grab")
        //         d3.select(this).classed("active", false);
        //         that.alpha.drawAlphaScatter()
        //         that.volcano.drawVolcano()

        //     });

        // slider_rna.call(drag_rna);

        // // Create the second slider element
        // var slider_dna = this.infoSvg
        //     .append("g")
        //     .attr("transform", `translate(${this.SLIDER_MARGIN_LEFT},${this.DNA_SLIDER_TRANSLATE})`);

        // this.dna_dots = this.infoSvg
        //     .append("g")
        //     .attr("transform", `translate(${this.SLIDER_MARGIN_LEFT},${this.DNA_SLIDER_TRANSLATE})`);
    
        // slider_dna.append("line")
        //     .attr("class", "track")
        //     .attr("x1", this.barcode_scale.range()[0])
        //     .attr("x2", this.barcode_scale.range()[1])
        //     .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        //     .attr("class", "track-inset")


        // // Create the handle for the second slider
        // var handle_dna = slider_dna.insert("circle")
        //     .attr("class", "handle")
        //     .attr("r", 4)
        //     .attr("cx", 8)
            
        // var drag_dna = d3.drag()
        //     .on("start", function() {
        //         handle_dna.raise().classed("active", true);
        //         handle_dna.style("cursor", "grab")
        //     })
        //     .on("drag", function(event) {
        //         var xPos = event.x;
        //         handle_dna.style("cursor", "grabbing")
        //         xPos = Math.max(0, Math.min(that.barcode_scale.range()[1], xPos-that.SLIDER_MARGIN_LEFT));
        //         handle_dna.attr("cx", xPos);
        //         var sliderValue = that.barcode_scale.invert(xPos);
        //         that.globalApplicationState.min_DNA = sliderValue
        //     })
        //     .on("end", function() {
        //         handle_dna.style("cursor", "grab")
        //         d3.select(this).classed("active", false);
        //         that.alpha.drawAlphaScatter()
        //         that.volcano.drawVolcano()

        //     });

        // slider_dna.call(drag_dna);


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
                .style("top", `${event.pageY - 60}px`)
                .transition()
                .delay(this.TOOL_TIP_DELAY)
                .style("opacity", 1)
          })
          .on("mousemove", (event, d) => {
            d3.select(".tooltip")
              .style("left", `${event.pageX + 30}px`)
              .style("top", `${event.pageY - 60}px`)
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
                .style("top", `${event.pageY - 60}px`)
                .transition()
                .delay(this.TOOL_TIP_DELAY)
                .style("opacity", 1)
          })
          .on("mousemove", (event, d) => {
            d3.select(".tooltip")
              .style("left", `${event.pageX + 30}px`)
              .style("top", `${event.pageY - 60}px`)
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
          .style("left", `20px`)
          .style("top", `250px`);
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
            that.showTooltip(tooltipText);
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
        let base_treatment = this.globalApplicationState.selected_comparison.split("_vs_")[0].split("__")[0]
        let base_run = this.globalApplicationState.selected_comparison.split("_vs_")[0].split("__")[1]
        let stim_treatment = this.globalApplicationState.selected_comparison.split("_vs_")[1].split("__")[0]
        let stim_run = this.globalApplicationState.selected_comparison.split("_vs_")[1].split("__")[1]
        let base_alpha_name = "alpha__" + base_treatment + "__" + base_run
        let stim_alpha_name = "alpha__" + stim_treatment + "__" + stim_run

        let n_rna_stim_name = "RNA_barcodes__" +stim_treatment+"__"+stim_run
        let n_rna_base_name = "RNA_barcodes__" +base_treatment+"__"+base_run
        let n_dna_stim_name = "DNA_barcodes__" +stim_treatment+"__"+stim_run
        let n_dna_base_name = "DNA_barcodes__" +base_treatment+"__"+base_run

        this.draw_barcode_n(row[n_rna_stim_name], row[n_rna_base_name])

        this.globalApplicationState.selected_motif = row.architecture.split(":")[0]
        this.searchBar.value = row.architecture.split(":")[0]
        
        this.infoSvg.select("#architecture_text").text("Architecture: " + row.architecture)
        this.infoSvg.select("#fdr_text").text("FDR: " + row[fdr_name])
        this.infoSvg.select("#fc_text").text("Log 2 Fold Change: " + (+row[fc_name]).toFixed(this.NUM_DEC))
        this.infoSvg.select("#basal_text").text("Basal Alpha: " + (+row[base_alpha_name]).toFixed(this.NUM_DEC))
        this.infoSvg.select("#stimulated_text").text("Stimulated Alpha: " + (+row[stim_alpha_name]).toFixed(this.NUM_DEC))
        this.selected_architecture = row.architecture
    }

    clear(){
        this.infoSvg.select("#architecture_text").text("Architecture: ")
        this.infoSvg.select("#fdr_text").text("FDR: ")
        this.infoSvg.select("#fc_text").text("Log 2 Fold Change: ")
        this.infoSvg.select("#basal_text").text("Basal Alpha: ")
        this.infoSvg.select("#stimulated_text").text("Stimulated Alpha: ")
        this.selected_architecture = "none"
    }

    draw_barcode_n(n_rna_stim, n_rna_base){
        this.barcode_scale(n_rna_stim)
        this.barcode_scale(n_rna_base)

        this.rna_dots.selectAll("circle").remove()

        this.rna_dots.append("circle")
        .attr('r', '4')
        .attr("cx", this.barcode_scale(n_rna_base))
        .attr("cy", 8)
        .attr("fill", '#6C4343')

        this.rna_dots.append("circle")
        .attr('r', '4')
        .attr("cx", this.barcode_scale(n_rna_stim))
        .attr("cy", -8)
        .attr("fill", '#00429d')



        //base
        // #6C4343

        //stim
       //.style('fill', '#00429d');

            

    }


}
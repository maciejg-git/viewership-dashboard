import * as d3 from "d3"

export let chart = {
  margin: {top: 30, right: 30, bottom: 50, left: 60},
  colorChannel: null,
  parseDateLong: null,
  parseDate: null,
  svg: null,
  x: null,

  setColorChannel(channels) {
    this.colorChannel = d3.scaleOrdinal(d3.schemeCategory10).domain(channels);
  },
  setParser() {
    this.parseDateLong = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
    this.parseDate = d3.timeParse("%Y-%m-%d");
  },
  setSVG(id, margin, width, height) {
    this.width = 700 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.svg = d3.select("body")
      .select("svg#" + id)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    return this.svg;
  },
  createSimpleLabels(xText, yText) {
    this.svg.append("text")             
      .attr("transform",
        "translate(" + (this.width/2) + " ," + 
        (this.height + this.margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text(xText);

    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yText);    
  },
  createXScale(domain, range) { 
    this.x = d3.scaleTime()
      .domain(date)
      .range([ 0, this.width ])
  }
}

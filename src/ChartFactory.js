import * as d3 from "d3"

export let Chart = (m, w, h) {
	let margin = {top: 30, right: 30, bottom: 50, left: 60};
	let colorChannel = null;
	let parseDateLong = null;
	let parseDate = null;

	let width = w - margin.left - margin.right;
	let height = h - margin.top - margin.bottom;

	setColorChannel(channels) {
		this.colorChannel = d3.scaleOrdinal(d3.schemeCategory10).domain(channels);
	},
	setParser() {
		this.parseDateLong = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
		this.parseDate = d3.timeParse("%Y-%m-%d");
	},
	setSVG(id, margin, width, height) {
		return d3.select("body")
			.select("svg#" + id)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	 
	},
	createSimpleLabel() {
		
	},
}

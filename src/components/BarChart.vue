<template>
<div :id="'chart'+id">
</div>
</template>

<script>
import * as d3 from "d3"
import * as d3array from "d3-array"
import { chart } from "../chart.js"

export default {
	name: 'BarChart',
	props: {
		item: Array,
		id: Number,
	},
	data: () => ({
	}),
	mounted: function () {
		let x = d3.scaleLinear()
				.domain([0, 200000])
				.range([ 0, 30 ]);

		let chart = d3.select('div#chart'+this.id)
			.selectAll("div")
			.data(this.item.sort())
			.enter()
			.append("div")
			.style("width", d => x(d[1])+"px")
			.style("height", "20px")
			.style("background-color", (d, i) => this.color(i))
			.style("display", "inline-block")
	},
	methods: {
		color(c) {
			return d3.scaleOrdinal(d3.schemeCategory10)
				.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])(c);
		},
	}
}
</script>

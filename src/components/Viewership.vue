<template>
  <v-container>
    <div v-if="dataLoad">
      <label  for="markedArea" class="custom-file-upload p-0 m-0">
        Import
      </label>
      <input type="file" id="markedArea" @change="importData">
    </div>

    <span v-if="isLoading">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
      Loading data
    </span>

    <v-row>

      <v-col cols="auto">

        <!-- DATE -->

        <v-menu
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateRangeText"
              label="Date"
              readonly
              v-on="on"
              :dense="true"
              hide-details="true"
              style="min-width: 300px"
              ></v-text-field>
          </template>
          <v-date-picker v-model="dateSelected" @change="dateChanged" range></v-date-picker>
        </v-menu> 

      </v-col>

      <v-col cols="auto">
        <v-select
          v-model="channelsSelected"
          :items="channels"
          :menu-props="{ maxHeight: '400' }"
          label="Channel"
          multiple
          persistent-hint
          hide-details="true"
          :dense="true"
          @blur="channelChanged"
        >
        <template v-slot:selection="{ item, index }">
          <span v-if="index == 0">{{ item }}</span>
          <span v-if="index == 1">, {{ item }}</span>
          <span
            v-if="index === 2"
            class="grey--text caption"
            >
            (+{{ channelsSelected.length - 2 }} others)
          </span>
        </template>
        </v-select>

      </v-col>

      <!-- FILMS -->

      <v-col cols="auto">
        <v-autocomplete 
          :items="films"
          placeholder="Films"
          hide-details
          dense>
        </v-autocomplete>
      </v-col>

      <v-col cols="auto" class="ml-auto">
        <v-btn class="ml-2" small @click="resizeAll(0)">
          Small
          <v-icon class="pl-1" small>mdi-view-grid</v-icon>
        </v-btn>
        <v-btn class="ml-2" small @click="resizeAll(1)">
          Maximize
          <v-icon class="pl-1" small>mdi-view-stream</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6" style="border-bottom: 1px #e2e2e2 solid">

      <v-col :cols="layoutCardSize[0]" :order="layoutCardOrder[0]">

        <!-- <v&#45;card class="py&#45;2 px&#45;2"> -->

            <!-- CHART -->

            <div class="blue darken-2 text-left mb-2 pl-4" style="border-radius: 0px">
              <span class="white--text">Concurrent Sessions per minute</span>
            </div>
            <div class="d-flex justify-end">
              <v-btn class="ml-2 mr-1" small @click="resizeChartCard(0)">
                Maximize
                <v-icon class="pl-1" small>mdi-arrow-left-right</v-icon>
              </v-btn>
            </div>

            <!-- SVG -->

            <div class="py-2 px-2">
              <svg id="line">
              </svg>
              
              <ul class="mt-2 channel-list">
                <li v-for="(c, i) in channelsSelected" style="display: inline-block">
                  <div class="mr-1" style="width: 16px; height: 16px;display: inline-block" :style="{'background-color': colorChannel(c)}">
                  </div>
                  <span class="mr-4">
                    {{ c }}
                  </span>
                </li>
              </ul>
            </div>
        <!-- </v&#45;card> -->

      </v-col>

      <v-col :cols="layoutCardSize[1]" :order="layoutCardOrder[1]">

        <!-- <v&#45;card class="py&#45;2 px&#45;2"> -->

            <!-- CHART -->

            <div class="blue darken-2 text-left mb-2 pl-4" style="border-radius: 0px">
              <span class="white--text">Concurrent Sessions per minute</span>
            </div>
            <div class="d-flex justify-end">
              <v-btn class="ml-2 mr-1" small @click="resizeChartCard(1)">
                Maximize
                <v-icon class="pl-1" small>mdi-arrow-left-right</v-icon>
              </v-btn>
            </div>

            <!-- SVG -->

            <div class="py-2 px-2">
              <svg id="stacked">
              </svg>
              
              <ul class="mt-2 channel-list">
                <li v-for="(c, i) in channelsSelected" style="display: inline-block">
                  <div class="mr-1" style="width: 16px; height: 16px;display: inline-block" :style="{'background-color': colorChannel(c)}">
                  </div>
                  <span class="mr-4">
                    {{ c }}
                  </span>
                </li>
              </ul>
            </div>
        <!-- </v&#45;card> -->

      </v-col>

      <v-col :cols="layoutCardSize[2]" :order="layoutCardOrder[2]">

        <!-- <v&#45;card class="py&#45;2 px&#45;2"> -->

            <!-- CHART -->

            <div class="blue darken-2 text-left mb-2 pl-4" style="border-radius: 0px">
              <span class="white--text">Concurrent Sessions per minute</span>
            </div>
            <div class="d-flex justify-end">
              <v-btn class="ml-2 mr-1" small @click="resizeChartCard(2)">
                Maximize
                <v-icon class="pl-1" small>mdi-arrow-left-right</v-icon>
              </v-btn>
            </div>

            <!-- SVG -->

            <div class="py-2 px-2">
              <svg id="yearsStacked">
              </svg>
              
              <ul class="mt-2 years-list">
                <li v-for="(y, i) in years" style="display: inline-block">
                  <div class="mr-1" style="width: 16px; height: 16px;display: inline-block" :style="{'background-color': color(i)}">
                  </div>
                  <span class="mr-4">
                    {{ y }}
                  </span>
                </li>
              </ul>
            </div>
        <!-- </v&#45;card> -->

      </v-col>

    </v-row>

    <div class="blue darken-2 text-left mb-4 pl-4" style="border-radius: 0px">
      <span class="white--text">Events details</span>
    </div>

    <div class="d-flex justify-end">
      <v-chip
        v-if="dateSearch"
        class="mr-auto"
        close
        @click:close="dateSearch = ''"
        >
        {{ dateSearch }}
      </v-chip>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          style="max-width: 500px"
          class="pb-4"
          :dense="true"
          single-line
          hide-details
          ></v-text-field>
    </div>

    <v-data-table
      :headers="headers"
      :items="dataTable"
      :items-per-page="50"
      :dense="true"
      :search="search"
      :page.sync="page"
      >
      <template v-slot:item.years="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <BarChart :item="item.years" :id="item.id">
              </BarChart>
            </div>
          </template>
          <ul style="list-style: none">
            <li v-for="i in item.years">
              {{ i[0] }}: {{ i[1] }}
            </li>
          </ul>
        </v-tooltip>
      </template>
    </v-data-table>

  </v-container>
</template>

<script>
import * as d3 from "d3"
import * as d3array from "d3-array"
import { chart } from "../chart.js"
import BarChart from "./BarChart.vue"

let dataLineChart = [];
let dataForChannelStacked = [];
let dataChannelStacked = [];
let dataYearsStacked = [];
let dataPerChannel = [];
let dataPerChannelFiltered = [];
let chartLine2 = null;
let chartLine = {
  svg: null,
  margin: null,
  width: null,
  height: null,
  x: null,
};
let chartStacked = {
  svg: null,
  margin: null,
  width: null,
  height: null,
  x: null,
};
let chartStackedYears = {
  svg: null,
  margin: null,
  width: null,
  height: null,
  x: null,
};

export default {
  name: 'HelloWorld',
  components: {
    BarChart,
  },
  data: () => ({
    items: [],
    itemsTest: [],
    dataTable: [],
    channels: [],
    films: [],
    isLoading: false,
    search: "",
    dateSearch: "",
    page: 1,
    layoutCardOrder: [0, 1, 2],
    layoutCardSize: [4, 4, 4],
    years: ['0-2 years', '3-12 years', '13-19 years', '22-29 years', '30-49 years', '50-69 years', '70+'],
    dateSelected: ["2019-08-22", "2019-08-23"],
    channelsSelected: [],
    dataLoad: false,
  }),
  mounted: function() {
    chart.setColorChannel(this.channels);
    chart.setParser();
    this.init();
  },
  computed: {
    headers() {
      return  [
        // { 
        //  text: 'Date', value: 'date',
        //  filter: value => {
        //    if (!this.dateSearch) return true
        //
        //    return value == this.dateSearch;
        //  },
        // },
        { text: 'Channel', value: 'channel' },
        { 
          text: 'Start time', 
          value: 'datestart', 
          filter: value => {
            if (!this.dateSearch) return true
            return value <= this.dateSearch;
          },
        },
        { 
          text: 'End time', 
          value: 'dateend', 
          filter: value => {
            if (!this.dateSearch) return true
            return value >= this.dateSearch;
          },
        },
        { text: 'Title', value: 'film' },
        { text: 'Sum', value: 'sum' },
        // { text: 'Sum', value: 'sum' },
        { text: 'Years', value: 'years' },
      ]
    },
    dateRangeText () {
      return this.dateSelected.join('   -   ')
    },
  },
  methods: {
    init(data) {
      if (data) {
        let results = d3.csvParse(data);
        this.initData(results);
      }
      else {
        this.isLoading = true;
        d3.csv("https://raw.githubusercontent.com/maciejg-git/viewership-dashboard/master/src/result2.csv").then(results => {
          this.isLoading = false;
          this.initData(results);
        });
      }
    },

    // DATA

    initData(results) {
      this.items = Object.freeze(results);
      // this.items = Object.freeze(results.slice(0, 50000));
      // this.itemsTest = Object.freeze(this.items.slice(0, 50000));

      for (let i = 0; i < this.items.length; i++) {
        if (this.channels.indexOf(this.items[i].channel) == -1)
          this.channels.push(this.items[i].channel)
      }
      this.channelsSelected = [...this.channels];

      for (let i = 0; i < this.items.length; i++) {
        if (this.films.indexOf(this.items[i].film) == -1)
          this.films.push(this.items[i].film)
      }

      let dataPerYears = d3array.rollups(
        this.items, 
        v => d3.sum(v, d => d.sum), 
        d => d.date, 
        d => d.years
      );

      let dataForYearsStacked = dataPerYears.map(d => {
        return {date: chart.parseDateLong(d[0]), ...Object.fromEntries(d[1])}
      });

      // table years
      let dataForTable = d3array.rollups(
        this.items, 
        v => d3.sum(v, d => d.sum),
        d => d.film, 
        d => d.channel,
        d => d.datestart,
        d => d.dateend,
        d => d.years,
      );
      let dataTable = []
      let d2 = null;
      for (let f of dataForTable) {
        for (let c of f[1]) {
          let item = {};
          item.film = f[0];
          item.channel = c[0]
          d2 = c[1][0];
          item.datestart = d2[0]
          d2 = d2[1][0]
          item.dateend = d2[0]
          item.years = d2[1];
          item.sum = d3.sum(d2[1], d => d[1]);
          dataTable.push(item);
        }
      }
      this.dataTable = Object.freeze(dataTable);
      for (let i = 0; i < this.dataTable.length; i++) {
        this.dataTable[i].id = i;
      }
      // end table years

      let dataPerDate = d3array.rollups(
        this.items, 
        v => d3.sum(v, d => d.sum), 
        d => d.date, 
        d => d.channel
      );

      dataForChannelStacked = dataPerDate.map(d => {
        return {date: chart.parseDateLong(d[0]), ...Object.fromEntries(d[1])}
      });

      dataPerChannel = d3array.rollups(
        this.items, 
        v => d3.sum(v, d => d.sum), 
        d => d.channel, 
        d => d.date
      );
      for (let c of dataPerChannel) {
        for (let d of c[1]) {
          d[0] = chart.parseDateLong(d[0])
        }
      }

      let stackedYears = d3.stack()
        .keys(this.years)
        .value(function(d, key) {
          return d[key] ? d[key] : 0
        })
      dataYearsStacked = stackedYears(dataForYearsStacked);

      chartLine2 = Object.create(chart)

      this.dataFilterByDate();
      this.channelChanged();
    },
    color(c) {
      return d3.scaleOrdinal(d3.schemeCategory10).domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])(c);
    },
    colorChannel(c) {
      return d3.scaleOrdinal(d3.schemeCategory10)
        .domain(this.channels)(c);
    },
    dataFilterByDate() {
      dataPerChannelFiltered = [];
      let date = [
        chart.parseDate(this.dateSelected[0]), 
        chart.parseDate(this.dateSelected[1])
      ]
      for (let c of dataPerChannel) {
        let d2 = c[1].filter(d => d[0] >= date[0] && d[0] <= date[1])
        dataPerChannelFiltered.push([c[0], d2])
      }
    },
    resizeChartCard(card, size) {
      let c = size == 0 ? 4 : size == 1 ? 12 : this.layoutCardSize[card] == 4 ? 12 : 4; 
      this.$set(this.layoutCardSize, card, c);

      if (card == 0) { 
        d3.select("svg#line").selectAll("*").remove();
        this.drawChart();
      }
      else if (card == 1) {
        d3.select("svg#stacked").selectAll("*").remove();
        this.drawChartStack();
      } 
      else if (card == 2) {
        d3.select("svg#yearsStacked").selectAll("*").remove();
        this.drawChartYearsStack();
      }
    },
    resizeAll(size) {
      for (let c of this.layoutCardSize.keys()) {
        this.resizeChartCard(c, size)
      }
    },

    // EVENT

    dateChanged() {
      this.dataFilterByDate();

      this.redrawAll();
    },
    channelChanged() {
      let stacked = d3.stack()
        .keys(this.channelsSelected)
        .offset(d3.stackOffsetExpand)
        .value(function(d, key) {
          return d[key] ? d[key] : 0
        });
      dataChannelStacked = stacked(dataForChannelStacked);

      this.redrawAll();
    },

    // CHART

    redrawAll() {
      d3.select("svg#line").selectAll("*").remove();
      d3.select("svg#stacked").selectAll("*").remove();
      d3.select("svg#yearsStacked").selectAll("*").remove();
      this.drawChart("square");
      this.drawChartStack();
      this.drawChartYearsStack();
    },
    drawChart() {
      let margin = null;
      let width = null;
      let height = null;
      let svg = null;
      if (this.layoutCardSize[0] == 4) { 
        margin = {top: 30, right: 30, bottom: 50, left: 60};
        width = 700 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;

        svg = chartLine2.setSVG("line", margin, width, height)
      }
      else if(this.layoutCardSize[0] == 12) {
        margin = {top: 30, right: 30, bottom: 50, left: 60};
        width = 1000 - margin.left - margin.right;
        height = 400 - margin.top - margin.bottom;

        svg = chartLine2.setSVG("line", margin, width, height)
      }
      chartLine.svg = svg;
      chartLine.margin = margin;
      chartLine.width = width;
      chartLine.height = height;

      let date = [
        chart.parseDate(this.dateSelected[0]), 
        chart.parseDate(this.dateSelected[1])
      ]

      let x = d3.scaleTime()
        .domain(date)
        .range([ 0, width ]);
      chartLine.x = x;

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      let y = d3.scaleLinear()
        // .domain([0, d3.max(dataFiltered, function(d) { return +d.sum; })])
        .domain([0, 9000])
        .range([ height, 0 ]);

      svg.append("g")
        .call(d3.axisLeft(y));

      chartLine2.createSimpleLabels("Date", "# of Concurrent Sessions");
      
      let line = d3.line()
        .x(function(d) {
          return x(d[0])
        })
        .y(function(d) {
          return y(d[1])
        })

      let data = dataPerChannelFiltered.filter(c => this.channelsSelected.indexOf(c[0]) != -1);

      let lines = svg.selectAll("lines")
        .data(data)
        .enter()
        .append("g")
        .attr("fill", "none")

      lines.append("path")
        // .attr("clip-path", "url(#clip)")
        .attr("d", function(d) {return line(d[1])})
        .style("stroke", d => chart.colorChannel(d[0]))
        .style("stroke-width", "0.5px")

      // MOUSE

      let bisectDate = d3.bisector(d => d[0]).left;
      var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");

      var mouse = svg.append("g")
        .attr("class", "mouse-over-effects")
        .style("display", "none")

      let lineMouse = mouse.append("line")
        .attr("class", "mouse-line")
        .style("stroke", "grey")
        .style("stroke-width", "2px")
        .style("stroke-dasharray", 4)
        .style("shape-rendering", "optimizeSpeed")
        .attr("y1", -height)
        .attr("y2",0);

      let lineSearch = svg.append("path")
        .attr("class", "mouse-click-line")
        .style("stroke", "red")
        .style("stroke-width", "2px")
        .style("stroke-dasharray", 4)

      if (this.dateSearch) {
        let date = chart.parseDateLong(this.dateSearch);
        lineSearch.attr("d", `M${x(date)},${height} ${x(date)},0`)
          .style("display", null)
      }

      let labels = mouse.append("g")
        
      labels.append("rect");

      labels.selectAll(".lineHoverText")
        .data(this.channels)
        .enter()
        .append("text")
        .attr("class", "lineHoverText")
        .style("fill", "black")
        .attr("text-anchor", "start")
        .attr("font-size",12)
        .attr("dy", (_, i) => 1 + i * 2 + "em")
        .attr("font-weight", "bold")
        // .merge(labels);

      var colorChannel = d3.scaleOrdinal(d3.schemeCategory10).domain(this.channels);

      let focus = svg.append('svg:rect') 
        .attr('width', width) 
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() {
          mouse.style("display", "none"); 
        })
        .on('mouseover', function() {
          mouse.style("display", null); 
        })
        .on('mousemove', function() { // mouse moving over canvas
          let x0 = x.invert(d3.mouse(this)[0]);
          let i = bisectDate(data[0][1], x0, 1);
          let d0 = data[0][1][i - 1];
          let d1 = data[0][1][i];
          let d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;
          
          // lineMouse.attr("transform", `translate(${d3.mouse(this)[0]},${height})`);

          mouse.selectAll(".lineHoverText")
            .attr("transform", "translate(" + (d3.mouse(this)[0] + 10) + "," + d3.mouse(this)[1] + ")")
            // .attr("transform", "translate(" + d3.mouse(this)[0] + "," + height / 2.5 + ")")
            .style("fill", d => colorChannel(d))
            .text(e => e + " " + d[1]);
          // let labelsSize = labels.node().getBBox();

           // labels.select("rect")
            // .attr("transform", `translate(${labelsSize.x} ${labelsSize.y})`)
            // .attr("width", labelsSize.width)
            // .attr("height", labelsSize.height)
            // .style("fill", "#e8e8e8")
        })
        .on('click', () => { // mouse moving over canvas
          let x0 = d3.mouse(mouse.node())[0];
          var date = x.invert(d3.mouse(mouse.node())[0]);
          lineSearch.attr("d", `M${x0},${height} ${x0},0`)
            .style("display", null)
          let date2 = formatTime(date) + ":00.000";

          this.dateSearch = date2;
          this.page = 1;

          this.updateChartStacked();
          this.updateChartStackedYears();
        });

    },
    drawChartStack() {
      let margin = null;
      let width = null;
      let height = null;
      let svg = null;
      if (this.layoutCardSize[1] == 4) { 
        margin = {top: 30, right: 30, bottom: 50, left: 60};
        width = 700 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;

        svg = chart.setSVG("stacked", margin, width, height)
      }
      else if(this.layoutCardSize[1] == 12) {
        margin = {top: 30, right: 30, bottom: 50, left: 60};
        width = 1000 - margin.left - margin.right;
        height = 400 - margin.top - margin.bottom;

        svg = chart.setSVG("stacked", margin, width, height)
      }
      chartStacked.svg = svg;
      chartStacked.margin = margin;
      chartStacked.width = width;
      chartStacked.height = height;

      let parser = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");

      var colorChannel = d3.scaleOrdinal(d3.schemeCategory10).domain(this.channels);

      let parserDate = d3.timeParse("%Y-%m-%d");
      let date = [parserDate(this.dateSelected[0]), parserDate(this.dateSelected[1])]

      let x = d3.scaleTime()
        .domain(date)
        .range([ 0, width ]);

      chartStacked.x = x;

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      let y = d3.scaleLinear()
        .domain([0, 1])
        .range([ height, 0 ]);

      svg.append("g")
        .call(d3.axisLeft(y));

      svg.append("text")             
        .attr("transform",
          "translate(" + (width/2) + " ," + 
          (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Date");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# of Concurrent Sessions");    

      var clipPath = svg.append("defs")
        .append("clipPath")
        .attr("id", "clipStacked")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      var area = d3.area()
        .x(function(d) { return x(d.data.date); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

      svg.append("g")
        .selectAll("mylayers")
        .data(dataChannelStacked)
        .enter()
        .append("path")
        .attr("clip-path", "url(#clipStacked)")
        .style("fill", (d, i) => colorChannel(d.key))
        .attr("d", area)

      let lineSearch = svg.append("path")
        .attr("class", "mouse-click-line")
        .style("stroke", "red")
        .style("stroke-width", "2px")
        .style("stroke-dasharray", 4)

      if (this.dateSearch) {
        let date = chart.parseDateLong(this.dateSearch);
        lineSearch.attr("d", `M${x(date)},${height} ${x(date)},0`)
          .style("display", null)
      }
    },
    drawChartYearsStack() {
      let margin = null;
      let width = null;
      let height = null;
      let svg = null;
      if (this.layoutCardSize[2] == 4) { 
        margin = {top: 30, right: 30, bottom: 50, left: 60};
        width = 700 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;

        svg = chart.setSVG("yearsStacked", margin, width, height)
      }
      else if(this.layoutCardSize[2] == 12) {
        margin = {top: 30, right: 30, bottom: 50, left: 60};
        width = 1000 - margin.left - margin.right;
        height = 400 - margin.top - margin.bottom;

        svg = chart.setSVG("yearsStacked", margin, width, height)
      }
      chartStackedYears.svg = svg;
      chartStackedYears.margin = margin;
      chartStackedYears.width = width;
      chartStackedYears.height = height;

      let parser = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");

      var color = d3.scaleOrdinal(d3.schemeCategory10).domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      var colorChannel = d3.scaleOrdinal(d3.schemeCategory10).domain(this.channels);
      let parserDate = d3.timeParse("%Y-%m-%d");
      let date = [parserDate(this.dateSelected[0]), parserDate(this.dateSelected[1])]

      let x = d3.scaleTime()
        .domain(date)
        .range([ 0, width ]);

      chartStackedYears.x = x;

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      let y = d3.scaleLinear()
        .domain([0, 30000])
        .range([ height, 0 ]);

      svg.append("g")
        .call(d3.axisLeft(y));

      svg.append("text")             
        .attr("transform",
          "translate(" + (width/2) + " ," + 
          (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Date");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("# of Concurrent Sessions");    

      var clipPath = svg.append("defs")
        .append("clipPath")
        .attr("id", "clipStackedYears")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      var area = d3.area()
        .x(function(d) { return x(d.data.date); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

      svg.append("g")
        .selectAll("mylayers")
        .data(dataYearsStacked)
        .enter()
        .append("path")
        .attr("clip-path", "url(#clipStackedYears)")
        .style("fill", (d, i) => color(i))
        .attr("d", area)

      let lineSearch = svg.append("path")
        .attr("class", "mouse-click-line")
        .style("stroke", "red")
        .style("stroke-width", "2px")
        .style("stroke-dasharray", 4)

      if (this.dateSearch) {
        let date = chart.parseDateLong(this.dateSearch);
        lineSearch.attr("d", `M${x(date)},${height} ${x(date)},0`)
          .style("display", null)
      }
    },
    updateChartStacked() {
      let date = chart.parseDateLong(this.dateSearch);

      chartStacked.svg.select(".mouse-click-line")
        .attr("d", `M${chartStacked.x(date)},${chartStacked.height} ${chartStacked.x(date)},0`)
        .style("display", null)
    },
    updateChartStackedYears() {
      let date = chart.parseDateLong(this.dateSearch);

      chartStackedYears.svg.select(".mouse-click-line")
        .attr("d", `M${chartStackedYears.x(date)},${chartStackedYears.height} ${chartStackedYears.x(date)},0`)
        .style("display", null)
    },
    importData(event) {
      if(event.target.files.length) {
        let file = event.target.files[0];
        var reader = new FileReader();

        reader.onload = event => {
          let fileText = reader.result;
          this.init(fileText)
          this.dataLoad = false;
        }

        reader.readAsText(file);
      }
    },
  }
}
</script>

<style>
.years-list {
  font-size: 0.8em;
}
.channel-list {
  font-size: 0.8em;
}
</style>

<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col
          v-for="(chartName, i) in charts"
          :key="i"
          cols="12"
          md="8"
          offset-md="2"
        >
          <canvas :ref="chartName"></canvas>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
/* eslint-disable no-new */

import Chart from 'chart.js'
import * as R from 'ramda'

const defaultOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
}

export default {
  data() {
    return {
      questions: {},
      results: {},
    }
  },
  computed: {
    charts() {
      // prettier-ignore
      return R.pipe(
        R.flatten,
        R.map(R.prop('ask')
      ))(this.questions)
    },
  },
  async mounted() {
    const { data } = await this.$axios.get()

    this.questions = R.flatten(data.questions)
    // prettier-ignore
    this.results = R.pipe(
      R.toPairs,
      R.map(
        R.pipe(
          R.evolve([R.objOf('name')]),
          R.mergeAll
        )
      )
    )(data.results)

    await this.$nextTick()

    this.charts.forEach(this.drawChart)
  },
  methods: {
    drawChart(name) {
      const { responses } = R.find(
        R.pipe(R.prop('ask'), R.equals(name)),
        this.questions
      )

      const votes = R.pipe(
        R.groupBy(el => el[name]),
        R.map(R.length)
      )(this.results)

      const data = responses.map(possibility => votes[possibility] || 0)

      new Chart(this.$refs[name][0], {
        type: 'bar',
        options: {
          title: {
            display: true,
            text: name,
          },
          ...defaultOptions,
        },
        data: {
          labels: responses,
          datasets: [
            {
              data,
            },
          ],
        },
      })
    },
  },
}
</script>

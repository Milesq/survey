<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <canvas ref="canvas"></canvas>
        </v-col>

        <v-col
          v-for="(teammate, i) in removableTeammates"
          :key="i"
          cols="12"
          md="8"
          offset-md="2"
        >
          <canvas :ref="teammate"></canvas>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
/* eslint-disable no-new */

import Chart from 'chart.js'
import _ from 'lodash'

const countVotes = x =>
  Object.fromEntries(Object.entries(x).map(([x, votes]) => [x, votes.length]))

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
      removableTeammates: [],
    }
  },
  async mounted() {
    const { data } = await this.$axios.get()
    this.questions = data.questions
    this.results = Object.entries(data.results).map(
      ([name, possibilities]) => ({
        name,
        ...possibilities,
      })
    )

    this.managerChart()

    const limitations = this.questions.limitations
    this.removableTeammates = Object.entries(limitations).map(([el]) => el)
    await this.$nextTick()

    this.removableTeammates.forEach(teammate => {
      this.removeTeamMemberChart(this.$refs[teammate][0], teammate)
    })
  },
  methods: {
    managerChart() {
      let managerVotes = _.groupBy(this.results, ({ manager }) => manager)
      managerVotes = countVotes(managerVotes)
      managerVotes = this.questions.manager.map(el => managerVotes[el] || 0)

      new Chart(this.$refs.canvas, {
        type: 'bar',
        data: {
          labels: this.questions.manager,
          datasets: [
            {
              data: managerVotes,
            },
          ],
        },
      })
    },
    removeTeamMemberChart(ctx, teammate) {
      const possibilities = this.questions.limitations[teammate]

      let votes = _.groupBy(this.results, el => el.limitations[teammate])
      votes = countVotes(votes)
      votes = possibilities.map(possibility => votes[possibility] || 0)

      new Chart(ctx, {
        label: 'asd',
        type: 'bar',
        options: {
          title: {
            display: true,
            text: teammate,
          },
          ...defaultOptions,
        },
        data: {
          labels: possibilities,
          datasets: [
            {
              data: votes,
            },
          ],
        },
      })
    },
  },
}
</script>

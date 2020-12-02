<template>
  <v-stepper v-model="currentEl">
    <v-stepper-header class="mb-2">
      <v-spacer />

      <v-stepper-step :complete="currentEl > 1" step="1" />

      <template v-for="i in questions.length">
        <v-spacer :key="i + '-spacer'" />
        <v-stepper-step
          :key="`${i + 1}`"
          :complete="currentEl > i + 1"
          :step="i + 1"
        />
      </template>

      <v-spacer />
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-form ref="form-1" @submit.prevent="start">
          <v-text-field
            v-model="code"
            class="mt-4"
            outlined
            label="Access Code"
            :error-messages="codeExists ? [] : 'Podany kod nie istnieje'"
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn color="primary" type="submit">Start</v-btn>
          </div>
        </v-form>
      </v-stepper-content>

      <v-stepper-content
        v-for="(questionPart, i) in questions"
        :key="i"
        :step="i + 2"
      >
        <v-form :ref="`form-${i + 2}`" @submit.prevent="next">
          <v-select
            v-for="(question, j) in questionPart"
            :key="j"
            v-model="answers[question.ask]"
            :label="question.ask"
            :items="question.responses"
            :rules="[v => !!v || 'Item is required']"
          />

          <div class="d-flex justify-space-between">
            <v-btn text @click="currentEl--">Powrót</v-btn>
            <v-btn color="success" type="submit">
              {{ isTheLast ? 'Wyślij' : 'Dalej' }}
            </v-btn>
          </div>
        </v-form>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {
  data() {
    return {
      currentEl: 1,
      code: '',
      codeExists: true,
      questions: [],
      answers: {},
    }
  },
  computed: {
    isTheLast() {
      return this.currentEl - 1 === this.questions.length
    },
  },
  async mounted() {
    const {
      data: { questions },
    } = await this.$axios.get('/')

    this.questions = questions
  },
  methods: {
    async start() {
      const {
        data: { exists },
      } = await this.$axios.get(this.code)

      this.codeExists = exists
      if (!exists) return

      if (!this.$refs['form-1'].validate()) return

      this.currentEl = 2
    },
    next() {
      if (this.$refs[`form-${this.currentEl}`][0].validate()) {
        if (this.isTheLast) this.send()
        else this.currentEl++
      }
    },
    send() {
      console.log(this.answers)
    },
  },
}
</script>

<template>
  <v-stepper v-model="currentEl">
    <v-stepper-header class="mb-2">
      <v-spacer />

      <v-stepper-step :complete="currentEl > 1" step="1">
        Wybór kierownika
      </v-stepper-step>

      <v-spacer />

      <v-stepper-step :complete="currentEl > 2" step="2">
        Skład
      </v-stepper-step>

      <v-spacer />
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-form ref="form1">
          <v-text-field
            v-model="code"
            class="mt-4"
            outlined
            label="Access Code"
            :error-messages="codeExists ? [] : 'Podany kod nie istnieje'"
          ></v-text-field>

          <v-select
            v-model="selectedManager"
            label="Kierownik"
            :items="managers"
            :rules="[v => !!v || 'Item is required']"
          ></v-select>

          <div class="d-flex justify-end">
            <v-btn color="primary" @click="next">Next</v-btn>
          </div>
        </v-form>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-form ref="form2">
          <v-select
            v-for="(untrusted, i) in untrastedUsers"
            :key="i"
            v-model="selectedLimitations[untrusted.name]"
            :label="untrusted.name"
            :items="untrusted.possibilities"
            :rules="[v => !!v || 'Item is required']"
          />

          <div class="d-flex justify-space-between">
            <v-btn text @click="currentEl = 1">Powrót</v-btn>
            <v-btn color="success" @click="send">Wyślij</v-btn>
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
      managers: [],
      limitations: {},

      selectedLimitations: {},
      selectedManager: '',
    }
  },
  computed: {
    untrastedUsers() {
      return Object.entries(this.limitations).map(([name, possibilities]) => ({
        name,
        possibilities,
      }))
    },
  },
  async mounted() {
    const {
      data: {
        answers: { limitations, manager },
      },
    } = await this.$axios.get('/')

    this.managers = manager
    this.limitations = limitations
  },
  methods: {
    async next() {
      const {
        data: { exists },
      } = await this.$axios.get(this.code)

      this.codeExists = exists
      if (!exists) return

      if (!this.$refs.form1.validate()) return

      this.currentEl = 2
    },
    send() {
      if (!this.$refs.form2.validate()) return
      const body = {
        manager: this.selectedManager,
        limitations: {
          ...this.selectedLimitations,
        },
      }

      this.$axios.post(this.code, body).then(() => {
        this.$router.push('/results')
      })
    },
  },
}
</script>

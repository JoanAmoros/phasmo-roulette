<script setup lang="ts">
import {computed, ref} from 'vue'
import {next_status, Status} from "@/ghosts/status"
import {Evidence, EvidenceType} from "@/ghosts/evidence"
import {Ghost} from "@/ghosts/ghost"

const base_url = 'https://wheelofnames.com/api'
const api_key_input = ref("")
const error = ref(null)
const old_wheel_url = ref(null)
const wheel_url = ref(null)
const api_key = ref(localStorage.getItem('api_key'))

function refresh_evidence(): Array<Evidence> {
  return [
    new Evidence(EvidenceType.Dots),
    new Evidence(EvidenceType.Writing),
    new Evidence(EvidenceType.EMF5),
    new Evidence(EvidenceType.Orbs),
    new Evidence(EvidenceType.UV),
    new Evidence(EvidenceType.SpiritBox),
    new Evidence(EvidenceType.Freezing),
  ]
}

const evidences: ref<Array<Evidence>> = ref(refresh_evidence())

function refresh_ghosts(): Array<Ghost> {
  return [
    new Ghost("Spirit", [EvidenceType.Writing, EvidenceType.EMF5, EvidenceType.SpiritBox]),
    new Ghost("Wraith", [EvidenceType.Dots, EvidenceType.EMF5, EvidenceType.SpiritBox]),
    new Ghost("Phantom", [EvidenceType.Dots, EvidenceType.UV, EvidenceType.SpiritBox]),
    new Ghost("Poltergeist", [EvidenceType.Writing, EvidenceType.UV, EvidenceType.SpiritBox]),
    new Ghost("Banshee", [EvidenceType.Dots, EvidenceType.Orbs, EvidenceType.UV]),
    new Ghost("Jinn", [EvidenceType.EMF5, EvidenceType.UV, EvidenceType.Freezing]),
    new Ghost("Mare", [EvidenceType.Writing, EvidenceType.Orbs, EvidenceType.SpiritBox]),
    new Ghost("Revenant", [EvidenceType.Writing, EvidenceType.Orbs, EvidenceType.Freezing]),
    new Ghost("Shade", [EvidenceType.Writing, EvidenceType.EMF5, EvidenceType.Freezing]),
    new Ghost("Demon", [EvidenceType.Writing, EvidenceType.UV, EvidenceType.Freezing]),
    new Ghost("Yurei", [EvidenceType.Dots, EvidenceType.Orbs, EvidenceType.Freezing]),
    new Ghost("Oni", [EvidenceType.Dots, EvidenceType.EMF5, EvidenceType.Freezing]),
    new Ghost("Yokai", [EvidenceType.Dots, EvidenceType.Orbs, EvidenceType.SpiritBox]),
    new Ghost("Hantu", [EvidenceType.Orbs, EvidenceType.UV, EvidenceType.Freezing]),
    new Ghost("Goryo", [EvidenceType.Dots, EvidenceType.EMF5, EvidenceType.UV]),
    new Ghost("Myling", [EvidenceType.Writing, EvidenceType.EMF5, EvidenceType.UV]),
    new Ghost("Onryo", [EvidenceType.Orbs, EvidenceType.Freezing, EvidenceType.SpiritBox]),
    new Ghost("The Twins", [EvidenceType.EMF5, EvidenceType.Freezing, EvidenceType.SpiritBox]),
    new Ghost("Raiju", [EvidenceType.Dots, EvidenceType.EMF5, EvidenceType.Orbs]),
    new Ghost("Obake", [EvidenceType.EMF5, EvidenceType.Orbs, EvidenceType.UV]),
    new Ghost("The Mimic", [EvidenceType.UV, EvidenceType.Freezing, EvidenceType.SpiritBox, EvidenceType.Orbs]),
    new Ghost("Moroi", [EvidenceType.Writing, EvidenceType.Freezing, EvidenceType.SpiritBox]),
    new Ghost("Deogen", [EvidenceType.Dots, EvidenceType.Writing, EvidenceType.SpiritBox]),
    new Ghost("Thaye", [EvidenceType.Dots, EvidenceType.Writing, EvidenceType.Orbs]),
  ]
}

const ghosts: ref<Array<Ghost>> = ref(refresh_ghosts())

function refresh_all() {
  evidences.value = refresh_evidence()
  ghosts.value = refresh_ghosts()
}

function toggle_evidence(evidence: Evidence) {
  evidence.status = next_status(evidence.status)
}

function toggle_ghost(ghost: Ghost) {
  ghost.status = ghost.status === Status.Unselected
    ? Status.Crossed
    : Status.Unselected
}

const selected_evidences = computed(() =>
  evidences.value.filter(evidence => evidence.status === Status.Selected)
)

const crossed_evidences = computed(() =>
  evidences.value.filter(evidence => evidence.status === Status.Crossed)
)

const possible_ghosts = computed(() => {
  // Has to contain the selected evidences and NOT contain the crossed ones.
  ghosts.value.filter(ghost =>
    ghost.status !== Status.Crossed
    && (
      selected_evidences.value.length === 0
      || selected_evidences.value.every(ev => ghost.evidences.includes(ev.type))
    )
    && !crossed_evidences.value.some(ev => ghost.evidences.includes(ev.type))
  ).map(ghost => ghost.name)
})

function set_api_key() {
  if (api_key_input.value !== "") {
    error.value = null
    const url = `${base_url}/users/info`
    fetch(url, {headers: {'Accept': 'text/plain', 'x-api-key': api_key.value}})
      .then(response => {
        if (response.status === 200) {
          localStorage.setItem("api_key", api_key_input.value)
          api_key.value = api_key_input.value
          api_key_input.value = ""
        } else if (response.status === 401) {
          error.value = "The API key provided is not valid."
        } else {
          error.value = "An unexpected error happened, please try again."
        }
      })
      .catch(() => {
        error.value = "An unexpected error happened, please try again."
      })
  }
}

function fetch_user() {

}

function create_wheel() {
  console.log("Creating wheel with ghosts:", possible_ghosts.value)
}
</script>

<template>
  <div class="container">
    <div class="row" v-if="api_key === null">
      <div class="input-field col s9 m7 l6 mt-3">
        <input placeholder="Enter your wheelofnames.com API key" id="api_key" type="password"
          @keyup.enter="set_api_key" v-model="api_key_input"
        >
        <label for="first_name" class="active">API key</label>
      </div>
      <div class="col s3 m2 mt-4">
        <button class="btn" @click="set_api_key">Save</button>
      </div>
      <div class="col s12" v-if="error !== null">
        {{ error }}
      </div>
    </div>
    <div class="row" v-else>
      <div class="col s12 m6">
        <div class="row">
          <div class="col s12">
            <h4>Evidences</h4>
          </div>
          <div class="col s12 m4 item no-select" v-for="evidence in evidences" @click="() => toggle_evidence(evidence)"
            :class="{selected: evidence.status === Status.Selected, crossed: evidence.status === Status.Crossed}"
          >
            <span>{{ evidence.type }}</span>
          </div>
          <div class="col s12">
            <h4>Ghost Types</h4>
          </div>
          <div class="col s12 m4 item no-select" v-for="ghost in ghosts" @click="() => toggle_ghost(ghost)"
            :class="{selected: ghost.status === Status.Selected, crossed: ghost.status === Status.Crossed}"
          >
            <span>{{ ghost.name }}</span>
          </div>
        </div>
      </div>
      <div class="col s12 m6" style="padding-top: 2rem;">
         <iframe :src="wheel_url" width="100%" height="800" v-if="wheel_url !== null"></iframe>
      </div>
    </div>
  </div>
</template>

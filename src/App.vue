<template>
  <div id="app">
    <div class="tuning">
      Tuning
      <select v-model="string1">
        <option value="0">E</option>
        <option value="1">F</option>
        <option value="2">F#/Gb</option>
        <option value="3">G</option>
        <option value="4">G#/Ab</option>
        <option value="5">A</option>
        <option value="6">A#/Bb</option>
        <option value="7">B</option>
        <option value="8">C</option>
        <option value="9">C#/Db</option>
        <option value="10">D</option>
        <option value="11">D#/Eb</option>
      </select>
      <select v-model="string2">
        <option value="0">E</option>
        <option value="1">F</option>
        <option value="2">F#/Gb</option>
        <option value="3">G</option>
        <option value="4">G#/Ab</option>
        <option value="5">A</option>
        <option value="6">A#/Bb</option>
        <option value="7">B</option>
        <option value="8">C</option>
        <option value="9">C#/Db</option>
        <option value="10">D</option>
        <option value="11">D#/Eb</option>
      </select>
      <select v-model="string3">
        <option value="0">E</option>
        <option value="1">F</option>
        <option value="2">F#/Gb</option>
        <option value="3">G</option>
        <option value="4">G#/Ab</option>
        <option value="5">A</option>
        <option value="6">A#/Bb</option>
        <option value="7">B</option>
        <option value="8">C</option>
        <option value="9">C#/Db</option>
        <option value="10">D</option>
        <option value="11">D#/Eb</option>
      </select>
      <select v-model="string4">
        <option value="0">E</option>
        <option value="1">F</option>
        <option value="2">F#/Gb</option>
        <option value="3">G</option>
        <option value="4">G#/Ab</option>
        <option value="5">A</option>
        <option value="6">A#/Bb</option>
        <option value="7">B</option>
        <option value="8">C</option>
        <option value="9">C#/Db</option>
        <option value="10">D</option>
        <option value="11">D#/Eb</option>
      </select>
      <select v-model="string5">
        <option value="0">E</option>
        <option value="1">F</option>
        <option value="2">F#/Gb</option>
        <option value="3">G</option>
        <option value="4">G#/Ab</option>
        <option value="5">A</option>
        <option value="6">A#/Bb</option>
        <option value="7">B</option>
        <option value="8">C</option>
        <option value="9">C#/Db</option>
        <option value="10">D</option>
        <option value="11">D#/Eb</option>
      </select>
      <select v-model="string6">
        <option value="0">E</option>
        <option value="1">F</option>
        <option value="2">F#/Gb</option>
        <option value="3">G</option>
        <option value="4">G#/Ab</option>
        <option value="5">A</option>
        <option value="6">A#/Bb</option>
        <option value="7">B</option>
        <option value="8">C</option>
        <option value="9">C#/Db</option>
        <option value="10">D</option>
        <option value="11">D#/Eb</option>
      </select>
    </div>

    <div class="notes">
      <input type="checkbox" id="E" name="E" value="0" v-model="notes"><span>E</span>
      <input type="checkbox" id="F" name="F" value="1" v-model="notes"><span>F</span>
      <input type="checkbox" id="Gb" name="Gb" value="2" v-model="notes"><span>F#/Gb</span>
      <input type="checkbox" id="G" name="G" value="3" v-model="notes"><span>G</span>
      <input type="checkbox" id="Ab" name="Ab" value="4" v-model="notes"><span>G#/Ab</span>
      <input type="checkbox" id="A" name="A" value="5" v-model="notes"><span>A</span>
      <input type="checkbox" id="Bb" name="Bb" value="6" v-model="notes"><span>A#/Bb</span>
      <input type="checkbox" id="B" name="B" value="7" v-model="notes"><span>B</span>
      <input type="checkbox" id="C" name="C" value="8" v-model="notes"><span>C</span>
      <input type="checkbox" id="Db" name="Db" value="9" v-model="notes"><span>C#/Db</span>
      <input type="checkbox" id="D" name="D" value="10" v-model="notes"><span>D</span>
      <input type="checkbox" id="Eb" name="Eb" value="11" v-model="notes"><span>D#/Eb</span>
    </div>

  <div class="selectbox" >
    Root
    <select id="root" v-model="root">
      <option disabled value="">---</option>
      <option value="0">E</option>
      <option value="1">F</option>
      <option value="2">F#/Gb</option>
      <option value="3">G</option>
      <option value="4">G#/Ab</option>
      <option value="5">A</option>
      <option value="6">A#/Bb</option>
      <option value="7">B</option>
      <option value="8">C</option>
      <option value="9">C#/Db</option>
      <option value="10">D</option>
      <option value="11">D#/Eb</option>
    </select>
  </div>

    <button v-on:click="update">Update</button>
    <img id="fretboard" v-if="show === true" src="http://localhost:3000/image" />
    <img class="spinner" v-if="loading" src="./assets/spinner.gif" />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data: function () {
    return {
      show: false,
      loading: false,
      root: "",
      notes: [],
      string1: '0',
      string2: '5',
      string3: '10',
      string4: '3',
      string5: '7',
      string6: '0'
    }
  },
  methods: {
    update() {
      let data = {
          notes: this.notes,
          root: this.root,
          tuning: [ this.string1, this.string2, this.string3, this.string4, this.string5, this.string6 ]
        };

        this.show = false;
        this.loading = true;

        axios.post('http://localhost:3000/update', data).then((result) => {
          this.show = true;
          this.loading = false;
          return result.data;
        })
        .catch(error => {
          console.log(error.response)
        });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
img {
  width: 100%;
}
.spinner {
  display: block;
  width: 100px;
  height: 100px;
}
input[type='checkbox'] {
  width: 16px;
  height: 16px;
  margin-left: 30px;
}
.notes {
  margin-bottom: 20px;
}
.selectbox {
  margin-bottom: 20px;
}
select #root {
  width: 80px;
  height: 22px;
}
.tuning {
  margin-bottom: 20px;
}
</style>

<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-4">
          <b-alert show>MAKE</b-alert>
          <input type="range" v-model="boxSize" min="10" max="250" /> {{ boxSize }} <br>
          <input type="range" v-model="boxMargin" min="0" max="20" /> {{ boxMargin }} <br>
          <input type="range" v-model="numberOfBoxes.width" min="2" max="100" @change="draw"/> {{ numberOfBoxes.width }} <br>
          <input type="range" v-model="numberOfBoxes.height" min="2" max="100" @change="draw"/> {{ numberOfBoxes.height }} <br>
          <swatches v-model="colors" @change-color="onChange"></swatches>

          <button @click="addBox"> Add Box </button>
        </div>
        <div class="col-8">
          <b-alert show>ART</b-alert>
          <div class="clearfix" id="back" :style="'background-color:' + backColor + ';'">
          <ul id="box">
            <li :class="box.style" v-for="box in boxes" :style="'width:' + boxSize + 'px; height:' + boxSize +'px; background-color:' + box.color +'; margin:' + boxMargin + 'px;'">
            </li>
          </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import { Swatches } from 'vue-color'

export default {
  name: 'app',
    components: {
        Swatches
    },
  data () {
    return {
      numberOfBoxes: {
          height: 10,
          width: 10
      },
      colors: {
          hex: '#ffffff',
      },
      boxColors:['black','white'],
      boxSize: 40,
      backColor: '#ddd',
      boxMargin: '0',
      boxes: [
      ]
    }
  },

    methods: {
        addBox(){
            //is this the correct way, this works otherwise I got some __ob__ Observable
            this.$set(this.boxColors,this.boxColors.length,this.colors.hex);
            this.draw();
        },
        removeBox(index){
            this.boxes.splice(index,1); // why is this removing only the last row?
        },
        draw(){
            this.boxes = [];
            for (let boxCount = 0; boxCount < (this.numberOfBoxes.width*this.numberOfBoxes.height); ) {
                let boxStyle = 'box';

                for (let i = 0; i < this.boxColors.length; i++) {

                    if((boxCount % this.numberOfBoxes.width) == 0){
                        boxStyle = 'box clear';
                    } else {
                        boxStyle = 'box';
                    }
                    this.boxes.push({color: this.boxColors[i], style:boxStyle});
                    boxCount++
                    if(boxCount == this.numberOfBoxes.width*this.numberOfBoxes.height) {
                        break;
                    }
                }
            }
        },
        onChange (val) {
            this.colors = val
        }
    },

    beforeMount(){
        this.draw()
    },

}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.box {
  margin: 0;
  float:left;
}
.clear {
  clear: both;
}
.clearfix:after {
  content: ".";
  display: block;
  clear: both;
  visibility: hidden;
  line-height: 0;
  height: 0;
}

.clearfix {
  display: inline-block;
}

html[xmlns] .clearfix {
  display: block;
}

* html .clearfix {
  height: 1%;
}

</style>

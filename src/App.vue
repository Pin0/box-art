<template>
    <div id="app">
        <div class="container">
            <div class="row">
                <div class="col-4">
                    <b-alert show>{{ title }}</b-alert>
                    <input type="range" v-model="boxMargin" min="0" max="20" v-b-tooltip.hover title="Margin"/> {{ boxMargin }} <br>
                    <input type="range" v-model="numberOfBoxes.width" min="2" max="100" @change="draw" v-b-tooltip.hover title="Width"/> {{ numberOfBoxes.width }} <br>
                    <input type="range" v-model="numberOfBoxes.height" min="2" max="100" @change="draw" v-b-tooltip.hover title="Height"/> {{ numberOfBoxes.height }} <br>

                    <div class="clear">
                        <ul id="boxcolors" class="clearfix">
                            <li v-for="boxColor in boxColors" :style="'background-color:' + boxColor +';'">
                                <span v-on:click="removeColorBox(boxColor)">X</span>
                            </li>
                        </ul>
                    </div>
                    <div class="clear">
                        Background <div v-on:click="showBgColorModal()" class="pickbackground" :style="'background-color:' + backColor + ';'"></div>
                    </div>

                    <div class="clear">
                        <button @click="showColorModal()">Add Color</button>
                        <button @click="download()">Download</button>
                    </div>
                </div>
                <div class="col-8">
                    <div class="clearfix" ref="downloadMe" id="back" :style="'background-color:' + backColor + ';padding: ' + boxMargin + 'px;'">
                        <ul id="box">
                            <li :class="box.style" v-for="box in boxes"
                                :style="'width: calc(' + boxPercentage + '% - ' + (boxMargin*2) + 'px); padding-bottom: calc(' + boxPercentage + '% - ' + (boxMargin*2) + 'px); background-color:' + box.color +'; margin:' + boxMargin + 'px;'">
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <b-modal v-model="colorModalShow" title="Add color" ok-title="Add color" @ok="addBox()">
            <swatches v-model="colors" @change-color="onChangeColor"></swatches>
        </b-modal>
        <b-modal v-model="downloadModal" size="lg" title="Download" ok-only>
            <img class="downloadimage" :src="output">
        </b-modal>
        <b-modal v-model="backgroundColorModal" size="lg" title="Choose Background Color" ok-title="Set Background Color" @ok="setBgColor()">
            <swatches v-model="bgcolors" @change-color="onChangeBgColor"></swatches>
        </b-modal>
    </div>
</template>


<script>
    import {Swatches} from 'vue-color'
    import bModal from 'bootstrap-vue/es/components/modal/modal'

    export default {
        name: 'app',
        components: {
            Swatches,
            'b-modal': bModal
        },
        data() {
            return {
                title: 'ENB BOX ART',
                output: null,
                colorModalShow: false,
                backgroundColorModal: false,
                downloadModal: false,
                numberOfBoxes: {
                    height: 10,
                    width: 10
                },
                colors: {
                    hex: '#ffffff',
                },
                bgcolors: {
                    hex: '#ffffff',
                },
                boxColors: ['black', 'white', 'gray'],
                //  boxPercentage: 100,
                backColor: '#ddd',
                boxMargin: '0',
                boxes: []
            }
        },
        computed: {
            boxPercentage: function () {
                return 100 / this.numberOfBoxes.width;
            }
        },

        methods: {
            addBox() {
                //is this the correct way, this works otherwise I got some __ob__ Observable
                this.$set(this.boxColors, this.boxColors.length, this.colors.hex);
                this.draw();
            },

            removeColorBox: function (index) {
                this.boxColors.splice(index, 1);
                this.draw();
            },
            draw() {
                this.boxes = [];
                if (this.boxColors.length == 0) {
                    return;
                }
                for (let boxCount = 0; boxCount < (this.numberOfBoxes.width * this.numberOfBoxes.height);) {
                    let boxStyle = 'box';

                    for (let i = 0; i < this.boxColors.length; i++) {

                        if ((boxCount % this.numberOfBoxes.width) == 0) {
                            boxStyle = 'box clear';
                        } else {
                            boxStyle = 'box';
                        }
                        this.boxes.push({color: this.boxColors[i], style: boxStyle});
                        boxCount++
                        if (boxCount == this.numberOfBoxes.width * this.numberOfBoxes.height) {
                            break;
                        }
                    }

                }
            },
            setBgColor() {
                this.backColor = this.bgcolors.hex;
            },
            onChangeColor(val) {
                this.colors = val;
            },
            onChangeBgColor(val) {
                this.bgcolors = val;
            },
            hideColorModal() {
                this.colorModalShow = false;
            },
            showColorModal() {
                this.colorModalShow = true;
            },
            showBgColorModal() {
                this.backgroundColorModal = true;
            },
            download() {
                self = this;
                this.downloadModal = true;
                const el = this.$refs.downloadMe;
                // add option type to get the image version
                // if not provided the promise will return
                // the canvas.
                const options = {
                    type: 'dataURL'
                }
                this.$html2canvas(el, options).then(function (result) {
                    self.output = result;
                });

            }
        },

        beforeMount() {
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
        float: left;
    }

    #boxcolors {
        li {
            float: left;
            display: inline-block;
            margin: 0 10px;
            width: 20px;
            height: 20px;
            border: 1px solid #d1ecf1;
            cursor: pointer;

            span {
                font-weight: bold;
                font-size: 1em;
                color: white;
            }
        }
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

    #back {
        width: 100%;
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

    h1 {
        height: 120px;
        line-height: 120px;
        text-align: center;
    }

    .vc-chrome {
        position: absolute;
        top: 35px;
        right: 0;
        z-index: 9;
    }

    .current-color {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-color: #000;
        cursor: pointer;
    }
    .pickbackground {
        width: 20px;
        height:20px;
        display: inline-block;
        cursor: pointer;
    }

    .downloadimage {
        width: 100%;
    }
</style>

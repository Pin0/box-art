<template>
    <div id="app">
        <div class="container-fluid">
            <div class="row">
                <div class="col-4">
                    <b-alert show> {{ title }} </b-alert>
                    <int-input v-model="boxMargin" title="Margin" tooltip="Set the space between boxes"></int-input>
                    <int-input v-model="numberOfBoxes.width" @update="draw()" title="Horizontal boxes" tooltip="Set the number of boxes horizontally"></int-input>
                    <int-input v-model="numberOfBoxes.height" @update="draw()" title="Verical boxes" tooltip="Set the number of boxes verticaly"></int-input>
                    <int-input v-model="numberOfGradientColors" @update="draw()" title="Gradient colors" tooltip="Set the number of gradient colors"></int-input>


                    <div class="row">
                        <div class="col text-left"><h5 v-b-tooltip.hover title="Click a color to remove it">Chosen colors</h5></div>
                        <div class="col">
                            <ul id="boxcolors" class="clearfix">
                                <li v-for="(boxColor,index) in boxColors"
                                    v-on:click="removeColorBox(index)"
                                    v-bind:class="{
                                        'colorbox': true,
                                        'white': boxColor.toUpperCase() == 'RGBA(255,255,255,1)',
                                        'trans': boxColor.toUpperCase() == 'RGBA(0,0,0,0)'
                                        }"
                                    :style="'background-color:' + boxColor +';'"
                                >
                                    <span><fa-icon icon="times"/></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-left"><h5 v-b-tooltip.hover title="Add gradient color to replace">Chosen gradient</h5></div>
                        <div class="col">
                            <ul class="clearfix gradientcolors">
                                <li v-for="gradientColor in gradientColors" :style="'background-color:' + gradientColor +';'">
                                    <span></span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col text-left"><h5 v-b-tooltip.hover title="Click color area to change background">Background</h5></div>
                        <div class="col">
                            <div v-on:click="showBgColorModal()" class="pickbackground" :style="'background-color:' + backColor + ';'">Click to change</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <hr/>
                        </div>
                    </div>

                    <div class="row tools">
                        <div class="col">
                            <button type="button" class="btn btn-success" @click="showColorModal()">Add color</button>
                            <button type="button" class="btn btn-success" @click="addTransparentColor()">Add transparent</button>
                            <button type="button" class="btn btn-success" @click="showGradientColorModal()">Add gradient color</button>
                            <button type="button" class="btn btn-success" @click="gradient()">Set gradient</button>
                            <button type="button" class="btn btn-success" @click="download()">Download <fa-icon icon="download"/></button>
                        </div>
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
        <b-modal v-model="colorModalShow" size="lg" title="Add color" ok-title="Add color" @ok="addColorBox()">
            <color-picker v-model="colors" :palette="defaultColors" @change-color="onChangeColor"></color-picker>
        </b-modal>
        <b-modal v-model="downloadModal" size="lg" title="Download" ok-only>
            <img class="downloadimage" :src="output">
        </b-modal>
        <b-modal v-model="backgroundColorModal" size="lg" title="Choose Background Color" ok-title="Set Background Color" @ok="setBgColor()">
            <color-picker v-model="bgcolors" :palette="defaultColors" @change-color="onChangeBgColor"></color-picker>
        </b-modal>
        <b-modal v-model="gradientColorModal" size="lg" title="Choose Gradient Color" ok-title="Set Gradient Color" @ok="addGradientColor()">
            <color-picker v-model="colors" :palette="defaultColors" @change-color="onChangeColor"></color-picker>
        </b-modal>
    </div>
</template>


<script>
    import {Swatches} from 'vue-color'
    import bModal from 'bootstrap-vue/es/components/modal/modal'
   // import { library } from '@fortawesome/fontawesome-svg-core'
   // import { faCoffee } from '@fortawesome/free-solid-svg-icons'
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    //import setIntValue from 'setIntValue'

    import setIntValue from './setIntValue.vue'
    import material from 'material-colors'


    // var colorMap = [
    //     'white', 'pink', 'purple', 'deepPurple',
    //     'indigo', 'blue', 'lightBlue', 'cyan',
    //     'teal', 'green', 'lightGreen', 'lime',
    //     'yellow', 'amber', 'orange', 'deepOrange',
    //     'brown', 'blueGrey', 'black'
    // ]
    // var colorLevel = ['900', '700', '500', '300', '100']
    // var defaultColors = (() => {
    //     var colors = []
    //     colorMap.forEach((type) => {
    //         var typeColor = []
    //         if (type.toLowerCase() === 'black' || type.toLowerCase() === 'white') {
    //             typeColor = typeColor.concat(['#000000', '#FFFFFF'])
    //         } else {
    //             colorLevel.forEach((level) => {
    //                 const color = material[type][level]
    //                 typeColor.push(color.toUpperCase())
    //             })
    //         }
    //         colors.push(typeColor)
    //     })
    //     return colors
    // })()

    export default {
        name: 'app',
        components: {
            'color-picker':  Swatches,
            'b-modal': bModal,
            'fa-icon': FontAwesomeIcon,
            'int-input': setIntValue
        },
        data() {
            return {
                title: 'ENB BOX ART',
                output: null,
                colorModalShow: false,
                backgroundColorModal: false,
                downloadModal: false,
                gradientColorModal:false,
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
                boxColors: ['RGBA(0,0,0,1)', 'RGBA(255,255,255,1)', '#808080'],
                gradientColors: ['RGBA(0,0,0,1)', 'RGBA(255,255,255,1)'],
                //  boxPercentage: 100,
                backColor: '#ddd',
                boxMargin: '5',
                numberOfGradientColors: 10,
                boxes: [],
                defaultColors: []
            }
        },
        computed: {
            boxPercentage: function () {
                return 100 / this.numberOfBoxes.width;
            }
        },
        methods: {
            addColorBox() {
                var rgba = 'RGBA(' + this.colors.rgba.r + ',' + this.colors.rgba.g + ',' + this.colors.rgba.b + ',' + this.colors.rgba.a + ')';
                //is this the correct way, this works otherwise I got some __ob__ Observable
                this.$set(this.boxColors, this.boxColors.length, rgba);
                this.draw();
            },
            addGradientColor() {
                //is this the correct way, this works otherwise I got some __ob__ Observable
                this.gradientColors.shift();
                this.$set(this.gradientColors, this.gradientColors.length, this.colors.hex);
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
            // hideColorModal() {
            //     this.colorModalShow = false;
            // },
            showColorModal() {
                this.colorModalShow = true;
            },
            showBgColorModal() {
                this.backgroundColorModal = true;
            },
            showGradientColorModal() {
                this.gradientColorModal = true;
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

            },
            decreaseBoxMargin() {
                this.boxMargin--;
                if(this.boxMargin <=0) {
                    this.boxMargin = 0;
                }
            },
            increaseBoxMargin() {
                this.boxMargin++;
            },
            gradient(){
                if (typeof this.gradientColors[0] !== 'undefined' && typeof this.gradientColors[1] !== 'undefined') {
                    var color1 = this.gradientColors[0];
                    var color2 = this.gradientColors[1];
                } else {
                    var color1 = this.getRandomColor();
                    var color2 = this.getRandomColor();
                }

                var rgb1 = this.hexToRgb(color1);
                var rgb2 = this.hexToRgb(color2);

                var gradientColors = this.interpolateColors(rgb1,rgb2,this.numberOfGradientColors);

                this.boxColors = gradientColors;
                this.draw();

            },
            interpolateColor(color1, color2, factor) {
                if (arguments.length < 3) {
                    factor = 0.5;
                }

                var color = {
                    r: Math.round(color1.r + factor * (color2.r - color1.r)),
                    g: Math.round(color1.g + factor * (color2.g - color1.g)),
                    b: Math.round(color1.b + factor * (color2.b - color1.b))
                };

                var hexColor = this.fullColorHex(color.r,color.g,color.b);
                //var result = color1.slice();
                // for (var i = 0; i < 3; i++) {
                //     result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
                // }
                return hexColor;
            },
    // My function to interpolate between two colors completely, returning an array
            interpolateColors(color1, color2, steps) {
                var stepFactor = 1 / (steps - 1),
                    interpolatedColorArray = [];

                // color1 = color1.match(/\d+/g).map(Number);
                // color2 = color2.match(/\d+/g).map(Number);

                for(var i = 0; i < steps; i++) {
                    interpolatedColorArray.push(this.interpolateColor(color1, color2, stepFactor * i));
                }

                return interpolatedColorArray;
            },
            rgbToHex(rgb) {
                var hex = Number(rgb).toString(16);
                if (hex.length < 2) {
                    hex = "0" + hex;
                }
                return hex;
            },
            fullColorHex(r,g,b) {
                var red = this.rgbToHex(r);
                var green = this.rgbToHex(g);
                var blue = this.rgbToHex(b);
                return '#'+red+green+blue;
            },
            hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            },
            getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            },
            addTransparentColor()
            {
                this.boxColors.push('RGBA(0,0,0,0)');
                this.draw();
            }
        },

        beforeMount() {
            //overwrite default color of color picker to add grayscales and transparent color
            var colorMap = [
                    'red', 'pink', 'purple', 'deepPurple',
                    'indigo', 'blue', 'lightBlue', 'cyan',
                    'teal', 'green', 'lightGreen', 'lime',
                    'yellow', 'amber', 'orange', 'deepOrange',
                    'brown', 'blueGrey', 'black'
                ]
            var colorLevel = ['900', '700', '500', '300', '100']
            this.defaultColors = (() => {
                var colors = []
                colorMap.forEach((type) => {
                    var typeColor = []
                    if (type.toLowerCase() === 'black' || type.toLowerCase() === 'white') {
                        typeColor = typeColor.concat(['#000000','#323232', '#7F7F7F','#CCCCCC', '#FFFFFF'])
                        //console.log(typeColor);
                    } else {
                        colorLevel.forEach((level) => {
                            const color = material[type][level]
                            typeColor.push(color.toUpperCase())
                        })
                    }
                    colors.push(typeColor)
                })

                return colors
            })();
            this.draw();
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
        float:right;
        li {
            float: left;
            display: inline-block;
            margin: 0;
            border: 1px solid #d1ecf1;
            padding: .375rem .75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: .25rem;
           // width: 40px;
           // height: 40px;
           // border: 1px solid #d1ecf1;
            cursor: pointer;
            color: white;
            span {
                font-weight: bold;
                font-size: 1em;
            }
        }

        .white, .trans {
             color: black;
        }
        .trans {
            background-image: url("dist/transparency10.png");
            background-repeat: repeat;
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
        border-radius: .25rem;
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
        height:38px;
        width: 164px;
        float: right;
        border: 1px solid #d1ecf1;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        display: inline-block;
        color:white;
        cursor: pointer;
        margin-bottom: 0.5em;
    }
    .gradientcolors {
        float:right;
        li {
            float: left;
            display: inline-block;
            margin: 0;
            border: 1px solid #d1ecf1;
            padding: .375rem .75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: .25rem;
            width: 40px;
            height: 40px;
        }
    }
    .downloadimage {
        width: 100%;
    }
    .btn-circle {
        width: 30px;
        height: 30px;
        text-align: center;
        padding: 6px 0;
        font-size: 12px;
        line-height: 1.428571429;
        border-radius: 15px;
    }
    .tools button{
        margin: 0.5em;
    }
    hr {
        border-top: 1px solid #bee5eb;
    }

</style>

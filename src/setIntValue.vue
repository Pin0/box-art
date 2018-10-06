<template>
    <div class="row setintvalue">
        <div class="col text-left"><h5 v-b-tooltip.hover v-bind:title="tooltip">{{ title }}</h5></div>
        <div class="col">
            <div class="input-group">
                <span class="input-group-btn">
                    <button type="button" @click="decrease()" class="btn btn-danger btn-number">
                        <font-awesome-icon icon="minus"/>
                    </button>
                </span>
                <input type="text" :value="value" v-on:input="parse($event.target.value)" class="form-control input-number">
                <span class="input-group-btn">
                    <button type="button" @click="increase()" class="btn btn-success btn-number">
                        <font-awesome-icon icon="plus"/>
                    </button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>

    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    //module.exports = {
    export default {
        props: ['value','title','tooltip'],
        name: 'setIntValue',
        components: {
            FontAwesomeIcon
        },
        data () {
            return {
                content: this.value
            }
        },
        computed: {
            function () {
                return this.content
            }
        },
        methods: {
            decrease() {
                this.content--;
                if(this.content <=0) {
                    this.content = 0;
                }
                this.$emit('input', this.content)
                this.$emit('update')

            },
            increase() {
                this.content++;
                this.$emit('input', this.content)
                this.$emit('update')
            },
            parse(v) {
                this.$emit('input', v)
                this.$emit('update')
            }
        }
    }
</script>

<style scoped>
    .setintvalue {
        margin-bottom: 0.5em;
    }
</style>
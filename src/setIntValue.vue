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
                <input type="text" v-bind:value="value" v-on:input="updateParent($event.target.value)" class="form-control input-number">
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
        data: function () {
            return {
                intValue: this.value
            }
        },
        methods: {
            updateParent: function (value) {
                this.intValue = value; //set intValue on update so value is passed correct to parent
                this.$emit('input', this.intValue); //@todo why should we do this in every function? this is ugly...
                this.$emit('update')
            },
            decrease() {
                this.intValue--;
                if(this.intValue <=0) {
                    this.intValue = 0;
                }
                this.$emit('input', this.intValue)
                this.$emit('update')

            },
            increase: function () {
                this.intValue ++
                this.$emit('input', this.intValue)
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
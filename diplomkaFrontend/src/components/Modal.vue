<template>
    <transition appear>
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            default header
                        </slot>
                        <IconClose type="button" class="ml-2 col-1" @click="closeModal"/>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            default body
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="modal-default-button rounded border px-3 py-2 greyColor text-light" @click="closeModal">
                                Zavřít
                            </button>
                        </slot>
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import IconClose from './icons/IconClose.vue';
    export default {
        name: "Modal",
        emits: ['close'],
        components: {IconClose},
        props: {
            modalOpen: {
                type: Boolean,
                default: false,
            }
        },
        methods: {
            closeModal() {
                this.$emit('update:modalOpen', false);
                this.$emit('close');
            }
        }
    }
</script>
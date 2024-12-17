<template>
    <div>
        <video id='video1' class="video" :src="src" autoplay="true" duration="" controls="true" danmu-btn="false"
            enable-danmu="false" :loop="true" muted="true" initial-time="" direction="-90" show-mute-btn="true"
            @play="onstart" @pause="onpause" @ended="onfinish" @error="onfail" @waiting="waiting"
            @timeupdate="timeupdate" @fullscreenchange="fullscreenchange"></video>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                src: "https://aimg8.dlssyht.cn/u/2219650/wap/mp4/1110/645aedbca35475.68991243.mp4",
                fil: true
            }
        },
        onReady() {
            this.context = uni.createVideoContext("video1", this);
        }
    }
</script>

<style>
    .video {
        width: 750rpx;
        /* #ifdef H5 */
        width: 100%;
        /* #endif */
        height: 400rpx;
        background-color: #808080;
    }

    .btn {
        margin-top: 5px;
        margin-bottom: 5px;
    }
</style>
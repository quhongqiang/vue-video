<template>
  <div class="container" :class="[{an:isAndroid,ios:isiOS}]">
    <video id="first-video" width="100%" height="100%" 
    		   x5-video-player-type="h5"
    		   x5-video-player-fullscreen="true"
    		   x5-playsinline=""
    		   playsinline=""
    		   webkit-playsinline=""
    		   :poster="poster"
    		   preload="auto"
    		   :src="videoUrl"
    		   x-webkit-airplay="allow"
    		   @ended="onPlayerEnded($event)">
    </video>
    <div class="second-btn-img">
    	<img :src="poster">
    </div>
  	<div class="platStart" v-if="isAndroid">
  		<img :src="poster" @click="androidPlay">
  	</div>
  </div>
</template>
<script>
	export default {
	  name: 'index',
	  data () {
	    var u = navigator.userAgent
	    return {
	      poster: 'https://h5-file.oss-cn-hangzhou.aliyuncs.com/zy_bank/20180412/button.gif',
	      videoUrl: 'https://h5-file.oss-cn-hangzhou.aliyuncs.com/zy_bank/20180412/video.mp4',
	      video: null,
	      isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
	      isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
	    }
	  },
	  mounted () {
	    if (this.isiOS) {
	      let video = document.querySelector('video')
	      this.videoMethod(video)
	    } else {
	      document.getElementById('first-video').style.display = 'block'
	      document.getElementsByClassName('platStart')[0].style.display = 'block'
	    }
	  },
	  methods: {
    videoMethod (video) {
	      video.addEventListener('touchstart', function () {
	        video.play()
	      })
	      video.addEventListener('ended', function (e) {
	        let second_btn_img = document.getElementsByClassName('second-btn-img')[0]
	        second_btn_img.style.display = 'block'
	        second_btn_img.onclick = function (params) {
	          second_btn_img.style.display = 'none'
	          document.getElementById('first-video').style.display = 'block'
	          video.play()
	        }
	      })
	      // 进入全屏
	      video.addEventListener('x5videoenterfullscreen', function () {
	        window.onresize = function () {
	          video.style.width = window.innerWidth + 'px'
	          video.style.height = window.innerHeight + 'px'
	        }
	      })
	    },
	    onPlayerEnded (player) {
	      if (this.isAndroid) {
	        document.getElementsByClassName('platStart')[0].style.display = 'block'
	      } else {
	        document.getElementsByClassName('second-btn-img')[0].style.display = 'block'
	      }
	      document.getElementById('first-video').style.display = 'none'
	    },
	    androidPlay () {
	      let that = this
	      this.video = document.getElementById('first-video')
	      document.getElementsByClassName('platStart')[0].style.display = 'none'
	      document.getElementsByClassName('second-btn-img')[0].style.display = 'none'
	      document.getElementById('first-video').style.display = 'block'
	      let video = that.video
	      video.play()
	    }
	  }
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#first-video{
    object-fit: fill;
  }
  .container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
  }
  .second-btn-img,.platStart{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;object-fit: fill;
    display: none;
  }
  .platStart img, .second-btn-img img{
  	width: 100%;
  	object-fit: fill;
  }
</style>

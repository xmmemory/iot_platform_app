<template>
  <view class="container">
    <view class="title">服务条款</view>
    <view class="content">
      <text>
        软件服务及隐私条款\n
        欢迎您使用软件及服务，以下内容请仔细阅读。\n\n
        
        1、保护用户个人信息是一项基本原则，我们将会采取合理的措施保护用户的个人信息。除法律法规规定的情形外，未经用户许可我们不会向第三方公开、透漏个人信息。APP对相关信息采用专业加密存储与传输方式，保障用户个人信息安全，如果您选择同意使用APP软件即表示您认可并接受APP服务条款及其可能随时更新的内容。\n\n
        2、我们将会使用您的以下功能:WIFI网络、蜂窝通信网络、手机基站数据、SD卡、通话权限，如果您禁止APP使用以上相关服务和功能，您将自行承担不能获得或享用APP相应服务的后果。\n\n
        3、为了提供更好的客户服务，基于技术必要性收集一些有关设备级别事件(例如崩溃)的信息，但这些信息并不能够让我们识别您的身份。为了能够让APP定位服务更精确，可能会收集并处理有关您实际所在位置信息(例如移动设备发送的GPS信号)，WL-FI接入点和基站位置信息，我们将对上述信息实施技术保护措施，以最大程度保护这些信息不被第三方非法获得，同时，您可以自行选择拒绝我们基于技术必要性收集的这些信息，并自行承担不能获得或享用APP相应服务的后果。\n\n
        4、在您使用我们的产品或服务的过程中，我们可能：需要您提供个人信息，如姓名、电子邮件地址、电话号码、联系地址等以及注册或申请服务时需要的其它类似个人信息;您对我们的产品和服务使用即表明您同意我们对这些信息的收集和合理使用。您可以自行选择拒绝、放弃使用相关产品或服务。\n\n
        5、由于您的自身行为或不可抗力等情形，导致上述可能涉及您隐私或您认为是私人信息的内容发生被泄露、批漏，或被第三方获取、使用、转让等情形的，均由您自行承担不利后果，我们对此不承担任何责任。\n\n
        6、我们拥有对上述条款的最终解释权。
      </text>
    </view>
    <view class="footer">
      <button type="default" @click="onConfirm">我已阅读并同意</button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    onConfirm() {
      uni.navigateBack(); // 返回上一页
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  /* height: 100%; */
  justify-content: space-between;
  background-color: #fff;
}
.title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
.content {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}
.footer {
  margin-top: 20px;
  text-align: center;
}
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>

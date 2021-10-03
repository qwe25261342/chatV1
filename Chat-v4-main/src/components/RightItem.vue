<template>
  <div class="containerR">
    <p>{{ username }}</p>
    <div class="content">
      <div class="text">
        <img v-if="content == null || content == ''" :src="img" />
        <span v-else>{{ content }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RightItem",
  props: ["content", "username", "img"],
};
</script>

<style >
.containerR {
  display: flex;
  flex-direction: row-reverse;
}
.containerR .content {
  margin-right: 10px;
  margin-top: 10px;
}
.containerR .content .text {
  background-color: rgb(197, 171, 107);
  border-radius: 10px;
  padding: 5px 15px;
  font-size: 20px;
  color: #000;
  min-width: 50px;
}
</style>
<template>
  <div class="containerL">
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
  name: "LeftItem",
  props: ["content", "username", "img"],
};
</script>

<style>
.containerL {
  display: flex;
}
.containerL .content {
  margin-right: 10px;
  margin-top: 10px;
}
.containerL .content .text {
  background-color: rgba(17, 17, 17, 0.466);
  border-radius: 10px;
  padding: 5px 15px;
  font-size: 20px;
  color: white;
  min-width: 50px;
}
</style>
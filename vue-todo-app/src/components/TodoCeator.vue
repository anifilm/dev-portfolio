<template>
  <div>
    <button @click="createTodo">
      <i class="material-icons">add</i>
    </button>
    <input
      v-model="title"
      :placeholder="placeholder"
      type="text"
      @keypress.enter="createTodo"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      placeholder: '할 일을 추가하세요'
    };
  },
  methods: {
    createTodo() {
      // 'title' 유효성 검사
      const validatedTitle = this.title && this.title.trim();
      if (!validatedTitle) {
        alert('유효하지 않은 제목입니다.');
        this.title = '';
        return;
      }
      //console.log(validatedTitle);

      // 생성
      //this.$emit('create-todo', validatedTitle);
      this.$store.dispatch('todoApp/createTodo', this.title);
      this.title = '';

      this.$nextTick(() => {
        // 스크롤을 맨 아래로 이동
        window.scrollTo(0, document.body.scrollHeight);
      });
    }
  }
};
</script>

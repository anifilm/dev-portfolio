<template>
  <section class="home">
    <div>
      <h1>
        anifilm's Todo App page!
      </h1>
      <br />
  <!--<h2 @click="$router.push('/todos')">
        Enter Todo App
      </h2>
      <h2 @click="$router.push('/about')">
        About me
      </h2>-->
      <router-link to="/todos" tag="h2">
        Enter Todo App
      </router-link>
      <router-link to="/about" tag="h2">
        About me
      </router-link>
    </div>
  </section>
</template>

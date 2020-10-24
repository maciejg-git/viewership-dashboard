<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    Viewership
  </v-app-bar>

    <v-content>
      <Viewership/>
    </v-content>
  </v-app>
</template>

<script>
import Viewership from './components/Viewership.vue';

export default {
  name: 'App',

  components: {
    Viewership,
  },

  data: () => ({
    //
  }),
};
</script>

<script>
  import Router, { location } from 'svelte-spa-router';
  import { fade } from 'svelte/transition';
  import routes from '~/routes';
  import Header from '~/components/Header.svelte';
  import Footer from './components/Footer.svelte';
</script>

<Header />
{#key $location}
  <div in:fade>
    <Router routes={routes} restoreScrollState={true} />
  </div>
{/key}
<Footer />

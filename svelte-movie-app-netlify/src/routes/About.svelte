<script>
  import { querystring } from 'svelte-spa-router';
  import qs from 'qs';

  $: query = qs.parse($querystring);
  $: name = query.name || 'Anifilm (Chaeyoung Lim)';
  $: email = query.email || 'anifilm02@gmail.com';
  $: blog = query.blog || 'https://anifilm.github.io/';
  $: phone = query.phone || '+82-10-8731-23**';
  $: image = query.image || 'https://avatars.githubusercontent.com/u/7001233?v=4';
</script>

<div class="user-profile">
  <div class="photos">
    <div class="photo">
      <img src="/assets/svelte.png" alt="Svelte Logo">
    </div>
    <div class="photo">
      <img src={image} alt="User Photo">
    </div>
  </div>
  <div class="details">
    <div class="name">{name}</div>
    <div class="email">{email}</div>
    <div class="blog">{blog}</div>
    <div class="phone">{phone}</div>
  </div>
</div>

<style lang="scss">
  .user-profile {
    padding: 90px 0;
    .photos {
      display: flex;
      justify-content: center;
      .photo {
        flex-shrink: 0;
        width: 230px;
        height: 230px;
        padding: 30px;
        box-sizing: border-box;
        background-color: $color--area;
        border-radius: 50%;
        border: 6px solid $color--black;
        &:first-child {
          margin-right: -70px;
        }
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
    }
    .details {
      margin-top: 40px;
      text-align: center;
      line-height: 1.8;
      .name {
        font-size: 40px;
        font-family: 'Oswald', sans-serif;
        margin-bottom: 20px;
      }
    }
  }
</style>

<script lang="ts">
    import { page } from "$app/stores";
    $: currentRoute = $page.url.pathname;
</script>

<nav data-sveltekit-reload>
    <a class="container home" href="/">
        <i
            class="material-symbols-outlined"
            class:is-active={currentRoute === "/"}>home</i
        >
        <p>Home</p>
    </a>
    <a class="container groups" href="/groups">
        <i
            class="material-symbols-outlined"
            class:is-active={currentRoute.startsWith("/groups")}>forum</i
        >
        <p>Groups</p>
    </a>
    <a class="container settings" href="/settings">
        <i
            class="material-symbols-outlined"
            class:is-active={currentRoute === "/settings"}>settings</i
        >
        <p>Settings</p>
    </a>
</nav>

<style>
    nav {
        /* Background */
        background-color: var(--color-primary-black);

        /* Position */
        position: fixed;
        width: 100vw;
        height: auto;
        max-width: 100vw;
        max-height: 6rem;

        bottom: 0;
        left: 0;
        right: 0;
        z-index: 5;

        /* Flex */
        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: space-evenly;
        gap: 1rem;
    }

    .container {
        height: 4rem;
        width: 4rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: stretch;
        justify-content: center;
        gap: 0.125rem;
        padding: 1rem;
    }

    i {
        font-size: 1.75rem;
        transition: 200ms color;
    }

    /* State changes */
    .container:hover {
        cursor: pointer;
    }

    .container:hover i {
        color: #ffffff;
    }

    .container:hover p {
        color: #ffffff;
    }

    .is-active {
        font-variation-settings: "FILL" 1;
    }
</style>

<template>
    <div class="container">
        <div class="m-auto">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link to="/register" class="nav-link"><span>Registrace</span></router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/about" class="nav-link"><span>O mně</span></router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Menu",
    }
</script>
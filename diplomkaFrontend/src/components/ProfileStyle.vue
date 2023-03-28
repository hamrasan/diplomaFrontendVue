<template>
    <div class="container mt-3 my-3 raiffeseisenComponentYellow">
        <div class="row d-flex justify-content-center">
            <div class="col col-sm-6 col-4 mt-3">
                <h3>{{username}}</h3>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col">
                <img :src="getUserGenderImage()" class="d-block mx-auto about rounded-circle" alt="profilepicture"/>
            </div>
        </div>
        <div class="row d-flex container">
            <div class="col"></div>
            <div class="col bg-light round">
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Email:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.email}}</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Man-day rate:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.mdRate}} Kč</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Dostupnost:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.availability}}%</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Role:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.teamRole.name}}</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Skillset:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.skillset}}</p>
                    </div>
                </div>
                <div class="row d-flex">
                    <div class="col form-title">
                        <p class="form-title">Úvazek:</p>
                    </div>
                    <div class="col form-title-text">
                        <p>{{user.employment}}</p>
                    </div>
                </div>
            </div>
            <div class="col"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProfileStyle',
        props: ['user', 'username','id'],
        data() {
            return {}
        },
        methods: {
            getUserGenderImage() {
                if (this.user.gender === "WOMAN") {
                    return "/src/assets/woman.png";
                } else return "/src/assets/man23.png";
            }
        }
    }
</script>

<style>
    img.about {
        height: auto;
        max-width: 150px;
        background-color: white;
    }

    .form-title {
        text-align: right;
    }

    .form-title-text {
        text-align: left;
    }
    div.round {
        border-radius: 25px;
        border: 2px solid #4d4f53;;
        padding: 20px;
    }
    p.form-title {
        font-size: 18px;
        line-height: 26px;
        font-style: normal;
        font-family: 'Navigo-Bold', Arial, sans-serif;
    }
</style>
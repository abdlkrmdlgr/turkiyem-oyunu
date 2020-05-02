<template>
    <div class="harita">
        <b-navbar class="fixed-top m-0 p-0" type="light">
            <div class="col-md-1 col-sm-1 col-1 text-center p-0">

            </div>
            <div class="col-md-9 col-sm-9 col-9 p-0">
                <span v-if="!this.isPaused && this.isQuestionText && !this.isPassQuestion && !this.isTimeout"
                      class="badge text-wrap col-md-11 col-sm-11 col-11">{{this.questionText}}</span>
                <span v-if="this.isPaused"
                      class="badge  text-wrap col-md-5 col-sm-5 col-5 font-weight-bold text-danger">#TÜRKİYE'M</span>
                <div v-if="this.isBasariliMessage" class="badge">Tebrikler!! Doğru cevap. <span
                        class="badge badge-success">{{this.questionPoint}}</span> kazandınız.
                </div>
                <div v-if="this.isHataliMessage" class="text-danger badge">Üzgünüm!! Yanlış cevap. <span
                        class="badge badge-danger">{{this.kaybedilenPuan}}</span> kaybettiniz.
                </div>
                <div v-if="this.isPassQuestion" class="text-danger badge">Soruyu pas geçtiniz. <span
                        class="badge badge-danger">{{this.kaybedilenPuan}}</span> kaybettiniz.
                </div>
                <div v-if="this.isTimeout" class="text-danger badge">Süre içinde cevap vermediniz.. <span
                        class="badge badge-danger">{{this.kaybedilenPuan}}</span> kaybettiniz.
                </div>
            </div>
            <div class="col-md-2 col-sm-2 col-2 text-right p-0 pr-2">
                    <span v-if="!this.isPaused" class="btn" @click="passQuestionManuel">
                        <FontAwesomeIcon icon="random"/>
                    </span>
                <span class="btn" @click="handleNedirModal">
                        <FontAwesomeIcon icon="ellipsis-v"/>
                    </span>
            </div>
        </b-navbar>

        <b-navbar class="navbar fixed-bottom m-0 p-0 pl-2 pr-2 d-flex d-flex justify-content-between"
                  type="light" style="left: auto; width:25%">

            <div>
                <div class="btn btn-md font-weight-bold mb-0 mt-1 p-0">
                    Puan:
                    <span>
                        {{this.skor}}
                    </span><br>
                    <span class="badge badge-success">
                        D:{{this.dogruCevapSayisi}}
                    </span>
                    <span class="badge badge-danger">Y:{{this.yanlisCevapSayisi}}</span>
                </div>
                <BaseTimer
                        :pauseTimer="this.pauseTimer"
                        :timerResetProp="this.timerReset"
                        @timeUp="nextQuestionTimeup"
                        @calculateQuestionPoint="calculateQuestionPoint"
                        @handlePause="handlePause" class="float-right mr-2 mb-2 ml-2"/>
            </div>
        </b-navbar>

        <div class="svg-turkiye-haritasi mt-4">
            <svg version="1.1" id="svg-turkiye-haritasi" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink"
                 viewBox="0 0 1008 450" xml:space="preserve"
                 :class="this.disabledMap">
        <g id="turkiye">
          <Country
                  v-for="(country, indexCounty) in this.countries"
                  :key="indexCounty"
                  :country="country"
                  @countryClick="handleCountryClick"
          ></Country>
        </g>
      </svg>
        </div>
        <div class="il-isimleri"></div>

        <b-modal v-model="modalNedirShow" title="Nedir?"
                 :centered=true :scrollable=true headerCloseLabel="Kapat" :hide-footer="true"
                 aria-label="Emzirme Kaydı"
                 no-button>
            <div class="col-md-12 small">
                <p class="text-right small"><a href="https://twitter.com/bortecoder">@bortecoder</a></p>
                <p><b>Nedir?</b></p>
                <p>Bu oyun Türkiye'mizin illerinde belli başlı ön plana çıkan kültürel, sosyal, coğrafi
                    özellikklerinden yola çıkılarak hazırlanmıştır.
                    Size gösterilen anahtar kelimelere karşılık gelen ilimizi bulmanız gerekmektedir.
                </p>
                <p><b>Nasıl kullanılır?</b></p>

                <p>Android için: Tarayıcınız üzerinden Anasayfa'ya ekle dediğinizde uygulama çekmecenize kurulum
                    yapılacak ve oyunu artık oradan oynayabileceksiniz.</p>
                <p>iOS için: Apple protokolleri gereği sadece Safari'de Anasayfa'ya ekle özelliği çalışmaktadır. Sayfayı
                    paylaş dediğinizde Anaysafa'ya ekle özelliğini göreceksiniz.</p>
                <p>Zaman sayacını başlattığınızda sorular anahtar kelimeler size gösterilecektir. Zaman akarken hangi
                    ilimize ait olduğunu bulmanız beklenmektedir.</p>
                <p>Doğru cevabı bulduğunuzda puan kazanacaksınız. Yanlış cevapta ise puan kaybedersiniz.</p>

                <p><b>Puanlama Nasıl Olur?</b></p>
                <p>Zamana bağlı olarak kazanacağınız ve kaybedeceğiniz puan büyük olur.</p>
                <p>Dilediğinizde sayacın üstüne basarak süreyi durdurabilir, sonrasında tekrardan kaldığınız yerden
                    devam edebilirsiniz.</p>

                <p>En yüksek puani yapıp, ekran görüntüsünü arkadaşlarınızla paylaşmayı unutmayın.</p>

                <p>İyi eğlenceler dilerim.</p>
            </div>
        </b-modal>


    </div>
</template>

<script>

    /**
     * Puan Sistemi
     * Soru pass geçilirse 1 puan düşer.
     * Soru timeout'a düşerse 3 puan düşer.
     * Yanlış cevapta kazanılacak puandan 1 puan eksiği kadar puan düşer
     * Zamana bağlı olarak puan kazanılır. ilk 10sn'de 3 puan sonraki 10sn'de 2 puan sonrakinde 1 puan.
     * Son 10sn'de hatalı cevap için 1 puan düşer.
     */

    import countryJson from '../../turkiye-haritasi-svg-path';
    import meshurSeylerJson from '../../illerin-meshur-seyleri';
    import Country from "./Country";
    import BaseTimer from "./BaseTimer";

    import $ from "jquery";

    export default {
        name: 'Maps',
        props: {},
        components: {Country, BaseTimer},
        data() {
            return {
                countries: countryJson,
                meshurSeyler: "",
                questionText: "",
                questionIndex: null,
                skor: 0,
                elepsadTime: 30,
                timerReset: "false",
                questionPoint: 3,
                disabledMap: "disabledMap",
                isPaused: true,
                isBasariliMessage: false,
                isHataliMessage: false,
                isQuestionText: true,
                kaybedilenPuan: 0,
                isPassQuestion: false,
                isTimeout: false,
                modalNedirShow: false,
                pauseTimer: false,
                dogruCevapSayisi:0,
                yanlisCevapSayisi:0
            };
        },
        computed: {
            getElepsadTimeIcon: function () {
                if (this.elepsadTime >= 40) {
                    return "hourglass-start";
                } else if (this.elepsadTime >= 20) {
                    return "hourglass-half";
                } else if (this.elepsadTime > 0) {
                    return "hourglass-end";
                } else {
                    return "hourglass";
                }
            }
        },
        created() {
            // fetch("https://turkiyem.abdulkerimdulger.com/illerin-meshur-seyleri.json")
            //     .then(r => r.json())
            //     .then(json => {
            //         this.meshurSeyler = json;
            //     });
        },
        mounted() {
            this.meshurSeyler = meshurSeylerJson;
            this.svgturkiyeharitasi();
            this.nextQuestion();
        },
        methods: {
            svgturkiyeharitasi: function () {
                const element = document.querySelector('#svg-turkiye-haritasi');
                const info = document.querySelector('.il-isimleri');
                element.addEventListener(
                    'mouseover',
                    function (event) {
                        if (event.target.tagName === 'path') {
                            info.innerHTML = [
                                '<div>',
                                event.target.parentNode.getAttribute('data-iladi'),
                                '</div>'
                            ].join('');
                        }
                    }
                );

                element.addEventListener(
                    'mousemove',
                    function (event) {
                        info.style.top = event.pageY + 5 + 'px';
                        info.style.left = event.pageX + 'px';
                    }
                );

                element.addEventListener(
                    'mouseout',
                    function () {
                        info.innerHTML = '';
                    }
                );
            },
            handleCountryClick: function (item) {
                if ((item.$el.attributes.plaka.value - 1) === this.questionIndex) {
                    //Doğru cevap geldi.
                    $("." + item.$el.attributes.id.value + " path")[0].classList.add("fillSuccess");
                    $("." + item.$el.attributes.id.value + " path")[0].classList.remove("fillDefault");
                    this.skor += this.questionPoint;
                    this.passQuestion();

                    this.isBasariliMessage = true;
                    this.isHataliMessage = false;
                    this.isQuestionText = false;

                    this.dogruCevapSayisi+=1;

                    setTimeout(() => {
                        this.isBasariliMessage = false;
                        this.isHataliMessage = false;
                        this.isQuestionText = true;
                        this.removeCountryName();
                    }, 1000);
                } else {
                    $("." + item.$el.attributes.id.value + " path")[0].classList.add("fillClick");
                    this.kaybedilenPuan = (this.questionPoint > 1) ? this.questionPoint - 1 : 1;
                    this.skor -= this.kaybedilenPuan;

                    this.isBasariliMessage = false;
                    this.isHataliMessage = true;
                    this.isQuestionText = false;

                    this.yanlisCevapSayisi+=1;

                    setTimeout(() => {
                        this.isBasariliMessage = false;
                        this.isHataliMessage = false;
                        this.isQuestionText = true;
                        this.removeCountryName();
                        $("." + item.$el.attributes.id.value + " path")[0].classList.remove("fillClick");
                        $("." + item.$el.attributes.id.value + " path")[0].classList.add("fillDefault");

                    }, 1000);
                }
            },
            handlePause: function (isPaused) {
                this.isPaused = isPaused;
                if (isPaused) {
                    this.disabledMap = "disabledMap";
                } else {
                    this.disabledMap = "";
                }
            },
            passQuestion: function () {
                setTimeout(() => {
                    this.nextQuestion();
                }, 1000);
                this.timerReset = new Date().getTime().toString();
            },
            handleNedirModal: function () {
                this.pauseTimer = new Date().getTime().toString();
                this.modalNedirShow = !this.modalNedirShow;
                this.isPaused = true;
            },
            passQuestionManuel: function () {
                this.skor -= 1;
                this.kaybedilenPuan = 1;
                this.isPassQuestion = true;
                setTimeout(this.nextQuestion, 1000);
            },
            nextQuestionTimeup: function () {
                this.skor -= 2;
                this.kaybedilenPuan = 2;
                this.isTimeout = true;
                this.passQuestion();
            },
            nextQuestion: function () {

                $(".countryPath").each(function () {
                    $(this)[0].classList.remove("fillSuccess");
                    $(this)[0].classList.add("fillDefault");
                });

                let plaka = this.getRandomPlaka(1, 81);
                let meshurSeyTextRandom = this.getMeshurSeylerBy(plaka);
                this.questionText = meshurSeyTextRandom;
                this.questionIndex = plaka - 1;
                this.isPassQuestion = false;
                this.isTimeout = false;
            },
            removeCountryName: function () {
                if ($(".il-isimleri div")[0] !== undefined)
                    $(".il-isimleri div")[0].remove()
            },
            getMeshurSeylerBy(plaka) {
                return this.meshurSeyler[plaka - 1].meshurSeyleri.join(", ");
            },
            getRandomPlaka: function (min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            },
            calculateQuestionPoint: function (point) {
                this.questionPoint = point;
            }
        }
    }
</script>
<style>
    .svg-turkiye-haritasi {
        max-width: 1140px;
        margin: 0 auto;
        text-align: center;
    }

    .svg-turkiye-haritasi svg {
        width: 100%;
        height: auto;
    }

    .il-isimleri {
        position: absolute;
        z-index: 2;
    }

    .il-isimleri div {
        font-family: 'Tahoma';
        display: inline-block;
        background: #3b3b3b;
        color: #ffffff;
        padding: 4px 8px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        font-size: 14px;
    }

    #svg-turkiye-haritasi path {
        cursor: pointer;
        fill: #e04848;
    }

    #svg-turkiye-haritasi path:hover {
        fill: #e9e5e7;
    }

    #guney-kibris {
        pointer-events: none;
    }

    .fillSuccess {
        fill: darkgreen !important;
    }

    .fillDefault {
        fill: #e04848 !important;
    }

    .fillClick {
        fill: #e9e5e7 !important;
    }

    .badge-muted {
        background-color: #6c757d !important
    }

    .disabledMap {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        pointer-events: none;
    }


</style>

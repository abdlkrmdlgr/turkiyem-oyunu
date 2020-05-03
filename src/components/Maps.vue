<template>
    <div class="harita">
        <b-navbar class="fixed-top m-0 p-0 col-11" type="light" style="left:auto">
            <div class="col-md-10 col-sm-10 col-10 p-0">
                <span v-if="!this.isPaused && this.isQuestionText && !this.isPassQuestion && !this.isTimeout"
                      class="badge text-wrap col-md-11 col-sm-11 col-11">{{this.questionText}}</span>
                <span v-if="this.isPaused && !this.isFinished"
                      class="badge  text-wrap col-md-5 col-sm-5 col-5 font-weight-bold textDanger">#TÜRKİYE'M</span>

                <span v-if="this.isPaused && this.isFinished"
                      class="badge text-wrap col-md-8 col-sm-8 col-8 font-weight-bold textSuccess">
                    <img src="../assets/favicon-96x96.png" width="30" height="30"/>
                    Tebrikler!!! Ülkemizi avucunun içi gibi öğrendin. Her oyunayışında farklı gelmeye devam edecek. Tekrar oynamaya ne dersin?
                </span>
                <div v-if="this.isBasariliMessage && !this.isFinished" class="badge">Tebrikler!! Doğru cevap. <span
                        class="badge bgSuccess text-white">{{this.questionPoint}}</span> kazandınız.
                </div>
                <div v-if="this.isHataliMessage" class="textDanger badge">Üzgünüm!! Yanlış cevap. <span
                        class="badge bgDanger text-white">{{this.kaybedilenPuan}}</span> kaybettiniz.
                </div>
                <div v-if="this.isPassQuestion" class="textDanger badge">Soruyu pas geçtiniz. <span
                        class="badge bgDanger text-white">{{this.kaybedilenPuan}}</span> kaybettiniz.
                </div>
                <div v-if="this.isTimeout" class="textDanger badge">Süre içinde cevap vermediniz.. <span
                        class="badge bgDanger text-white">{{this.kaybedilenPuan}}</span> kaybettiniz.
                </div>
            </div>
            <div class="col-md-2 col-sm-2 col-2 text-right p-0 pr-2">
                    <span v-if="!this.isPaused" class="btn" @click="passQuestionManuel">
                        <FontAwesomeIcon icon="random"/>
                    </span>
                <span class="btn" @click="handleNedirModal">
                        <FontAwesomeIcon icon="info-circle" class="text-info"/>
                    </span>
            </div>
        </b-navbar>

        <b-navbar class="navbar fixed-bottom m-0 p-0 d-flex d-flex justify-content-between col-3 mr-2"
                  type="light" style="left: auto;">

            <div>
                <BaseTimer
                        :pauseTimer="this.pauseTimer"
                        :timerResetProp="this.timerReset"
                        :isFinished="this.isFinished"
                        @timeUp="nextQuestionTimeup"
                        @calculateQuestionPoint="calculateQuestionPoint"
                        @handlePause="handlePause"
                        @handleReset="handleReset"
                        class="float-right mb-0"/>


                <div class="col-8 font-weight-bold mb-0 mt-0 p-0 float-right">
                    <p class="mb-0 badge p-0">Puan: {{this.skor}}</p>
                    <p class="mb-0">
                        <span class="badge bgSuccess text-white">
                            D:{{this.dogruCevapSayisi}}
                        </span>
                        <span class="badge bgDanger text-white">Y:{{this.yanlisCevapSayisi}}</span>
                    </p>
                </div>

                <div class="badge bgWarning align-items-end col-10 mb-0 text-center font-weight-bold float-right mb-1">
                    Şehir: {{this.bilinenIlPlakalari.length}}/{{this.bilinmeyenIlPlakalari.length}}
                </div>
            </div>
        </b-navbar>

        <div class="svg-turkiye-haritasi mt-3">
            <svg version="1.1" id="svg-turkiye-haritasi" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink"
                 viewBox="0 0 1008 450" xml:space="preserve"
                 :class="this.disabledMapClass">
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
                <p class="text-right small">
                    <a href="https://twitter.com/bortecoder">@bortecoder</a>
                    <br>
                    <span class="badge badge-muted text-white">v1.0.5</span>
                </p>
                <p><b>Nedir? </b></p>
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
                questionsPlaka: null,
                skor: 0,
                timerReset: "false",
                questionPoint: 3,
                disabledMapClass: this.disabledMap,
                isDisabledMap: false,
                isPaused: true,
                isBasariliMessage: false,
                isHataliMessage: false,
                isQuestionText: true,
                kaybedilenPuan: 0,
                isPassQuestion: false,
                isTimeout: false,
                modalNedirShow: false,
                pauseTimer: "",
                dogruCevapSayisi: 0,
                yanlisCevapSayisi: 0,
                soruyaVerilenYanlisCevapSayisi: 0,
                yanlisCevapHakki: 3,
                keywordCount: 3,
                bilinenIlPlakalari: [],
                bilinmeyenIlPlakalari: [],
                isFinished: false
            };
        },
        created() {
            // fetch("https://turkiyem.abdulkerimdulger.com/illerin-meshur-seyleri.json")
            //     .then(r => r.json())
            //     .then(json => {
            //         this.meshurSeyler = json;
            //     });

            this.bilinmeyenIlPlakalari = this.shuffle(this.defaultIlPlakalari());
        },
        mounted() {
            this.meshurSeyler = meshurSeylerJson;
            this.svgturkiyeharitasi();
            this.nextQuestion();
        },
        computed:{
            disabledMap:function () {
                return "disabledMap"
            },
        },
        methods: {
            defaultIlPlakalari:function () {
                return  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]
            },
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

                if (this.isDisabledMap)
                    return;

                if (parseInt(item.$el.attributes.plaka.value) === this.questionsPlaka) {
                    //Doğru cevap geldi.
                    $("." + item.$el.attributes.id.value + " path").each(function () {
                        this.classList.add("fillSuccess");
                        this.classList.remove("fillDefault");
                    });

                    this.skor += this.questionPoint;

                    this.bilinenIlPlakalari.push(this.questionsPlaka);
                    this.bilinmeyenIlPlakalari.splice(0, 1);

                    //tüm sorular bittiyse
                    if (this.bilinmeyenIlPlakalari.length !== 0) {
                        this.passQuestion();
                    } else {
                        this.isFinished = true;
                        this.pauseTimerEvent();
                    }

                    this.isBasariliMessage = true;
                    this.isHataliMessage = false;
                    this.isQuestionText = false;

                    this.dogruCevapSayisi += 1;
                    this.soruyaVerilenYanlisCevapSayisi = 0;

                    setTimeout(() => {
                        this.isBasariliMessage = false;
                        this.isHataliMessage = false;
                        this.isQuestionText = true;
                        this.removeCountryName();
                    }, 1000);
                } else {

                    if ($("." + item.$el.attributes.id.value + " path")[0].classList.contains("fillSuccess"))
                        return;

                    $("." + item.$el.attributes.id.value + " path").each(function () {
                        this.classList.add("fillClick");
                    });

                    this.kaybedilenPuan = (this.questionPoint > 1) ? this.questionPoint - 1 : 1;
                    this.skor -= this.kaybedilenPuan;

                    this.isBasariliMessage = false;
                    this.isHataliMessage = true;
                    this.isQuestionText = false;

                    this.yanlisCevapSayisi += 1;

                    this.soruyaVerilenYanlisCevapSayisi += 1;

                    setTimeout(() => {
                        this.isBasariliMessage = false;
                        this.isHataliMessage = false;
                        this.isQuestionText = true;
                        this.removeCountryName();


                        $("." + item.$el.attributes.id.value + " path").each(function () {
                            this.classList.remove("fillClick");
                            this.classList.add("fillDefault");

                        });

                    }, 1000);

                    this.showCorrectAnswerAndPassQuestion();
                }
            },
            handlePause: function (isPaused) {
                this.isPaused = isPaused;
                if (isPaused) {
                    this.disabledMapClass = this.disabledMap;
                    this.isDisabledMap = true;
                } else {
                    this.disabledMapClass = "";
                    this.isDisabledMap = false;
                }
            },
            handleReset: function () {
                this.bilinmeyenIlPlakalari = this.shuffle(this.defaultIlPlakalari());
                this.bilinenIlPlakalari = [];
                this.dogruCevapSayisi = 0;
                this.yanlisCevapSayisi = 0;
                this.isFinished = false;
                this.isPaused = true;
                this.disabledMapClass = this.disabledMap;
                this.isDisabledMap = true;
                this.skor = 0;

                this.nextQuestion();

                $(".countryPath").each(function () {
                    this.classList.remove("fillSuccess");
                    this.classList.add("fillDefault");
                });

            },
            passQuestion: function () {
                this.soruyaVerilenYanlisCevapSayisi = 0;
                setTimeout(() => {
                    this.comeToEnd();
                    this.nextQuestion();
                }, 1000);
                this.timerReset = new Date().getTime().toString();
            },
            handleNedirModal: function () {
                this.modalNedirShow = !this.modalNedirShow;
                this.pauseTimerEvent();
            },
            pauseTimerEvent: function () {
                this.pauseTimer = new Date().getTime().toString();
                this.isPaused = true;
                this.disabledMapClass = this.disabledMap;
                this.isDisabledMap = true;
            },
            passQuestionManuel: function () {
                this.skor -= 1;
                this.kaybedilenPuan = 1;
                this.isPassQuestion = true;
                this.comeToEnd();
                setTimeout(this.nextQuestion, 1000);
            },
            nextQuestionTimeup: function () {

                if (this.bilinmeyenIlPlakalari.length !== 0) {
                    this.skor -= 2;
                    this.kaybedilenPuan = 2;
                    this.isTimeout = true;
                    this.comeToEnd();
                    this.showCorrectAnswerAndPassQuestion();
                } else {
                    this.handlePause(false);
                    this.isFinished = true;
                }
            },
            comeToEnd: function () {
                let buPlaka = this.bilinmeyenIlPlakalari[0];
                this.bilinmeyenIlPlakalari.splice(0, 1);
                this.bilinmeyenIlPlakalari.push(buPlaka);
            },
            showCorrectAnswerAndPassQuestion: function () {
                if (this.soruyaVerilenYanlisCevapSayisi === this.yanlisCevapHakki || this.isTimeout) {
                    this.isDisabledMap = true;
                    //Bilemediği durumda cevabı göster ve sonraki soruya geç.
                    const plaka = this.bilinmeyenIlPlakalari[0] < 10 ? "0" + this.bilinmeyenIlPlakalari[0] : this.bilinmeyenIlPlakalari[0];
                    var correctAnswersCountryElement = $("g [plaka='" + plaka + "'] path");

                    correctAnswersCountryElement.each(function () {
                        this.classList.add("fillWarning");
                        this.classList.remove("fillDefault");
                    });

                    const correctAnswerCountryName = $("g [plaka='" + plaka + "']").attr("adi");
                    $(".il-isimleri").html("<div>" + correctAnswerCountryName + "</div>");

                    let countryNameTopPosition = correctAnswersCountryElement[0].getBoundingClientRect().top;
                    let countryNameLeftPosition = correctAnswersCountryElement[0].getBoundingClientRect().left;
                    $(".il-isimleri").css("top", countryNameTopPosition + 20 + "px");
                    $(".il-isimleri").css("left", countryNameLeftPosition + 40 + "px");

                    setTimeout(() => {

                        correctAnswersCountryElement.each(function () {
                            this.classList.remove("fillWarning");
                            this.classList.add("fillDefault");
                        });

                        $(".il-isimleri").html("");
                        this.isDisabledMap = false;
                    }, 1000);
                    this.passQuestion();
                }
            },
            nextQuestion: function () {
                this.questionsPlaka = this.bilinmeyenIlPlakalari[0];
                let meshurSeyTextRandom = this.getMeshurSeylerBy(this.questionsPlaka);
                this.questionText = meshurSeyTextRandom;
                this.isPassQuestion = false;
                this.isTimeout = false;
            },
            removeCountryName: function () {
                if ($(".il-isimleri div")[0] !== undefined)
                    $(".il-isimleri div")[0].remove()
            },
            getMeshurSeylerBy(plaka) {
                let meshurSeylerRandom = this.shuffle(this.meshurSeyler[plaka - 1].meshurSeyleri);
                return meshurSeylerRandom.slice(0, this.keywordCount).join(", ");
            },
            calculateQuestionPoint: function (point) {
                this.questionPoint = point;
            },
            shuffle: function (arr) {
                return arr.sort(() => Math.random() - 0.5);
            }
        }
    }
</script>
<style>
    .svg-turkiye-haritasi {
        /*max-width: 1140px;*/
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
        fill: #2b6442 !important;
    }

    .fillDefault {
        fill: #e04848 !important;
    }

    .fillWarning {
        fill: #d5d167 !important;
    }

    .textSuccess {
        color: #2b6442;
    }

    .textWarning {
        color: #d5d167;
    }

    .textDanger {
        color: #e04848;
    }

    .bgSuccess {
        background-color: #2b6442
    }

    .bgDanger {
        background-color: #e04848
    }

    .bgWarning {
        background-color: #d5d167
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

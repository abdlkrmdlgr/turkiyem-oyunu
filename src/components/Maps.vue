<template>
    <div class="harita">
        <!-- HEADER NAVBAR START -->
        <b-navbar class="fixed-top m-0 p-0 col-11" type="light" style="left:auto">
            <div class="col-md-10 col-sm-9 col-9 p-0 offset-lg-0 offset-md-0 offset-sm-1">
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
            <div class="col-md-2 col-sm-2 col-3 text-right p-0 pr-2">
                    <span v-if="!this.isPaused" class="btn" @click="passQuestionManuel" title="Soruyu Pas Geç">
                        <FontAwesomeIcon icon="random"/>
                    </span>
                <span class="btn" @click="handleNedirModal" title="Nedir ve Kullanım Klavuzu">
                        <FontAwesomeIcon icon="info-circle" class="text-info"/>
                </span>
            </div>
        </b-navbar>
        <!-- HEADER NAVBAR END -->

        <!-- FOOTER NAVBAR START-->
        <b-navbar class="navbar fixed-bottom m-0 p-0 d-flex d-flex justify-content-between col-12 mr-2"
                  type="light" style="left: auto;">

            <div class="col-8 text-left">
                <span class="h6 p-2 badge bgSuccess text-white">
                    <FontAwesomeIcon icon="clock"/>
                    {{this.toplamSure}}
                </span>
            </div>

            <div class="col-4">
                <BaseTimer
                        :pauseTimer="this.pauseTimer"
                        :timerResetProp="this.timerReset"
                        :isFinished="this.isFinished"
                        @timeUp="nextQuestionTimeup"
                        @calculateQuestionPoint="calculateQuestionPoint"
                        @handlePause="handlePause"
                        @handleReset="handleReset"
                        @timerTick="handleTimerTick"
                        class="float-right mb-0"/>

                <div class="col-8 font-weight-bold mb-0 mt-0 p-0 float-right">
                    <p class="mb-0 badge p-0">Puan: {{this.skor}}</p>
                    <p class="mb-0">
                        <span class="badge bgSuccess text-white mr-1">
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
        <!-- FOOTER NAVBAR END-->

        <!-- HARİTA START-->
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
        <!-- HARİTA END-->

        <!-- MODAL START-->
        <b-modal v-model="modalNedirShow" no-close-on-backdrop
                 :centered=true :scrollable=true
                 headerCloseLabel="Kapat"
                 :hide-footer="true"
                 :hide-header="true"
                 no-close-on-esc
                 aria-label="Gelişmi"
                 no-button
                 @hide="handleNedirDialogHide">

            <div class="col-md-12 small">
                <button type="button" aria-label="Kapat" class="close" @click="modalNedirShow=!modalNedirShow">×
                </button>
                <div>
                    <b-tabs content-class="mt-3">
                        <b-tab title="Nedir?" active>
                            <p>Bu oyun Türkiye'mizin illerinde belli başlı ön plana çıkan kültürel, sosyal, coğrafi
                                özellikklerinden yola çıkılarak hazırlanmıştır.
                                Size gösterilen anahtar kelimelere karşılık gelen ilimizi bulmanız gerekmektedir.
                            </p>
                            <p><b>Nasıl kullanılır?</b></p>

                            <p>Android için: Tarayıcınız üzerinden Anasayfa'ya ekle dediğinizde uygulama çekmecenize
                                kurulum
                                yapılacak ve oyunu artık oradan oynayabileceksiniz.</p>
                            <p>iOS için: Apple protokolleri gereği sadece Safari'de Anasayfa'ya ekle özelliği
                                çalışmaktadır. Sayfayı
                                paylaş dediğinizde Anaysafa'ya ekle özelliğini göreceksiniz.</p>
                            <p>Zaman sayacını başlattığınızda sorular anahtar kelimeler size gösterilecektir. Zaman
                                akarken hangi
                                ilimize ait olduğunu bulmanız beklenmektedir.</p>
                            <p>Doğru cevabı bulduğunuzda puan kazanacaksınız. Yanlış cevapta ise puan kaybedersiniz.</p>

                            <p><b>Puanlama Nasıl Olur?</b></p>
                            <p>Zamana bağlı olarak kazanacağınız ve kaybedeceğiniz puan büyük olur.</p>
                            <p>Dilediğinizde sayacın üstüne basarak süreyi durdurabilir, sonrasında tekrardan kaldığınız
                                yerden
                                devam edebilirsiniz.</p>

                            <p>En yüksek puani yapıp, ekran görüntüsünü arkadaşlarınızla paylaşmayı unutmayın.</p>

                            <p>İyi eğlenceler dilerim.</p>


                            <p class="text-right small">
                                <a href="https://twitter.com/bortecoder">@bortecoder</a>
                                <br>
                                <span class="badge badge-muted text-white">v1.0.5</span>
                            </p>
                        </b-tab>
                        <b-tab title="Oyun Ayarları">

                            <b-container class="bv-example-row">

                                <b-row>
                                    <b-col>
                                        İllerin İsmini Göster
                                        <FontAwesomeIcon icon="info-circle" class="text-info" id="settingsIlAdi"/>
                                        <b-popover target="settingsIlAdi" triggers="hover" placement="top">
                                            Haritada il isimlerinin gösterilmesini sağlar.
                                        </b-popover>
                                    </b-col>
                                    <b-col>
                                        <ToggleButton
                                                :is-checked="settings.illerinIsminiGoster"
                                                align="right"
                                                toggle-size="toggle-md"
                                                @handleChangeToggleEvent="settings.illerinIsminiGoster=!settings.illerinIsminiGoster"/>
                                    </b-col>
                                </b-row>

                                <b-row>
                                    <b-col>
                                        Doğru Cevabı Göster
                                        <FontAwesomeIcon icon="info-circle" class="text-info" id="settingsDogruCevap"/>
                                        <b-popover target="settingsDogruCevap" triggers="hover" placement="top">
                                            Zaman aşımına uğraması veya soruyu bilemediğiniz durumda doğru ilin
                                            gösterilmesini sağlar.
                                        </b-popover>
                                    </b-col>
                                    <b-col>
                                        <ToggleButton
                                                :is-checked="settings.dogruCevabiGoster"
                                                align="right"
                                                toggle-size="toggle-md"
                                                @handleChangeToggleEvent="settings.dogruCevabiGoster=!settings.dogruCevabiGoster"/>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col>
                                        İpucu Göster
                                        <FontAwesomeIcon icon="info-circle" class="text-info" id="settingsIpucu"/>
                                        <b-popover target="settingsIpucu" triggers="hover" placement="top">
                                            Kelimelere karşılık gelen ili bulmanız için ipucu gösterimi sağlar.
                                        </b-popover>
                                    </b-col>
                                    <b-col>
                                        <ToggleButton
                                                :is-checked="settings.ipucuGoster"
                                                align="right"
                                                toggle-size="toggle-md"
                                                @handleChangeToggleEvent="settings.ipucuGoster=!settings.ipucuGoster"/>
                                    </b-col>
                                </b-row>

                                <b-row>
                                    <b-col>
                                        Uyarı Sesleri
                                        <FontAwesomeIcon icon="info-circle" class="text-info" id="settingsSound"/>
                                        <b-popover target="settingsSound" triggers="hover" placement="top">
                                            Uyarı seslerinin açar kapatır.
                                        </b-popover>
                                    </b-col>
                                    <b-col>
                                        <ToggleButton
                                                :is-checked="settings.uyariSesleri"
                                                align="right"
                                                toggle-size="toggle-md"
                                                @handleChangeToggleEvent="settings.uyariSesleri=!settings.uyariSesleri"/>
                                    </b-col>
                                </b-row>

                                <!--                                                https://codesource.io/how-to-dynamically-create-reactive-properties-in-vue/-->

                                <b-row>
                                    <b-col>
                                        Kelime Sayısı
                                        <FontAwesomeIcon icon="info-circle" class="text-info" id="soruSayisi"/>
                                    </b-col>
                                    <b-col class="text-right">
                                        <span class="btn btn-danger btn-xs">
                                            <FontAwesomeIcon icon="minus-circle"
                                                             @click="handleKeywordCountChangeClick(-1)"/>
                                        </span>
                                        <span class="h6 p-1">{{settings.keywordCount}}</span>

                                        <span class="btn btn-success btn-xs">
                                            <FontAwesomeIcon icon="plus-circle"
                                                             @click="handleKeywordCountChangeClick(1)"/>
                                        </span>
                                    </b-col>

                                    <b-popover target="soruSayisi" triggers="hover" placement="top">
                                        Her il için gösterilecek kelime sayısıdır.
                                    </b-popover>
                                </b-row>

                            </b-container>

                        </b-tab>
                        <b-tab title="Öneride Bulun">
                            <p>Pek Yakında...</p>
                        </b-tab>
                    </b-tabs>
                </div>

            </div>

        </b-modal>
        <!-- MODAL END-->
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
    import ToggleButton from "./ToggleButton";

    export default {
        name: 'Maps',
        props: {},
        components: {ToggleButton, Country, BaseTimer},
        data() {
            return {
                countries: countryJson,
                meshurSeyler: "",
                questionText: "",
                questionsPlaka: null,
                skor: 0,
                timerReset: "false",
                questionPoint: 3,
                disabledMapClass: "disabledMap",
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
                bilinenIlPlakalari: [],
                bilinmeyenIlPlakalari: [],
                isFinished: false,
                correctSound: require("../assets/sound/correctSound.wav"),
                wrongSound: require("../assets/sound/wrongSound.wav"),
                showCorrectAnswerSound: require("../assets/sound/showCorrectAnswerSound.wav"),
                finishedSound: require("../assets/sound/finishedAllCountry.wav"),
                passQuestionSound: require("../assets/sound/passQuestion.wav"),
                settings: {},
                totalTime:0
            };
        },
        created() {
            // fetch("https://turkiyem.abdulkerimdulger.com/illerin-meshur-seyleri.json")
            //     .then(r => r.json())
            //     .then(json => {
            //         this.meshurSeyler = json;
            //     });

            this.bilinmeyenIlPlakalari = this.shuffle(this.defaultIlPlakalari());

            var settingsStr = localStorage.getItem("turkiyemSettings");

            if (settingsStr === null) {
                this.loadDefaultSettings();
                this.modalNedirShow = true;
            } else {
                this.settings = JSON.parse(settingsStr);
            }
        },
        mounted() {
            this.meshurSeyler = meshurSeylerJson;
            this.svgturkiyeharitasi();
            this.nextQuestion();

            var appvue = this;
            document.addEventListener("blur",function () {
                appvue.handleBlurEvent();
            });
            document.addEventListener("focus",function () {
                appvue.handleFocusEvent();
            });

        },
        computed: {
            disabledMap: function () {
                return "disabledMap"
            },
            toplamSure:function () {
                let minutes = Math.floor(this.totalTime/60);
                let seconds = this.totalTime % 60;
                if (minutes>0){
                    if (seconds<10){
                        seconds = "0"+seconds;
                    }
                    return minutes+":"+seconds;
                }else{
                    return seconds;
                }
            }
        },
        methods: {
            defaultIlPlakalari: function () {
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]
            },
            svgturkiyeharitasi: function () {
                const element = document.querySelector('#svg-turkiye-haritasi');
                const info = document.querySelector('.il-isimleri');

                var vue = this;
                element.addEventListener(
                    'mouseover',
                    function (event) {
                        if (event.target.tagName === 'path') {
                            if (vue.settings.illerinIsminiGoster) {
                                info.innerHTML = [
                                    '<div>',
                                    event.target.parentNode.getAttribute('data-iladi'),
                                    '</div>'
                                ].join('');
                            }
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

                this.showCountryName(item.$el.attributes.plaka.value);

                if (parseInt(item.$el.attributes.plaka.value) === this.questionsPlaka) {

                    if (this.bilinmeyenIlPlakalari.length > 1)
                        this.playSound(this.correctSound, 0.2);

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
                        this.playSound(this.finishedSound, 0.2);
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

                    if (this.soruyaVerilenYanlisCevapSayisi < 2)
                        this.playSound(this.wrongSound)

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
                    this.timerReset = new Date().getTime().toString();
                    this.playSound(this.passQuestionSound,1);
                }, 1000);
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
                this.passQuestion();
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
            playSound: function (source, volume = 0.5) {
                if (this.settings.uyariSesleri) {
                    let audio = new Audio(source);
                    audio.volume = volume;
                    audio.play();
                }
            }, showCorrectAnswerAndPassQuestion: function () {
                if (!this.settings.dogruCevabiGoster)
                    return;

                if (this.soruyaVerilenYanlisCevapSayisi === this.yanlisCevapHakki || this.isTimeout) {

                    this.playSound(this.showCorrectAnswerSound, 0.2);

                    this.isDisabledMap = true;
                    //Bilemediği durumda cevabı göster ve sonraki soruya geç.
                    const plaka = this.bilinmeyenIlPlakalari[0] < 10 ? "0" + this.bilinmeyenIlPlakalari[0] : this.bilinmeyenIlPlakalari[0];
                    var correctAnswersCountryElement = $("g [plaka='" + plaka + "'] path");

                    correctAnswersCountryElement.each(function () {
                        this.classList.add("fillWarning");
                        this.classList.remove("fillDefault");
                    });

                    this.showCountryName(plaka);
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
            showCountryName: function (plaka) {
                var correctAnswersCountryElement = $("g [plaka='" + plaka + "'] path");
                const correctAnswerCountryName = $("g [plaka='" + plaka + "']").attr("adi");
                $(".il-isimleri").html("<div>" + correctAnswerCountryName + "</div>");

                let countryNameTopPosition = correctAnswersCountryElement[0].getBoundingClientRect().top;
                let countryNameLeftPosition = correctAnswersCountryElement[0].getBoundingClientRect().left;
                $(".il-isimleri").css("top", countryNameTopPosition + 20 + "px");
                $(".il-isimleri").css("left", countryNameLeftPosition + 40 + "px");
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
                return meshurSeylerRandom.slice(0, this.settings.keywordCount).join(", ");
            },
            calculateQuestionPoint: function (point) {
                this.questionPoint = point;
            },
            shuffle: function (arr) {
                return arr.sort(() => Math.random() - 0.5);
            },
            handleKeywordCountChangeClick: function (interval) {
                if (this.settings.keywordCount > 1 && this.settings.keywordCount < 5 ||
                    this.settings.keywordCount == 5 && interval == -1 ||
                    this.settings.keywordCount == 1 && interval == 1)
                    this.settings.keywordCount += interval;
            },
            handleNedirDialogHide: function () {
                localStorage.setItem("turkiyemSettings", JSON.stringify(this.settings));
            },
            loadDefaultSettings: function () {
                let settings = {
                    illerinIsminiGoster: true,
                    dogruCevabiGoster: true,
                    ipucuGoster: true,
                    uyariSesleri: true,
                    keywordCount: 3
                };
                localStorage.setItem("turkiyemSettings", JSON.stringify(settings));
                this.settings = settings;
            },
            handleBlurEvent:function () {
                this.pauseTimerEvent();
            },
            handleFocusEvent:function () {

            },
            handleTimerTick:function () {
                this.totalTime += 1;
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

    .btn-xs, .btn-group-ss > .btn {
        padding: 0.25rem 0.3rem !important;
        font-size: 0.675rem !important;;
        line-height: 1 !important;;
        border-radius: 0.2rem !important;;
    }

</style>

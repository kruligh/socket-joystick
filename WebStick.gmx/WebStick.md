Mam taki pomysł i tutaj zamieszczam dosyć zorganizowaną jego prezentację.

## 0. Genesis
    "Dzisiaj jeszcze tańczę, dzisiaj jeszcze śpiewam, ale jutro to się skończy."
Ta piosenka ma tak wyrazisty i prosty tekst, że pomysł na tą grę rytmiczną po prostu był oczywistą koleją rzeczy. Plus rapsy, nad którymi pracujesz ostatnio mnie zmotywowały do napisania tego

## 1. Definicja
**Gra imprezowa, rytmiczna, wieloosobowa.** Rozgrywka polega na wybieraniu aktualnie śpiewanego słowa/wyrażenia. Wybieramy słowo/piktogram/symbol. Trudność polega na tym, że pojawiają się błędne propozycje, a dodatkowo musimy wybierać tak szybko, jak szybko jest śpiewany tekst. Proponowana implementacja tego pomysłu to niekończąca się horyzontalnie lub wertykalnie gra platformowa, gdzie kolejne generowane platformy są reprezentacją słów piosenki.

Definicja gameplay'u dzieli się na dwa etapy:
1. Możemy tworzyć poziomy poprzez zalinkowanie muzyki z youtube i skorzystanie z edytora online bazującego na timeline. Wtedy dodajemy jakie słowa/piktogramy/symbole się pojawiają i inne elementy gameplay'u poziomu. Level designer.
2. Możemy grać w zamieszczone już przez graczy poziomy. Rozgrywka może być jedno lub wieloosobowa. Preferowany styl to gra na telewizorze i WebStick na telefonie.

## 2. Architektura 
Ten projekt wymaga implementacji poniższych instancji:
1. Aplikacja webowa z edytorem poziomów, zapisywaniem ich, API dla gry do pobierania tych poziomów. Musi umożliwiać logowanie, aby dało się jednoznacznie przypisać autora i system ocen poziomów. Ten punkt możemy podzielić na subinstancje:
    * Frontend:
        * strona,
        * edytor poziomów (canvas).
    * Backend:
        * REST,
        * Obsługa WebStick.
2. Klient gry. Musi pozwalać na łączenie się z serwerem, pobieranie poziomów i autentykację użytkownika (w celu oceny poziomu). Koniecznie musi być cross-platform i zapewniać możliwość uruchomienia się na PC/MacOS/Linux. Android oraz iOS można rozważyć, jeżeli WebStick nie będzie realizował innowacyjnej funkcji kontrolera (czyli, że nie będzie po prostu mapował joysticka, ale będzie inteligentym padem).
3. Aplikacja WebStick na urządzenia mobilne. Musi mieć dostęp do różnego rodzaju smartphonów i wysyłać je przez serwer do klienta gry lub bezpośrednio parować się przez bluetooth lub wifi.

##3. Stos technologiczny

Do implementacji instancji z punktu 2. proponuję poniższe technolgie wraz z krótkim komentarzem dlaczego:
* Ad. 1.
    * Frontend:
        * strona - moze byc angular, ale mozna nawet recznie cos ladnego wystrugać, zwlaszcza z tym nes.css
            *   https://int10h.org/oldschool-pc-fonts/fontlist/
            *   https://bcrikko.github.io/NES.css/
        * edytor
            * cos zeby pozwalalo ladnie edytowac na canvasach, drag & drop itd.
            * edytor napisany w GM:S 2.0
    * Backend:
        * Springboot - dużo doświadczenia (Ostatnie HackYEAH to chyba tylko Adam nie był SpringBoi xD).
        * Node.js Express - z tego co pamietam to to było w WebSticku
* Ad. 2.
    * GM:S 2.0 - mamy prawie gotowego klienta, albo silnik gry plus mam ogromne doświadczenie, a w sam raz wystarczy. Minusy to takie, że tylko ja umiem.
    * Phaser.js - piszemy od zera z exampli plus wiedza z PAI 2016
    * LibGDX - gamdeve w Javie, piszemy od zera z exampli plus wiedza z CodeCraft 2017
* Ad. 3.
    * GM:S 2.0 - tak jak wyżej plus WebStick jest już zaczęty.
    * Phaser.js - tak jak wyżej plus eksport w formie na przeglądarke

## 4. Termin realizacji

* Plan SpaceJAM
    * 29.11 - 8.12 - setup, corowe rzeczy, żeby coś już było.
    * 8.12 - 9.12 - Intensywnie podczas SpaceJam na UJ.
    * 9.12 - ... - Sprawdzamy feedback otoczenia, decydujemy o kontynuacji projektu i jego losach.

## 5. Pierwsze zadania
* Mockup gameplay, prototyp.
* Spotkanie decyzyjne ws. gameplay scope.
* Implementacja BPM + deltaFPS
* Parsowanie youtube do klienta gry
* WebStick Server
* MapServer (samo trzymanie map)



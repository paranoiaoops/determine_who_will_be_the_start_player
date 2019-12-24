class CalculateRandom {
    static exec(min, max) {
        return min + Math.floor( Math.random() * (max - min + 1));
    }
}

class MinimumCircle {

    constructor() {
        this.color_class = "";
        this.left_potion = 0;
        this.top_potion = 0;
        this.circle_sizes_class = "";
        this.setRandomTopPotion();
        this.setRandomLeftPotion();
    }

    setRandomLeftPotion() {
       this.left_potion = CalculateRandom.exec(70, (window.innerWidth - 70));
    }

    setRandomTopPotion() {
        this.top_potion = CalculateRandom.exec(70, (window.innerHeight - 70));
    }
}

class ColorList {
    constructor(circleCount) {
        this.list = [
            // Blue
            "royalblue",
            "navy",
            "blue",
            "dodgerblue",
            "deepskyblue",
            // Green
            "seagreen",
            "mediumaquamarine",
            "palegreen",
            "lightgreen",
            "mediumspringgreen",
            // Yellow
            "khaki",
            "gold",
            "darkorange",
            "goldenrod",
            "darkgoldenrod",
            // Red
            "deeppink",
            "palevioletred",
            "pink",
            "magenta",
            "violet"
        ];
        this.setRandomList(circleCount);
    }

    /**
     *
     * @link https://qiita.com/mi-miya/items/9eb9a0fb14f4ec3a8764
     * @returns {[string, string, string, string, string]}
     */
    setRandomList(circleCount) {
        for (let i = this.list.length - 1; i >= 0; i --){
            let rand = Math.floor( Math.random() * (i + 1));
            [this.list[i], this.list[rand]] = [this.list[rand], this.list[i]];
        }
        this.list = this.list.slice(0, circleCount);
    }
}

class CircleManagement {

    constructor() {
        this.colors = [];
    }

    deploy() {
        this.potionSetUp();
        this.displayCircle();
    }

    finish(){
        for (let i = 1; i < this.colors.length; i++){
            document.getElementById(`circle_${i}`).classList.add("circle_color_disappear");
        }
    }
    
    potionSetUp(){
        let temp_list = [{left : this.colors[0].left_potion, top: this.colors[0].top_potion}]
        for (let i = 1 ; i < this.colors.length ; i++ ) {
            while (true) {
                let potion_change_flag = false;
                for (let list_counter = 0; list_counter < temp_list.length; list_counter ++ ) {
                    // FIXME 円のサイズを動的にして
                    if (
                        (this.colors[i].left_potion > temp_list[list_counter].left - 140 && this.colors[i].left_potion < temp_list[list_counter].left + 140)
                        && (this.colors[i].top_potion > temp_list[list_counter].top - 140 && this.colors[i].top_potion < temp_list[list_counter].top + 140)
                    ) {
                        this.colors[i].setRandomTopPotion();
                        this.colors[i].setRandomLeftPotion();
                        potion_change_flag = true;
                    }
                }
                if (potion_change_flag == false){
                    temp_list.push({left : this.colors[i].left_potion, top : this.colors[i].top_potion});
                    break;
                }
            }
        }
    }
    
    displayCircle(){
        this.colors.forEach(function (object, index) {
            let divElement = document.createElement("div");
            divElement.className = `circle circle_color_${object.color_class} circle_size_medium`;
            divElement.id = "circle_" + index;
            divElement.setAttribute("style", `top: ${object.top_potion}px; left: ${object.left_potion}px;`);
            document.body.appendChild(divElement);
        });
    }
    
}

class GenerateColorObject {
    /**
     *
     * @param ColorList colors
     */
    exec(colors){
        let object = new CircleManagement();
        object.colors = colors.list.map(function(color) {
            let tmp_object = new MinimumCircle();
            tmp_object.color_class = color;
            return tmp_object;
        });
        return object;
    }
}

/**
 * range
 * @param start
 * @param stop
 * @param step
 * @returns {unknown[]}
 * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 */
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));


class NumberOfPlayersForm {
    constructor() {
    }

    create(){
        let divElement = document.createElement("div");
        divElement.innerText = "参加人数を選んでスタートを押してください。";
        divElement.className = "top_element";
        document.getElementById("app").appendChild(divElement);
        let selectElement = document.createElement("select");
        selectElement.id = "number_of_player";
        let windows_size = window.innerHeight * window.innerWidth;
        let stop_counter = 4;
        if (windows_size <= 304704) {
            stop_counter = 6;
        } else if (windows_size <= 995796) {
            stop_counter = 10;
        } else if (windows_size > 995796) {
            stop_counter = 15;
        }
        for (let option_data of range(3, stop_counter, 1)) {
            let optionElement = document.createElement("option");
            optionElement.value = option_data.toString();
            optionElement.text = option_data.toString();
            if (circleCount == option_data){
                optionElement.selected = true;
            }
            selectElement.appendChild(optionElement);
        }
        document.getElementById("app").appendChild(selectElement);
        let buttonElement = document.createElement("button");
        buttonElement.innerHTML = "スタート";
        buttonElement.addEventListener("click", function () {
            circleCount = document.getElementById("number_of_player").value;
            new removeElement();
            let color_management = new GenerateColorObject().exec(new ColorList(circleCount));
            color_management.deploy();
            let timer = new Timer();
            timer.timerStart(color_management);
        });
        document.getElementById("app").appendChild(buttonElement);
    }
}

class removeElement{
    constructor() {
        this.exec();
    }

    exec(){
        let element = document.getElementById("app");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        let circleElements = document.getElementsByClassName("circle");
        if (circleElements.length > 0) {
            let remove_list = [];
            for (let element of circleElements) {
                remove_list.push(element.id);
            }
            remove_list.forEach(id => document.getElementById(id).remove());
        }
    }
}

class TimerUtility {
    setCounter(counter) {
        this.counter = counter;
        this.intervalId  = "";
    }
    subtract(){
        this.counter = this.counter - 1;
        if (this.counter < 0) {
            return true
        }
        return false;
    }
}

class Timer{
    constructor() {
        this.setupDisplay();
    }

    timerStart(callbackClass)
    {
        if(timerUtility.intervalId != undefined) clearInterval(timerUtility.intervalId);
        timerUtility.intervalId = setInterval(this.countDown, 1000, callbackClass);
    }

    countDown(callbackClass){
        let countElement = document.getElementById("counter_text");
        timerUtility.counter;
        countElement.innerText = timerUtility.counter;
        if (timerUtility.subtract()){
            clearInterval(timerUtility.intervalId);
            countElement.className = "counter_text top_element counter_text_disappear";
            callbackClass.finish();
            let descriptionElement = document.getElementById("description_text");
            descriptionElement.innerText = "残った色の人が１番です！";
            let buttonElement = document.createElement("button");
            buttonElement.innerText = "もう一度";
            buttonElement.addEventListener("click", function () {
                timerUtility.setCounter(5);
                new removeElement();
                new NumberOfPlayersForm().create();
            });
            descriptionElement.appendChild(buttonElement);
        }
    }

    setupDisplay()
    {
        let textElement = document.createElement("div");
        textElement.innerText = "！好きな色を指差せ！";
        textElement.className = "top_element";
        textElement.id = "description_text";
        document.getElementById("app").appendChild(textElement);
        let countElement = document.createElement("div");
        countElement.className = "counter_text top_element";
        countElement.innerText = timerUtility.counter;
        countElement.id = "counter_text";
        document.getElementById("app").appendChild(countElement);
    }

}


class WindowController {
    startCircle(){
        new removeElement();
        let color_management = new GenerateColorObject().exec(new ColorList(9));
        color_management.deploy();
        // setTimeout(
        //     function () {
        //         color_management.finish()
        //     },
        //     10000
        // );

    }
    startSelect(){
        new NumberOfPlayersForm().create();
    }
}

// グローバルで管理するため
let timerUtility = new TimerUtility();
timerUtility.setCounter(5);
let circleCount = 0;

window.onload = function () {
    // let color_management = new GenerateColorObject().exec(new ColorList(9));
    // color_management.deploy();
    // setTimeout(
    //     function () {
    //         color_management.finish()
    //     },
    //     1000
    // );
    new NumberOfPlayersForm().create();
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then(function(reg) {
            console.log('登録に成功しました。 Scope は ' + reg.scope);
        }).catch(function(error) {
        console.log('登録に失敗しました。' + error);
    });
}
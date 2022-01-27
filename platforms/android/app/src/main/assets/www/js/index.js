document.addEventListener('deviceready', onDeviceReady, false);
const bt = document.querySelector(".bt");
let lastTemp = 0;

function onDeviceReady() {
    screen.orientation.lock('portrait');
    document.querySelector(".bt-connect").addEventListener('click', function() {
        document.querySelector(".bt-list-wrap").classList.add("active");
    });
    document.querySelector(".theme_change").addEventListener('click', function() {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark")
            document.body.classList.add("light");
            bt.innerHTML = "yes";
        } else {
            document.body.classList.remove("light")
            document.body.classList.add("dark")
            bt.innerHTML = "NO";
        }
    });
    isEnableBt()

    // document.querySelector(".send").addEventListener('click',function(){
    //  SendData(document.querySelector(".number").value);
    // })
}

function mapProg(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function isEnableBt() {
    bluetoothSerial.enable(
        function() {

            bt.innerHTML = "blin";
            Connecting();
        },
        function() {
            bluetoothSerial.enable(isEnableBt, error);
        }
    );
}

function Connecting() {
    bluetoothSerial.list(
        function(results) {
            results.forEach((item) => {
                document.querySelector(".bt-list ul").innerHTML += '<li data-mac="' + item.id + '" onclick="connectToDevice(this)">' + item.name + '<div class="ui_but"><svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" ><path d="M 41 2 C 37.145851 2 34 5.1458514 34 9 C 34 10.842988 34.724355 12.518937 35.896484 13.771484 L 27.525391 24 L 15.919922 24 C 15.430748 20.617539 12.513828 18 9 18 C 5.1458514 18 2 21.145851 2 25 C 2 28.854149 5.1458514 32 9 32 C 12.513828 32 15.430748 29.382461 15.919922 26 L 27.501953 26 L 35.535156 36.640625 C 34.5767 37.838633 34 39.353257 34 41 C 34 44.854149 37.145851 48 41 48 C 44.854149 48 48 44.854149 48 41 C 48 37.145851 44.854149 34 41 34 C 39.515247 34 38.13907 34.471256 37.003906 35.265625 L 29.271484 25.025391 L 37.455078 15.021484 C 38.496931 15.638103 39.706395 16 41 16 C 44.854149 16 48 12.854149 48 9 C 48 5.1458514 44.854149 2 41 2 z M 41 4 C 43.773268 4 46 6.2267316 46 9 C 46 11.773268 43.773268 14 41 14 C 38.226732 14 36 11.773268 36 9 C 36 6.2267316 38.226732 4 41 4 z M 9 20 C 11.773268 20 14 22.226732 14 25 C 14 27.773268 11.773268 30 9 30 C 6.2267316 30 4 27.773268 4 25 C 4 22.226732 6.2267316 20 9 20 z M 41 36 C 43.773268 36 46 38.226732 46 41 C 46 43.773268 43.773268 46 41 46 C 38.226732 46 36 43.773268 36 41 C 36 38.226732 38.226732 36 41 36 z"/></svg></div></li>';
            })
            const hc06 = results.filter(i => i.name == 'HC-06')[0]

        },
        error
    );
}

function connectToDevice(mac) {
    document.querySelector(".bt-list-wrap").classList.remove("active");
    bluetoothSerial.connect(mac.dataset.mac,
        function(d) {
            bluetoothSerial.subscribe('\n', (data) => recvData(data), error);
        }, error);
}

function recvData(data) {
    data = data.split('');
    data = data.slice(0, data.length - 2).join('');
    js_data = JSON.parse(data);
    // document.querySelector('.progressbar').style.setProperty('--value',mapProg(js_data.temp,0,40,0,100));
    if (js_data.temp != lastTemp) {
        document.querySelector('.progressbar').outerHTML = '<div class="progressbar" style="--lastTemp:' + mapProg(lastTemp, 0, 40, 0, 100) + ';--value:' + mapProg(js_data.temp, 0, 40, 0, 100) + '" ></div>';
        lastTemp = js_data.temp;
    }

    document.querySelector(".button-dial-label span").innerHTML = js_data.temp + "&deg;C";
    document.querySelector(".hum .data").innerHTML = js_data.hum + "%";
    document.querySelector(".pres .data").innerHTML = js_data.pres + "Pa";
    // bt.innerHTML += "[";
    // bt.innerHTML += "Temp: "+JSON.parse(data).temp+"<br>";
    // bt.innerHTML += "Hum: "+JSON.parse(data).hum+"<br>";
    // bt.innerHTML += "Press: "+JSON.parse(data).pres+"<br>";
    // bt.innerHTML += "]<br>";
    // bt.innerHTML += "--------------";
}

function SendData(data) {
    bluetoothSerial.isConnected(
    function() {
        bluetoothSerial.write("$"+data, {}, error);
    },
    function() {
        console.log("Bluetooth is *not* connected");
        window.plugins.toast.showLongBottom('Hello there!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
    }
);
    
}

function error() {
    bt.innerHTML = "Error";

}
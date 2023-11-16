#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#define DHTTYPE DHT11   // DHT 11
const char* ssid = "iPhone";
const char* password = "03102002";
const char* mqtt_server = "172.20.10.2";

WiFiClient espClient; // Tạo một đối tượng WiFiClient để kết nối WiFi.
PubSubClient client(espClient); // Tạo một đối tượng PubSubClient và truyền đối tượng WiFiClient vào.

const int DHTPin = 4; // Cảm biến DHT - GPIO 4 = D2
const int led1 = 2; // GPIO 2 = D4
const int led2 = 16; // GPIO 16 = D0
const int lightPin = A0; // Chân analog A0 cho kết nối LDR
// Khởi tạo cảm biến DHT.
DHT dht(DHTPin, DHTTYPE);

long Time = millis(); // Hàm millis() trả về số miligiây đã trôi qua kể từ khi board Arduino hoặc ESP8266 được khởi động.
long lastTime = 0; // Biến lastTime được sử dụng để lưu trữ thời điểm cuối cùng mà một hoạt động đo lường đã được thực hiện. 

void connectToWifi() { 
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { // chờ cho đến khi kết nối WiFi được thiết lập
    delay(500);
    Serial.print(".");
  }
}

void connectToMqtt() { // thiết lập kết nối mqtt vs esp8266
  while (!client.connected()) { //kiểm tra xem kết nối MQTT có được thiết lập hay không
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      client.subscribe("Control/led"); // sử dụng hàm client.subscribe() để đăng ký (subscribe) chủ đề "Control/led"
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}


// Hàm này được sử dụng làm hàm xử lý cho các thông báo (messages) nhận được từ một chủ đề (topic) trong giao thức MQTT.
void callback(String topic, byte* message, unsigned int length) {
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]); 
    messageTemp += (char)message[i];
  }
  Serial.println();

  if (topic == "Control/led") {
    if (messageTemp == "onled1") {
      digitalWrite(led1, HIGH);
    } else if (messageTemp == "offled1") {
      digitalWrite(led1, LOW);
    } else if (messageTemp == "onled2") {
      digitalWrite(led2, HIGH);
    } else if (messageTemp == "offled2") {
      digitalWrite(led2, LOW);
    }
  }
}
// thiết lập và khởi tạo các tài nguyên cần thiết, bao gồm cấu hình chân, khởi tạo cảm biến, thiết lập giao tiếp Serial, kết nối Wi-Fi, cài đặt kết nối MQTT và đặt hàm callback cho MQTT client.
void setup() {
  pinMode(led1, OUTPUT); // Đây là câu lệnh pinMode() để cấu hình chân led1 là một chân xuất (OUTPUT). Chân này được sử dụng để điều khiển đèn 1.
  pinMode(led2, OUTPUT);
  dht.begin();
  Serial.begin(115200);
  connectToWifi();
  client.setServer(mqtt_server, 1883); //client.setServer(server, port): Đặt máy chủ MQTT và cổng để kết nối đến.
  client.setCallback(callback); // Đây là lệnh để thiết lập hàm callback (callback()) mà MQTT client (client) sẽ gọi khi nhận được thông báo từ máy chủ MQTT
  delay(5000);
}

void loop() {
  if (!client.connected()) { // Nếu k kết nối được với mqtt thì gọi hàm reconnect để kết nối lại
    connectToMqtt();
  } 
  if (!client.loop())
  client.connect("ESP8266Client");
  Time = millis(); //lấy giá trị thời gian hiện tại bằng cách sử dụng hàm 
  if (Time - lastTime > 5000) { // đảm bảo rằng chúng ta sẽ đo đạc lại sau ít nhất 5 giây kể từ lần đo trước đó.
    lastTime = Time;
    float hum = dht.readHumidity();
    float temp = dht.readTemperature();
    if (isnan(hum) || isnan(temp)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }
    int light = analogRead(lightPin);
    client.publish("index", (String(temp) + "," + String(hum) + "," + String(light)).c_str());
    Serial.print("Humidity: ");
    Serial.print(hum);
    Serial.println(" %");
    Serial.print("Temperature: ");
    Serial.print(temp);
    Serial.println(" ºC");
    Serial.print("Light: ");
    Serial.print(light);
    Serial.println(" Lux");
  }
}

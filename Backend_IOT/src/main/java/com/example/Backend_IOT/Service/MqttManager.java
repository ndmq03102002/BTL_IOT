package com.example.Backend_IOT.Service;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttManager { // cấu hình đối tượng MqttClient
	    @Bean
	    public MqttClient mqttClient() throws MqttException {
	        MqttConnectOptions options = new MqttConnectOptions(); // cấu hình các tùy chọn kết nối MQTT
	        options.setAutomaticReconnect(true); // Thiết lập tùy chọn cho phép kết nối MQTT tự động kết nối lại nếu mất kết nối.
	        MqttClient mqttClient = new MqttClient("tcp://10.20.82.39","ManhQuynh");
	        mqttClient.connect(options);
	        return mqttClient;
	    }
}

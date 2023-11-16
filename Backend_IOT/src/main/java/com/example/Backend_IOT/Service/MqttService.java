package com.example.Backend_IOT.Service;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Backend_IOT.Model.DataDevice;
import com.example.Backend_IOT.Model.Device;
import com.example.Backend_IOT.Repository.DataRepository;
import com.example.Backend_IOT.Repository.DeviceRepository;
import com.example.Backend_IOT.util.TimeUntil;

@Service

public class MqttService {
	@Autowired
	private DataRepository repo;
	@Autowired
	private MqttClient mqttClient;

	@Autowired
	private DeviceRepository repo1;
	
	public void sendMessageAndSaveToDatabase(String topic, String message) throws MqttException {
		MqttMessage mqttMessage = new MqttMessage(message.getBytes()); // tạo một đối tượng MqttMessage để chứa tin nhắn MQTT.
		String statusled = message.length() >= 4 ? message.substring(message.length() - 4) : message;
		mqttClient.publish(topic, mqttMessage); // gửi tin nhắn MQTT tới topic đã cho.
		repo1.save(new Device(statusled ,message ,TimeUntil.getCurrentFormattedTime())); // lưu message và time vào database
	}

	public void receiveAndProcessMessage(String topic) throws MqttException {
		mqttClient.subscribe(topic, (t, m) -> { // đăng ký theo dõi topic, khi có tin nhắn gửi đến sẽ xử lý trong hàm try
			try {
				String[] data = new String(m.getPayload()).split(","); // lấy nội dung của tin nhắn MQTT và chuyển đổi thành string tách dấu , và cho vào mảng
				repo.save(new DataDevice(Float.parseFloat(data[0]), Float.parseFloat(data[1]),
						Float.parseFloat(data[2]), TimeUntil.getCurrentFormattedTime()));
			} catch (Exception e) {
				e.printStackTrace();
			}
		});
	}
	
}

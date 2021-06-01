# python yolo.py --yolo model --confidence 0.5
# python yolo.py --image images/baggage_claim.jpg --yolo model

import numpy as np
import argparse
import time
import cv2
import os
import socket
import pickle
import struct
import imutils
import threading
import pyshine as ps    # pip install pyshine
import re

def mainMethod(addr,client_socket):
	global m
	try:
		print('CLIENT {} CONNECTED!'.format(addr))
		if client_socket:   # if a client socket exists
			data = b""
			payload_size = struct.calcsize("Q")
			while True:
				while len(data) < payload_size:
					packet = client_socket.recv(4*1024) # 4K
					if not packet: break
					data += packet
				packed_msg_size = data[:payload_size]
				data = data[payload_size:]
				msg_size = struct.unpack("Q",packed_msg_size)[0]
				
				while len(data) < msg_size:
					data += client_socket.recv(4*1024)
				frame_data = data[:msg_size]
				data = data[msg_size:]
				frame = pickle.loads(frame_data)

				textIP = re.findall(r'[0-9]+(?:\.[0-9]+){3}', addr)   # Utilizing RegEx to extract the Client IP address
				frame = ps.putBText(frame,textIP,5,5,vspace=3,hspace=3,font_scale=0.4,background_RGB=(20,210,4),text_RGB=(255,255,255))

				textTime = str(time.strftime("%d/%m/%y - %H:%M"))

				(H, W) = frame.shape[:2]

				frame = ps.putBText(frame,textTime,5,H-5,vspace=2,hspace=2,font_scale=0.3,background_RGB=(228,225,222),text_RGB=(255,255,255))
				# cv2.imshow(f"FROM {addr}",frame)
				# image loaded successfully in frame var
				
				image = frame
				(H, W) = image.shape[:2]
				
				blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416),swapRB=True, crop=False)
				net.setInput(blob)
				start = time.time()
				layerOutputs = net.forward(ln)
				end = time.time()
				
				# initialize our lists of detected bounding boxes, confidences, and
				# class IDs, respectively
				boxes = []
				confidences = []
				classIDs = []
				
				for output in layerOutputs:
					# loop over each of the detections
					for detection in output:
						# extract the class ID and confidence (i.e., probability) of
						# the current object detection
						scores = detection[5:]
						classID = np.argmax(scores)
						confidence = scores[classID]
						# filter out weak predictions by ensuring the detected
						# probability is greater than the minimum probability
						if confidence > args["confidence"]:
							# scale the bounding box coordinates back relative to the
							# size of the image, keeping in mind that YOLO actually
							# returns the center (x, y)-coordinates of the bounding
							# box followed by the boxes' width and height
							box = detection[0:4] * np.array([W, H, W, H])
							(centerX, centerY, width, height) = box.astype("int")

							# use the center (x, y)-coordinates to derive the top and
							# and left corner of the bounding box
							x = int(centerX - (width / 2))
							y = int(centerY - (height / 2))

							# update our list of bounding box coordinates, confidences,
							# and class IDs
							boxes.append([x, y, int(width), int(height)])
							confidences.append(float(confidence))
							classIDs.append(classID)
							detectedFlag = 1
				# apply non-maxima suppression to suppress weak, overlapping bounding
				# boxes
				idxs = cv2.dnn.NMSBoxes(boxes, confidences, args["confidence"],
					args["threshold"])

				# ensure at least one detection exists
				if len(idxs) > 0:
					# loop over the indexes we are keeping
					for i in idxs.flatten():
						# extract the bounding box coordinates
						(x, y) = (boxes[i][0], boxes[i][1])
						(w, h) = (boxes[i][2], boxes[i][3])

						# draw a bounding box rectangle and label on the image
						color = [int(c) for c in COLORS[classIDs[i]]]
						cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)
						# textLabel = "{}: {:.4f}".format(LABELS[classIDs[i]], confidences[i])
						# cv2.putText(image, textLabel, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
				
				if detectedFlag:
					print("inside detectedFlag")
					filename = "detected/" + str(m) + ".jpg"
					cv2.imwrite(filename, image)
					detectedFlag = 0

					textFileName = "detected/" + str(m) + ".txt"
					f = open(textFileName, "w")
					f.write(addr)
					f.close()

					m += 1
				# the output image is "image"
				cv2.imshow("Image", image)
				
				key = cv2.waitKey(1) & 0xFF
				if key  == ord('q'):
					break
			client_socket.close()
	except Exception as e:
		print(f"CLIENT {addr} DISCONNECTED")
		pass
		
		
	
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", default="test.jpg",
	help="path to input image")
ap.add_argument("-y", "--yolo", default="model",
	help="base path to YOLO directory")
ap.add_argument("-c", "--confidence", type=float, default=0.4,
	help="minimum probability to filter weak detections")
ap.add_argument("-t", "--threshold", type=float, default=0.4,
	help="threshold when applyong non-maxima suppression")
args = vars(ap.parse_args())

m = 0

# load the model class labels our YOLO model was trained on
labelsPath = os.path.sep.join([args["yolo"], "obj.names"])
LABELS = open(labelsPath).read().strip().split("\n")

# initializing a list of colors to represent each possible class label
np.random.seed(42)
COLORS = np.random.randint(0, 255, size=(len(LABELS), 3),
	dtype="uint8")

# paths to the weights and cfg
weightsPath = os.path.sep.join([args["yolo"], "yolov3_SDP_last.weights"])
configPath = os.path.sep.join([args["yolo"], "yolov3_custom.cfg"])

# loading our YOLO object detector (cigarettes)
print("[INFO] loading YOLO from disk...")
net = cv2.dnn.readNetFromDarknet(configPath, weightsPath)
ln = net.getLayerNames()
ln = [ln[i[0] - 1] for i in net.getUnconnectedOutLayers()]


server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
host_name  = socket.gethostname()
host_ip = socket.gethostbyname(host_name)
print('host_ip', host_ip)
port = 9999
socket_address = (host_ip, port)
server_socket.bind(('', port))
server_socket.listen(64)
print("Listening at", socket_address)


while True:
	client_socket, addr = server_socket.accept()
	thread = threading.Thread(target=mainMethod, args=(addr, client_socket))
	thread.start()
	print("TOTAL CLIENTS ", threading.activeCount() - 1)


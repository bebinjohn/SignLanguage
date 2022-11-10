import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
import base64
import time

cap = cv2.VideoCapture(0)
detector = HandDetector(maxHands=1)
classifier = Classifier("keras_model.h5", "labels.txt")

offset = 20
imgSize = 300

folder = "Data/C"
counter = 0


def parseBase64Image(image):
    encoded_data = image.split(',')[1]
    return encoded_data


labels = ["A", "B", "C"]


def predictHandGestures(image):
    im_bytes = base64.b64decode(parseBase64Image(image))
    # im_arr is one-dim Numpy array
    im_arr = np.frombuffer(im_bytes, dtype=np.uint8)
    img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)
    imgOutput = img.copy()
    hands, img = detector.findHands(img)
    if hands:
        hand = hands[0]
        x, y, w, h = hand['bbox']

        imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255
        imgCrop = img[y - offset:y + h + offset, x - offset:x + w + offset]

        imgCropShape = imgCrop.shape

        aspectRatio = h / w

        if aspectRatio > 1:
            k = imgSize / h
            wCal = math.ceil(k * w)
            imgResize = cv2.resize(imgCrop, (wCal, imgSize))
            imgResizeShape = imgResize.shape
            wGap = math.ceil((imgSize - wCal) / 2)
            imgWhite[:, wGap:wCal + wGap] = imgResize
            prediction, index = classifier.getPrediction(imgWhite, draw=False)
            print(prediction, index)
            return labels[index]

        else:
            k = imgSize / w
            hCal = math.ceil(k * h)
            imgResize = cv2.resize(imgCrop, (imgSize, hCal))
            imgResizeShape = imgResize.shape
            hGap = math.ceil((imgSize - hCal) / 2)
            imgWhite[hGap:hCal + hGap, :] = imgResize
            prediction, index = classifier.getPrediction(imgWhite, draw=False)
            print(prediction, index)
            return labels[index]
    else:
        return "Hands not Detected!!"


#     cv2.rectangle(imgOutput, (x - offset, y - offset - 80), (x-offset+100, y - offset - 50  + 50), (255, 0, 255), cv2.FILLED)
#     cv2.putText(imgOutput, labels[index], (x,y-25), cv2.FONT_HERSHEY_COMPLEX, 1.7, (255, 255, 255), 2)
#     cv2.rectangle(imgOutput, (x-offset,y-offset), (x+w+offset+30,y+h+offset), (255,0,255), 4)
#
#     cv2.imshow("ImageCrop", imgCrop)
#     cv2.imshow("ImageWhite", imgWhite)
#
# cv2.imshow("Image", imgOutput)
# key = cv2.waitKey(1)

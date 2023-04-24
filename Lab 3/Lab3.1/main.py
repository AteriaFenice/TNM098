import numpy as np 
import pandas as pd
import cv2
import glob

img_rgb = cv2.imread("Lab3.1/02.jpg")
images = [cv2.imread(file) for file in glob.glob("Lab3.1/*.jpg")] # Load in all files

#print(img)

b,g,r = img_rgb[1,1] # Testing to see if we get the color from px in position (1,1)

# Debug
'''print("b: ", b)
print("g: ", g)
print("r: ", r)'''

# rgb -> lab 
img_lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2Lab)

# Debug
print(img_lab[1,1])

# Feature vectors 
vec_color =  [[] for i in range(12)] # color
cv2.imshow('color image', img_rgb) # Show image
cv2.waitKey(0)
cv2.destroyAllWindows()

''' Color Mean feature vectors'''
vec_meanColor = [[]for i in range(12)]

for i in range(12):
    vec_meanColor[i] = cv2.mean(images[i])
    vec_meanColor[i] = vec_meanColor[i][:3] # ignore last value in array, contains b, g, r!

#print(vec_meanColor)

''' Edge feature vectors'''
vec_edges = [[]for i in range(12)]

for i in range(12):
    vec_edges[i] = cv2.Canny(images[i], 100, 200).flatten() # 100 and 200 are the minimum and maximum values in hysteresis thresholding.

print(vec_edges)
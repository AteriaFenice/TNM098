import numpy as np 
import pandas as pd
import cv2

img = cv2.read("01.jpg")
print(img)

b,g,r = img[1,1] # Testing to see if we get the color from px in position (1,1)

print("b: ", b)
print("g: ", g)
print("r: ", r)

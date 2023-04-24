import numpy as np 
import pandas as pd
import cv2
import glob
from matplotlib import pyplot as plt

img_chosen = 10 # Image 11
images = [cv2.imread(file) for file in glob.glob("Lab3.1/*.jpg")] # Load in all files
img_rgb = images[img_chosen]

b,g,r = img_rgb[1,1] # Testing to see if we get the color from px in position (1,1)

# Debug
'''print("b: ", b)
print("g: ", g)
print("r: ", r)'''

# rgb -> lab 
img_lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2Lab)

# Debug
#print(img_lab[1,1])

# Histogram of one image
#hist = cv2.calcHist([img_rgb], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
#hist = hist.flatten() # Making the histogram into one vector -> feature vector
#print(hist.shape)

# Feature vectors 
vec_color =  [[] for i in range(12)] # color

for i in range(12):

    img = images[i]

    # Calculate the histogram for each image in the dataset
    hist = cv2.calcHist([img], [0, 1, 2], None, [32, 32, 32], [0, 256, 0, 256, 0, 256])
    hist = hist.flatten() # Making the histogram into one vector -> feature vector

    vec_color[i] = hist # puts all the feature vectors in the same color feature vector

    print(i, ": ", vec_color[i][11])

# Compare the feature vector with the original image
dist_color = []

for i in range(12):
    d1 = 0
    for j in range(len(vec_color)):
        d1 += pow((vec_color[i][j]-vec_color[img_chosen][j]),2) # Calculates total distance vector

    dist_color.append(d1)
    print("image ", i, " distance: ", d1)


# Gives the indexes based on the distances dist_color
ind_color = sorted(range(len(dist_color)), key = lambda k: dist_color[k])

print(ind_color)


# Show one image
'''cv2.imshow('color image', img_rgb) # Show chosen image
cv2.waitKey(0)
cv2.destroyAllWindows()'''

# Create figure
fig = plt.figure(figsize=(10,10))

# Create subplots to print all images
for i in range(12):
    fig.add_subplot(4, 3, 1+i)
    # adds the images based on the ranking from the vectors
    # Change the from BGR to RGB since cv2 loads images in BGR for some reason
    plt.imshow(cv2.cvtColor(images[ind_color[i]], cv2.COLOR_BGR2RGB))
    plt.axis('off')
    plt.title(i)

plt.show() # Show rank imgaes

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
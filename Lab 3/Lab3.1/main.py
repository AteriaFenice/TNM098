import numpy as np 
import pandas as pd
import cv2
import glob
from matplotlib import pyplot as plt
import math

img_chosen = 10 # Image 11
#images_original = [cv2.imread(file) for file in glob.glob("Lab3.1/*.jpg")] # Load in all files
images = [cv2.imread(file) for file in glob.glob("Lab3.1/*.jpg")] # Load in all files
#img_rgb = images[img_chosen]

# resize images, preserve aspect ratio

# find smallest breadth and width BYT TILL MINSTA GEMENSAMMA NÄMNARE KOLLA PÅ HUR FAN MAN SKA GÖRA DET
'''width = images_original[0].shape[1]
height = images_original[0].shape[0]
for i in range(1,12):
    if width > images_original[i].shape[1]:
        width = images_original[i].shape[1]

    if height > images_original[i].shape[0]:
        height = images_original[i].shape[0]

# Aspect ratio
width_ratio = width/100
height_ratio = height/100

# resize images
images = [[] for i in range(12)]

for i in range(12):
    dim = (int(images_original[i].shape[1]*width_ratio), int(images_original[i].shape[0]*height_ratio))
    resized = cv2.resize(images_original[i], dim, interpolation=cv2.INTER_AREA)
    images[i] = resized
    print('resized image ', i+1)
    print('sizes of image ', i, ': ', resized.shape)'''

#b,g,r = img_rgb[1,1] # Testing to see if we get the color from px in position (1,1)


# Debug
'''print("b: ", b)
print("g: ", g)
print("r: ", r)'''

# rgb -> lab 
#img_lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2Lab)

# Debug
#print(img_lab[1,1])

# Histogram of one image
#hist = cv2.calcHist([img_rgb], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
#hist = hist.flatten() # Making the histogram into one vector -> feature vector
#print(hist.shape)

# Feature vectors 
vec_color =  [[] for i in range(12)] # color distribution
vec_meanColor = [[]for i in range(12)] # mean color
vec_edges = [[]for i in range(12)] # edges
edges = [[]for i in range(12)] # edges
vec_lum = [[]for i in range(12)] # illumination

for i in range(12):

    img = images[i]

    # Calculate the histogram for each image in the dataset
    hist = cv2.calcHist([img], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
    hist = hist.flatten() # Making the histogram into one vector -> feature vector
    vec_color[i] = hist # puts all the feature vectors in the same color feature vector

    # Calculate mean color
    mean = cv2.mean(images[i])
    mean = mean[:3]
    for j in range(3):
        vec_meanColor[i].append(mean[j])

    # Calculate illumination
    img2 = cv2.cvtColor(images[i], cv2.COLOR_BGR2HSV)

    # Calculate the histogram for each image in the dataset
    lum = cv2.calcHist([img2], [2], None, [8], [0, 256])
    vec_lum[i] = lum.flatten() # Making the histogram into one vector -> feature vector

    # Edges
    edges[i] = cv2.Canny(images[i], 100, 200)#.flatten() # 100 and 200 are the minimum and maximum values in hysteresis thresholding.
    edges_hist = cv2.calcHist(edges[i], [0], None, [8], [0, 256])
    vec_edges[i] = edges_hist.flatten()
    cv2.imshow
    

    #print(i, ": ", vec_color[i][11])


# Compare the feature vector with the original image
dist_color = []
dist_mean = []
dist_edges = []
dist_lum = []

print(len(vec_edges[0]))



for i in range(12):
    d1 = d2 = d3 = d4 = 0

    # Histogram
    for j in range(len(vec_color[i])):
        d1 += abs(vec_color[i][j]-vec_color[img_chosen][j]) # Calculates total distance vector
    dist_color.append(d1)

    # Distance 
    for j in range(len(vec_meanColor[i])):
        d2 += abs(vec_meanColor[i][j]-vec_meanColor[img_chosen][j])
    dist_mean.append(d2)

    # Illumination
    for j in range(len(vec_lum[i])):
        d3 += abs(vec_lum[i][j]-vec_lum[img_chosen][j])
    dist_lum.append(d3)

    '''max_len = len(vec_edges[img_chosen])
    if(len(vec_edges[i]) < max_len):
        max_len = len(vec_edges[i])'''

    for j in range(len(vec_edges[i])): 
        d4 += abs(vec_edges[i][j]-vec_edges[img_chosen][j])
    dist_edges.append(d4)



    print("image ", i, " distance: ", d4)


# Gives the indexes based on the distances dist_color
ind_color = sorted(range(len(dist_color)), key = lambda k: dist_color[k])
ind_mean = sorted(range(len(dist_mean)), key = lambda k: dist_mean[k])
ind_lum = sorted(range(len(dist_lum)), key = lambda k: dist_lum[k])
ind_edges = sorted(range(len(dist_edges)), key = lambda k: dist_edges[k])

print("color ranking: ", ind_color)
print("mean ranking: ", ind_mean)
print("illumination ranking: ", ind_lum)
print("edge ranking: ", ind_edges)


# Show one image
'''cv2.imshow('color image', img_rgb) # Show chosen image
cv2.waitKey(0)
cv2.destroyAllWindows()'''
fig = plt.figure(figsize=(10,10))

# Create subplots to print all images
for i in range(12):
    fig.add_subplot(4, 3, 1+i)
    # adds the images based on the ranking from the vectors
    # Change the from BGR to RGB since cv2 loads images in BGR for some reason
    plt.imshow(edges[ind_edges[i]])
    plt.axis('off')
    plt.title(i)

# Create figure
fig = plt.figure(figsize=(10,10))

# Create subplots to print all images
for i in range(12):
    fig.add_subplot(4, 3, 1+i)
    # adds the images based on the ranking from the vectors
    # Change the from BGR to RGB since cv2 loads images in BGR for some reason
    plt.imshow(cv2.cvtColor(images[ind_edges[i]], cv2.COLOR_BGR2RGB))
    plt.axis('off')
    plt.title(i)

plt.show() # Show rank imgaes

''' Color Mean feature vectors'''
'''vec_meanColor = [[]for i in range(12)]

for i in range(12):
    vec_meanColor[i] = cv2.mean(images[i])
    vec_meanColor[i] = vec_meanColor[i][:3] # ignore last value in array, contains b, g, r!'''

#print(vec_meanColor)

''' Edge feature vectors'''
'''vec_edges = [[]for i in range(12)]

for i in range(12):
    vec_edges[i] = cv2.Canny(images[i], 100, 200).flatten() # 100 and 200 are the minimum and maximum values in hysteresis thresholding.

print(vec_edges)'''


'''Luminance feature vectors'''
'''vec_lum = [[]for i in range(12)]

for i in range(12):
    img = cv2.cvtColor(images[i], cv2.COLOR_BGR2HSV)

    # Calculate the histogram for each image in the dataset
    vec_lum[i] = cv2.calcHist([img], [2], None, [8], [0, 256])
    vec_lum[i] = hist.flatten() # Making the histogram into one vector -> feature vector

print(vec_lum)'''
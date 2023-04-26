import numpy as np
import math
import pandas as pd
import nltk
from nltk import tokenize
import os # for reading in files
import string

# remove punctuation
def remove_punctuation(text):
    return [sentence.translate(str.maketrans('','', string.punctuation)) for sentence in text]

# make everything into lower case
def lower_case(text):
    return [sentence.lower() for sentence in text]

# Print all files 
path = 'Lab3.2/'
all_files = os.listdir(path)

files = [[] for i in range(10)]
counter = 0

for fle in all_files:
    with open(os.path.join(path, fle)) as f:
        files[counter] = f.read()
        counter += 1
        f.close()

# Remove \n
files = [file.replace('\n', " ") for file in files]

# Debug
#print(files[2])
print('load in all files')

# Divide texts into sentences
files = [tokenize.sent_tokenize(file) for file in files]

print('split text into sentences')


# Reshape text
files = [remove_punctuation(file) for file in files]
files = [lower_case(file) for file in files]

#print(files[2])
print('reshape files')

#print(files[2])


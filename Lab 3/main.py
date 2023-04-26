import numpy as np
import math
import pandas as pd
import nltk
import os # for reading in files
import string

# Print all files 
path = 'Lab3.2/'
all_files = os.listdir(path)

files = [[] for i in range(10)]
counter = 0

for fle in all_files:
    with open(os.path.join(path, fle)) as f:
        files[counter] = f.read()
        counter += 1
        print(counter)
        f.close()

# Debug
print(type(files[2]))

#file.translate(str.maketrans('','', string.punctuation)) # Remove punctuation
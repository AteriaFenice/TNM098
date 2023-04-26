import numpy as np
import math
import pandas as pd
import nltk
import os # for reading in files
import string


with open('Lab3.2/01.txt', 'r') as f:
    file = f.readlines()


print(file)

file.translate(str.maketrans('','', string.punctuation)) # Remove punctuation
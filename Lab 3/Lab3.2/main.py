import numpy as np
import math
import pandas as pd
import nltk
from nltk import tokenize
import os # for reading in files
import string
import copy

# remove punctuation
def remove_punctuation(text):
    return [sentence.translate(str.maketrans('','', string.punctuation)) for sentence in text]

# make everything into lower case
def lower_case(text):
    return [sentence.lower() for sentence in text]

'''def hashed_dictionary(files):
    dictionary = {} # set
    counter = 0 # replaces words wiht numerical values with word position

    for text in files:
        for i in range(len(text)):
            sentence = text[i]
            indices = []
            for word in sentence.split():
                if word in dictionary: # If word already has numerical, add it again
                    indices.append(str(dictionary[word]))
                else:
                    dictionary[word] = counter # Put new numerical in dictionary
                    indices.append(str(counter)) # Add numerical
                    counter += 1
        text[i] = ' '.join(indices)
    
    print('indicies\n', indices)
    return dictionary'''

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
print('Load in all files')

# Divide texts into sentences
files = [tokenize.sent_tokenize(file) for file in files]

print('Split text into sentences')


# Reshape text
files = [remove_punctuation(file) for file in files]
files = [lower_case(file) for file in files]

#print(files[2])
print('Reshape files')

# Replacing the words with numbers and storing the words in a dictionary
#dictionary = hashed_dictionary(files)

print('Created dicitonary')
#print(dictionary)

# Compare the sentences
print('\n\n---Matches found---')
print('------------------')
for i in range(len(files)-1):
    file1 = files[i]
    for j in range(i+1, len(files)): # get following file from file1
        file2 = files[j]

        for k, sentence in enumerate(file1): # enumerate to find indices of words (hashed dictionary where indices are the numerical values)

            if len(sentence.split()) <= 5: # Sentences shorter than 5 words are irrelevent
                continue

            try:
                file2_index = file2.index(sentence) # index where sentence is in file2
                print(f'File {i+1} and file {j+1} have the same sentence: {files[i][k]}\n')
            except:
                pass
        
        





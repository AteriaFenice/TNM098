import plotly.express as px # For plotly, graphs
import pandas as pd # For importing the data file
from dash import Dash, html, dcc, callback, Output, Input
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import numpy as np

data = pd.read_csv('EyeTrack-raw.tsv', sep='\t') 

x_int = [int(x) for x in data['GazePointX(px)']]
y_int = [int(y) for y in data['GazePointY(px)']]

data2 = data['GazePointX(px)'], data['GazePointX(px)']

#print(data2)

'''inertias = []

for i in range(0,len(data2)):
    kmeans = KMeans(n_clusters=i)
    kmeans.fit(data2)
    inertias.append(kmeans.inertia_)

plt.plot(range(0, len(data2)), inertias, marker='o')
plt.title('Elbow method')
plt.xlabel('Number of clusters')
plt.ylabel('Inertia')
plt.show()'''

# Calculate kmeans clustering
kmeans = KMeans(n_clusters=5, random_state=0, n_init='auto')
kmeans.fit(data2)
print(kmeans)

plt.scatter(data2[0], data2[1], c=kmeans.labels_)
plt.show()


start = min(data['RecordingTimestamp'])
end = max(data['RecordingTimestamp'])
time_stamp = [int(x)/1000 for x in data['RecordingTimestamp']] # Change the timestamp from ms to s

# 2D-scatter plot
fig = px.scatter(data, x='GazePointX(px)', y='GazePointY(px)', color=time_stamp, size='GazeEventDuration(mS)', range_color=(0,end/1000))
fig.update_layout(scattermode='group')
#fig.show() # Show figure in a seperate window and not the app

# 3D-scatter plot
fig_3d = px.scatter_3d(data, x='GazePointX(px)', y='GazePointY(px)',z='RecordingTimestamp', color= time_stamp, size='GazeEventDuration(mS)',range_color=(0,end/1000))
#fig_3d.show()


fig_time = px.timeline(data, x_start= time_stamp, x_end=time_stamp, y='GazePointY(px)')


app = Dash(__name__)

# Add the figures to the html and app in a div
app.layout = html.Div([
    html.H1(children='TNM098, Assignment 2', style={'textAlign':'center'}),
    #dcc.Dropdown(df.country.unique(), 'Canada', id='dropdown-selection'),
    dcc.Graph(id='graph-content', figure=fig),
    dcc.Graph(id='3DGraph-content', figure=fig_3d),
    dcc.Graph(id='timelineGraph-content', figure=fig_time)
    
])

'''@callback(
    Output('graph-content', 'figure'),
    #Input('dropdown-selection', 'value')
)
def update_graph(value):
    dff = df[df.country==value]
    return px.line(dff, x='year', y='pop')'''

if __name__ == '__main__':
    app.run_server(debug=True)
import cv2
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

def resize_image(image):

    # Resize frame of video to 1/3 size for faster face recognition processing
    small_frame = cv2.resize(image, (0, 0),  fx=0.3, fy=0.3)
    
    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = small_frame[:, :, ::-1]
    
    return rgb_small_frame

def plot_clusters(data, labels, algorithm_name, images = []):
        
    classes = np.unique(labels)
    
    print(labels)
    print(classes)

    palette = sns.color_palette('deep', np.max(labels) + 1)
    
    # reduce embedding dimentions to 2
    x = PCA(n_components=2).fit_transform(data) if len(data[0]) > 2 else np.array(data)

    # create a scatter plot.
    plt.figure(figsize=(12,6))
    for i, label in enumerate(classes):
        ind_pos = [i for i, v in enumerate(labels) if v == label]
        data = [ x[i] for i in ind_pos ]
        
        lst1 = [item[0] for item in data]
        lst2 = [item[1] for item in data]
        
        #add data points 
        plt.scatter(lst1, lst2,
                    # color=palette[i],
                    label = label)

    plt.legend(loc="lower left")
    plt.title(f'Clusters found by ' + algorithm_name)
    plt.show()

def plot_clusters_grid(data, images, labels):
        
    for cluster in range(0, 70):
        temp = data[data.cluster == cluster]
        num_of_rows = int(temp.shape[0] / temp.shape[1])
        num_of_cols = temp.shape[1]
        if(num_of_rows == 0):
            num_of_rows += 1
            num_of_cols = temp.shape[0] % temp.shape[1]
        
        _, axs = plt.subplots(num_of_rows, num_of_cols, figsize=(12, 12))
        axs = axs.flatten()
        for filename, ax in zip(temp["image_path"], axs):
            img = cv2.imread(filename)
            ax.title.set_text('cluster number: {}'.format(cluster))
            ax.imshow(img)
        plt.show()

def plot_pca_variance(var):

    plt.figure(figsize=(12,6))
    plt.ylabel('% Variance Explained')
    plt.xlabel('# of Features')
    plt.title('PCA Analysis')
    plt.ylim(0,100.5)
    plt.plot(var)
    plt.show()